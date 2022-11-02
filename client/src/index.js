import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import "antd/dist/antd.css";

import App from "./App";
import ContextWrapper from "./Context/ContextWrapper";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ContextWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextWrapper>
  </React.StrictMode>
);
