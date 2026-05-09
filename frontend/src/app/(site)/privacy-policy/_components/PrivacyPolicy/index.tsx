import { PageLayout } from "@/app/_components/Layout/PageLayout";
import styles from "./styles.module.css";

export const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>プライバシーポリシー</h1>
          <p className={styles.lastUpdated}>最終更新日: 2026年5月9日</p>
        </header>

        <p className={styles.paragraph}>
          Profme (以下「本サービス」)
          を提供する運営者 (以下「当社」)
          は、ユーザーの個人情報の重要性を認識し、適切な保護および取扱いに努めます。本プライバシーポリシー
          (以下「本ポリシー」)
          は、本サービスにおける個人情報の取扱方針を定めるものです。本ポリシーは、個人情報の保護に関する法律
          (以下「個人情報保護法」) その他の関連法令に従って運用します。
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第1条 (取得する情報)</h2>
          <p className={styles.paragraph}>本サービスは、以下の情報を取得します。</p>
          <ol className={styles.list}>
            <li>
              <strong>認証情報</strong>
              <ul className={styles.subList}>
                <li>電話番号 (Firebase Authentication により取得・管理)</li>
                <li>認証セッション (HTTP Cookie として発行)</li>
              </ul>
            </li>
            <li>
              <strong>プロフィール情報</strong> (ユーザー自身が入力)
              <ul className={styles.subList}>
                <li>表示名</li>
                <li>大学、学部、学年</li>
                <li>自己紹介、ガクチカ (学生時代に力を入れたこと)</li>
                <li>アバター画像</li>
                <li>スキル、趣味、資格</li>
                <li>SNSリンク (X、Instagram、GitHub、LinkedIn)</li>
                <li>ポートフォリオ等の任意のリンク</li>
              </ul>
            </li>
            <li>
              <strong>サービス利用情報</strong>
              <ul className={styles.subList}>
                <li>フォロー関係 (フォロー / フォロワー、申請の状態)</li>
                <li>評価 (Endorsement) の送受信履歴と内容</li>
                <li>名刺ページの公開設定 (大学情報、SNS、評価、ポートフォリオの各公開可否)</li>
                <li>カラーテーマ等の表示設定</li>
              </ul>
            </li>
            <li>
              <strong>アクセスログ等</strong>
              <ul className={styles.subList}>
                <li>IPアドレス、ブラウザ情報、デバイス情報、アクセス日時</li>
                <li>本サービス内での操作履歴 (機能利用ログ)</li>
                <li>Cookie 等を用いた識別情報</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第2条 (利用目的)</h2>
          <p className={styles.paragraph}>取得した情報は以下の目的で利用します。</p>
          <ol className={styles.list}>
            <li>本人確認、不正利用の防止</li>
            <li>本サービスの提供 (名刺ページの表示、フォロー機能、評価機能等)</li>
            <li>ユーザーの公開設定に基づく他ユーザーへの情報開示</li>
            <li>本サービスの維持、改善、新機能の開発</li>
            <li>ユーザーへのお知らせ、サポート対応</li>
            <li>利用規約等の違反対応</li>
            <li>個人を特定できないように加工した統計情報の作成および利用</li>
            <li>
              スカウト機能 (将来提供予定) — オプトインしたユーザーの情報を提携企業に提供し、企業からのスカウトメッセージ送信を可能にする目的
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第3条 (個人データの第三者提供)</h2>
          <ol className={styles.list}>
            <li>
              当社は、以下の場合を除き、ユーザーの個人データをあらかじめ本人の同意を得ることなく第三者に提供しません。
              <ul className={styles.subList}>
                <li>法令に基づく場合</li>
                <li>
                  人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難であるとき
                </li>
                <li>
                  公衆衛生の向上または児童の健全な育成の推進のために特に必要があり、本人の同意を得ることが困難であるとき
                </li>
                <li>
                  国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合
                </li>
                <li>
                  本人が事前に公開しているとみなせる情報 (公開設定が「公開」の項目)
                  を本サービスの仕様に従って閲覧者に表示する場合
                </li>
              </ul>
            </li>
            <li>
              ユーザー間の表示について、本サービスの仕様上、フォロー関係や名刺ページの公開項目は他のユーザーから閲覧可能となります。これは「第三者提供」ではなく本サービスの本来的な機能です。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            第4条 (スカウト機能における個人データの第三者提供 — 将来提供予定)
          </h2>
          <ol className={styles.list}>
            <li>
              当社は将来、ユーザーが事前に「スカウトを受け取る」設定 (以下「オプトイン」)
              を行った場合に限り、当該ユーザーの個人データを提携企業に提供する「スカウト機能」を提供する予定です。
            </li>
            <li>
              <strong>提供する個人データの項目:</strong> 表示名、大学、学部、学年、自己紹介、ガクチカ、スキル、趣味、資格、公開設定が「公開」となっている評価。
              <strong>電話番号その他の連絡先は提供されません。</strong>
            </li>
            <li>
              <strong>提供の手段:</strong> 当社が運営するスカウト機能のシステムを介し、暗号化通信
              (TLS) 上でのアクセス権付与により提供します。
            </li>
            <li>
              <strong>提供を受ける者:</strong> 当社が別途定める基準により審査・契約した提携企業。
            </li>
            <li>
              <strong>提供を受ける者の利用目的:</strong>
              採用候補者の選定およびユーザーへのスカウトメッセージの送信。本目的以外の利用は契約上禁止します。
            </li>
            <li>
              <strong>本人の関与:</strong>
              ユーザーはいつでもスカウト機能のオプトインをオフにできます。オフ以降は新規の情報提供および新たなスカウトメッセージ送信を停止します。すでに提供済みの情報については、提携企業に対し速やかな削除を契約上求めます。
            </li>
            <li>
              スカウト機能の運用詳細 (提供データ範囲の細目、提携企業の選定基準、メッセージ取扱い等)
              は機能提供開始時に本ポリシーまたは別途のガイドラインで明示します。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第5条 (個人データの取扱いの委託)</h2>
          <p className={styles.paragraph}>
            当社は、利用目的の達成に必要な範囲内で、個人データの取扱いを以下の事業者に委託することがあります。
          </p>
          <ul className={styles.subList}>
            <li>
              Google LLC (Firebase Authentication / Cloud Firestore for Firebase Data Connect / Cloud
              Storage for Firebase 等) — 認証、データベース、ストレージ
            </li>
            <li>クラウドインフラ事業者 — サーバー、CDN、ログ収集</li>
            <li>その他、業務遂行に必要な事業者</li>
          </ul>
          <p className={styles.paragraph}>
            委託先に対しては、安全管理措置の遵守、再委託の制限、契約終了時のデータ返還または削除等を契約上義務付け、必要かつ適切な監督を行います。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第6条 (国外への移転)</h2>
          <p className={styles.paragraph}>
            本サービスは Firebase / Google Cloud
            等の海外サーバーを利用するため、ユーザーの個人情報は日本国外
            (米国その他、Google が定めるリージョン)
            に移転される可能性があります。これらの国における個人情報保護に関する制度や移転先事業者が講じる措置については、個人情報保護委員会の公表する情報をご参照ください。当社は、個人情報保護法の定めに従い、移転先における安全管理措置の継続的な確保に努めます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第7条 (Cookie 等の利用)</h2>
          <ol className={styles.list}>
            <li>
              本サービスは、ユーザー認証およびセッション管理のために必要な Cookie
              (HttpOnly / Secure 属性付与、暗号化された session cookie) を発行します。
            </li>
            <li>
              当該 Cookie はサービス機能の提供に不可欠であり、受け入れを拒否した場合、本サービスの一部または全部をご利用いただけません。
            </li>
            <li>
              当社は、サービス改善のためアクセス解析ツールを利用する場合があります。これらは
              Cookie
              等を使用してトラフィックデータを収集しますが、個人を特定する情報は含まれません。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第8条 (安全管理措置)</h2>
          <p className={styles.paragraph}>
            当社は、個人情報の漏えい、滅失、毀損の防止その他の個人情報の安全管理のため、以下を含む組織的・人的・物理的・技術的安全管理措置を講じます。
          </p>
          <ul className={styles.subList}>
            <li>個人情報取扱責任者の設置と社内規程の整備</li>
            <li>従業者および委託先への教育・監督</li>
            <li>アクセス権限の最小化と権限管理</li>
            <li>通信の TLS 暗号化</li>
            <li>セッションクッキーへの HttpOnly / Secure 属性付与</li>
            <li>認証コードの短期失効</li>
            <li>侵入検知、ログ監視、定期的なセキュリティレビュー</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第9条 (保有個人データの開示・訂正・利用停止等)</h2>
          <ol className={styles.list}>
            <li>
              ユーザーは、自己の保有個人データについて、開示、訂正、追加、削除、利用停止、消去、第三者提供の停止を請求することができます。
            </li>
            <li>
              請求は、第13条のお問い合わせ窓口までご連絡ください。当社は、本人または代理人であることを確認のうえ、法令の定めに従って対応します。
            </li>
            <li>請求の手続上必要な範囲で本人確認のための情報をお伺いすることがあります。</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第10条 (退会時のデータ取扱い)</h2>
          <ol className={styles.list}>
            <li>
              ユーザーが退会した場合、アカウント情報、プロフィール、フォロー関係、評価等の本サービス上のデータは原則として削除されます。
            </li>
            <li>
              ただし、以下の情報は法令に基づく保存義務その他の正当な理由がある範囲内で保持される場合があります。
              <ul className={styles.subList}>
                <li>不正利用防止のための記録</li>
                <li>法令に基づく保存義務のあるデータ</li>
                <li>個人を特定できないよう加工された統計情報</li>
              </ul>
            </li>
            <li>
              スカウト機能で過去に提携企業に提供された情報については、契約に従い提携企業側でも速やかに削除されます。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第11条 (未成年者の利用)</h2>
          <p className={styles.paragraph}>
            13歳未満の方は本サービスを利用できません。13歳以上18歳未満の方は、保護者の同意を得たうえでご利用ください。当社は、ユーザーが18歳未満であることを認識した場合、追加の本人・保護者確認の措置を取ることがあります。スカウト機能のオプトインは、保護者の同意を確認できる場合にのみ有効化を認めます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第12条 (本ポリシーの変更)</h2>
          <ol className={styles.list}>
            <li>
              本ポリシーの内容は、法令の改正や本サービスの機能追加 (スカウト機能の正式提供を含む)
              に伴い変更されることがあります。
            </li>
            <li>
              変更後のポリシーは、本サービス内で告知された時点から効力を生じます。重要な変更については、別途ユーザーに通知します。
            </li>
            <li>
              個人データの取扱方法に重要な変更が生じる場合、変更内容について明示的に同意を求めることがあります。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第13条 (お問い合わせ窓口)</h2>
          <p className={styles.paragraph}>
            本ポリシーまたは個人情報の取扱いに関するお問い合わせは、本サービス内のお問い合わせフォームまたは下記までご連絡ください。
          </p>
          <ul className={styles.subList}>
            <li>事業者名: Profme 運営事務局</li>
            <li>個人情報取扱責任者: Profme 運営事務局 個人情報保護管理者</li>
            <li>連絡先: support@profme.example (準備中)</li>
          </ul>
        </section>

        <p className={styles.signoff}>以上</p>
      </article>
    </PageLayout>
  );
};
