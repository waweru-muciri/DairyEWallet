import {auth as firebaseAuth, firestore, functions, storage, initializeApp} from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDzy6_qnfDQqb1-Y71ktE-gqIYFwUgfPFQ",
	authDomain: "stockmanager2-5b371.firebaseapp.com",
	projectId: "stockmanager2-5b371",
	storageBucket: "stockmanager2-5b371.appspot.com",
	messagingSenderId: "392549665847",
	appId: "1:392549665847:web:63d50a4d95a42a808603b2", 
	databaseURL: "https:stockmanager2-5b371.firebaseio.com",
};
// Initialize firebase
initializeApp(firebaseConfig);
export const auth = firebaseAuth()
export const firebaseStorage = storage()
export const firebaseFirestore = firestore()
export const firebaseFunctions = functions()
