import React, { lazy } from "react";
import Layout from "../components/PrivateLayout";
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import TabPanel from "../components/TabPanel";
import { commonStyles } from '../components/commonStyles'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TenantsChargesStatement from "./TenantsChargesStatement";
import { parse } from "date-fns";
const TenantsPaymentsStatement = lazy(() => import('./TenantsPaymentsStatement'));

let TenantStatementsPage = ({
    sales,
    rentalCharges,
    contacts,
    properties,
}) => {
    const classes = commonStyles()
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Layout pageTitle="Tenants Statements">
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Tenants Charges Statement" />
                    <Tab label="Tenants Payments Statement" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <TenantsChargesStatement contacts={contacts} rentalCharges={rentalCharges} properties={properties} classes={classes} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <TenantsPaymentsStatement contacts={contacts} sales={sales} properties={properties} classes={classes} />
            </TabPanel>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        rentalCharges: state.rentalCharges
            .map(charge => {
                const tenant = state.contacts.find((contact) => contact.id === charge.tenant_id) || {};
                const tenantUnit = state.propertyUnits.find(({ id }) => id === charge.unit_id) || {};
                return Object.assign({}, charge, {
                    tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                    tenant_id_number: tenant.id_number,
                    unit_ref: tenantUnit.ref
                })
            })
            .sort((charge1, charge2) => parse(charge2.charge_date, 'yyyy-MM-dd', new Date()) -
                parse(charge1.charge_date, 'yyyy-MM-dd', new Date())),
        sales: state.sales
            .map(transaction => {
                const tenant = state.contacts.find(({ id }) => id === transaction.tenant_id) || {};
                const tenantUnit = state.propertyUnits.find(({ id }) => id === transaction.unit_id) || {};
                return Object.assign({}, transaction, {
                    tenant_name: `${tenant.first_name} ${tenant.last_name}`,
                    tenant_id_number: tenant.id_number,
                    unit_ref: tenantUnit.ref
                })
            })
            .sort((sale1, sale2) => parse(sale2.sale_date, 'yyyy-MM-dd', new Date()) -
                parse(sale1.sale_date, 'yyyy-MM-dd', new Date())),
        contacts: state.contacts,
        properties: state.properties,
    };
};

TenantStatementsPage = connect(mapStateToProps)(TenantStatementsPage);

export default withRouter(TenantStatementsPage);
