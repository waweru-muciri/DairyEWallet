import * as actionTypes from "../assets/actionTypes";

export function salesFetchDataSuccess(sales) {
    return {
        type: actionTypes.TRANSACTIONS_FETCH_DATA_SUCCESS,
        sales,
    };
}

export function deleteSale(transactionId) {
    return {
        type: actionTypes.DELETE_TRANSACTION,
        transactionId,
    };
}

export function addSale(transaction) {
    return {
        type: actionTypes.ADD_TRANSACTION,
        transaction,
    };
}

export function editSale(transaction) {
    return {
        type: actionTypes.EDIT_TRANSACTION,
        transaction,
    };
}
