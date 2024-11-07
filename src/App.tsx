import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  useLocation,
} from "react-router-dom";
import { Auth, Chat, Profile } from "./pages";
import { useCallback, useLayoutEffect, useState } from "react";
import { useUserInfoStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utlis/constant";

const GlobalProvider = () => {
  const { pathname } = useLocation();
  const { setUserInfo, userInfo } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUserData = useCallback(async () => {
    const pageRoute = ["/", "/auth"];
    if (pageRoute.includes(pathname)) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });
      setUserInfo(response.data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [pathname, setUserInfo]);

  useLayoutEffect(() => {
    if (!userInfo) {
      getUserData();
    }
  }, [getUserData, userInfo]);

  return isLoading ? <>Loading...</> : <Outlet />;
};

const AutheticateRoutes: RouteObject = {
  path: "/",
  Component: Outlet,
  children: [
    {
      path: "/auth",
      Component: Auth,
    },
    {
      path: "/chat",
      Component: Chat,
    },
    {
      path: "/profile",
      Component: Profile,
    },
  ],
};

const DefaultRoutes: RouteObject = {
  path: "",
  element: <Navigate to="/auth" />,
};

const NotFound: RouteObject = {
  path: "*",
  element: <h1>404</h1>,
};

export const App = createBrowserRouter([
  {
    path: "/",
    Component: GlobalProvider,
    children: [NotFound, DefaultRoutes, AutheticateRoutes],
  },
]);
