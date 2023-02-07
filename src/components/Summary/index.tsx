import React from "react";
import { BsCoin } from "react-icons/bs";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiDollarSign,
} from "react-icons/fi";
import { useTransactions } from "../../hooks/useTransactions";
import styles from "./styles.module.scss";

export function Summary() {
  const { transactions } = useTransactions();

  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "deposit") {
        acc.deposits += Number(transaction.amount);
        acc.total += Number(transaction.amount);
      } else {
        acc.pickups += Number(transaction.amount);
        acc.total -= Number(transaction.amount);
      }
      return acc;
    },
    {
      investiments: 0,
      deposits: 0,
      pickups: 0,
      total: 0,
    }
  );

  return (
    <div className={styles.cardsWrapper}>
      <div className={styles.card}>
        <div className={styles.textCard}>
          <FiArrowUpCircle color="#33cc95" />

          <p>Entradas</p>
          <strong>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(summary.deposits)}
          </strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.textCard}>
          <FiArrowDownCircle color="#e52e54" />

          <p>Saídas</p>
          <strong>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(summary.pickups)}
          </strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.textCard}>
          <FiDollarSign />

          <p>Total</p>
          <strong
            className={`${
              summary.total < 0 ? styles.negativeTotal : styles.total
            }`}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(summary.total)}
          </strong>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.textCard}>
          <BsCoin />

          <p>Salário</p>
          <strong className={`${styles.total}`}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(4630.49)}
          </strong>
        </div>
      </div>
    </div>
  );
}
