import { useEffect, useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import ReactPaginate from "react-paginate";

import styles from "./styles.module.scss";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { optionsCategory } from "../../utils/CategoryIcons";
import { toast } from "react-toastify";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  createdAt: string;
}

interface TransactionsTableProps {
  transactionsLengthPerPage: number;
}

export function TransactionsTable({
  transactionsLengthPerPage,
}: TransactionsTableProps) {
  const { transactions, removeTransaction } = useTransactions();

  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const transactionsPerPage = transactionsLengthPerPage;

  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * transactionsPerPage) % transactions.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const endOffset = itemOffset + transactionsPerPage;

    setTransactionsList(transactions.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(transactions.length / transactionsPerPage));
  }, [itemOffset, transactions, transactionsPerPage]);

  async function handleRemoveTransaction(transactionToRemove: Transaction) {
    try {
      await removeTransaction(transactionToRemove);
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao remover essa transação, tente novamente."
      );
    }
  }

  return (
    <section className={styles.transactionsContainer}>
      <div className={styles.title}>
        <h1>Histórico</h1>
        <span>Todas as Transações</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colum_1}>Transação</th>
            <th className={styles.colum_2}>Tipo</th>
            <th className={styles.colum_3}>Data</th>
            <th className={styles.colum_4}>Valor</th>
          </tr>
        </thead>

        <tbody>
          {transactions ? (
            transactionsList.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <div className={styles.transactionColumnOne}>
                  {optionsCategory.map((item) => (
                    <figure>
                      {item.title === transaction.category && item.icon}
                    </figure>
                  ))}
                  <div className={styles.titleColumn}>
                    <td>
                      <h1>{transaction.title}</h1>
                    </td>
                    <td>
                      <span>{transaction.category}</span>
                    </td>
                  </div>
                </div>

                <td>
                  <span
                    className={`${
                      transaction.type === "deposit"
                        ? styles.transactionType
                        : styles.transactionTypePickup
                    }`}
                  >
                    {transaction.type === "deposit" ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td>
                  <span className={styles.dateColumn}>
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "pt-BR",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </td>
                <td>
                  <span className={styles.amountColumn}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(transaction.amount)}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleRemoveTransaction(transaction)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <div></div>
          )}
        </tbody>
      </table>

      {transactions.length > 0 ? (
        <div className={styles.pagination}>
          <ReactPaginate
            previousLabel={<FiChevronLeft size={15} />}
            nextLabel={<FiChevronRight size={15} />}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={styles.paginationContainer}
            previousLinkClassName={styles.previousButton}
            nextLinkClassName={styles.nextButton}
            disabledClassName={styles.paginationDisabled}
            activeClassName={styles.paginationActive}
            pageRangeDisplayed={10}
            marginPagesDisplayed={10}
            breakLabel="..."
          />
        </div>
      ) : (
        <div></div>
      )}
    </section>
  );
}
