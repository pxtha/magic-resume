import { TooltipProvider } from "@reactive-resume/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";

import { helmetContext } from "../constants/helmet";
import { queryClient } from "../libs/query-client";
import { DialogProvider } from "./dialog";
import { LocaleProvider } from "./locale";
import { ThemeProvider } from "./theme";
import { Toaster } from "./toaster";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Providers = () => (
  <LocaleProvider>
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <ThemeProvider>
          <TooltipProvider>
            <DialogProvider>
              <Outlet />

              <Toaster />
            </DialogProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </LocaleProvider>
);
