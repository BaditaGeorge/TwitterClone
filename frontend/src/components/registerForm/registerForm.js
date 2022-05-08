import * as react from "react";
import FormBodyWrapper from "../bodyWrapper/formBodyWrapper";
import Button from "@mui/material/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

const validationObject = Yup.object({
  firstName: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  lastName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(5, "Must be 5 characters or more")
    .required("You must choose a password!"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match!"
  ),
});

const fieldStyle = {
  height: "5vh",
  width: "40vh",
  fontSize: "16px",
};

function RegisterForm() {
  const navigate = useNavigate();

  const onSignUpSubmit = (values, { setSubmitting }) => {
    const { passwordConfirmation, ...registrationData } = values;
    AuthAPI.registerUser(registrationData).then(([status, data]) => {
      if (status >= 400 && status < 500) {
        alert(data["message"]);
      }

      if (status === 200) {
        navigate("/signin");
      }
    });
  };

  return (
    <FormBodyWrapper>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Formik
          initialValues={{
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            passwordConfirmation: "",
          }}
          validationSchema={validationObject}
          onSubmit={onSignUpSubmit}
        >
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <label htmlFor="firstName">First Name</label>
            <Field style={fieldStyle} name="firstName" type="text" />
            <ErrorMessage name="firstName" />

            <label htmlFor="lastName">Last Name</label>
            <Field style={fieldStyle} name="lastName" type="text" />
            <ErrorMessage name="lastName" />

            <label htmlFor="email">Email</label>
            <Field style={fieldStyle} name="email" type="text" />
            <ErrorMessage name="email" />

            <label htmlFor="password">Passowrd</label>
            <Field style={fieldStyle} name="password" type="password" />
            <ErrorMessage name="password" />

            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <Field
              style={fieldStyle}
              name="passwordConfirmation"
              type="password"
            />
            <ErrorMessage name="passwordConfirmation" />

            <Button
              variant="outlined"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              type="button"
              style={{ marginTop: "10px" }}
              onClick={() => navigate("/signin")}
            >
              You have an account? Sign in!
            </Button>
          </Form>
        </Formik>
      </div>
    </FormBodyWrapper>
  );
}

export default RegisterForm;
