import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Preloader } from "../components/Preloader";

function AppRoutes() {
  return useRoutes(routes);
}

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Preloader/>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}