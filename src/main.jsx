import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QuizProvider } from "./QuizContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <App />
      </QuizProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
