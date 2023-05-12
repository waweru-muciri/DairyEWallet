import * as actionTypes from "../assets/actionTypes";
import * as contactsActions from "./contacts";
import * as salesActions from "./sales";
import * as productsActions from "./products";
import * as creditNotesActions from "./CreditNotes";
import { auth, firebaseStorage, firebaseFunctions } from "../firebase";
import { getDatabaseRef } from "./firebaseHelpers";


const setAdminCustomClaim = firebaseFunctions.httpsCallable('setAdminCustomClaim');
export const setDatabaseRefCustomClaim = firebaseFunctions.httpsCallable('setDatabaseRefCustomClaim');
export const createFirebaseUser = firebaseFunctions.httpsCallable('createFirebaseUser');
export const adminCreateFirebaseUser = firebaseFunctions.httpsCallable('adminCreateFirebaseUser');
export const updateFirebaseUser = firebaseFunctions.httpsCallable('updateFirebaseUser');
export const deleteFirebaseUsers = firebaseFunctions.httpsCallable('deleteFirebaseUsers');
export const sendInvoice = firebaseFunctions.httpsCallable('sendInvoice');

export function setCurrentUser(user) {
    return {
        type: actionTypes.SET_CURRENT_USER,
        user,
    };
}

const firebaseGetOptions = {
    source: 'default'
};

export const firebaseSignOutUser = () => {
    return (dispatch) => {
        auth
            .signOut()
            .then(function () {

            })
            .catch(function (error) {
                // An error happened.
            }).finally(() => {
                dispatch(setCurrentUser(null))
            })
    }
}

export const getFirebaseUserDetails = async (userToken) => {
    const idTokenResult = await userToken.getIdTokenResult()
    let isAdmin;
    let tenantId;
    if (idTokenResult.claims) {
        isAdmin = idTokenResult.claims.admin
        tenantId = idTokenResult.claims.databaseRef
    }
    const userDetails = {
        displayName: userToken.displayName,
        email: userToken.email,
        emailVerified: userToken.emailVerified,
        photoURL: userToken.photoURL,
        uid: userToken.uid,
        id: userToken.uid,
        isAdmin: isAdmin,
        tenant_id: tenantId
    };
    return userDetails;
}

export const resetUserPasswordByEmail = async (email) => {
    return await auth.sendPasswordResetEmail(email, { handleCodeInApp: false, url: 'https://rentgatepm.com/account-actions/' })
}

export const signUpWithEmailAndPassword = async (userDetails) => {
    try {
        const returnValue = await createFirebaseUser(userDetails)
        const createdUser = returnValue.data
        await setAdminCustomClaim({ userId: createdUser.uid, userProfile: userDetails })
    } catch (error) {
        // Handle Errors here.
        console.log("Actions error => ", error.message)
        throw new Error(error);
    }
};

export const signInUserWithEmailAndPassword = async (email, password) => {
    try {
        const authCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = authCredential.user;
        const userDetails = getFirebaseUserDetails(user)
        return userDetails;
    }
    catch (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = errorCode === "auth/wrong-password"
            ? "Wrong password."
            : errorCode === "auth/user-disabled"
                ? "User account disabled"
                : errorCode === "auth/invalid-email"
                    ? "Email is Invalid"
                    : errorCode === "auth/user-not-found"
                        ? "No user found with email"
                        : "Failed to connect to resource. Check your internet connection";
        throw new Error(errorMessage);
    }

}

export async function sendEmails(from_user, subject, email, recipients) {
    var sendEmail = firebaseFunctions.httpsCallable('sendEmail');
    try {
        await sendEmail({ replyTo: from_user, subject: subject, email: email, recipients: recipients })
        // Read result of the Cloud Function.
    } catch (error) {
        //getting the error details
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.error(`There was an error when calling the sendEmails Cloud Function.\n 
        Error Code => ${code}. Error Message => ${message}. Error Details => ${details}`);
    }
}


