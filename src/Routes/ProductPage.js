import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ProductInputForm from "../components/products/ProductInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let MeterReadingPage = (props) => {
    const { history, productToEdit, handleItemSubmit } = props;
    const pageTitle = "Product Details";
    return (
        <Layout pageTitle={pageTitle}>
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <ProductInputForm
                        productToEdit={productToEdit}
                        handleItemSubmit={handleItemSubmit}
                        history={history}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        productToEdit: state.products.find(({ id }) => id === ownProps.match.params.productId) || {},
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

MeterReadingPage = connect(mapStateToProps, mapDispatchToProps)(MeterReadingPage);

export default withRouter(MeterReadingPage);
