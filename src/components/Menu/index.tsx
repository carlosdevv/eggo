import { Link } from "react-router-dom";

import { FiHome, FiLogOut, FiRefreshCcw } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

import AvatarDefault from "../../assets/avatar_default.svg";
import styles from "./styles.module.scss";
import "react-toastify/dist/ReactToastify.css";

export function Menu() {
  const { user, logOut } = useAuth();

  function handleLogout() {
    logOut();
  }
  return (
    <>
      <aside className={styles.menuContainer}>
        <div className={styles.profileContainer}>
          {user?.avatar ? (
            <img className={styles.avatar} src={user?.avatar} alt="Avatar" />
          ) : (
            <img className={styles.avatar} src={AvatarDefault} alt="Avatar" />
          )}

          <span>{user?.name}</span>
        </div>

        <section className={styles.wrapServices}>
          <p>Services</p>

          <div className={styles.menuItem}>
            <Link to="/">
              <FiHome size={20} />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className={styles.menuItem}>
            <Link to="/transactions">
              <FiRefreshCcw size={20} />
              <span>Transações</span>
            </Link>
          </div>
        </section>

        <div className={styles.logout}>
          <button onClick={handleLogout}>
            <FiLogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
