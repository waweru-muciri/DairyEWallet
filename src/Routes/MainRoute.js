import React, { useEffect, Suspense, lazy } from "react";
import { connect } from "react-redux";
import {
  itemsFetchData,
  setCurrentUser,
  itemsHasErrored,
} from "../actions/actions";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  withRouter,
} from "react-router-dom";
import DashBoard from "./DashBoard";
import LoadingBackdrop from '../components/LoadingBackdrop'
import ErrorBoundary from '../components/ErrorBoundary'
import NotFound from "./NotFound"
import { auth } from '../firebase'
const DepositsPage = lazy(() => import('./Deposits'));
const DepositPage = lazy(() => import('./DepositPage'));
const ContactsPage = lazy(() => import('./Contacts'));
const ContactPage = lazy(() => import('./ContactPage'));
const SalesPage = lazy(() => import('./Sales'));
const SalePage = lazy(() => import('./SalePage'));
const ContactDetailsPage = lazy(() => import('./ContactDetailsPage'));
const ProductPage = lazy(() => import('./ProductPage'));
const ProductsPage = lazy(() => import('./Products'));


let MainPage = ({
  currentUser,
  match,
  fetchData, setUser, setError
}) => {
  const history = useHistory();

  useEffect(() => {
    
      fetchData([
        "contacts",
        "sales",
        "client-deposits",
        "products",
      ]);
    });

  return (
    <React.Fragment>
      {currentUser ?
        <Router>
          <ErrorBoundary>
            <Suspense fallback={<LoadingBackdrop open={true} />}>
              <Switch>
                <Route exact path={`${match.path}`} component={DashBoard} />
                <Route exact path={`${match.path}contacts/:contactId/details`} component={ContactDetailsPage} />
                <Route exact path={`${match.path}contacts`} component={ContactsPage} />
                <Route exact path={`${match.path}contacts/new`} component={ContactPage} />
                <Route exact path={`${match.path}contacts/:contactId/edit`} component={ContactPage} />
                <Route exact path={`${match.path}products/:productId/edit`} component={ProductPage} />
                <Route exact path={`${match.path}products`} component={ProductsPage} />
                <Route exact path={`${match.path}products/new`} component={ProductPage} />
                <Route exact path={`${match.path}sales`} component={SalesPage} />
                <Route exact path={`${match.path}sales/:saleId/edit`} component={SalePage} />
                <Route exact path={`${match.path}sales/new`} component={SalePage} />
                <Route exact path={`${match.path}client-deposits`} component={DepositsPage} />
                <Route exact path={`${match.path}client-deposits/:accountDepositId/edit`} component={DepositPage} />
                <Route exact path={`${match.path}client-deposits/new`} component={DepositPage} />
                <Route path="*" component={NotFound} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </Router>
        : null}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (collectionsUrls) => dispatch(itemsFetchData(collectionsUrls)),
    setUser: (user) => dispatch(setCurrentUser(user)),
    setError: (error) => dispatch(itemsHasErrored(error)),
  };
};

MainPage = connect(mapStateToProps, mapDispatchToProps)(MainPage);

export default withRouter(MainPage);
