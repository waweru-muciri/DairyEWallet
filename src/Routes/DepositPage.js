import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import AccountDepositInputForm from "../components/accountDeposits/AccountDepositInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let AccountDepositPage = ({ contacts, accountDepositToEdit, handleItemSubmit, history }) => {
    const pageTitle = accountDepositToEdit.id ? "Edit Account Deposit" : "New Account Deposit";
    return (
        <Layout pageTitle="Account Deposit Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading  text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <AccountDepositInputForm
                        history={history}
                        accountDepositToEdit={accountDepositToEdit}
                        handleItemSubmit={handleItemSubmit}
                        contacts={contacts}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        contacts: state.contacts,
        accountDepositToEdit: state.customerAccountDeposits.find(({ id }) => id === ownProps.match.params.accountDepositId) || {},
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

AccountDepositPage = connect(mapStateToProps, mapDispatchToProps)(AccountDepositPage);

export default withRouter(AccountDepositPage);
