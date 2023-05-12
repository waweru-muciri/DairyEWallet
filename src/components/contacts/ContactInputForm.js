import React from "react";
import CustomSnackbar from '../CustomSnackbar'
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	handleItemFormSubmit,
} from "../../actions/actions";
import { withRouter } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import {
	getContactTitles,
	getGendersList,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import CustomCircularProgress from "../CustomCircularProgress";

const CONTACT_TITLES = getContactTitles();
const GENDERS_LIST = getGendersList();


const ContactSchema = Yup.object().shape({
	first_name: Yup.string().trim().required("First Name is required"),
	last_name: Yup.string().trim().required("Last Name is required"),
	title: Yup.string().trim().required("Title is required"),
	gender: Yup.string().trim().required("Gender is required"),
	id_number: Yup.string().trim().required("ID Number is required"),
	personal_phone_number: Yup.string().trim().min(10, "Phone Number must be >= 10")
		.required('Phone Number is Required'),
	contact_email: Yup.string().trim().email(),
	alternate_email: Yup.string().trim().email(),
	present_address: Yup.string().trim().default(''),

});


let ContactInputForm = (props) => {

	const { history, handleItemSubmit } = props;
	let classes = commonStyles();

	let contactToEdit = props.contactToEdit || {};

	const contactValues = {
		id: contactToEdit.id,
		gender: contactToEdit.gender || "",
		id_number: contactToEdit.id_number || "",
		title: contactToEdit.title || "",
		present_address: contactToEdit.present_address || "",
		contact_email: contactToEdit.contact_email || "",
		personal_phone_number: contactToEdit.personal_phone_number || "",
		first_name: contactToEdit.first_name || "",
		last_name: contactToEdit.last_name || "",
	};

	return (
		<Formik
			initialValues={contactValues}
			enableReinitialize validationSchema={ContactSchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					let contact = {
						id: values.id,
						title: values.title,
						gender: values.gender,
						first_name: values.first_name,
						last_name: values.last_name,
						id_number: values.id_number,
						present_address: values.present_address,
						personal_phone_number: values.personal_phone_number,

					};

					await handleItemSubmit(contact, "contacts")
					resetForm({});
					if (values.id) {
						history.goBack();
					}
					setStatus({ sent: true, msg: "Details saved successfully." })
				} catch (error) {
					setStatus({ sent: false, msg: `Error! ${error}.` })
				}
			}}
		>
			{({
				values,
				status,
				touched,
				handleSubmit,
				errors,
				handleChange,
				handleBlur,
				isSubmitting,
			}) => (
				<form
					className={classes.form}
					method="post"
					noValidate
					id="contactInputForm"
					onSubmit={handleSubmit}
				>
					<Grid container direction="column" justify="flex-start">
						{
							status && status.msg && (
								<CustomSnackbar
									variant={status.sent ? "success" : "error"}
									message={status.msg}
								/>
							)
						}
						{
							isSubmitting && (<CustomCircularProgress open={true} />)
						}
						<Grid container spacing={4} direction="row">
							<Grid
								container
								item
								direction="column"
								spacing={2}
							>
								<Grid item>
									<Typography variant="h6">Personal Info</Typography>
								</Grid>
								<Grid
									item
									container
									direction="row"
									justify="flex-start"
									spacing={4}
									alignItems="center"
								>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										select
										name="title"
										label="Title"
										id="title"
										required
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.title}
										error={errors.title && touched.title}
										helperText={touched.title && errors.title}
									>
										{CONTACT_TITLES.map((contact_title, index) => (
											<MenuItem key={index} value={contact_title}>
												{contact_title}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										id="first_name"
										name="first_name"
										label="First Name"
										required
										value={values.first_name}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.first_name && touched.first_name}
										helperText={touched.first_name && errors.first_name}
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										id="last_name"
										name="last_name"
										label="Last Name"
										required
										value={values.last_name}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.last_name && touched.last_name}
										helperText={touched.last_name && errors.last_name}
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										select
										name="gender"
										label="Gender"
										id="gender"
										required
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.gender}
										error={errors.gender && touched.gender}
										helperText={touched.gender && errors.gender}
									>
										{GENDERS_LIST.map((gender_type, index) => (
											<MenuItem key={index} value={gender_type}>
												{gender_type}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										id="id_number"
										label="ID No"
										type="text"
										name="id_number"
										required
										value={values.id_number}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.id_number && touched.id_number}
										helperText={touched.id_number && errors.id_number}
									/>
								</Grid>
							</Grid>
							<Grid item container direction="column" spacing={2}>
								<Grid item sm>
									<TextField
										fullWidth
										variant="outlined"
										id="personal_phone_number"
										name="personal_phone_number"
										label="Personal Phone Number"
										required
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.personal_phone_number && touched.personal_phone_number}
										helperText={"Personal Phone Number"}
										value={values.personal_phone_number}
									/>
								</Grid>
								<Grid item>
									<TextField
										fullWidth
										variant="outlined"
										id="present_address"
										name="present_address"
										label="Present Address"
										value={values.present_address}
										onChange={handleChange}
										onBlur={handleBlur}
										error={errors.present_address && touched.present_address}
										helperText={touched.present_address && errors.present_address}
									/>
								</Grid>
							</Grid>
						</Grid >
						{/** end of contact details grid **/}
						< Grid
							item
							container
							direction="row"
							className={classes.buttonBox}
						>
							<Grid item>
								<Button
									color="secondary"
									variant="contained"
									size="medium"
									startIcon={<CancelIcon />}
									onClick={() => history.goBack()}
									disableElevation
								>
									Cancel
								</Button>
							</Grid>
							<Grid item>
								<Button
									type="submit"
									color="primary"
									variant="contained"
									size="medium"
									startIcon={<SaveIcon />}
									form="contactInputForm"
									disabled={isSubmitting}
								>
									Save
								</Button>
							</Grid>
						</Grid >
					</Grid >
				</form >
			)}
		</Formik>
	);
};



const mapDispatchToProps = (dispatch) => {
	return {
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	}
};

ContactInputForm = connect(null, mapDispatchToProps)(ContactInputForm);

export default withRouter(ContactInputForm);
