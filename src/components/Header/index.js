import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import "./index.css";
import styled from "styled-components";
// import NavOptions from "./content";
import user from "../../assets/images/user.png";
import logoutImg from "../../assets/images/logout.png";
import AileronReguler from "../../assets/fonts/aileron/Aileron-Regular.otf";
import defaultLogo from "../../assets/images/storeFront/defaultLogo.png";
import defaultUser from "../../assets/images/defaultUser.png";
import Modal from "../../components/Modal";
import useToggle from "../../components/Modal/useToggle";
import ModalLogo from "../../assets/images/storeFront/logo.png";
import { modalStyle } from "../Modal/style";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import Moment from "moment";
import { env } from "../../constants";
import { toast } from "react-toastify";
import ReCaptchaV2 from "react-google-recaptcha";
import ReCAPTCHA from "react-google-recaptcha";

function Header() {
  const cookies = new Cookies();
  const history = useHistory();
  const userRole = cookies.get("userRole");
  const [open, setOpen] = useToggle(false);
  const [signupOpen, setSignupOpen] = useToggle(false);
  const [loginShow, setLoginShow] = useState(true);
  const [inputList, setInputList] = useState([{ name: "", type: "" }]);
  const [checked, setChecked] = React.useState(true);
  const [profilePicture, setProfilePicture] = useState("");
  let balloonUserToken = cookies.get("balloonUserToken");
  let ownerToken = cookies.get("response");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [collectorrecaptchaValue, setcollectorRecaptchaValue] = useState(null);

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    } else if (type === "userLoggedIn") {
      toast(text);
    }
  };

  const logout = () => {
    console.log("logout");
    setLoginShow(true);
    cookies.remove("balloonUserToken", { path: "/" });
    cookies.remove("response", { path: "/" });
    cookies.remove("userId", { path: "/" });
    cookies.remove("firstname", { path: "/" });
    cookies.remove("lastname", { path: "/" });
    cookies.remove("userRole", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("profilePicture", { path: "/" });
    cookies.remove("username", { path: "/" });
    //console.log(cookies.getAll())
    sessionStorage.clear();
    history.push("/");
    //window.location.reload();
    // window.location.reload(true);
    // if (userRole == 'owner') {
    //   history.push('/balloon/home');
    //   window.location.reload(true);
    // } else if (userRole == 'client') {
    //   if (window.location.pathname == '/balloon/collection') {
    //     history.push('/balloon/home');
    //   } else {
    //     window.location.reload(true);
    //   }
    // }

    return false;
  };

  const [storeLogo, setStoreLogo] = useState("");
  const [storeName, setStoreName] = useState("");

  const getStoreLogoBanner = () => {
    let myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "connect.sid=s%3AdNCAgjeHH2wJwWN7qh9Ar3M0lExpAhtB.P4OCs94J%2FTGPs63CXpBD947wAfhVZduWnrvZBxXQYYk"
    );

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      env.apiUrl + `api/users/getUserProfile?username=${env.username}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setStoreLogo(result.data.logo);
        setStoreName(result.data.store_details);
        console.log(result);
      })
      .catch((error) => console.log("error", error));

    //call second API to get users profile picture
    //getUserProfilePicture();
  };

  const getUserProfilePicture = () => {
    let myHeaders = new Headers();

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    console.log(cookies.get("userId"));
    fetch(
      env.apiUrl + `api/users/getUserProfile?username=${env.username}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("profile image ");
        console.log(result);
        setProfilePicture(result.data.logo);
      })
      .catch((error) => console.log("error", error));
  };

  const [scrolled, setScrolled] = React.useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    getStoreLogoBanner();
  }, []);

  let x = ["navbar"];
  if (scrolled) {
    x.push("scrolled");
  }

  const redirectToHome = () => {
    window.location.href = "../";
  };
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "", type: "" }]);
  };
  const cancelModal = () => {
    // setType("");
    // setname("");
    setOpen(false);
  };
  const continueModal = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
    recaptcha: Yup.bool().oneOf([true], "Recaptcha is required"),
  });

  const validationSchema2 = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
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
    recaptcha: Yup.bool().oneOf([true], "Recaptcha is required"),
  });

  useEffect(() => {
    const ownerLoggedIn = cookies.get("response");
    const userLoggedIn = cookies.get("balloonUserToken");
    if (!userLoggedIn || !ownerLoggedIn) {
      // history.push("/");
      setLoginShow(true);
    } else {
      setLoginShow(false);
    }
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
  const loginFormSubmit = (data) => {
    const options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    if (recaptchaValue) {
      axios
        .post(env.apiUrl + "api/users/login", data, options)
        .then((res) => {
          if (res.data.status === false) {
            notify("loginError", res.data.msg);
            if (res.data.msg === "User email is Not Verified.") {
              history.push("/verify");
            }
          } else if (res.data.status === true) {
            setProfilePicture(res.data.data.logo);
            //remove cookies old data
            cookies.remove("balloonUserToken", { path: "/" });
            cookies.remove("response", { path: "/" });
            cookies.remove("userId", { path: "/" });
            cookies.remove("username", { path: "/" });
            cookies.remove("firstname", { path: "/" });
            cookies.remove("lastname", { path: "/" });
            cookies.remove("email", { path: "/" });
            cookies.remove("profilePicture", { path: "/" });

            // add new cookies

            cookies.set("balloonUserToken", res.data.token, {
              path: "/",
              expires: new Date(Moment().add(60, "m").format()),
            });
            cookies.set("response", res.data.token, {
              path: "/",
              expires: new Date(Moment().add(60, "m").format()),
            });
            cookies.set("userId", res.data.data.id, { path: "/" });
            cookies.set("username", res.data.data.username, { path: "/" });
            cookies.set("userRole", res.data.data.userRole, { path: "/" });
            cookies.set("firstname", res.data.data.firstName, { path: "/" });
            cookies.set("lastname", res.data.data.lastName, { path: "/" });
            cookies.set("email", res.data.data.email, { path: "/" });
            cookies.set("profilePicture", res.data.data.logo, { path: "/" });
            sessionStorage.setItem("newKey", 1);
            toast("Login Successful");
            setOpen(false);
            setLoginShow(false);
          }
        })
        .catch((err) => {
          if (err.response) {
            notify("loginError", err.response.data.msg);
          }
        });
    } else {
      notify("loginError", "Recaptcha is Required");
    }
  };

  const registerFormSubmit = (data) => {
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
          notify("loginError", res.data.msg);
          // history.push("/verify");
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
    <header className={`${x.join(" ")} verifyNav`}>
      {/* {userRole === "admin" ? (
        <a className="logo" href="/adminDashboard">
          <img className="logo logoClass" alt="logo" height="36" />{" "} 
        </a>
      ) : (
         <a className="logo" href="/dashboard#">
           <img className="logo logoClass" alt="logo" height="36" />{" "}
        </a>
      )} */}

      {/* once we have API to send the logo from store settings, make condition if there is a logo from the backend use that, otherwis use this deafult image */}
      {(userRole == "client" ||
        userRole == "owner" ||
        userRole === undefined) && (
        <div className="logoAndTitle">
          <a href="/">
            <img className="storeLogo" src={"https://" + storeLogo} />
          </a>
          <p onClick={() => redirectToHome()}>{storeName}</p>
        </div>
      )}

      <nav className="navigation">
        <ul>
          <NavLinkWrapper>
            {(userRole == "client" ||
              userRole == "owner" ||
              userRole === undefined) && (
              <a href="/balloon/home" className="header__marketplace">
                Marketplace
              </a>
            )}
            {userRole == "client" && balloonUserToken && (
              <a href="/balloon/collection" className="header__mycollection">
                My Collection
              </a>
            )}
            {!ownerToken && !balloonUserToken && (
              <a className="" onClick={() => history.push("/userlogin")}>
                Login
              </a>
            )}

            {open && (
              <Modal
                open={open}
                toggle={setOpen}
                modalClass="modalBackgroundColor"
              >
                <img className="loginLogo" src={ModalLogo} />

                <form onSubmit={handleSubmit(loginFormSubmit)}>
                  <div className="form-group mb-4">
                    <div className="row mb-5 mr-5 ml-5 loginFormCtn">
                      <div className="innerLogin">
                        <div className="input-container">
                          <i className="fa fa-user icon"></i>
                          <input
                            name="email"
                            type="text"
                            placeholder="User ID"
                            {...register("email")}
                            className={`input-field ${
                              errors.email ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback mb-3">
                          {errors.email?.message}
                        </div>
                        <div className="input-container">
                          <i className="fa fa-lock icon"></i>
                          <input
                            placeholder="Password"
                            name="password"
                            type="password"
                            {...register("password")}
                            className={`input-field ${
                              errors.password ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback mb-3">
                          {errors.password?.message}
                        </div>
                        <ReCAPTCHA
                          sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
                          data-size="compact"
                          // theme="dark"
                          required={true}
                          render="explicit"
                          // hl={"ja"}
                          onChange={onChange}
                          // onChange={useCallback(() => setDisableSubmit(false))}
                          className={`mb-4 ${
                            errors.recaptcha ? "is-invalid" : ""
                          }`}
                        />
                        <div className="invalid-feedback">
                          {errors.recaptcha?.message}
                        </div>

                        <button
                          className="btn btn-primary w-100 mb-4"
                          type="submit"
                        >
                          LOGIN{" "}
                        </button>
                        <div className="float-container mb-5">
                          <div className="float-child black">
                            <label>
                              <input
                                type="checkbox"
                                defaultChecked={checked}
                                onChange={() => setChecked(!checked)}
                              />
                              Remember Me
                            </label>
                          </div>

                          <div className="float-child">
                            <a className="blueColor" href="#">
                              Forgot Password
                            </a>
                          </div>
                        </div>
                        <button
                          className="btn btn-secondary w-100 mb-5"
                          type="button"
                          onClick={() => setSignupOpen()}
                        >
                          CREATE NEW ACCOUNT{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </Modal>
            )}
            {!ownerToken && !balloonUserToken && (
              <a className="" onClick={() => history.push("/userSignup")}>
                Register
              </a>
            )}

            {signupOpen && (
              <Modal
                open={signupOpen}
                toggle={setSignupOpen}
                modalClass="modalBackgroundColor"
                style={modalStyle}
                backdropColor={"green"}
                backdropOpacity={1}
                animationType={"slide"}
              >
                <img className="loginLogo" src={ModalLogo} />

                <form onSubmit={handleSubmit2(registerFormSubmit)}>
                  <div className="form-group mb-4">
                    <div className="row mb-5 mr-5 ml-5 loginFormCtn">
                      <div className="innerLogin">
                        <div className="input-container">
                          <input
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            {...register2("firstName")}
                            className={`input-field ${
                              errors2.firstName ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback">
                          {errors2.firstName?.message}
                        </div>
                        <div className="input-container">
                          <input
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            {...register2("lastName")}
                            className={`input-field ${
                              errors2.lastName ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback">
                          {errors2.lastName?.message}
                        </div>
                        <div className="input-container">
                          <input
                            name="email"
                            type="text"
                            placeholder="Email"
                            {...register2("email")}
                            className={`input-field ${
                              errors2.email ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback">
                          {errors2.email?.message}
                        </div>
                        <div className="input-container">
                          <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            {...register2("password")}
                            className={`input-field ${
                              errors2.password ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback">
                          {errors2.password?.message}
                        </div>
                        <div className="input-container">
                          <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            {...register2("confirmPassword")}
                            className={`input-field ${
                              errors2.confirmPassword ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                        <div className="invalid-feedback">
                          {errors2.confirmPassword?.message}
                        </div>
                        <ReCAPTCHA
                          sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
                          data-size="compact"
                          // theme="dark"
                          required={true}
                          render="explicit"
                          // hl={"ja"}
                          onChange={onCollectorChange}
                          // onChange={useCallback(() => setDisableSubmit(false))}
                          className={`mb-4 ${
                            errors.recaptcha ? "is-invalid" : ""
                          }`}
                        />
                        <div className="invalid-feedback">
                          {errors.recaptcha?.message}
                        </div>
                        <button
                          className="btn btn-primary w-100 mb-4"
                          type="submit"
                        >
                          REGISTER{" "}
                        </button>
                        <button
                          className="btn btn-secondary w-100"
                          type="button"
                          onClick={() => {
                            cancelModal();
                          }}
                        >
                          LOGIN
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </Modal>
            )}
          </NavLinkWrapper>
          {(balloonUserToken || ownerToken) && (
            <li style={{ width: 60 }}>
              <div className="nav-link">
                <div className="dropdown">
                  <i class="fa fa-solid fa-bars" data-toggle="dropdown"></i>

                  <div className="dropdown-menu">
                    {!cookies.get("profilePicture") ||
                    cookies.get("profilePicture").indexOf("undefined") !== -1 ||
                    cookies.get("profilePicture") === "" ? (
                      <img
                        src={defaultUser}
                        className="user-1 mr-5"
                        alt="user"
                      />
                    ) : (
                      <img
                        src={cookies.get("profilePicture")}
                        className="user-1 mr-5"
                        alt="user"
                      />
                    )}
                    {balloonUserToken && (
                      <span className="">
                        {cookies.get("firstname") +
                          " " +
                          cookies.get("lastname")}
                      </span>
                    )}

                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/balloonSettings">
                        Store Settings
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/dashboard">
                        Dashboard
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/balloon/owner/wallet">
                        Wallet
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/balloon/orders">
                        Orders
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/balloon/deliveries">
                        Items To Deliver
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/balloon/reports">
                        Reports
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/balloon/discountCode">
                        Discount Code
                      </a>
                    )}
                    {userRole === "client" && (
                      <a className="dropdown-item" href="/user/profile">
                        Profile
                      </a>
                    )}
                    {userRole === "client" && (
                      <a
                        className="dropdown-item"
                        href="/balloon/user/passwordUpdate"
                      >
                        Change Password
                      </a>
                    )}
                    {(balloonUserToken || ownerToken) && (
                      <li>
                        <a onClick={logout}>
                          <span className="dropdown-item">Logout</span>
                        </a>
                      </li>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
export default Header;

const NavLinkWrapper = styled.li`
  margin-right: 20px;
  &&& a {
    margin: 0px 25px;
    font-family: "Aileron Reguler";
    font-size: 16px;
    line-height: 1.14;
    letter-spacing: 1px;
    color: #fff;
    font-weight: 600;
  }
  @media screen and (max-width: 800px) {
    transform: translateX(25px);
    margin-right: 0;
  }
`;
