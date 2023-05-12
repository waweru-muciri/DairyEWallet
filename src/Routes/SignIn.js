import React from "react";
import Layout from "../components/GeneralLayout";
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import { connect } from "react-redux";
import { Formik } from "formik";
import { setCurrentUser } from "../actions/actions";
import PasswordResetDialog from "../components/login/ResetPassword";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import CardMedia from '@material-ui/core/CardMedia';

const SignInSchema = Yup.object().shape({
  password: Yup.string().trim()
    .min(2, "Too Short!")
    .max(50, "We prefer insecure systems, try a shorter password.")
    .required("Pasword is Required"),
  email: Yup.string().trim().email("Invalid email").required("Email is Required"),
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));



let SignInLayout = ({ setUser }) => {

  const classes = useStyles();
  const history = useHistory();
  let loginValues = { email: "", password: "" };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Layout pageTitle="Sign In">
      <Formik
        initialValues={loginValues}
        validationSchema={SignInSchema}
        onSubmit={async (values, { resetForm, setStatus, setSubmitting }) => {
          try {
            setUser({
              displayName: "Farmer Name",
              email: "hello@email.com",
              emailVerified: true,
              photoURL: "",
              uid: "123456",
              id: "123456",
              isAdmin: true,
              tenant_id: "123456"
            })
            resetForm({});
            history.push("/app/")
          } catch (error) {
            setSubmitting(false);
            setStatus({ error: error.message });
          }
        }}>
        {({
          values,
          handleSubmit,
          touched,
          status,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => {
          const passwordOrOtherError = (touched.password && errors.password) || (status && status.error)
          return (
            <div>
              <PasswordResetDialog open={open} handleClose={handleClose} />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <form
                  className={classes.form}
                  method="post"
                  id="signInForm"
                  onSubmit={handleSubmit}
                >
                  <Grid container justify="center" direction="column" spacing={3}>
                    <Grid item container direction="column" alignItems="center">
                      <Grid item>
                        <Typography variant="subtitle1">
                          Leena's Dairy E-Wallet
                        </Typography>
                      </Grid>
                      <Grid item>
                        <CardMedia
                          height="auto"
                          width="auto"
                          component="img"
                          alt="Module Images"
                          image="propertyDetails.png"
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography align="center" component="h1" variant="h5">
                        Sign In
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        variant="outlined"
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched.email && errors.email}
                        error={errors.email && touched.email}
                        type="email"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={passwordOrOtherError}
                        error={(passwordOrOtherError ? true : false)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="outlined"
                        color="primary"
                        form="signInForm"
                      >
                        Sign In
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </div>
          )
        }}
      </Formik>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setCurrentUser(user)),
  };
};

export default connect(null, mapDispatchToProps)(SignInLayout);
