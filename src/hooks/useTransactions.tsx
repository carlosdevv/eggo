import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ref,
  query,
  onValue,
  limitToLast,
  remove,
  set,
} from "firebase/database";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

import { v4 as uuidv4 } from "uuid";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  createdAt: string;
}

//TransactionInput irá herdar todos os atributos de Transaction
// menos "id" e "createdAt" (Omit = omitir)
type TransactionInput = Omit<Transaction, "id" | "createdAt">;

interface TransactionsContextData {
  transactions: Transaction[];
  recentsTransactions: Transaction[];
  createTransaction: (transactionInput: TransactionInput) => Promise<void>; //Promise pq essa função é async
  removeTransaction: (transactionToRemove: Transaction) => Promise<void>; //Promise pq essa função é async
  selectedItemDropdownModal: string;
  setSelectedItemDropdownModal: Dispatch<SetStateAction<string>>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentsTransactions, setRecentsTransactions] = useState<Transaction[]>(
    []
  );

  const [selectedItemDropdownModal, setSelectedItemDropdownModal] =
    useState("");

  const transactionRef = ref(database, "transactions/" + user?.id);

  useEffect(() => {
    const allTransactionRef = ref(database, "transactions/" + user?.id);

    const recentsTransactionRef = query(
      ref(database, "transactions/" + user?.id),
      limitToLast(8)
    );
    let recentList = [] as Transaction[];
    let list = [] as Transaction[];

    onValue(
      recentsTransactionRef,
      (snapshot) => {
        snapshot.forEach((result) => {
          recentList.push(result.val());
        });
        setRecentsTransactions(recentList);
      },

      {
        onlyOnce: true,
      }
    );

    onValue(
      allTransactionRef,
      (snapshot) => {
        snapshot.forEach((result) => {
          list.push(result.val());
        });
        setTransactions(list);
      },

      {
        onlyOnce: true,
      }
    );
  }, [user?.id, recentsTransactions]);

  async function createTransaction(transactionInput: TransactionInput) {
    const id = uuidv4();

    await set(ref(database, `transactions/${user?.id}/${id}`), {
      id: id,
      title: transactionInput.title,
      amount: transactionInput.amount,
      category: transactionInput.category,
      type: transactionInput.type,
      createdAt: Date.now(),
    });

    setSelectedItemDropdownModal("");

    onValue(
      transactionRef,
      (snapshot) => {
        snapshot.forEach((result) => {
          const listTransactions = result.val();

          setTransactions([...transactions, listTransactions]);
          setRecentsTransactions([...recentsTransactions, listTransactions]);
        });
      },
      { onlyOnce: true }
    );
  }

  async function removeTransaction(transactionToRemove: Transaction) {
    remove(ref(database, `transactions/${user?.id}/${transactionToRemove.id}`));

    const positionTransaction = transactions.indexOf(transactionToRemove);
    const positionRecentsTransaction =
      recentsTransactions.indexOf(transactionToRemove);

    if (positionRecentsTransaction > -1) {
      transactions.splice(positionTransaction, 1);
      recentsTransactions.splice(positionRecentsTransaction, 1);
    } else {
      transactions.splice(positionTransaction, 1);
    }
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        recentsTransactions,
        createTransaction,
        removeTransaction,
        selectedItemDropdownModal,
        setSelectedItemDropdownModal,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
