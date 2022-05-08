import * as react from "react";
import FormBodyWrapper from "../bodyWrapper/formBodyWrapper";
import { Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../apis";

const validationObject = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(5, "Must be 5 characters or more")
    .required("You must choose a password!"),
});

const fieldStyle = {
  height: "5vh",
  width: "60vh",
  fontSize: "16px",
};

function LoginForm() {
  const navigate = useNavigate();

  const onSignInSubmit = (values, { setSubmitting }) => {
    AuthAPI.loginUser(values).then(([status, data]) => {
      if (status >= 400 && status < 500) {
        alert(data["message"]);
      } else {
        localStorage.setItem("token", data["token"]);
        navigate("/home");
      }
    });
  };

  return (
    <FormBodyWrapper>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationObject}
          onSubmit={onSignInSubmit}
        >
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <label htmlFor="email">Email</label>
            <Field style={fieldStyle} name="email" type="text" />
            <ErrorMessage name="email" />

            <label htmlFor="password">Password</label>
            <Field style={fieldStyle} name="password" type="password" />
            <ErrorMessage name="password" />

            <Button
              variant="outlined"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              type="button"
              style={{ marginTop: "10px" }}
              onClick={() => navigate("/signup")}
            >
              You do not have an account? Sign up!
            </Button>
          </Form>
        </Formik>
      </div>
    </FormBodyWrapper>
  );
}

export default LoginForm;
