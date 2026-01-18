// src/router/index.jsx
import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Preloader } from "../components/preloader";

function AppRoutes() {
  return useRoutes(routes);
}

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <Preloader />
        </div>
      }>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}