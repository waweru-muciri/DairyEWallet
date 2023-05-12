import Layout from "../components/PrivateLayout";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../components/PageHeading";
import React, { useEffect, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import UndoIcon from "@material-ui/icons/Undo";
import PrintIcon from "@material-ui/icons/Print";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import { connect } from "react-redux";
import { handleItemFormSubmit, handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import { getStartEndDatesForPeriod, getSalesFilterOptions } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from "@material-ui/icons/Add";


const TRANSACTIONS_FILTER_OPTIONS = getSalesFilterOptions()

const headCells = [
    { id: "sale_date", numeric: false, disablePadding: true, label: "Sale Date" },
    { id: "contact_name", numeric: false, disablePadding: true, label: "Farmer Name" },
    { id: "contact_id_number", numeric: false, disablePadding: true, label: "Farmer ID" },
    { id: "product_name", numeric: false, disablePadding: true, label: "Product Name" },
    { id: "sale_quantity", numeric: true, disablePadding: true, label: "Sale Quantity" },
    { id: "sale_price", numeric: true, disablePadding: true, label: "Sale Amount" },
    { id: "total_sale", numeric: true, disablePadding: true, label: "Total Sale(Ksh)" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },
];


let SalesPage = ({
    sales,
    contacts,
    products,
    match,
    handleItemSubmit,
    handleItemDelete,
}) => {
    const classes = commonStyles();
    let [salesItems, setSalesItems] = useState([]);
    const [filteredSalesItems, setFilteredSalesItems] = useState([]);
    const [productFilter, setProductFilter] = useState("all");
    const [periodFilter, setPeriodFilter] = useState("month-to-date");
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [contactFilter, setContactFilter] = useState(null);

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSalesItems(sales);
        setFilteredSalesItems(filterSalesByCriteria(sales));
    }, [sales]);

    const filterSalesByCriteria = (salesToFilter) => {
        //filter the sales according to the search criteria here
        let filteredSales = salesToFilter
        if (periodFilter) {
            const { startDate, endDate } = getStartEndDatesForPeriod(periodFilter)
            filteredSales = filteredSales.filter((saleItem) => {
                const saleDate = parse(saleItem.sale_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(saleDate, { start: startDate, end: endDate })
            })
        }
        filteredSales = filteredSales
            .filter(({ sale_date, contact_id, product_id }) =>
                (!fromDateFilter ? true : sale_date >= fromDateFilter)
                && (!toDateFilter ? true : sale_date <= toDateFilter)
                && (productFilter === "all" ? true : product_id === productFilter)
                && (!contactFilter ? true : contact_id === contactFilter.id)
            )
        return filteredSales;
    }


    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        setFilteredSalesItems(filterSalesByCriteria(salesItems));
    }

    const handleSaleDelete = async (saleId, url) => {
        const saleToDelete = salesItems.find(({ id }) => id === saleId) || {}
        const saleForSameCharge = salesItems
            .find(({ id, charge_id }) => charge_id === saleToDelete.charge_id && id !== saleToDelete.id)
        if (!saleForSameCharge) {
            await handleItemSubmit({ id: saleToDelete.charge_id, payed: false }, 'transactions-charges')
        }
        await handleItemDelete(saleId, url)
    }

    const resetSearchForm = (event) => {
        event.preventDefault();
        setProductFilter("all");
        setPeriodFilter("month-to-date");
        setFromDateFilter("");
        setToDateFilter("");
        setContactFilter("");
    };

    return (
        <Layout pageTitle="Sales">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item key={2}>
                    <PageHeading text={'Sales'} />
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
                            reportName={'Rental Sales Records'}
                            reportTitle={'Rental Sales Data'}
                            headCells={headCells}
                            dataToPrint={filteredSalesItems.filter(({ id }) => selected.includes(id))}
                        />
                    </Grid>
                    <Grid item>
                        <ExportToExcelBtn
                            disabled={!selected.length}
                            reportName={'Rental Sales Records'}
                            reportTitle={'Rental Sales Data'}
                            headCells={headCells}
                            dataToPrint={filteredSalesItems.filter(({ id }) => selected.includes(id))}
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
                            id="salesSearchForm"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                            >
                                <Grid item container spacing={2}>
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item container xs={12} md={6} direction="row" spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    type="date"
                                                    id="from_date_filter"
                                                    name="from_date_filter"
                                                    label="From Date"
                                                    value={fromDateFilter}
                                                    onChange={(event) => {
                                                        setFromDateFilter(
                                                            event.target.value
                                                        );
                                                    }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    type="date"
                                                    name="to_date_filter"
                                                    label="To Date"
                                                    id="to_date_filter"
                                                    onChange={(event) => {
                                                        setToDateFilter(event.target.value);
                                                    }}
                                                    value={toDateFilter}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                select
                                                id="period_filter"
                                                name="period_filter"
                                                label="Period"
                                                value={periodFilter}
                                                onChange={(event) => {
                                                    setPeriodFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                            >
                                                {TRANSACTIONS_FILTER_OPTIONS.map((filterOption, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={filterOption.id}
                                                    >
                                                        {filterOption.text}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                variant="outlined"
                                                name="product_filter"
                                                label="Product"
                                                id="product_filter"
                                                onChange={(event) => {
                                                    setProductFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                value={productFilter}
                                            >
                                                <MenuItem key={"all"} value={"all"}>All</MenuItem>
                                                {products.map(
                                                    (product, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={product.id}
                                                        >
                                                            {product.product_name}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                id="contact_filter"
                                                options={contacts}
                                                getOptionSelected={(option, value) => option.id === value.id}
                                                name="contact_filter"
                                                onChange={(event, newValue) => {
                                                    setContactFilter(newValue);
                                                }}
                                                value={contactFilter}
                                                getOptionLabel={(contact) => contact ? `${contact.first_name} ${contact.last_name}` : ''}
                                                style={{ width: "100%" }}
                                                renderInput={(params) => <TextField {...params} label="Farmer" variant="outlined" />}
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
                                            type="submit"
                                            form="salesSearchForm"
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
                                            onClick={(event) => resetSearchForm(event)}
                                            type="reset"
                                            form="salesSearchForm"
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
                        rows={filteredSalesItems}
                        headCells={headCells}
                        handleDelete={handleSaleDelete}
                        deleteUrl={"sales"}
                    />
                </Grid>

            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        sales: state.sales
            .map((sale) => {
                const contact = state.contacts.find((contact) => contact.id === sale.contact_id) || {};
                const product = state.products.find((product) => product.id === sale.product_id || {})
                return Object.assign({}, sale, {
                    contact_name: `${contact.first_name} ${contact.last_name}`,
                    product_name: product.product_name,
                    total_sale: parseFloat(sale.sale_price) * parseFloat(sale.sale_quantity)
                })
            })
            .sort((sale1, sale2) => parse(sale2.sale_date, 'yyyy-MM-dd', new Date()) -
                parse(sale1.sale_date, 'yyyy-MM-dd', new Date())),
        products: state.products,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

SalesPage = connect(mapStateToProps, mapDispatchToProps)(SalesPage);

export default withRouter(SalesPage);
