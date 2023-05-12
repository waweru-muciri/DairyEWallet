import * as actionTypes from "../assets/actionTypes";

export function editProduct(product) {
    return {
        type: actionTypes.EDIT_METER_READING,
        product,
    };
}

export function addProduct(product) {
    return {
        type: actionTypes.ADD_METER_READING,
        product,
    };
}

export function deleteProduct(productId) {
    return {
        type: actionTypes.DELETE_METER_READING,
        productId,
    };
}

export function productsFetchDataSuccess(products) {
    return {
        type: actionTypes.METER_READINGS_FETCH_DATA_SUCCESS,
        products,
    };
}
