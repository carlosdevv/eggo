import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import { FiArrowDownCircle, FiArrowUpCircle, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { useTransactions } from "../../hooks/useTransactions";
import { Dropdown } from "../Dropdown";
import { Input } from "../Input";

import styles from "./styles.module.scss";

interface NewTransactionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface createTransactionProps {
  title: string;
  amount: number;
}

export function ModalNewTransaction({
  isOpen,
  onRequestClose,
}: NewTransactionModalProps) {
  const { createTransaction, selectedItemDropdownModal } = useTransactions();
  const formRef = useRef<FormHandles>(null);

  const [type, setType] = useState("pickup");
  const [category, setCategory] = useState("");
  // const [amount, setAmount] = useState(0);

  useEffect(() => {
    setCategory(selectedItemDropdownModal);
  }, [selectedItemDropdownModal]);

  async function handleCreateNewTransaction(data: createTransactionProps) {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        title: Yup.string().required("Titulo obrigatório").trim(),
        amount: Yup.number().required("Valor obrigatório"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (category) {
        const transaction = {
          title: data.title,
          amount: data.amount,
          category: category,
          type: type,
        };

        await createTransaction(transaction);

        toast.success("Transação registrada com sucesso.");
        setCategory("");
        setType("pickup");

        onRequestClose();
      } else {
        toast.error("Informe a categoria da transação.");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors({
          title: "Titulo obrigatório",
          amount: "Valor obrigatório",
        });
        toast.error("Informe corretamente os campos e tente novamente.");
      } else {
        toast.error("Ocorreu um erro ao cadastrar uma nova transação.");
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName={styles.react_modal_overlay}
        className={styles.react_modal_content}
      >
        <button
          type="button"
          onClick={onRequestClose}
          className={styles.react_modal_close}
        >
          <FiX size={25} />
        </button>

        <Form
          ref={formRef}
          className={styles.contentModal}
          onSubmit={handleCreateNewTransaction}
        >
          <h2>Cadastrar Transação</h2>

          <Input name="title" placeholder="Título" isCustom />

          <Dropdown />

          <div className={styles.transactionsButtons}>
            <button
              className={`${type === "deposit" ? styles.buttonActive : ""}`}
              type="button"
              onClick={() => {
                setType("deposit");
              }}
            >
              <FiArrowUpCircle color="#33cc95" />
              <span>Entrada</span>
            </button>

            <button
              className={`${type === "pickup" ? styles.buttonActive : ""}`}
              type="button"
              onClick={() => {
                setType("pickup");
              }}
            >
              <FiArrowDownCircle color="#e52e54" />
              <span>Saída</span>
            </button>
          </div>

          <Input
            name="amount"
            type="number"
            isCustom
            step="0.01"
            placeholder="R$ Valor"
          />

          <button type="submit">Cadastrar</button>
        </Form>
      </Modal>
    </>
  );
}
