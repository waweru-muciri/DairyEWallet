import React from "react";
import { connect } from "react-redux";
import {
    firebaseSignOutUser, setPaginationPage, toggleDrawer
} from "../actions/actions";
import {
    withRouter,
    Link,
} from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import PaymentIcon from '@material-ui/icons/Payment';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ContactsIcon from "@material-ui/icons/Contacts";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DashboardIcon from "@material-ui/icons/Dashboard";


const navigationLinks = [
    { text: "Home", to: "/app/", icon: <DashboardIcon /> },
    { text: "Customers", to: "/app/contacts", icon: <ContactsIcon /> },
    { text: "Products", to: "/app/products", icon: <ShoppingCartIcon /> },
    { text: "Sales", to: "/app/sales", icon: <PaymentIcon /> },
    { text: "Client Deposits", to: "/app/client-deposits", icon: <AccountBalanceWalletIcon /> },
];


let AppNavLayout = ({
    setDrawerToggleState,
    drawerOpen,
    selectedTab,
    setSelectedTab,
    classes,
}) => {
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setDrawerToggleState(!drawerOpen);
    };

    const handleListItemClick = (indexObject) => {
        setSelectedTab(Object.assign({}, selectedTab, { ...indexObject }));
    };

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: drawerOpen,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        Dairy E-Wallet
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{ onBackdropClick: handleDrawerToggle }}
                BackdropProps={{ invisible: true }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List component="div" disablePadding>
                    {navigationLinks.map((linkItem, listIndex) => {
                        const parentIndex = listIndex + 2;
                        return (
                            <React.Fragment key={parentIndex}>
                                <ListItem
                                    component={Link}
                                    to={linkItem.to}
                                    button
                                    key={linkItem.text}
                                    selected={selectedTab.parent === parentIndex}
                                    onClick={(event) => {
                                        handleListItemClick({
                                            parent: parentIndex,
                                        });
                                        handleDrawerToggle();
                                    }}
                                >
                                    <ListItemIcon>{linkItem.icon}</ListItemIcon>
                                    <ListItemText primary={linkItem.text} />
                                </ListItem>
                            </React.Fragment>
                        )
                    })}
                </List>
            </Drawer>
            <div className={classes.drawerHeader} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        drawerOpen: state.drawerOpen,
        selectedTab: state.selectedTab,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleUserSignOut: () => dispatch(firebaseSignOutUser()),
        setSelectedTab: (index) => dispatch(setPaginationPage(index)),
        setDrawerToggleState: (toggleValue) => dispatch(toggleDrawer(toggleValue)),
    };
};

AppNavLayout = connect(mapStateToProps, mapDispatchToProps)(AppNavLayout);

export default withRouter(AppNavLayout);
