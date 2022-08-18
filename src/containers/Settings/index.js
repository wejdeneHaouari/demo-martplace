import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import { env } from "../../constants";
import * as Yup from "yup";
import "./index.css";
import { toast } from "react-toastify";
// import { useHistory } from "react-router-dom";
// import { useMetamask } from "use-metamask";
// import Web3 from "web3";
import { MetaMaskProvider } from "metamask-react";
import AdminHeader from "../../components/AdminHeader";
import { userID } from "../../constants/apiEndPoints";

function Settings() {
  const cookies = new Cookies();
  const [getEmail, setEmail] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setlastName] = useState("");
  const [getusername, setuserName] = useState("");
  const [getorgName, setOrgName] = useState("");
  const intialValues = { firstName: "", lastName: "" };
  const [formValues, setFormValues] = useState(intialValues);

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const state = {
    button: 1,
  };
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };
  // const {
  //   connect,
  //   getAccounts,
  //   getChain,
  //   metaState,
  //   status,
  //   account,
  // } = useMetamask();
  useEffect(() => {
    axios
      .get(
        env.apiUrl + `api/users/getUserById?userId=${userID}`,
        headers
      )
      .then((res) => {
        console.log(res.data.data.email);
        setEmail(res.data.data.email);
        setFirstName(res.data.data.firstName);
        setlastName(res.data.data.firstName);
        setOrgName(res.data.data.organizationName);
        setuserName(res.data.data.username);
        setFormValues({ firstName: res.data.data.firstName });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            cookies.remove("response");
            notify("loginError", "Token is expired. Please try to login again");
            // history.push("/");
            sessionStorage.clear();
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });
  }, []);
  const userId = cookies.get("userId");
  const validationSchema = Yup.object().shape({
    oldPass: Yup.string()
      .required("Old Password is required")
      .min(2, "Password must be at least 2 characters")
      .max(40, "Password must not exceed 40 characters"),
    newPass: Yup.string()
      .required("New Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPass"), null], "Confirm Password does not match"),
  });

  Yup.addMethod(Yup.string, "stripEmptyString", function () {
    return this.transform((value) => (value === "" ? undefined : value));
  });

  const validationSchema2 = Yup.object().shape({
    firstName: Yup.string("Name must be a string")
      .stripEmptyString()
      .required("First Name is required")
      .default("John"),
    lastName: Yup.string()
      .required("Last Name is required")
      .default(getLastName),
    username: Yup.string()
      .required("Username is required")
      .min(2, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .default(getusername),
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid")
      .default(getEmail),
    organizationName: Yup.string()
      .required("Organization Name is required")
      .min(2, "Organization Name must be at least 6 characters")
      .max(20, "Organization Name must not exceed 20 characters")
      .default(getorgName),
  });

  const validationSchema4 = Yup.object().shape({
    password: Yup.string()
      .required("Current Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
  });
  // const initialValue = {
  //   firstName: "kjh",
  //   lastName: getLastName,
  //   email: getEmail,
  //   // review: "",
  //   // rating: "",
  //   // date: new Date(),
  //   // wouldRecommend: false,
  //   // product: "",
  // };
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

  const {
    register: register4,
    formState: { errors: errors4 },
    handleSubmit: handleSubmit4,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema4),
  });

  const onSubmit = (data) => {
    data.userId = userId;
    delete data.confirmPassword;
    axios
      .post(env.apiUrl + "api/users/changePassword", data, headers)
      .then((res) => {
        notify("loginError", res.data.msg);
      })
      .catch((err) => {
        if (err.response) {
          notify("loginError", err.response.data.msg);
        }
      });
  };

  const onSubmit2 = (data) => {
    data.userId = userId;
    delete data.confirmPassword;
    axios
      .post(env.apiUrl + "api/users/changeDetails", data, headers)
      .then((res) => {
        notify("loginError", res.data.msg);
      })
      .catch((err) => {
        if (err.response) {
          notify("loginError", err.response.data.msg);
        }
      });
  };
  const onSubmit3 = async () => {
    if (window.ethereum) {
      //check if Metamask is installed
      try {
        const address = await window.ethereum.enable(); //connect Metamask
        const obj = {
          connectedStatus: true,
          status: "",
          address: address,
        };
        const updateKeyData = {
          publicKey: obj.address[0],
          userId: userId,
        };
        axios
          .post(
            env.apiUrl + "api/users/updateMetamaskKey",
            updateKeyData,
            headers
          )
          .then((res) => {
            notify("loginError", res.data.msg);
          })
          .catch((err) => {
            if (err.response) {
              notify("loginError", err.response.data.msg);
            }
          });
        return obj;
      } catch (error) {
        return {
          connectedStatus: false,
          status: "🦊 Connect to Metamask using the button on the top right.",
        };
      }
    } else {
      return {
        connectedStatus: false,
        status:
          "🦊 You must install Metamask into your browser: https://metamask.io/download.html",
      };
    }
  };

  const onSubmit4 = (data) => {
    data.userId = userId;
    axios
      .post(env.apiUrl + "api/users/getuserPublicKey", data, headers)
      .then((res) => {
        notify("loginError", res.data.msg + " is: " + res.data.data);
        // notify("loginError", res.data.data);
      })
      .catch((err) => {
        if (err.response) {
          notify("loginError", err.response.data.msg);
        }
      });
  };

  return (
    <>
      <div className="container dashboardContainer">
        <AdminHeader />
        <div className="container">
          <div className=" justify-content-center settingsCard w-100 ">
            <div className="card cardClass">
              <div className="card-block">
                <h4 className="card-title">Change Password</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group mb-4">
                    <input
                      name="oldPass"
                      type="password"
                      placeholder="Old Password"
                      {...register("oldPass")}
                      className={`form-control ${
                        errors.oldPass ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.oldPass?.message}
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <input
                      name="newPass"
                      type="password"
                      autoComplete="off"
                      placeholder="New Password"
                      {...register("newPass")}
                      className={`form-control ${
                        errors.newPass ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.newPass?.message}
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
                      className="btn btn-primary "
                      type="submit"
                      onClick={() => (state.button = 1)}
                      name="passwordChange"
                      // disabled={disableSubmit}
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className=" justify-content-center settingsCard w-100 ">
            <div className="card cardClass">
              <div className="card-block">
                <h4 className="card-title">Change Info</h4>
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
                        name="organizationName"
                        type="text"
                        placeholder="Organization Name"
                        {...register2("organizationName")}
                        className={`form-control ${
                          errors2.organizationName ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors2.organizationName?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <input
                        name="email"
                        type="text"
                        placeholder="Email"
                        {...register2("email")}
                        className={`form-control ${
                          errors2.email ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors2.email?.message}
                      </div>
                    </div>
                    <div className=" mb-4">
                      <button
                        className="btn btn-primary "
                        type="submit"
                        onClick={() => (state.button = 2)}
                        name="infoChange"
                      >
                        Change Info
                      </button>
                    </div>
                  </div>
                </form>{" "}
              </div>
            </div>
          </div>
          <div className=" justify-content-center settingsCard w-100 ">
            <div className="card cardClass">
              <div className="card-block">
                <h4 className="card-title">Connect to MetaMask</h4>
                <MetaMaskProvider>
                  <button
                    type="button"
                    id="btnPublicKey"
                    className="btn btn-primary mt-3"
                    onClick={onSubmit3}
                  >
                    <img className="metamaskIcon" />
                    Link metamask wallet
                  </button>
                </MetaMaskProvider>
              </div>
            </div>
          </div>
          <div className=" justify-content-center settingsCard w-100 ">
            <div className="card cardClass">
              <div className="card-block">
                <h4 className="card-title">
                  Export the Chaincert-Blockchain private key
                </h4>
                <form onSubmit={handleSubmit4(onSubmit4)}>
                  <div className="form-group mb-4">
                    <input
                      name="password"
                      type="password"
                      autoComplete="off"
                      placeholder="Current Password"
                      {...register4("password")}
                      className={`form-control ${
                        errors4.password ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors4.password?.message}
                    </div>
                  </div>
                  <div className=" mb-4">
                    <button className="btn btn-primary " type="submit">
                      Export Chaincert Private Key
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Settings;
