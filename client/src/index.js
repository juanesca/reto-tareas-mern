import React from "react";
import ReactDOM from "react-dom";

import App from "./Pages/App";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
  rootElement
);