import ReactDOM from "react-dom/client";
import { App } from "./App";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={App} />
    <Toaster closeButton position="top-right" />
  </>
);
