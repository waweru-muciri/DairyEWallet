import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import { handleDelete, itemsFetchData } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { connect } from "react-redux";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";



const productsTableHeadCells = [
    { id: "product_name", numeric: false, disablePadding: true, label: "Product Name" },
    { id: "purchase_date", numeric: false, disablePadding: true, label: "Purchase Recorded" },
    { id: "product_purchase_price", numeric: false, disablePadding: true, label: "Purchase Price" },
    { id: "product_quantity", numeric: false, disablePadding: true, label: "Quantity" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];

let ProductsPage = ({
    fetchData,
    products,
    handleItemDelete,
    match,
}) => {
    const classes = commonStyles();
    let [productItems, setMeterReadingItems] = useState([]);
    let [filteredMeterReadingItems, setFilteredMeterReadingItems] = useState([]);
    let [productNameFilter, setProductNameFilter] = useState("");
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        fetchData(['products']);
    }, [fetchData]);

    useEffect(() => {
        setMeterReadingItems(products);
        setFilteredMeterReadingItems(filterproductsByCriteria(products));
    }, [products]);

    const filterproductsByCriteria = (productsToFilter) => {
        let filteredproducts = productsToFilter
        .filter(({ product_name }) =>
                !productNameFilter ? true : product_name.toLowerCase().includes(productNameFilter.toLowerCase())
            )
        return filteredproducts;
    }

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the products here according to search criteria
        setFilteredMeterReadingItems(filterproductsByCriteria(productItems));
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setProductNameFilter("")
    };

    return (
        <Layout pageTitle="Products">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item lg={12}>
                    <PageHeading text="Products" />
                </Grid>
                <Grid
                    container
                    spacing={2}
                    item
                    alignItems="center"
                    direction="row"
                    key={1}
                >
                    <Grid item>
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            startIcon={<AddIcon />}
                            component={Link}
                            to={`${match.url}/new`}
                        >
                            NEW
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="button"
                            color="primary"
                            variant="contained"
                            size="medium"
                            startIcon={<EditIcon />}
                            disabled={!selected.length}
                            component={Link}
                            to={`${match.url}/${selected[0]}/edit`}
                        >
                            Edit
                        </Button>
                    </Grid>
                    <Grid item>
                        <PrintArrayToPdf
                            disabled={!selected.length}
                            reportName={'Products Records'}
                            reportTitle={'Products Records'}
                            headCells={productsTableHeadCells}
                            dataToPrint={productItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        border={1}
                        borderRadius="borderRadius"
                        borderColor="grey.400"
                    >
                        <form
                            className={classes.form}
                            id="contactSearchForm"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                direction="column"
                            >
                                <Grid
                                    container
                                    item
                                    spacing={2}
                                    justify="center"
                                    direction="row"
                                >
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="product_search_name"
                                                name="product_search_name"
                                                label="Product Name"
                                                value={productNameFilter}
                                                onChange={(event) => {
                                                    setProductNameFilter(
                                                        event.target.value.trim()
                                                    );
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    item
                                    justify="flex-end"
                                    alignItems="center"
                                    direction="row"
                                    key={1}
                                >
                                    <Grid item>
                                        <Button
                                            onClick={(event) => handleSearchFormSubmit(event)}
                                            type="submit"
                                            form="contactSearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<SearchIcon />}
                                        >
                                            SEARCH
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            onClick={(event) =>
                                                resetSearchForm(event)
                                            }
                                            type="reset"
                                            form="propertySearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<UndoIcon />}
                                        >
                                            RESET
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredMeterReadingItems}
                        headCells={productsTableHeadCells}
                        handleDelete={handleItemDelete}
                        deleteUrl={"products"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        products: state.products
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (collectionsUrls) => dispatch(itemsFetchData(collectionsUrls)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

ProductsPage = connect(mapStateToProps, mapDispatchToProps)(ProductsPage);

export default withRouter(ProductsPage);
