import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useTransactions } from "../../hooks/useTransactions";
import { Button } from "../Button";
import styles from "./styles.module.scss";
import { optionsCategory } from "../../utils/CategoryIcons";

interface RecentActivitiesProps {
  onOpenNewTransactionModal: () => void;
}

export function RecentActivities({
  onOpenNewTransactionModal,
}: RecentActivitiesProps) {
  const { recentsTransactions } = useTransactions();

  const [timeNow, setTimeNow] = useState("");
  const [hourNow, setHourNow] = useState("");

  useEffect(() => {
    setTimeNow(
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
      })
    );

    setHourNow(
      new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  return (
    <aside className={styles.sideContainer}>
      <section className={styles.newTransaction}>
        <p>{timeNow}</p>
        <span>{hourNow}</span>
        <Button type="button" onClick={onOpenNewTransactionModal}>
          Nova Transação
          <FiPlus size={20} />
        </Button>
      </section>

      <section className={styles.recentTransactions}>
        <h1>Atividades Recentes</h1>
        <p>Últimas transações</p>

        <div className={styles.transactionBlock}>
          {recentsTransactions &&
            recentsTransactions.slice(0, 8).map((transaction) => (
              <div className={styles.transactionItem}>
                {optionsCategory.map((item) => (
                  <figure>
                    {item.title === transaction.category && item.icon}
                  </figure>
                ))}

                <div>
                  <h2>{transaction.title}</h2>
                  <span className={styles.transactionHour}>
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </span>
                </div>
                <span
                  className={`${
                    transaction.type === "deposit"
                      ? styles.transactionType
                      : styles.transactionTypePickup
                  }`}
                >
                  {transaction.type === "deposit" ? "Entrada" : "Saída"}
                </span>
                <span className={styles.transactionAmount}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(transaction.amount)}
                </span>
              </div>
            ))}
        </div>
      </section>
    </aside>
  );
}
