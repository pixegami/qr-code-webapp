import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import IndexPage from "./components/pages/IndexPage";
import ViewPage from "./components/pages/ViewPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/view">
            <ViewPage />
          </Route>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
