import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./theme.css";
import "./styles.css";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="yellow-border" />
      <div className="wrapper">
        <div className="container-outer">
          <div className="container">
            <App />
          </div>
        </div>
        <ReactQueryDevtools initialIsOpen={true} />
      </div>
    </QueryClientProvider>
  </React.StrictMode>
);
