import * as actionTypes from "../assets/actionTypes";

export function products(state = [], action) {
    switch (action.type) {
        case actionTypes.METER_READINGS_FETCH_DATA_SUCCESS:
            return action.products;

        case actionTypes.EDIT_METER_READING:
            return state.map((product) =>
                product.id === action.product.id
                    ? Object.assign({}, product, action.product)
                    : product
            );

        case actionTypes.ADD_METER_READING:
            return [...state, action.product];

        case actionTypes.DELETE_METER_READING:
            return state.filter((product) => product.id !== action.productId);

        default:
            return state;
    }
}
