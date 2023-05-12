import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import CustomSnackbar from '../CustomSnackbar'
import { Formik } from "formik";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import CustomCircularProgress from "../CustomCircularProgress";
import { format, startOfToday } from "date-fns";
import { commonStyles } from "../commonStyles";
const defaultDate = format(startOfToday(), 'yyyy-MM-dd')


const ProductSchema = Yup.object().shape({
  product_name: Yup.string().trim().required("Product Name is required"),
  product_quantity: Yup.number().required("Quantity is required").min(0, "Amount must be greater than 0"),
  product_purchase_price: Yup.number().required("Price is required").min(0, "Price must be greater than 0"),
  purchase_date: Yup.date().required("Date is Required"),
});


const ProductInputForm = ({ history, productToEdit, handleItemSubmit }) => {
	const classes = commonStyles();

  const ProductValues = {
    id: productToEdit.id,
    purchase_date: productToEdit.purchase_date || defaultDate,
    product_name: productToEdit.product_name || '',
    product_quantity: productToEdit.product_quantity || '',
    product_purchase_price: productToEdit.product_purchase_price || '',
  }

  return (
    <Formik
      initialValues={ProductValues}
      enableReinitialize
      validationSchema={ProductSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const Product = {
            id: values.id,
            product_name: values.product_name,
            product_quantity: values.product_quantity,
            product_purchase_price: values.product_purchase_price,
            purchase_date: values.purchase_date,
          };
          await handleItemSubmit(Product, "products")
          resetForm({})
          if (values.id) {
            history.goBack();
          }
          setStatus({ sent: true, msg: "Product Saved." })
        } catch (error) {
          setStatus({ sent: false, msg: `Error! ${error}.` })
        }
      }}
    >
      {({
        values,
        status,
        handleSubmit,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <form
          method="post"
          id="productInputForm"
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
            <Grid item container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="purchase_date"
                  name="purchase_date"
                  label="Purchase Date"
                  value={values.purchase_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.purchase_date && touched.purchase_date}
                  helperText={touched.purchase_date && errors.purchase_date}

                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="product_name"
                  name="product_name"
                  label="Product Name"
                  value={values.product_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.product_name && touched.product_name}
                  helperText={touched.product_name && errors.product_name}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="product_quantity"
                  name="product_quantity"
                  label="Product Quantity"
                  value={values.product_quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.product_quantity && touched.product_quantity}
                  helperText={touched.product_quantity && errors.product_quantity}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="product_purchase_price"
                  name="product_purchase_price"
                  label="Purchase Price"
                  value={values.product_purchase_price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.product_purchase_price && touched.product_purchase_price}
                  helperText={touched.product_purchase_price && errors.product_purchase_price}
                />
              </Grid>
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
                    form="productInputForm"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid >
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ProductInputForm;

