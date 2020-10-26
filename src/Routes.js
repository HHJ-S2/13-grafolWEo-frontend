import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./Pages/Main/Main";
import WorksList from "./Pages/WorksList/WorksList";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/WorksList" component={WorksList} />
        </Switch>
      </Router>
    );
  }
}
export default Routes;
