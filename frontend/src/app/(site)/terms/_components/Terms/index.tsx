import { PageLayout } from "@/app/_components/Layout/PageLayout";
import styles from "./styles.module.css";

export const Terms = () => {
  return (
    <PageLayout>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>利用規約</h1>
          <p className={styles.lastUpdated}>最終更新日: 2026年5月9日</p>
        </header>

        <p className={styles.paragraph}>
          本利用規約 (以下「本規約」) は、Profme (以下「本サービス」)
          の提供条件および本サービスの利用に関する運営者 (以下「当社」)
          とユーザーとの間の権利義務関係を定めるものです。本サービスを利用する方は、本規約に同意したうえでご利用ください。
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第1条 (適用)</h2>
          <ol className={styles.list}>
            <li>本規約は、本サービスの利用に関するすべての関係に適用されます。</li>
            <li>
              当社が本サービス内で随時掲載する利用上のルール、ガイドライン等は、本規約の一部を構成するものとします。
            </li>
            <li>
              本規約と前項のルール等の規定が矛盾する場合、特段の定めがない限り本規約の規定が優先するものとします。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第2条 (利用登録)</h2>
          <ol className={styles.list}>
            <li>
              本サービスは、利用希望者が本規約に同意のうえ電話番号認証を完了することで利用登録を行います。
            </li>
            <li>
              当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録を承認しないことがあり、その理由については一切の開示義務を負いません。
              <ul className={styles.subList}>
                <li>虚偽の事項を届け出た場合</li>
                <li>本規約に違反したことがある者からの申請である場合</li>
                <li>反社会的勢力等であると当社が判断した場合</li>
                <li>その他、当社が利用登録を相当でないと判断した場合</li>
              </ul>
            </li>
            <li>
              13歳未満の方は本サービスを利用できません。13歳以上18歳未満の方は、保護者の同意を得たうえでご利用ください。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第3条 (アカウントの管理)</h2>
          <ol className={styles.list}>
            <li>
              ユーザーは自己の責任において認証情報 (電話番号、認証コード、セッション情報等)
              を適切に管理するものとします。
            </li>
            <li>
              ユーザーが登録した認証情報を用いて行われた行為は、当該ユーザー本人の行為とみなされます。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第4条 (ユーザー投稿コンテンツ)</h2>
          <ol className={styles.list}>
            <li>
              ユーザーは本サービスにプロフィール情報 (表示名、大学、学部、学年、自己紹介、ガクチカ、スキル、趣味、資格、SNSリンク、ポートフォリオ等)
              および他ユーザーへの評価 (Endorsement) を投稿できます。
            </li>
            <li>
              ユーザーは、投稿コンテンツについて自らが投稿する適法な権限を有することを表明し保証するものとします。
            </li>
            <li>
              ユーザーは、投稿コンテンツについて、当社に対し、本サービスの提供・維持・改善に必要な範囲で、無償・非独占的・地域無制限・サブライセンス可能な利用許諾
              (複製、公衆送信、編集等を含む) を許諾するものとします。
            </li>
            <li>
              ユーザーは投稿コンテンツを本サービスの機能を通じていつでも削除できます。ただし、当社のバックアップ等にコピーが残ることがあります。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第5条 (評価機能)</h2>
          <ol className={styles.list}>
            <li>
              評価 (Endorsement) は、フォロー関係が成立しているユーザー間でのみ送信できます。
            </li>
            <li>
              評価は受信者が承認した時点で公開されます。承認しない限り、第三者には公開されません。
            </li>
            <li>
              ユーザーは、虚偽の事実、誹謗中傷、名誉毀損、差別的表現、個人情報を不当に含む内容、その他公序良俗に反する内容を含む評価を投稿してはなりません。
            </li>
            <li>
              当社は、ユーザーから報告を受けた場合または当社が独自に発見した場合、事前の通知なく当該評価を削除できるものとします。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第6条 (フォロー機能)</h2>
          <ol className={styles.list}>
            <li>ユーザーは他のユーザーに対してフォロー申請を送信できます。</li>
            <li>フォロー申請は、相手の承認をもって有効になります。</li>
            <li>フォロー関係はいつでも解除できます。</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第7条 (公開設定)</h2>
          <ol className={styles.list}>
            <li>
              ユーザーは、自身の名刺情報の各項目 (大学情報、SNS、ポートフォリオ、評価等)
              について、公開・非公開を個別に選択できます。
            </li>
            <li>非公開に設定した項目は、本人以外のユーザーには表示されません。</li>
            <li>
              当社は、公開設定を尊重するため API レベルでも該当データのマスク処理を行いますが、設定反映前にキャッシュ等に残るデータが存在し得る点をご了承ください。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第8条 (スカウト機能 — 将来提供予定)</h2>
          <ol className={styles.list}>
            <li>
              当社は将来、本サービスにおいてユーザーのプロフィール情報を提携企業に提供し、企業からユーザーへスカウトメッセージを送信できる「スカウト機能」を提供する予定です。
            </li>
            <li>
              スカウト機能は、ユーザーが事前に「スカウトを受け取る」設定 (以下「オプトイン」)
              を有効にした場合に限り稼働します。オプトインしていないユーザーの情報は提携企業に一切提供されません。
            </li>
            <li>
              オプトインしたユーザーについて提供される情報の範囲は、表示名、大学、学部、学年、自己紹介、ガクチカ、スキル、趣味、資格、公開設定が「公開」となっている評価とします。電話番号その他の連絡先は提供されません。
            </li>
            <li>
              提携企業は、提供された情報を採用候補者の選定およびスカウトメッセージ送信の目的にのみ利用するものとし、当社はこれを契約上義務付けます。
            </li>
            <li>
              ユーザーはいつでもスカウト機能をオフにすることができ、オフ以降は新規の情報提供および新たなスカウトメッセージの送信が停止されます。
            </li>
            <li>
              スカウト機能の運用詳細 (提供データの正確な範囲、提携企業の選定基準、メッセージの取扱い等)
              は、機能提供開始時に本規約またはガイドラインで別途定めるものとします。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第9条 (禁止事項)</h2>
          <p className={styles.paragraph}>
            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ol className={styles.list}>
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              当社、本サービスの他ユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為
            </li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>不正アクセスをし、またはこれを試みる行為</li>
            <li>他のユーザーに関する個人情報等を権限なく収集または蓄積する行為</li>
            <li>なりすまし行為</li>
            <li>他のユーザーに対する誹謗中傷</li>
            <li>反社会的勢力に対する利益供与</li>
            <li>
              本サービスのスカウト機能以外の方法で営利目的のスパム、ダイレクトマーケティングを送信する行為
            </li>
            <li>当社が認めない方法で他のユーザーへ営業・勧誘する行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第10条 (本サービスの提供の停止等)</h2>
          <ol className={styles.list}>
            <li>
              当社は、以下のいずれかに該当する場合、ユーザーに事前通知することなく本サービスの全部または一部の提供を停止または中断できます。
              <ul className={styles.subList}>
                <li>本サービスにかかるシステムの保守・点検・更新を行う場合</li>
                <li>地震、火災、停電、その他の不可抗力により本サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線の障害が発生した場合</li>
                <li>その他、当社が停止または中断を必要と判断した場合</li>
              </ul>
            </li>
            <li>
              当社は、本サービスの提供停止または中断によりユーザーまたは第三者に生じたいかなる不利益または損害について、責任を負わないものとします。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第11条 (利用制限および登録抹消)</h2>
          <p className={styles.paragraph}>
            当社は、ユーザーが本規約に違反した場合または当社が必要と判断した場合、当該ユーザーに対し、事前の通知なく、投稿コンテンツの削除、本サービスの利用制限、登録の抹消等の措置を講じることができます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第12条 (退会)</h2>
          <p className={styles.paragraph}>
            ユーザーは、当社所定の手続きによりいつでも退会できます。退会した場合、当該ユーザーのアカウント、プロフィール、フォロー関係、評価等の本サービス上のデータは原則として削除されます
            (法令により保存が義務付けられているもの、不正利用防止のため保持が必要なものを除く)。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第13条 (保証の否認および免責事項)</h2>
          <ol className={styles.list}>
            <li>
              当社は、本サービスに事実上または法律上の瑕疵 (安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、第三者の権利を侵害しないこと等)
              がないことを明示的にも黙示的にも保証しません。
            </li>
            <li>
              当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
            </li>
            <li>
              本サービスに関する当社とユーザーとの間の契約 (本規約を含む)
              が消費者契約法に定める消費者契約となる場合、本条において当社の損害賠償責任を完全に免責する旨の規定は適用されません。
            </li>
            <li>
              前項に定める場合であっても、当社は、当社の過失 (重過失を除く)
              による債務不履行または不法行為によりユーザーに生じた損害のうち、特別な事情から生じた損害については一切の責任を負わないものとします。
            </li>
            <li>
              当社は、ユーザー間または、ユーザーと第三者 (提携企業を含む)
              との間で生じたトラブルについて、原則として関与せず、責任を負わないものとします。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第14条 (サービス内容の変更等)</h2>
          <p className={styles.paragraph}>
            当社は、ユーザーへの事前通知をもって、本サービスの内容を変更し、または本サービスの提供を中止できるものとします。当社は、これによりユーザーに生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第15条 (利用規約の変更)</h2>
          <ol className={styles.list}>
            <li>
              当社は、必要と判断した場合、ユーザーへの通知のうえ、本規約を変更することができるものとします。
            </li>
            <li>
              変更後の本規約は、当社が定める方法 (本サービス内の掲示、メール送付等)
              で告知された時点から効力を生じます。
            </li>
            <li>
              ユーザーが変更の効力発生後に本サービスの利用を継続した場合、当該ユーザーは変更後の本規約に同意したものとみなされます。
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第16条 (個人情報の取扱い)</h2>
          <p className={styles.paragraph}>
            本サービスの利用において取得する個人情報の取扱いについては、別途定める「プライバシーポリシー」によるものとします。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第17条 (通知または連絡)</h2>
          <p className={styles.paragraph}>
            ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは発信時にユーザーへ到達したものとみなします。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第18条 (権利義務の譲渡の禁止)</h2>
          <p className={styles.paragraph}>
            ユーザーは、当社の書面による事前の承諾なく、本規約に基づく権利または義務を第三者に譲渡し、または承継させることはできません。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>第19条 (準拠法・裁判管轄)</h2>
          <ol className={styles.list}>
            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
            <li>
              本サービスに関して紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </li>
          </ol>
        </section>

        <p className={styles.signoff}>以上</p>
      </article>
    </PageLayout>
  );
};
