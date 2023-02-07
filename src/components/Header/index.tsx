import React, { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import styles from "./styles.module.scss";

interface HeaderProps {
  title: string;
  description: string;
  onOpenNewTransactionModal?: () => void;
}
export function Header({
  title,
  description,
  onOpenNewTransactionModal,
}: HeaderProps) {
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    setCurrentMonth(new Date().toLocaleString("pt-BR", { month: "long" }));
  }, []);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.title}>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>

      <div className={styles.inputMonth}>
        <input
          placeholder={currentMonth.toLocaleUpperCase()}
          readOnly
          disabled
        />
        <FiCalendar size={20} />
      </div>

      <div className={styles.profileContainer}></div>
    </header>
  );
}
