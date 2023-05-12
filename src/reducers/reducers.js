import * as actionTypes from "../assets/actionTypes";
import * as contactsReducers from "./contacts";
import * as salesReducers from "./sales";
import * as usersReducers from "./users";
import * as productsReducers from "./products";
import * as customerAccountDepositsReducers from "./CreditNotes";


export function itemsHasErrored(state = null, action) {
    switch (action.type) {
        case actionTypes.ITEMS_HAS_ERRORED:
            return action.error;
        default:
            return state;
    }
}

export function setPaginationPage(state = { parent: 0, nestedLink: -1, drawerOpen: false }, action) {
    switch (action.type) {
        case actionTypes.SET_PAGINATION_PAGE:
            return action.index;
        default:
            return state;
    }
}

export function toggleDrawer(state = false, action) {
    switch (action.type) {
        case actionTypes.TOGGLE_DRAWER:
            return action.toggleValue;
        default:
            return state;
    }
}

export function setCurrentUser(state = null, action) {
    switch (action.type) {
        case actionTypes.SET_CURRENT_USER:
            return action.user;
        default:
            return state;
    }
}

export function itemsIsLoading(state = false, action) {
    switch (action.type) {
        case actionTypes.ITEMS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

function reducers(state = {}, action) {
    return {
        users: usersReducers.users(state.users, action),
        products: productsReducers.products(state.products, action),
        customerAccountDeposits: customerAccountDepositsReducers.creditNotes(state.customerAccountDeposits, action),
        contacts: contactsReducers.contacts(state.contacts, action),
        sales: salesReducers.sales(
            state.sales,
            action
        ),
        currentUser: setCurrentUser(state.currentUser, action),
        isLoading: itemsIsLoading(state.isLoading, action),
        error: itemsHasErrored(state.itemsHasErrored, action),
        selectedTab: setPaginationPage(state.selectedTab, action),
        drawerOpen: toggleDrawer(state.drawerOpen, action),
    };
}

export default reducers;
