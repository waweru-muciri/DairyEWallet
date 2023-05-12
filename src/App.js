import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainRoutePage from "./Routes/MainRoute";
import SignInPage from "./Routes/SignIn";
import HomePage from "./Routes/HomePage";


const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/app/" component={MainRoutePage} />
          <Route exact path="/" component={SignInPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
