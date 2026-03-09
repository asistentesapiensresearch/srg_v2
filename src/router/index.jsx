import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Preloader } from "@src/components/preloader";
import { TitleUpdater } from "@src/components/TitleUpdater";

function AppRoutes() {
  return useRoutes(routes);
}

export function RouterProvider() {
  return (
    <BrowserRouter>
      <TitleUpdater />
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