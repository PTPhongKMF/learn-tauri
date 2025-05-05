/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import Sqlite from "./pages/Sqlite";

render(() => (
  <Router>
    <Route path="/" component={App} />
    <Route path="/sqlite" component={Sqlite} />
  </Router>
), document.getElementById("root"));
