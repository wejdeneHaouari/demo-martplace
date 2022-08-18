import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./index.css";
import axios from "axios";
import { env } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

function ResetPassword() {
  const validationSchema = Yup.object().shape({
    upass: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("upass"), null], "Confirm Password does not match"),
  });
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    delete data.confirmPassword;
    var loc = window.location.href;
    loc = loc.split("?");
    loc = loc[1].split("token=");
    if (loc[1] === undefined || loc[1] === "undefined") {
      window.location = "/";
    }
    data.rtoken = loc[1];
    const options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post(env.apiUrl + "api/users/resetPassword", data, options)
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        notify("loginError", err.response.data.msg);
      });
  };
  return (
    <div className="container-fluid bg-image" id="main">
      <div className="row no-gutter">
        <div className="col-sm-6 d-none centerMain d-sm-flex borderRight">
          <div className="innerCenter">
            <img className="logo leftLogo" alt="logo" />
            <span className="A-quick-way-to-authe">
              A quick way to authenticate your products and tokenize your
              digital assets
            </span>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-10 col-xl-7 mx-auto">
                  <h2 className="display-4 loginHeader">Reset Password</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-4">
                        <input
                          name="upass"
                          type="password"
                          placeholder="Password"
                          {...register("upass")}
                          className={`form-control ${
                            errors.upass ? "is-invalid" : ""
                          }`}
                        />
                        <div className="invalid-feedback">
                          {errors.upass?.message}
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
                    <div className=" mb-4">
                      <button
                        className="btn btn-primary w-50 text-center btnsText"
                        type="submit"
                      >
                        Reset Password
                      </button>
                    </div>
                    <p className="text-muted mb-4">
                      Go Back to <a href="/">Login</a>
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
export default ResetPassword;
