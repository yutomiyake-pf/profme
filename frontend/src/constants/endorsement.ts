export const ENDORSEMENT_RELATIONSHIPS = [
  "同期",
  "先輩",
  "後輩",
  "インターン仲間",
  "サークル仲間",
  "バイト仲間",
  "その他",
] as const;

export type EndorsementRelationship = (typeof ENDORSEMENT_RELATIONSHIPS)[number];

export const ENDORSEMENT_TAGS = [
  "リーダーシップ",
  "コミュニケーション力",
  "行動力",
  "粘り強さ",
  "創造性",
  "技術力",
  "誠実さ",
  "ユーモア",
  "頼れる存在",
  "学習意欲",
  "チームワーク",
  "発想力",
] as const;

export type EndorsementTag = (typeof ENDORSEMENT_TAGS)[number];

export const ENDORSEMENT_MAX_TAGS = 3;
export const ENDORSEMENT_EPISODE_MIN = 30;
export const ENDORSEMENT_EPISODE_MAX = 300;
