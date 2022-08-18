import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ReCaptchaV2 from "react-google-recaptcha";
import axios from "axios";
import { env } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

function TabContent() {
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const state = {
    button: 1,
  };
  const cookies = new Cookies();
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [collectorrecaptchaValue, setcollectorRecaptchaValue] = useState(null);
function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === "string" && originalValue === "") {
    return null;
  }
  return value;
}
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
    phonNumber: Yup
      .number().typeError("Please specify valid number")
      // .min(10)
      // .max(15)
      .transform(emptyStringToNull)
      .nullable(),
    orgName:Yup.string().required("Organization name is required"),
    // checking self-equality works for NaN, transforming it to null
    // .transform((_, val) => (val === val ? val : null)),
    // acceptTerms: Yup.bool().oneOf([true], "Accept Terms is required"),
    recaptcha: Yup.bool().oneOf([true], "Recaptcha is required"),
  });


  const validationSchema2 = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
    phonNumber: Yup.number()
      .typeError("Please specify valid number")
      // .min(10)
      // .max(15)
      .transform(emptyStringToNull)
      .nullable(),
    recaptcha: Yup.bool().oneOf([true], "Recaptcha is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
   const {
     register: register2,
     formState: { errors: errors2 },
     handleSubmit: handleSubmit2,
   } = useForm({
     mode: "onBlur",
     resolver: yupResolver(validationSchema2),
   });
  
  const history = useHistory();

  const onSubmit = (data) => {
      data.userRole = "owner";
      delete data.confirmPassword;
      const options = {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
      if (recaptchaValue) {
        axios
          .post(env.apiUrl + "api/users/signup", data, options)
          .then((res) => {
            const userid = res.data.data.id;
            cookies.set("userId", userid, { path: "/" });
            history.push("/verify");
          })
          .catch((err) => {
            notify("loginError", err.response.data.msg);
          });
      } else {
        notify("loginError", "Recaptcha is Required");
      }
  };

  const onSubmit2 = (data) => {
   const options = {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
      data.userRole = "client";
      data.orgName = data.firstName + " " + data.lastName;
      delete data.confirmPassword;
      if (collectorrecaptchaValue) {
        axios
          .post(env.apiUrl + "api/users/signup", data, options)
          .then((res) => {
            const userid = res.data.data.id;
            cookies.set("userId", userid, { path: "/" });
            history.push("/verify");
          })
          .catch((err) => {
            notify("loginError", err.response.data.msg);
          });
      } else {
        notify("loginError", "Recaptcha is Required");
      }
  };
  function onChange(value) {
    setRecaptchaValue(value);
  }
  function onCollectorChange(value) {
    setcollectorRecaptchaValue(value);
  }
  return (
    <div className="tabs overflow-auto">
      <Tabs>
        <Tab label="Creator" className="CreatorClass">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="form-group mb-4">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors.firstName?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.lastName?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors.username?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="orgName"
                  type="text"
                  placeholder="Organization Name"
                  {...register("orgName")}
                  className={`form-control ${
                    errors.orgName ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors.orgName?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="email"
                  type="text"
                  placeholder="Email"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />

                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="phonNumber"
                  type="text"
                  placeholder="Phone Number"
                  {...register("phonNumber")}
                  className={`form-control ${
                    errors.phonNumber ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors.phonNumber?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </div>
              </div>
              <ReCaptchaV2
                sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
                data-size="compact"
                theme="dark"
                required={true}
                onChange={onChange}
                // onChange={useCallback(() => setDisableSubmit(false))}
                className={`mb-4 ${errors.recaptcha ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors.recaptcha?.message}
              </div>
              <div className="row mb-4">
                <div className="col-6">
                  <button
                    className="btn btn-primary w-100 btnsText"
                    type="submit"
                    onClick={() => (state.button = 1)}
                    name="signupButton1"
                  >
                    Sign up
                  </button>
                </div>
                <div className="col-6">
                  <a
                    className="btn btn-secondary w-100 btnsText"
                    type="button"
                    href="/"
                    style={{ padding: "14px" }}
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </form>
        </Tab>
        <Tab label="Collector" className="overflow-auto CreatorClass">
          <form onSubmit={handleSubmit2(onSubmit2)}>
            <div>
              <div className="form-group mb-4">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register2("firstName")}
                  className={`form-control ${
                    errors2.firstName ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors2.firstName?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  {...register2("lastName")}
                  className={`form-control ${
                    errors2.lastName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors2.lastName?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  {...register2("username")}
                  className={`form-control ${
                    errors2.username ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors2.username?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="email"
                  type="text"
                  placeholder="Email"
                  {...register2("email")}
                  className={`form-control ${errors2.email ? "is-invalid" : ""}`}
                />

                <div className="invalid-feedback">{errors2.email?.message}</div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="phonNumber"
                  type="text"
                  placeholder="Phone Number"
                  {...register2("phonNumber")}
                  className={`form-control ${
                    errors2.phonNumber ? "is-invalid" : ""
                  }`}
                />

                <div className="invalid-feedback">
                  {errors2.phonNumber?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  {...register2("password")}
                  className={`form-control ${
                    errors2.password ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors2.password?.message}
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  {...register2("confirmPassword")}
                  className={`form-control ${
                    errors2.confirmPassword ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors2.confirmPassword?.message}
                </div>
              </div>
              <ReCaptchaV2
                sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
                data-size="compact"
                theme="dark"
                required={true}
                onChange={onCollectorChange}
                // onChange={useCallback(() => setDisableSubmit(false))}
                className={`mb-4 ${errors2.recaptcha ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors2.recaptcha?.message}
              </div>
              <div className="row mb-4">
                <div className="col-6">
                  <button
                    className="btn btn-primary w-100 btnsText"
                    type="submit"
                    onClick={() => (state.button = 2)}
                    name="signupButton2"
                  >
                    Sign up
                  </button>
                </div>
                <div className="col-6">
                  <a
                    className="btn btn-secondary w-100 btnsText"
                    type="button"
                    href="/"
                    style={{ padding: "14px" }}
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </form>
        </Tab>
      </Tabs>
    </div>
  );
}

class Tabs extends React.Component {
  state = {
    activeTab: this.props.children[0].props.label,
  };
  changeTab = (tab) => {
    this.setState({ activeTab: tab });
  };
  render() {
    let content;
    let buttons = [];
    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          buttons.push(child.props.label);
          if (child.props.label === this.state.activeTab)
            content = child.props.children;
        })}

        <TabButtons
          activeTab={this.state.activeTab}
          buttons={buttons}
          changeTab={this.changeTab}
        />
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}

const TabButtons = ({ buttons, changeTab, activeTab }) => {
  return (
    <div className="tab-buttons">
      {buttons.map((button) => {
        return (
          <button
            className={button === activeTab ? "activeClass" : ""}
            onClick={() => changeTab(button)}
          >
            {button}
          </button>
        );
      })}
    </div>
  );
};

const Tab = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default TabContent;
