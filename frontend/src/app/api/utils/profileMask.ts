import "server-only";

import type { GetProfileData } from "@dataconnect/generated";

type Profile = NonNullable<GetProfileData["user"]>;

/**
 * /api/users/[userId] のレスポンス向けに、owner 以外の閲覧者には公開設定で
 * 非公開になっているフィールドを空 (null / []) に塗り潰す。
 *
 * - 大学情報 (university / faculty / grade) を非公開: 3 フィールドとも null
 * - SNS (twitter / instagram / github / linkedin) を非公開: 4 フィールドとも null
 * - ポートフォリオ (customLinks) を非公開: 空配列に置き換え
 * - endorsement の出し分けは別ルート (/api/users/[uid]/endorsements) でやる
 *
 * カスタムディレクティブで宣言的に書きたいところだが、DataConnect は
 * ユーザ定義ディレクティブを許容しないので API レイヤで集約する。
 */
export const maskProfileForViewer = (profile: Profile, isOwner: boolean): Profile => {
  if (isOwner) return profile;
  const masked: Profile = { ...profile };
  if (!profile.universityVisible) {
    masked.university = null;
    masked.faculty = null;
    masked.grade = null;
  }
  if (!profile.snsVisible) {
    masked.twitter = null;
    masked.instagram = null;
    masked.github = null;
    masked.linkedin = null;
  }
  if (!profile.customLinksVisible) {
    masked.customLinks = [];
  }
  return masked;
};