export function itemsFetchData(collectionsUrls) {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        collectionsUrls.forEach(async (url) => {
            try {
                const snapshot = await getDatabaseRef().collection(url).get(firebaseGetOptions)
                let fetchedItems = []
                snapshot.forEach((doc) => {
                    let fetchedObject = Object.assign(
                        {},
                        doc.data(),
                        {
                            id: doc.id,
                        }
                    );
                    fetchedItems.push(fetchedObject)
                });
                switch (url) {
  
                    case "contacts":
                        dispatch(contactsActions.contactsFetchDataSuccess(fetchedItems));
                        break;

                    case "sales":
                        dispatch(salesActions.salesFetchDataSuccess(fetchedItems));
                        break;

                    case "products":
                        dispatch(productsActions.productsFetchDataSuccess(fetchedItems));
                        break;

                    case "client-deposits":
                        dispatch(creditNotesActions.creditNotesFetchDataSuccess(fetchedItems));
                        break;

                    default:
                        break;
                }
            } catch (error) {
                dispatch(itemsHasErrored(error.message))
                dispatch(itemsIsLoading(false));
            }
        })
        dispatch(itemsIsLoading(false));
    }
}

export function setPaginationPage(index) {
    return {
        type: actionTypes.SET_PAGINATION_PAGE,
        index,
    };
}

export function toggleDrawer(toggleValue) {
    return {
        type: actionTypes.TOGGLE_DRAWER,
        toggleValue,
    };
}

export function itemsHasErrored(error) {
    return {
        type: actionTypes.ITEMS_HAS_ERRORED,
        error,
    };
}

export function itemsIsLoading(bool) {
    return {
        type: actionTypes.ITEMS_IS_LOADING,
        isLoading: bool,
    };
}

export function handleDelete(itemId, url) {
    //send request to server to delete selected item
    return async (dispatch) => {
        try {
            await getDatabaseRef()
                .collection(url)
                .doc(itemId)
                .delete();
            switch (url) {

                case "contacts":
                    dispatch(contactsActions.deleteContact(itemId)
                    );
                    break;

                case "sales":
                    dispatch(salesActions.deleteSale(itemId)
                    );
                    break;
            
                case "client-deposits":
                    dispatch(creditNotesActions.deleteCreditNote(itemId)
                    );
                    break;

                case "products":
                    dispatch(productsActions.deleteProduct(itemId)
                    );
                    break;

                default:
                    break;
            }
        }
        catch (error) {
            dispatch(itemsHasErrored(error.message))
            dispatch(itemsIsLoading(false));
            console.log("Failed to Delete Document!", error);
        }
    }
}

export function handleItemFormSubmit(data, url) {
    if (typeof data.id === "undefined") {
        delete data.id;
    }
    return (dispatch) => {
        return new Promise(function (resolve, reject) {
            dispatch(itemsIsLoading(true))
            typeof data.id !== "undefined"
                ? //send post request to edit the item
                getDatabaseRef()
                    .collection(url)
                    .doc(data.id)
                    .update(data)
                    .then((docRef) => {
                        let modifiedObject = Object.assign(
                            {},
                            data,
                        );
                        switch (url) {
                         
                            case "contacts":
                                dispatch(contactsActions.editContact(modifiedObject));
                                break;

                            case "sales":
                                dispatch(salesActions.editSale(modifiedObject));
                                break;

                            case "products":
                                dispatch(productsActions.editProduct(modifiedObject));
                                break;

                            case "client-deposits":
                                dispatch(creditNotesActions.editCreditNote(modifiedObject));
                                break;

                            default:
                                break;
                        }
                        resolve(data.id);
                    })
                    .catch((error) => {
                        dispatch(itemsHasErrored(error.message))
                        console.log("Error updating document => ", error.response);
                        reject(error)
                    }).finally(() => {
                        dispatch(itemsIsLoading(false));
                    })
                : //send post to create item
                getDatabaseRef()
                .collection(url)
                .add(data)
                .then((docRef) => {
                        let addedItem = Object.assign({}, data, {
                            id: docRef.id,
                        });
                        switch (url) {
                           
                            case "contacts":
                                dispatch(contactsActions.addContact(addedItem));
                                break;
                          
                            case "sales":
                                dispatch(salesActions.addSale(addedItem));
                                break;

                            case "products":
                                dispatch(productsActions.addProduct(addedItem));
                                break;

                            case "client-deposits":
                                dispatch(creditNotesActions.addCreditNote(addedItem));
                                break;

                            default:
                                break;
                        }
                        resolve(docRef.id);
                    })
                    .catch((error) => {
                        dispatch(itemsHasErrored(error.message))
                        console.log("Error adding document => ", error.response);
                        reject(error)
                    }).finally(() => {
                        dispatch(itemsIsLoading(false));
                    });
        })
    }
}
