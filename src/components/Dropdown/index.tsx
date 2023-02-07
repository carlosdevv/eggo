import { useState } from "react";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { useTransactions } from "../../hooks/useTransactions";
import { optionsCategory } from "../../utils/CategoryIcons";

import styles from "./styles.module.scss";

export function Dropdown() {
  const { selectedItemDropdownModal, setSelectedItemDropdownModal } =
    useTransactions();

  const [isActive, setIsActive] = useState(false);
  const placeholderCategory = "Escolha sua categoria";

  return (
    <section className={styles.dropdown}>
      <button
        type="button"
        className={`${
          isActive ? styles.dropdownInputActive : styles.dropdownInput
        }`}
        onClick={() => {
          setIsActive(!isActive);
        }}
      >
        {selectedItemDropdownModal
          ? selectedItemDropdownModal
          : placeholderCategory}
        {isActive ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>

      {isActive && (
        <div className={styles.dropdownContent}>
          {optionsCategory.map((value) => {
            return (
              <div
                key={value.title}
                className={styles.dropdownItem}
                onClick={() => {
                  setIsActive(false);
                  setSelectedItemDropdownModal(value.title);
                }}
              >
                {value.icon}
                {value.title}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
