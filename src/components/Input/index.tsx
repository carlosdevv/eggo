/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

import { IconBaseProps } from "react-icons";
import { useField } from "@unform/core";

import styles from "./styles.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  isCustom?: boolean;
  icon?: React.ComponentType<IconBaseProps>;
}

export function Input({
  name,
  icon: Icon,
  isCustom = false,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <div
      className={isCustom ? styles.inputContainerCustom : styles.inputContainer}
    >
      {Icon && <Icon size={20} />}
      <input defaultValue={defaultValue} ref={inputRef} {...rest} />
    </div>
  );
}
