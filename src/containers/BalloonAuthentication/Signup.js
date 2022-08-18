import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { env } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

function Signup() {
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
     
     function emptyStringToNull(value, originalValue) {
       if (typeof originalValue === "string" && originalValue === "") {
         return null;
       }
       return value;
     }
     const validationSchema = Yup.object().shape({
       firstName: Yup.string().required("First Name is required"),
       lastName: Yup.string().required("Last Name is required"),
       email: Yup.string()
         .required("Email is required")
         .email("Email is invalid"),
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
       recaptcha: Yup.bool().oneOf([true], "Recaptcha is required"),
     });

     const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm({
       resolver: yupResolver(validationSchema),
     });

     const history = useHistory();


     const onSubmit = (data) => {
       const options = {
         headers: {
           "content-type": "application/json",
           "Access-Control-Allow-Origin": "*",
         },
       };
         data.userRole = "client";
        //  data.username == data.firstName + " " + data.lastName;
    //    data.orgName = data.firstName + " " + data.lastName;
       delete data.confirmPassword;
       if (recaptchaValue) {
         axios
           .post(env.apiUrl + "api/users/signup", data, options)
           .then((res) => {
             const userid = res.data.data.id;
             cookies.set("userId", userid, { path: "/" });
             history.push("/userVerifyEmail");
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
     
    return (
      <div className="container-fluid bg-image" id="main">
        <div className="row no-gutter">
          <div className="col-sm-6 d-none centerMain d-sm-flex borderRight">
            <div className="innerCenter">
              <img className="logo leftLogo" alt="logo" />
              {/* <h2 className="display-4 loginHeader">Login </h2> */}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <h2 className="display-4 loginHeader">Sign up</h2>
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
                            name="email"
                            type="text"
                            placeholder="Email"
                            {...register("email")}
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                          />

                          <div className="invalid-feedback">
                            {errors.email?.message}
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
                        <ReCAPTCHA
                          sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
                          data-size="compact"
                          required={true}
                          onChange={onChange}
                          className={`mb-4 ${
                            errors.recaptcha ? "is-invalid" : ""
                          }`}
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
                              href="/userLogin"
                              style={{ padding: "14px" }}
                            >
                              Login
                            </a>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Signup;