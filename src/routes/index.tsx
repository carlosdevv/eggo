import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import { AuthContextProvider } from "../hooks/useAuth";
import PrivateRoute from "./PrivateRoute";
import { Register } from "../pages/Register";
import { TransactionsProvider } from "../hooks/useTransactions";
import TransactionsPage from "../pages/TransactionsPage";

export function Routes() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <TransactionsProvider>
          <Switch>
            <PrivateRoute path="/" exact component={Dashboard} />
            <PrivateRoute
              path="/transactions"
              exact
              component={TransactionsPage}
            />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            {/* <Route path="*" exact component={NotFoundPage} /> */}
          </Switch>
        </TransactionsProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
