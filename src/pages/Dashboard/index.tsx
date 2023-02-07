import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";

import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";
import { ModalNewTransaction } from "../../components/ModalNewTransaction";
import { Summary } from "../../components/Summary";
import { useAuth } from "../../hooks/useAuth";

import styles from "./styles.module.scss";
import { RecentActivities } from "../../components/RecentActivities";

Modal.setAppElement("#root");

export default function Dashboard() {
  const history = useHistory();
  const { user } = useAuth();

  const [isOpenModalTransaction, setIsOpenModalTransaction] = useState(false);

  if (!user) {
    history.push("/login");
  }

  function handleOpenTransactionModal() {
    setIsOpenModalTransaction(true);
  }

  function handleCloseTransactionModal() {
    setIsOpenModalTransaction(false);
  }
  return (
    <>
      <ModalNewTransaction
        isOpen={isOpenModalTransaction}
        onRequestClose={handleCloseTransactionModal}
      />

      <div className={styles.pageContainer}>
        <Menu />

        <main className={styles.mainContent}>
          <section className={styles.content}>
            <Header
              title="Dashboard"
              description="Payments updates"
              onOpenNewTransactionModal={handleOpenTransactionModal}
            />

            <Summary />
          </section>

          <RecentActivities
            onOpenNewTransactionModal={handleOpenTransactionModal}
          />
        </main>
      </div>
    </>
  );
}
