/**
 * 開発用シードスクリプト。
 *
 * - Firebase Auth / Postgres (Data Connect emulator) を完全に空にしてから投入する。
 * - 本番事故防止: NODE_ENV=development かつ各種 EMULATOR_HOST が localhost のときのみ走る。
 * - 投入内容 (MAIN_UID 基準):
 *     User                 : メイン 1 名 + 一般 100 名
 *     Follow (pending)     : 25 件 / Follow (approved)     : 25 件
 *     Endorsement (pending): 25 件 / Endorsement (approved): 10 件
 *
 * 実行: `npm run seed` (NODE_ENV=development が npm script で付与される)
 * Node 22.18+ の native TS strip-types を利用しているので外部ランナー (tsx 等) は不要。
 */
import { createHash } from "node:crypto";
import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Client } from "pg";

// ---------- 投入パラメータ ----------
// Firebase Auth uid 風の 28 文字 base64url。session cookie に焼かれる Auth uid と
// DB User.uid が一致しないと dashboard でプロフィールが引けないので、必ず同値で固定する。
const MAIN_UID = "Sd9oW2xMzC4hY7BfRk1VqJpL5tZc";
const MAIN_PHONE = "+819098765432";
const MAIN_DISPLAY_NAME = "テストユーザー";

const FILLER_USER_COUNT = 100;
// 各タブ 20 件/ページなので 25 で 2 ページ。Endorsement の card ページは 5 件/ページなので 10 で 2 ページ。
const FOLLOW_REQUESTS_COUNT = 25;
const FOLLOWERS_COUNT = 25;
const PENDING_ENDORSEMENTS_COUNT = 25;
const APPROVED_ENDORSEMENTS_COUNT = 10;

// filler の index レンジを切り分けて Follow の (follower, followee) 複合キーが衝突しないようにする
const REQUEST_RANGE = { start: 0, end: FOLLOW_REQUESTS_COUNT };
const FOLLOWER_RANGE = { start: REQUEST_RANGE.end, end: REQUEST_RANGE.end + FOLLOWERS_COUNT };
const PENDING_END_RANGE = {
  start: FOLLOWER_RANGE.end,
  end: FOLLOWER_RANGE.end + PENDING_ENDORSEMENTS_COUNT,
};
const APPROVED_END_RANGE = {
  start: PENDING_END_RANGE.end,
  end: PENDING_END_RANGE.end + APPROVED_ENDORSEMENTS_COUNT,
};

// PGlite (Data Connect emulator) の固定接続情報 (`npm run dataconnect:psql` と同じ)
const PG_CONFIG = {
  host: "127.0.0.1",
  port: 5433,
  user: "postgres",
  password: "postgres",
  database: "profme-dev-database",
} as const;

// ---------- 安全ガード ----------
const requireEnv = (key: string): string => {
  const v = process.env[key];
  if (!v) {
    console.error(`[seed] env ${key} is not set. .env.local を読み込んで実行してください。`);
    process.exit(1);
  }
  return v;
};

if (process.env.NODE_ENV !== "development") {
  console.error("[seed] NODE_ENV=development でのみ実行可能です。");
  process.exit(1);
}

const authEmulatorHost = requireEnv("FIREBASE_AUTH_EMULATOR_HOST");
const projectId = requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
const serviceAccountRaw = requireEnv("FIREBASE_SERVICE_ACCOUNT_KEY");

// 二重ガード: Auth emulator が localhost を向いていなければ中止
const looksLocal = (host: string) => host.startsWith("127.0.0.1:") || host.startsWith("localhost:");
if (!looksLocal(authEmulatorHost)) {
  console.error("[seed] FIREBASE_AUTH_EMULATOR_HOST がエミュレータを向いていません:", authEmulatorHost);
  process.exit(1);
}

// ---------- Firebase Admin / pg 初期化 ----------
const serviceAccount = JSON.parse(serviceAccountRaw) as ServiceAccount;
const app = getApps().length ? getApps()[0]! : initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);
const pg = new Client(PG_CONFIG);

// ---------- ヘルパ (deterministic な uid/phone 生成) ----------
const seedHash = (key: string): Buffer =>
  createHash("sha256").update(`profme-seed:${key}`).digest();

const fillerUid = (i: number) => seedHash(`uid:${i}`).toString("base64url").slice(0, 28);
const fillerPhone = (i: number) => {
  // 8 桁の数値 → +81 90 XXXX XXXX
  const num = seedHash(`phone:${i}`).readUInt32BE(0) % 100_000_000;
  return `+8190${String(num).padStart(8, "0")}`;
};
const fillerName = (i: number) => `ユーザー${String(i + 1).padStart(3, "0")}`;

