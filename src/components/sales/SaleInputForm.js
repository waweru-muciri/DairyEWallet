import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')


const SaleSchema = Yup.object().shape({
	sale_price: Yup.number().min(0, 'Price must be greater than 0').required("Sale Price is required"),
	sale_quantity: Yup.number().min(0, 'Quantity must be greater than 0').required("Sale Quantity is required"),
	sale_date: Yup.date().required("Sale Date Required"),
	product_id: Yup.string().trim().required("Product is Required"),
	contact_id: Yup.string().trim().required("Customer is Required"),
	deposit_id: Yup.string().trim(),
});


const SaleInputForm = ({ products, contacts, customerAccountDeposits, history, saleToEdit, handleItemSubmit }) => {

	const classes = commonStyles();
	const saleValues = {
		id: saleToEdit.id,
		product_id: saleToEdit.product_id || '',
		contact_id: saleToEdit.contact_id || '',
		deposit_id: saleToEdit.deposit_id || '',
		sale_date: saleToEdit.sale_date || defaultDate,
		sale_price: saleToEdit.sale_price || '',
		sale_quantity: saleToEdit.sale_quantity || '',
	}

	return (
		<Formik
			initialValues={saleValues}
			enableReinitialize
			validationSchema={SaleSchema}
			onSubmit={async (values, { resetForm, setStatus }) => {
				try {
					const productSalesValues = {
						id: values.id,
						sale_price: values.sale_price,
						product_id: values.product_id,
						deposit_id: values.deposit_id,
						sale_date: values.sale_date,
						contact_id: values.contact_id,
						sale_quantity: values.sale_quantity,
					};
					await handleItemSubmit(productSalesValues, "sales")
					resetForm({})
					if (values.id) {
						history.goBack();
					}
					setStatus({ sent: true, msg: "Sale saved." })
				} catch (error) {
					setStatus({ sent: false, msg: `Error! ${error}.` })
				}
			}}
		>
			{({
				values,
				status,
				handleSubmit,
				setFieldValue,
				errors,
				touched,
				handleChange,
				handleBlur,
				isSubmitting,
			}) => (
				<form
					className={classes.form}
					method="post"
					id="meterInputForm"
					onSubmit={handleSubmit}
				>
					<Grid
						container
						spacing={2}
						justify="center"
						alignItems="stretch"
						direction="column"
					>
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
						<Grid item xs={12}>
							<TextField
								fullWidth
								select
								variant="outlined"
								name="contact_id"
								label="Customer"
								id="contact_id"
								onChange={(event) => {
									setFieldValue('contact_id', event.target.value)
								}
								}
								value={values.contact_id}
								error={errors.contact_id && touched.contact_id}
								helperText={touched.contact_id && errors.contact_id}
							>
								{contacts.map((contact, index) => (
									<MenuItem key={index} value={contact.id}>
										{contact.first_name} {contact.last_name}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								select
								variant="outlined"
								name="product_id"
								label="Product Name"
								id="product_id"
								onChange={handleChange}
								value={values.product_id}
								error={errors.product_id && touched.product_id}
								helperText={touched.product_id && errors.product_id}

							>
								{products.map((product, index) => (
									<MenuItem key={index} value={product.id}>
										{product.product_name}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								select
								multiple
								variant="outlined"
								name="deposit_id"
								label="Farmer Deposit"
								id="deposit_id"
								onChange={handleChange}
								value={values.deposit_id}
								error={errors.deposit_id && touched.deposit_id}
								helperText={touched.deposit_id && errors.deposit_id}

							>
								{customerAccountDeposits.filter(customerDeposit => customerDeposit.contact_id === values.contact_id)
									.map((customerDeposit, index) => (
										<MenuItem key={index} value={customerDeposit.id}>
											{customerDeposit.deposit_amount}
										</MenuItem>
									))}
							</TextField>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								type="date"
								InputLabelProps={{ shrink: true }}
								variant="outlined"
								id="sale_date"
								name="sale_date"
								label="Sale Date"
								value={values.sale_date}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.sale_date && touched.sale_date}
								helperText={touched.sale_date && errors.sale_date}

							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								variant="outlined"
								id="sale_quantity"
								name="sale_quantity"
								label="Sale Quantity"
								value={values.sale_quantity}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.sale_quantity && touched.sale_quantity}
								helperText={touched.sale_quantity && errors.sale_quantity}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								variant="outlined"
								id="sale_price"
								name="sale_price"
								label="Sale Price"
								value={values.sale_price}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.sale_price && touched.sale_price}
								helperText={touched.sale_price && errors.sale_price}
							/>
						</Grid>
						<Grid item container className={classes.buttonBox}>
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
									form="meterInputForm"
									disabled={isSubmitting}
								>
									Save
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
};

export default SaleInputForm;
