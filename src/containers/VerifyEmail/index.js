import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { env } from "../../constants";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
function VerifyEmail() {
  var history=useHistory()
  const notify = (type, text) => {
    if (type === "forgotError") {
      toast(text);
    }
  };
  const validationSchema = Yup.object().shape({
    code: Yup.number()
      .required("Code is required")
      .typeError("you must specify a number"),
  });
  const cookies = new Cookies();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    const userId = cookies.get("userId");
    data.userId = userId;
    const options = {
      headers: {
        "content-type": "application/json",
      },
    };
    axios
      .post(env.apiUrl + "api/users/confirm-verification-code", data, options)
      .then((res) => {
        notify("forgotError", res.data.msg);
        history.push("/userLogin")
      });
  };
  const resendCode = () => {
    const userId = cookies.get("userId");
    const data = { userId: userId };
    const options = {
      headers: {
        "content-type": "application/json",
      },
    };

    axios
      .post(env.apiUrl + "api/users/send-verification-code", data, options)
      .then((res) => {
        notify("forgotError", res.data.msg);
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
                  <h2 className="display-4 mb-4 loginHeader">Verify Email</h2>
                  <h6 className="Are-you-a-creator-or text-left mb-4">
                    Please enter code that you have received in an email
                  </h6>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-4">
                      <input
                        name="code"
                        type="text"
                        placeholder="Code"
                        {...register("code")}
                        className={`form-control ${
                          errors.code ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.code?.message}
                      </div>
                    </div>{" "}
                    <div className="row mb-4">
                      <div className="col-6">
                        <button
                          className="btn btn-primary w-100 text-center btnsText"
                          type="submit"
                        >
                          Verify Email
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          className="btn btn-secondary w-100 text-center btnsText"
                          type="button"
                          onClick={() => resendCode()}
                        >
                          Resend Code
                        </button>
                      </div>
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
export default VerifyEmail;