const daysAgoIso = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const SAMPLE_RELATIONSHIPS = ["同期", "先輩", "後輩", "サークル仲間", "インターン仲間"];
const SAMPLE_TAGS = [
  ["リーダーシップ", "コミュニケーション力"],
  ["技術力", "学習意欲"],
  ["粘り強さ", "頼れる存在"],
  ["創造性", "発想力"],
  ["チームワーク", "ユーモア"],
];
const SAMPLE_EPISODE =
  "ハッカソンで一緒にチームを組み、議論を引っ張ってくれて素晴らしいリーダーシップを見せてくれました。技術の引き出しも広く、後輩の面倒見もよくて頼れる存在です。";

// hash 衝突チェック (確率は無視できるが、起きたときは静かに重複データが入るより落ちて気付ける方が良い)
const assertNoCollisions = () => {
  const phones = new Set<string>([MAIN_PHONE]);
  const uids = new Set<string>([MAIN_UID]);
  for (let i = 0; i < FILLER_USER_COUNT; i++) {
    const phone = fillerPhone(i);
    const uid = fillerUid(i);
    if (phones.has(phone)) throw new Error(`phone collision at filler #${i}: ${phone}`);
    if (uids.has(uid)) throw new Error(`uid collision at filler #${i}: ${uid}`);
    phones.add(phone);
    uids.add(uid);
  }
};

// ---------- Firebase Auth 全削除 ----------
// auth emulator の専用エンドポイント。本番 SDK には無い。
const clearAllAuthUsers = async () => {
  const res = await fetch(
    `http://${authEmulatorHost}/emulator/v1/projects/${projectId}/accounts`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    throw new Error(`failed to clear auth users: ${res.status} ${await res.text()}`);
  }
};

// ---------- Postgres 全削除 ----------
const clearAllPgRows = async () => {
  // CASCADE で follow / endorsement / custom_link も巻き込んで削除される
  await pg.query(`TRUNCATE "user", follow, endorsement, custom_link CASCADE`);
};

// ---------- 投入 (parameterized SQL で bulk insert) ----------
type UserRow = {
  uid: string;
  phoneNumber: string;
  displayName: string;
  university: string | null;
  faculty: string | null;
  grade: string | null;
  bio: string | null;
  cardTheme: string;
  skills: string[];
  hobbies: string[];
  qualifications: string[];
};

// 任意のサイズの行配列を 1 INSERT で投入する。$1, $2, ... を行ごとに割り当てる。
const insertUsers = async (rows: UserRow[]) => {
  if (rows.length === 0) return;
  const cols = 11;
  const values: unknown[] = [];
  const placeholders = rows.map((row, rowIdx) => {
    const base = rowIdx * cols;
    values.push(
      row.uid,
      row.phoneNumber,
      row.displayName,
      row.university,
      row.faculty,
      row.grade,
      row.bio,
      row.cardTheme,
      row.skills,
      row.hobbies,
      row.qualifications,
    );
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, NOW(), NOW())`;
  });
  await pg.query(
    `INSERT INTO "user"
       (uid, phone_number, display_name, university, faculty, grade, bio,
        card_theme, skills, hobbies, qualifications, created_at, updated_at)
     VALUES ${placeholders.join(", ")}`,
    values,
  );
};

type FollowRow = {
  followerUid: string;
  followeeUid: string;
  status: "pending" | "approved";
  approvedAtIso: string | null;
};

const insertFollows = async (rows: FollowRow[]) => {
  if (rows.length === 0) return;
  const cols = 4;
  const values: unknown[] = [];
  const placeholders = rows.map((row, rowIdx) => {
    const base = rowIdx * cols;
    values.push(row.followerUid, row.followeeUid, row.status, row.approvedAtIso);
    return `($${base + 1}, $${base + 2}, $${base + 3}, NOW(), $${base + 4})`;
  });
  await pg.query(
    `INSERT INTO follow (follower_uid, followee_uid, status, requested_at, approved_at)
     VALUES ${placeholders.join(", ")}`,
    values,
  );
};

type EndorsementRow = {
  authorUid: string;
  recipientUid: string;
  relationship: string | null;
  episode: string;
  tags: string[];
  status: "pending" | "approved";
  approvedAtIso: string | null;
};

// id は schema の default (uuid_generate_v4()) に任せるので INSERT 列から外す。
const insertEndorsements = async (rows: EndorsementRow[]) => {
  if (rows.length === 0) return;
  const cols = 7;
  const values: unknown[] = [];
  const placeholders = rows.map((row, rowIdx) => {
    const base = rowIdx * cols;
    values.push(
      row.authorUid,
      row.recipientUid,
      row.relationship,
      row.episode,
      row.tags,
      row.status,
      row.approvedAtIso,
    );
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, NOW(), $${base + 7})`;
  });
  await pg.query(
    `INSERT INTO endorsement
       (author_uid, recipient_uid, relationship, episode, tags, status, created_at, approved_at)
     VALUES ${placeholders.join(", ")}`,
    values,
  );
};

