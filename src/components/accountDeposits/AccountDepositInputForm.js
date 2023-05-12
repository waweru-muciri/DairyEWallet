import React from "react";
import CustomSnackbar from '../CustomSnackbar'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { format, startOfToday } from "date-fns";
import CustomCircularProgress from "../CustomCircularProgress";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

const AccountDepositSchema = Yup.object().shape({
  deposit_amount: Yup.number().positive("Amount must be a positive number").required("Deposit Amount is required"),
  deposit_date: Yup.date().required("Deposit Date Required"),
  contact_id: Yup.string().required("Client is Required"),
  deposit_notes: Yup.string().default(""),
});

const AccountDepositInputForm = (props) => {
  const classes = commonStyles();

  const { contacts, handleItemSubmit, history } = props
  const accountDepositToEdit = props.accountDepositToEdit || {}
  const accountDepositValues = {
    id: accountDepositToEdit.id,
    deposit_notes: accountDepositToEdit.deposit_notes || '',
    deposit_date: accountDepositToEdit.deposit_date || defaultDate,
    deposit_amount: accountDepositToEdit.deposit_amount || '',
    contact_id: accountDepositToEdit.contact_id || '',
  }

  return (
    <Formik
      initialValues={accountDepositValues}
      enableReinitialize
      validationSchema={AccountDepositSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        try {
          const product = {
            id: values.id,
            deposit_amount: values.deposit_amount,
            contact_id: values.contact_id,
            deposit_date: values.deposit_date,
            deposit_notes: values.deposit_notes,
          };
          await handleItemSubmit(product, "client-deposits")
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
        handleSubmit,
        touched,
        errors,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      }) => (
        <form
          className={classes.form}
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
            <Grid item container direction="row" spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="deposit_date"
                  name="deposit_date"
                  label="Deposit Date"
                  value={values.deposit_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.deposit_date && touched.deposit_date}
                  helperText={touched.deposit_date && errors.deposit_date}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  name="contact_id"
                  label="Client"
                  id="contact_id"
                  onChange={(event) => {
                    setFieldValue('contact_id', event.target.value);
                  }}
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
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                variant="outlined"
                id="deposit_amount"
                name="deposit_amount"
                label="Deposit Amount"
                value={values.deposit_amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.deposit_amount && touched.deposit_amount}
                helperText={touched.deposit_amount && errors.deposit_amount}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                id="deposit_notes"
                name="deposit_notes"
                label="Notes"
                value={values.deposit_notes}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={"Any notes regarding this deposit?"}
              />
            </Grid>
            <Grid item container direction="row" className={classes.buttonBox}>
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
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AccountDepositInputForm;
