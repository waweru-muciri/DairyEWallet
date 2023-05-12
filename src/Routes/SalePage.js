import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import SaleInputForm from "../components/sales/SaleInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let ProductPage = (props) => {
    const { history, saleToEdit, contacts, products, customerAccountDeposits, handleItemSubmit } = props;
    const pageTitle = saleToEdit.id ? "Edit Sale" : "New Sale";

    return (
        <Layout pageTitle={pageTitle}>
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <SaleInputForm
                        saleToEdit={saleToEdit}
                        handleItemSubmit={handleItemSubmit}
                        contacts={contacts}
                        history={history}
                        products={products}
                        customerAccountDeposits={customerAccountDeposits}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {    

    return {
        products: state.products,
        contacts: state.contacts,
        customerAccountDeposits: state.customerAccountDeposits,
        saleToEdit: state.sales.find(({ id }) => id === ownProps.match.params.saleId) || {},
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

ProductPage = connect(mapStateToProps, mapDispatchToProps)(ProductPage);

export default withRouter(ProductPage);
