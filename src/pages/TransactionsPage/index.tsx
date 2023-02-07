import { Menu } from "../../components/Menu";
import { TransactionsTable } from "../../components/TransactionsTable";

import styles from "./styles.module.scss";

export default function TrnsactionsPage() {
  return (
    <>
      <div className={styles.pageContainer}>
        <Menu />

        <main className={styles.mainContent}>
          <section className={styles.content}>
            <TransactionsTable transactionsLengthPerPage={7} />
          </section>
        </main>
      </div>
    </>
  );
}
