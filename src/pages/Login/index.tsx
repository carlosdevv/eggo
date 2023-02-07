import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import { FiLock, FiMail } from "react-icons/fi";
import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";

import styles from "./styles.module.scss";
import "react-toastify/dist/ReactToastify.css";
import illustrationImg from "../../assets/illustration_login.svg";
import googleIconImg from "../../assets/google-icon.svg";
import { useRef } from "react";
import { Input } from "../../components/Input";

interface SignInCredentials {
  email: string;
  password: string;
}

export default function Login() {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { signInWithGoogle, signInWithEmail, user } = useAuth();

  console.log(user);

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

  async function handleLoginWithEmail(data: SignInCredentials) {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required("E-mail obrigatório")
          .email("Digite um E-mail válido."),
        password: Yup.string().required("Senha obrigatória"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signInWithEmail({ email: data.email, password: data.password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors({
          email: "E-mail obrigatório",
          password: "Senha obrigatória",
        });
        toast.error("Erro nas credenciais, tente novamente.");
      } else {
        toast.error("Erro ao realizar o login, tente novamente.");
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.pageContainer}>
        <aside className={styles.asideLogin}>
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
            <h3>Log in</h3>
            <h1>Bem vindo de volta.</h1>

            <button
              className={styles.googleButton}
              onClick={handleLoginWithGoogle}
            >
              <img src={googleIconImg} alt="logo google" />
              Entrar com Google
            </button>

            <div className={styles.separator}>OU</div>

            <Form
              ref={formRef}
              onSubmit={handleLoginWithEmail}
              className={styles.loginForm}
            >
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
              <Button type="submit">Acessar minha conta</Button>
            </Form>

            <p className={styles.registerLink}>
              Não é membro ainda?
              <Link to="/register"> Registre-se</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
