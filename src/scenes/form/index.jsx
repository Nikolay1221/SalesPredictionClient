import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import ErrorAlert from '../../Services/uploadData/ErrorAlert';
import SuccessfullAlert from '../../Services/uploadData/SuccessfullAlert';
import { addRow, fetchTableData } from "../../redux/actions/tableRowActions";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();
  const [state, setState] = useState({
    deletedSuccess: false,
    deletedError: false,
    deletedMessage: ''
  });

  const handleSnackbarClose = () => updateState({
    deletedSuccess: false,
    deletedError: false
  });

  const updateState = (newState) => setState((prevState) => ({ ...prevState, ...newState }));
  const tableId = useSelector(state => state.tableData.tableId);

  const handleFormSubmit = async (values) => {
    updateState({ deletedError: false, deletedSuccess: false });

    try {
        await dispatch(addRow(tableId, {...values, tableId}));
        updateState({
            deletedSuccess: true,
            deletedMessage: 'Added successfully!',
        });
        console.log("Submitting values:", values);
        dispatch(fetchTableData(tableId));
    } catch (error) {
        console.error('Add function error:', error);
        updateState({
            deletedError: true,
            deletedMessage: 'Could not add row',
        });
    }
};


  return (
    <Box m="20px">
      <Header title="Add Row" subtitle="Add row of data" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="balanceStart"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.balanceStart}
                name="balanceStart"
                error={!!touched.balanceStart && !!errors.balanceStart}
                helperText={touched.balanceStart && errors.balanceStart}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
              />
               <TextField
                fullWidth
                variant="filled"
                type="number"
                label="sales"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sales}
                name="sales"
                error={!!touched.sales && !!errors.sales}
                helperText={touched.sales && errors.sales}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
              />
               <TextField
                fullWidth
                variant="filled"
                type="number"
                label="transit"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.transit}
                name="transit"
                error={!!touched.transit && !!errors.transit}
                helperText={touched.transit && errors.transit}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
              />
               <TextField
                fullWidth
                variant="filled"
                type="number"
                label="backorder"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.backorder}
                name="backorder"
                error={!!touched.backorder && !!errors.backorder}
                helperText={touched.backorder && errors.backorder}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Maximum"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.max}
                name="max"
                error={!!touched.max && !!errors.max}
                helperText={touched.max && errors.max}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}  
              />
              
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Minimum"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.min}
                name="min"
                error={!!touched.min && !!errors.min}
                helperText={touched.min && errors.min}
                sx={{ gridColumn: "span 2" }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Year_Month"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.yyyy_MM}
                name="yyyy_MM"
                error={!!touched.yyyy_MM && !!errors.yyyy_MM}
                helperText={touched.yyyy_MM && errors.yyyy_MM}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="product id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.product_id}
                name="product_id"
                error={!!touched.product_id && !!errors.product_id}
                helperText={touched.product_id && errors.product_id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="product category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.productCategory}
                name="productCategory"
                error={!!touched.productCategory && !!errors.productCategory}
                helperText={touched.productCategory && errors.productCategory}
                sx={{ gridColumn: "span 2" }}
              />
             
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                ADD DATA
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <SuccessfullAlert open={state.deletedSuccess} onClose={handleSnackbarClose} message={state.deletedMessage} />
     <ErrorAlert open={state.deletedError} onClose={handleSnackbarClose} message={state.deletedMessage} />
    </Box>
  );
};

const yearMonthRegExp = /\d{4}-\d{2}-\d{2}/;

const checkoutSchema = yup.object().shape({
  balanceStart: yup.number().required("required").integer("must be an integer"),
  max: yup.number().required("required").integer("must be an integer"),
  min: yup.number().required("required").integer("must be an integer"),
  sales: yup.number().required("required").integer("must be an integer"),
  transit: yup.number().required("required").integer("must be an integer"),
  backorder: yup.number().required("required").integer("must be an integer"),
  yyyy_MM: yup.string().required("required").matches(yearMonthRegExp, "Date must be in the format YYYY-MM-DD"),
  product_id: yup.string().required("required"),
  productCategory: yup.string().required("required")
});
const initialValues = {
  yyyy_MM: "",
  balanceStart: '',
  max: '',
  min: '',
  sales: '',
  transit: '',
  product_id: '',
  backorder: '',
  productCategory: '',
};

export default Form;
