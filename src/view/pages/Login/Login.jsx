import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useLogin } from "../../Hooks/useLogin";
import logo from "../../../assets/Images/logo.png";

function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        const { encryptedToken, user_role, expiresIn, user } = response.data;
        console.log("response.data===",response.data);
        

        if (user_role === "user" || user_role === "trustees") {
          toast.error("Access denied! Only admins can log in.", { position: "top-right" });
          return;
        }

        try {
          if (!encryptedToken || typeof encryptedToken !== "string") {
            throw new Error("Invalid token received from server");
          }

          const expiryTimestamp = Date.now() + expiresIn * 1000;

          // ✅ Store user data and token in localStorage
          localStorage.setItem("token", encryptedToken);
          localStorage.setItem("userRole", user_role);
          localStorage.setItem("tokenExpiry", expiryTimestamp.toString()); // Store as string
          localStorage.setItem("user", JSON.stringify(user)); // Store user details

          toast.success("Login Successful!", { position: "top-right" });

          setTimeout(() => {
            navigate("/");
          }, 1500);
        } catch (error) {
          console.error("Error storing token:", error);
          toast.error("Invalid token received. Please try again.", { position: "top-right" });
        }
      },
      onError: () => {
        toast.error("Invalid credentials! Please try again.", { position: "top-right" });
      },
    });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <ToastContainer />
      <Box boxShadow={3} p={4} width="100%" maxWidth="400px" sx={{ borderRadius: 2 }}>
        <Box mb={3} textAlign="center">
          <img src={logo} alt="Nest Mart Logo" style={{ width: "150px", height: "auto" }} />
        </Box>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#3bb77e", "&:hover": { backgroundColor: "#34a768" } }}
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
