import React, { useEffect, useState } from "react";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import PageHeading from "../components/PageHeading";
import InfoDisplayPaper from "../components/InfoDisplayPaper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import { Bar } from 'react-chartjs-2';
import { commonStyles } from '../components/commonStyles'
import * as Yup from "yup";
import { Formik } from "formik";
import { format, getYear, startOfYear, endOfYear, startOfToday, parse, eachMonthOfInterval, isSameMonth } from "date-fns";


const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0,
        }
      }
    ],
  }
};

const FilterYearSchema = Yup.object().shape({
  filter_year: Yup.number()
    .typeError("Year must be a number!")
    .required("Year is required")
    .min(2000, "Sorry, were not present then.")
    .max(2100, "Sorry, but we won't be here during those times.")
    .integer(),
});

var monthsInYear = eachMonthOfInterval({
  start: startOfYear(startOfToday()),
  end: endOfYear(startOfToday()),
})


const currentYear = new Date().getFullYear()

let DashBoardPage = (props) => {
  const classes = commonStyles()
  const { sales, customerAccountDeposits } = props;
  const [salesForCurrentYear, setFilteredSalesByYear] = useState([]);
  const [depositsForCurrentYear, setFilteredDepositsByYear] = useState([]);

  useEffect(() => {
    const accountDepositsForCurrentYear = customerAccountDeposits
      .filter(({ deposit_date }) => getYear(parse(deposit_date, 'yyyy-MM-dd', new Date())) === currentYear)
    setFilteredDepositsByYear(accountDepositsForCurrentYear);
  }, [customerAccountDeposits]);

  useEffect(() => {
    const salesForCurrentYear = sales
      .filter(({ sale_date }) => getYear(parse(sale_date, 'yyyy-MM-dd', new Date())) === currentYear)
      setFilteredSalesByYear(salesForCurrentYear);
  }, [sales]);

  const setFilteredItemsByYear = (filterYear) => {
    setFilteredSalesByYear(
      sales
        .filter(({ sale_date }) => getYear(parse(sale_date, 'yyyy-MM-dd', new Date())) === filterYear)
    );
    setFilteredDepositsByYear(
      customerAccountDeposits
        .filter(({ deposit_date }) => getYear(parse(deposit_date, 'yyyy-MM-dd', new Date())) === filterYear)
    );
  };

  //GET THE TOTAL NUMBER OF SALES
  const TOTAL_SALES = salesForCurrentYear.reduce((total, currentSale) =>
    total + ((parseFloat(currentSale.sale_price) * parseFloat(currentSale.sale_quantity)) || 0), 0);

  //GET THE TOTAL NUMBER OF CUSTOMER DEPOSITS
  const TOTAL_CUSTOMER_DEPOSITS = depositsForCurrentYear.reduce((total, currentDeposit) =>
    total + (parseFloat(currentDeposit.deposit_amount) || 0), 0);


  // CREATE A UNIT OCCUPANCY DISPLAY DATA ARRAY INSTEAD OF REPEATING MULTIPLE ELEMENTS
  const SALE_SUMMARY_DATA = [
    { title: "Total Sales", value: TOTAL_SALES },
    { title: "Total Client Deposits", value: TOTAL_CUSTOMER_DEPOSITS },
    { title: "Total Credit", value: (TOTAL_SALES - TOTAL_CUSTOMER_DEPOSITS) },
  ]

  //GET THE TOTAL PAYMENTS FOR EACH MONTH IN THE SELECTED YEAR
  const totalEachMonthSales = monthsInYear.map((monthDate) => {
    //get sales recorded in the same month and year as monthDate
    return salesForCurrentYear
      .filter((sale) => {
        const saleDate = parse(sale.sale_date, 'yyyy-MM-dd', new Date())
        return isSameMonth(monthDate, saleDate)
      }).reduce((total, currentSale) =>

        total + ((parseFloat(currentSale.sale_price) * parseFloat(currentSale.sale_quantity)) || 0), 0)
  })
  // MAKE AN OBJECT FOR SHOWING AN INCOME GRAPH, BY MONTH, LATER
  // LABELS ARE MONTHS IN THE YEAR IN SHORT FORMAT
  const rentIncomeData = {
    datasets: [{
      data: totalEachMonthSales, label: 'Monthly Sales', type: 'bar',
      fill: false,
      backgroundColor: '#71B37C',
      borderColor: '#71B37C',
      hoverBackgroundColor: '#71B37C',
      hoverBorderColor: '#71B37C',
    }],
    labels: monthsInYear.map((monthDate) => format(monthDate, 'MMMM')),
  }

  const totalEachMonthClientDeposits = monthsInYear.map((monthDate) => {
    //get sales recorded in the same month and year as monthDate
    return depositsForCurrentYear
      .filter((clientDeposit) => {
        const depositDate = parse(clientDeposit.deposit_date, 'yyyy-MM-dd', new Date())
        return isSameMonth(monthDate, depositDate)
      }).reduce((total, clientDeposit) => total + (parseFloat(clientDeposit.deposit_amount) || 0), 0)
  })
  rentIncomeData.datasets.push({
    data: totalEachMonthClientDeposits,
    label: 'Monthly Customer Deposits', type: 'line', borderColor: '#EC932F', fill: false,
    backgroundColor: '#EC932F',
    pointBorderColor: '#EC932F',
    pointBackgroundColor: '#EC932F',
    pointHoverBackgroundColor: '#EC932F',
    pointHoverBorderColor: '#EC932F',
  })

  return (
    <Layout pageTitle="Overview">
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item key={0}>
          <PageHeading text={"Overview"} />
        </Grid>
        <Grid item container>
          <Grid container item direction="column" spacing={4}>
            <Grid item>
              <Box
                border={1}
                borderRadius="borderRadius"
                borderColor="grey.400"
              >
                <Formik
                  initialValues={{ filter_year: currentYear }}
                  validationSchema={FilterYearSchema}
                  onSubmit={(values) => {
                    setFilteredItemsByYear(parseInt(values.filter_year));
                  }}
                >
                  {({
                    values,
                    handleSubmit,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                  }) => (
                    <form
                      className={classes.form}
                      id="yearFilterForm"
                      onSubmit={handleSubmit}
                    >
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justify="center"
                        direction="row"
                      >
                        <Grid item>
                          <TextField
                            variant="outlined"
                            id="filter_year"
                            name="filter_year"
                            label="Year"
                            value={values.filter_year}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.filter_year && touched.filter_year}
                            helperText={
                              touched.filter_year && errors.filter_year
                            }
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            type="submit"
                            form="yearFilterForm"
                            color="primary"
                            variant="contained"
                            size="medium"
                            startIcon={<SearchIcon />}
                          >
                            SEARCH
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          justify="space-around"
          key={3}
        >
        </Grid>
        <Grid
          item
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          justify="space-around"
          key={2}
        >
          {
            SALE_SUMMARY_DATA.map((unitOccupancyData, index) =>
              <InfoDisplayPaper key={index} xs={12} title={unitOccupancyData.title} value={unitOccupancyData.value} />
            )
          }
        </Grid>
        <Grid item>
          <Typography variant="h6" align="center" gutterBottom>
            Monthly Sales &amp; Deposits
          </Typography>
          <Bar
            data={rentIncomeData}
            options={options}>
          </Bar>
        </Grid>
      </Grid>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    customerAccountDeposits: state.customerAccountDeposits,
    sales: state.sales,
  };
};

export default connect(mapStateToProps)(DashBoardPage);
