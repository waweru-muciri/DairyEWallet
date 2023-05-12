import React from "react";
import Layout from "../components/PrivateLayout";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { handleDelete } from "../actions/actions";
import TabPanel from "../components/TabPanel";
import DataGridTable from '../components/DataGridTable'
import TenantInfoDisplayCard from "../components/TenantInfoDisplayCard";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


const salesColumns = [
    { field: 'sale_date', headerName: 'Date of Sale', width: 200 },
    { field: 'sale_price', headerName: 'Item Price', width: 200 },
    { field: 'sale_quantity', headerName: 'Amount Sold', type: "number", width: 90 },
]

const depositsColumns = [
    { field: 'deposit_date', headerName: 'Date', width: 200 },
    { field: 'deposit_amount', headerName: 'Amount Deposited', type: "number", width: 90 },
]

let TenantDetailsPage = ({
    sales,
    customerAccountDeposits,
    contactDetails,
}) => {
    const classes = commonStyles()


    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Layout pageTitle="Customer Summary">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Customer Details" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <Grid container justify="center" direction="column" spacing={2}>
                    <Grid item key={0}>
                        <Typography variant="h6">Customer Details</Typography>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        item
                        alignItems="stretch"
                        spacing={2}
                    >
                        <Grid item xs={12} md>
                            <TenantInfoDisplayCard title="Customer Details"
                                subheader="Personal Info"
                                avatarSrc={contactDetails.contact_avatar_url}
                                cardContent={[
                                    { name: 'Name', value: `${contactDetails.title} ${contactDetails.first_name} ${contactDetails.last_name}` },
                                    { name: 'ID Number', value: contactDetails.id_number || '-' },
                                    { name: 'Personal Phone Number', value: contactDetails.phone_number || '' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" item alignItems="stretch" spacing={2}>
                        <Grid item xs={12} md>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardContent>
                                    <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                        Recent Sales History
                                    </Typography>
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGridTable rows={sales} headCells={salesColumns} pageSize={5} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md>
                            <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                                <CardContent>
                                    <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                        Recent Deposits History
                                    </Typography>
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGridTable rows={customerAccountDeposits} headCells={depositsColumns} pageSize={5} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        sales: state.sales.filter((sale) => sale.contact_id === ownProps.match.params.contactId),
        customerAccountDeposits: state.customerAccountDeposits
        .filter((accountDeposit) => accountDeposit.contact_id === ownProps.match.params.contactId),
        contactDetails: state.contacts.find(({ id }) => id === ownProps.match.params.contactId) || {}
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
    };
};

TenantDetailsPage = connect(mapStateToProps, mapDispatchToProps)(TenantDetailsPage);

export default withRouter(TenantDetailsPage);