// ---------- 本体 ----------
const main = async () => {
  assertNoCollisions();
  await pg.connect();

  console.log("[seed] clearing Firebase Auth emulator users...");
  await clearAllAuthUsers();

  console.log("[seed] clearing Postgres rows (TRUNCATE)...");
  await clearAllPgRows();

  console.log(
    `[seed] inserting main user (${MAIN_UID}) into Firebase Auth + Postgres, plus ${FILLER_USER_COUNT} filler users into Postgres...`,
  );
  // Firebase Auth に displayName を入れると Auth Emulator UI の Identifier 欄に
  // displayName が出てしまい電話番号で識別しづらくなるので渡さない。
  // 表示名は DB の User.display_name で一元管理する。
  await auth.createUser({
    uid: MAIN_UID,
    phoneNumber: MAIN_PHONE,
  });
  const userRows: UserRow[] = [
    {
      uid: MAIN_UID,
      phoneNumber: MAIN_PHONE,
      displayName: MAIN_DISPLAY_NAME,
      university: "東京大学",
      faculty: "工学部",
      grade: "3年",
      bio: "テスト用のメインユーザーです。",
      cardTheme: "navy",
      skills: ["React", "TypeScript", "Next.js"],
      hobbies: ["コーヒー", "読書"],
      qualifications: ["TOEIC 800"],
    },
    ...Array.from(
      { length: FILLER_USER_COUNT },
      (_, i): UserRow => ({
        uid: fillerUid(i),
        phoneNumber: fillerPhone(i),
        displayName: fillerName(i),
        university: null,
        faculty: null,
        grade: null,
        bio: null,
        cardTheme: "navy",
        skills: [],
        hobbies: [],
        qualifications: [],
      }),
    ),
  ];
  await insertUsers(userRows);

  console.log(`[seed] inserting ${FOLLOW_REQUESTS_COUNT} pending follow requests + ${FOLLOWERS_COUNT} approved followers...`);
  const followRows: FollowRow[] = [
    ...Array.from({ length: REQUEST_RANGE.end - REQUEST_RANGE.start }, (_, k): FollowRow => ({
      followerUid: fillerUid(REQUEST_RANGE.start + k),
      followeeUid: MAIN_UID,
      status: "pending",
      approvedAtIso: null,
    })),
    ...Array.from({ length: FOLLOWER_RANGE.end - FOLLOWER_RANGE.start }, (_, k): FollowRow => ({
      followerUid: fillerUid(FOLLOWER_RANGE.start + k),
      followeeUid: MAIN_UID,
      status: "approved",
      approvedAtIso: daysAgoIso(k + 1),
    })),
  ];
  await insertFollows(followRows);

  console.log(
    `[seed] inserting ${PENDING_ENDORSEMENTS_COUNT} pending + ${APPROVED_ENDORSEMENTS_COUNT} approved endorsements...`,
  );
  const endorsementRows: EndorsementRow[] = [
    ...Array.from(
      { length: PENDING_END_RANGE.end - PENDING_END_RANGE.start },
      (_, k): EndorsementRow => ({
        authorUid: fillerUid(PENDING_END_RANGE.start + k),
        recipientUid: MAIN_UID,
        relationship: SAMPLE_RELATIONSHIPS[k % SAMPLE_RELATIONSHIPS.length] ?? null,
        episode: SAMPLE_EPISODE,
        tags: SAMPLE_TAGS[k % SAMPLE_TAGS.length] ?? [],
        status: "pending",
        approvedAtIso: null,
      }),
    ),
    ...Array.from(
      { length: APPROVED_END_RANGE.end - APPROVED_END_RANGE.start },
      (_, k): EndorsementRow => ({
        authorUid: fillerUid(APPROVED_END_RANGE.start + k),
        recipientUid: MAIN_UID,
        relationship: SAMPLE_RELATIONSHIPS[k % SAMPLE_RELATIONSHIPS.length] ?? null,
        episode: SAMPLE_EPISODE,
        tags: SAMPLE_TAGS[k % SAMPLE_TAGS.length] ?? [],
        status: "approved",
        approvedAtIso: daysAgoIso(k + 1),
      }),
    ),
  ];
  await insertEndorsements(endorsementRows);

  console.log("[seed] done.");
  console.log("");
  console.log(`  main user uid:             ${MAIN_UID}`);
  console.log(`  main user phone:           ${MAIN_PHONE}`);
  console.log(`  follow requests (pending): ${FOLLOW_REQUESTS_COUNT}`);
  console.log(`  followers       (approved):${FOLLOWERS_COUNT}`);
  console.log(`  endorsements    (pending): ${PENDING_ENDORSEMENTS_COUNT}`);
  console.log(`  endorsements    (approved):${APPROVED_ENDORSEMENTS_COUNT}`);
  console.log("");
  console.log("Auth Emulator UI: http://localhost:4000/auth で phone code を確認できます。");
};

main()
  .then(() => pg.end())
  .catch(async (err) => {
    console.error("[seed] failed:", err);
    await pg.end().catch(() => {});
    process.exit(1);
  });
