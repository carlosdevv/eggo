import React from "react";
import {
  RouteProps as ReactDOMRouterProps,
  Route,
  Redirect,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface RouteProps extends ReactDOMRouterProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

export function PrivateRoute({ component: Component, ...rest }: RouteProps) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(RouteProps) =>
        !!user ? <Component /> : <Redirect to={"/login"} />
      }
    />
  );
}

export default Route;
