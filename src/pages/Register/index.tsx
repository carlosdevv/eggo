import { useRef } from "react";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import styles from "./styles.module.scss";
import illustrationImg from "../../assets/illustration_login.svg";
import { FiLock, FiMail } from "react-icons/fi";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/Input";
import googleIconImg from "../../assets/google-icon.svg";

interface SignUpCredentials {
  email: string;
  password: string;
}

export function Register() {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { registerUser, user, signInWithGoogle } = useAuth();

  if (user) {
    history.push("/");
  }

  async function handleLoginWithGoogle() {
    try {
      if (!user) {
        await signInWithGoogle();
      }

      toast.success("Login realizado com sucesso.");
      history.push("/");
    } catch (error) {
      toast.error("Erro ao realizar o Login, tente novamente.");
    }
  }

  async function handleSubmit(data: SignUpCredentials) {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required("E-mail obrigatório")
          .email("Digite um E-mail válido."),
        password: Yup.string()
          .required("Senha obrigatória")
          .min(6, "Sua senha precisa ter ao menos 6 caracteres"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await registerUser({
        email: data.email,
        password: data.password,
      });

      history.push("/login");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setFieldError(
          "password",
          "Sua senha precisa ter ao menos 6 caracteres"
        );

        if (formRef.current?.getFieldError("password")) {
          toast.error(formRef.current?.getFieldError("password"));
        } else {
          formRef.current?.setErrors({
            email: "E-mail obrigatório",
            password: "Senha obrigatória",
          });

          toast.error("Erro nas credenciais, tente novamente.");
        }
      } else {
        toast.error("Ocorreu um erro ao se registrar.");
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.pageContainer}>
        <aside>
          <img src={illustrationImg} alt="" />
          <div className={styles.illustrationText}>
            <h1>
              Simplifique suas movimentações
              <pre />
              financeiras.
            </h1>
            <span>
              A jornada completa de poder gerenciar suas despesas e receitas
              <pre />
              em um único lugar.
            </span>
          </div>
        </aside>

        <main className={styles.mainContainer}>
          <div className={styles.mainContent}>
            <h3>Registro</h3>
            <h1>Comece agora com a sua conta.</h1>

            <button
              className={styles.googleButton}
              onClick={handleLoginWithGoogle}
            >
              <img src={googleIconImg} alt="logo google" />
              Entrar com Google
            </button>

            <div className={styles.separator}>Ou informe seus dados</div>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="email"
                icon={FiMail}
                placeholder="Informe seu email"
                type="text"
                required
              />
              <Input
                name="password"
                type="password"
                icon={FiLock}
                placeholder="Informe sua senha"
                autoComplete="off"
                required
              />

              <Button type="submit">Registrar</Button>
            </Form>

            <p className={styles.loginLink}>
              Já tem uma conta?
              <Link to="/login"> Faça seu login</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
