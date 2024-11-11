import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  useNavigate,
} from "react-router-dom";
import { Auth, Chat, Profile } from "./pages";
import { useCallback, useEffect, useState } from "react";
import { useUserInfoStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utlis/constant";

const GlobalProvider = () => {
  const path = window.location.pathname;
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      navigate("/auth");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUserInfo]);

  useEffect(() => {
    const pageRoute = ["/", "/auth"];
    if (!userInfo && !pageRoute.includes(path)) {
      getUserData();
    }
  }, [getUserData, path, userInfo]);

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
