import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Button,
  // Checkbox,
  // FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import { useLogin } from "../../Hooks/useLogin";
import logo from "../../../assets/Images/logo.png";

function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const initialValues = { email: "", password: "" };
  const handleSubmit = async (values) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        const { encryptedToken, user_role } = response.data;
  
        if (user_role === "user" || user_role === "trustees" ) {
          toast.error("Access denied! Only admins can log in.", {
            position: "top-right",
          });
          return;
        }
  
        localStorage.setItem("token", encryptedToken);
        localStorage.setItem("userRole", user_role);
  
        toast.success("Login Successful!", { position: "top-right" });
  
        setTimeout(() => {
          if (user_role === "admin" || user_role === "super-admin") {
            navigate("/"); // Admin/Super Admin Dashboard
          }
        }, 1500);
      },
      onError: () => {
        toast.error("Invalid credentials! Please try again.", {
          position: "top-right",
        });
      },
    });
  };
  

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: "background.paper" }}
    >
      <ToastContainer />
      <Box
        component="div"
        boxShadow={3}
        p={4}
        width="100%"
        maxWidth="400px"
        sx={{ borderRadius: 2 }}
      >
        <Box mb={3} textAlign="center">
          <img
            src={logo}
            alt="Nest Mart Logo"
            style={{ width: "150px", height: "auto" }}
          />
        </Box>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>

              <Box mb={2}>
                <Field
                  as={TextField}
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              {/* <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <FormControlLabel
                  control={<Field as={Checkbox} name="remember" />}
                  label="Remember Me"
                />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Box> */}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3bb77e",
                  "&:hover": { backgroundColor: "#34a768" },
                }}
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default Login;
