import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import axios from "axios";
import { env } from "../../constants";
function Forgot() {
  const notify = (type, text) => {
    if (type === "forgotError" || type === "success") {
      toast(text);
    }
  };
  const validationSchema = Yup.object().shape({
    emailId: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    const options = {
      headers: {
        "content-type": "application/json",
      },
    };
    axios
      .post(env.apiUrl + "api/users/forgotPassword", data, options)
      .then((res) => {
        notify("success", res.data.msg);
      })
    .catch((error) => {
       if (error.response) {
         // Request made and server responded
         notify("forgotError", error.response.data.msg);
       } else if (error.request) {
         // The request was made but no response was received
         notify("forgotError", error.message);
       } else {
         // Something happened in setting up the request that triggered an Error
         notify("forgotError", error.message);
       }
        });
  };
return (
  <div className="container-fluid bg-image" id="main">
    <div className="row no-gutter">
      <div className="col-sm-6 d-none centerMain d-sm-flex borderRight">
        <div className="innerCenter">
          <img className="logo leftLogo" alt="logo" />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="login d-flex align-items-center py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 col-xl-7 mx-auto">
                <h2 className="display-4 loginHeader text-left">
                  Forgot Password
                </h2>
                <h6 className="Are-you-a-creator-or text-left mb-4">
                  Please enter your email address. We will send you an email to
                  reset your password.
                </h6>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <input
                      name="emailId"
                      type="text"
                      placeholder="Email Address"
                      {...register("emailId")}
                      className={`form-control ${
                        errors.emailId ? "is-invalid" : ""
                      }`}
                    />

                    <div className="invalid-feedback">
                      {errors.emailId?.message}
                    </div>
                  </div>{" "}
                  <div className=" mb-4">
                    <button
                      className="btn btn-primary w-50 text-center btnsText"
                      type="submit"
                    >
                      Reset Password
                    </button>
                  </div>
                  <p className="text-muted mb-4">
                    Go Back to <a href="/userLogin">Login</a>
                  </p>
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
    export default Forgot;
