import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

type AuthContextData = {
  user: UserProps | undefined;
  signInWithGoogle: () => Promise<void>;
  logOut: () => void;
  registerUser: ({ email, password }: signUpCredentials) => void;
  signInWithEmail: ({ email, password }: signInCredentials) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

type UserProps = {
  id: string;
  name: string | null;
  avatar: string | null;
};

interface signInCredentials {
  email: string;
  password: string;
}

interface signUpCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const history = useHistory();
  const [user, setUser] = useState<UserProps>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        setUser({
          id: uid,
          name: displayName ?? "Coisinho(a)",
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  async function signInWithEmail({ email, password }: signInCredentials) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (result.user) {
        const { displayName, photoURL, uid } = result.user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }

      history.push("/");
    } catch (error) {
      toast.error("Erro ao realizar o login, tente novamente.");
    }
  }

  async function registerUser({ email, password }: signUpCredentials) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("Usuário registrado com sucesso.");
    } catch (error) {
      toast.error("Erro ao criar usuário.");
    }
  }

  function logOut() {
    signOut(auth).then(() => {
      setUser(undefined);
      history.push("/login");
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signInWithGoogle,
        logOut,
        registerUser,
        signInWithEmail,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  return value;
}
