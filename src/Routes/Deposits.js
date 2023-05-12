import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import AddIcon from "@material-ui/icons/Add";
import { Grid, TextField, Button, MenuItem, Box } from "@material-ui/core";
import { handleDelete } from "../actions/actions";
import CommonTable from "../components/table/commonTable";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../components/commonStyles";
import { connect } from "react-redux";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import PrintArrayToPdf from "../components/PrintArrayToPdfBtn";
import { parse } from "date-fns";



const customerAccountDepositsTableHeadCells = [
    { id: "deposit_date", numeric: false, disablePadding: true, label: "Deposit Date", },
    { id: "customer_name", numeric: false, disablePadding: true, label: "Customer" },
    { id: "deposit_amount", numeric: true, disablePadding: true, label: "Deposit Amount(Ksh)" },
    { id: "edit", numeric: false, disablePadding: true, label: "Edit" },
    { id: "delete", numeric: false, disablePadding: true, label: "Delete" },

];

let DepositsPage = ({
    customerAccountDeposits,
    handleItemDelete,
    contacts,
    match,
}) => {
    const classes = commonStyles();
    const [accountDepositItems, setAccountDepositItems] = useState([]);
    const [filteredAccountDepositItems, setFilteredAccountDepositItems] = useState([]);
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [contactFilter, setClientFilter] = useState("all");
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        setAccountDepositItems(customerAccountDeposits);
        setFilteredAccountDepositItems(customerAccountDeposits);
    }, [customerAccountDeposits]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the customerAccountDeposits here according to search criteria
        const filteredDeposits = customerAccountDeposits
            .filter(({ deposit_date, contact_id }) =>
                (!fromDateFilter ? true : deposit_date >= fromDateFilter)
                && (!toDateFilter ? true : deposit_date <= toDateFilter)
                && (contactFilter === "all" ? true : contact_id === contactFilter)
            )
        setFilteredAccountDepositItems(filteredDeposits);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFromDateFilter("");
        setToDateFilter("");
        setClientFilter("all");
    };

    return (
        <Layout pageTitle="Client Deposits">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
                <Grid item lg={12}>
                    <PageHeading text="Client Deposits" />
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
                            reportName={'Deposits Records'}
                            reportTitle={'Deposits Data'}
                            headCells={customerAccountDepositsTableHeadCells}
                            dataToPrint={accountDepositItems.filter(({ id }) => selected.includes(id))}
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
                                direction="row"
                            >
                                <Grid
                                    container
                                    item
                                    xs={12} md={6}
                                    spacing={1}
                                    justify="center"
                                    direction="row"
                                >
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
                                        select
                                        variant="outlined"
                                        name="client_filter"
                                        label="Client"
                                        id="client_filter"
                                        onChange={(event) => {
                                            setClientFilter(
                                                event.target.value
                                            );
                                        }}
                                        value={contactFilter}
                                    >
                                        <MenuItem key={"all"} value={"all"}>All</MenuItem>
                                        {contacts.map(
                                            (contact, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={contact.id}
                                                >
                                                    {contact.first_name} {contact.last_name}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
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
                                        form="contactSearchForm"
                                        color="primary"
                                        variant="contained"
                                        size="medium"
                                        startIcon={<UndoIcon />}
                                    >
                                        RESET
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredAccountDepositItems}
                        headCells={customerAccountDepositsTableHeadCells}
                        handleDelete={handleItemDelete}
                        deleteUrl={"client-deposits"}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    console.log(state.customerAccountDeposits)
    return {
        customerAccountDeposits: state.customerAccountDeposits
            .map(clientDeposit => {
                const contactWithDeposit = state.contacts.find(({ id }) => id === clientDeposit.contact_id) || {}
                return Object.assign({}, clientDeposit,
                    { customer_name: `${contactWithDeposit.first_name} ${contactWithDeposit.last_name}` })
            })
            .sort((clientDeposit1, clientDeposit2) => parse(clientDeposit2.deposit_date, 'yyyy-MM-dd', new Date()) -
                parse(clientDeposit1.deposit_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

DepositsPage = connect(mapStateToProps, mapDispatchToProps)(DepositsPage);

export default withRouter(DepositsPage);
