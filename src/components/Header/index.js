import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import "./index.css";
import styled from "styled-components";
import defaultUser from "../../assets/images/defaultUser.png";
import useToggle from "../../components/Modal/useToggle";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import Moment from "moment";
import { env } from "../../constants";
import { toast } from "react-toastify";

function Header() {
  const cookies = new Cookies();
  const history = useHistory();
  const userRole = cookies.get("userRole");
  const [open, setOpen] = useToggle(false);
  const [loginShow, setLoginShow] = useState(true);
  const [profilePicture, setProfilePicture] = useState("");
  let userToken = cookies.get("userToken");
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
    setLoginShow(true);
    cookies.remove("userToken", { path: "/" });
    cookies.remove("response", { path: "/" });
    cookies.remove("userId", { path: "/" });
    cookies.remove("firstname", { path: "/" });
    cookies.remove("lastname", { path: "/" });
    cookies.remove("userRole", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("profilePicture", { path: "/" });
    cookies.remove("username", { path: "/" });
    sessionStorage.clear();
    history.push("/");


    return false;
  };

  const [storeLogo, setStoreLogo] = useState("");
  const [storeName, setStoreName] = useState("");

  const getStoreLogoBanner = () => {
    let myHeaders = new Headers();
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

  const cancelModal = () => {
    // setType("");
    // setname("");
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
    const userLoggedIn = cookies.get("userToken");
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
              history.push("/userVerifyEmail");
            }
          } else if (res.data.status === true) {
            setProfilePicture(res.data.data.logo);
            //remove cookies old data
            cookies.remove("userToken", { path: "/" });
            cookies.remove("response", { path: "/" });
            cookies.remove("userId", { path: "/" });
            cookies.remove("username", { path: "/" });
            cookies.remove("firstname", { path: "/" });
            cookies.remove("lastname", { path: "/" });
            cookies.remove("email", { path: "/" });
            cookies.remove("profilePicture", { path: "/" });

            // add new cookies

            cookies.set("userToken", res.data.token, {
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


  return (
    <header className={`${x.join(" ")} verifyNav`}>


      {(userRole == "client" ||
        userRole == "owner" ||
        userRole === undefined) && (
        <div className="logoAndTitle">

        </div>
      )}

      <nav className="navigation">
        <ul>
          <NavLinkWrapper>
            {(userRole == "client" ||
              userRole == "owner" ||
              userRole === undefined) && (
              <a href="/marketplace/home" className="header__marketplace">
                Marketplace
              </a>
            )}
            {userRole == "client" && userToken && (
              <a href="/marketplace/collection" className="header__mycollection">
                My Collection
              </a>
            )}
            {!ownerToken && !userToken && (
              <a className="" onClick={() => history.push("/userlogin")}>
                Login
              </a>
            )}

            {!ownerToken && !userToken && (
              <a className="" onClick={() => history.push("/userSignup")}>
                Register
              </a>
            )}

          </NavLinkWrapper>
          {(userToken || ownerToken) && (
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
                    {userToken && (
                      <span className="">
                        {cookies.get("firstname")}
                      </span>
                    )}

                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/marketplaceSettings">
                        Store Settings
                      </a>
                    )}
                    {userRole === "owner" && (
                      <a className="dropdown-item" href="/dashboard">
                        Dashboard
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
                        href="/marketplace/user/passwordUpdate"
                      >
                        Change Password
                      </a>
                    )}
                    {(userToken || ownerToken) && (
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
