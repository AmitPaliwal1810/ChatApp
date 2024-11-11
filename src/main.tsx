import ReactDOM from "react-dom/client";
import { App } from "./App";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./context/socketContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <RouterProvider router={App} />
    <Toaster closeButton position="top-right" />
  </SocketProvider>
);
