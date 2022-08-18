import React, { useState, useEffect } from "react";
import { env } from "./constants/index";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Login from "./containers/Login";
import ForgotPassword from "./containers/ForgotPassword";
import ResetPassword from "./containers/ResetPassword";
import Register from "./containers/Register";
import Dashboard from "./containers/Dashboard";
import VerifyEmail from "./containers/VerifyEmail";
import VerifyCert from "./containers/VerifyCert";
import CreateCert from "./containers/CreateCert";
import ViewCert from "./containers/ViewCert";
import Wallet from "./containers/Wallet";
import Cookies from "universal-cookie";
import Settings from "./containers/Settings";
import TransactionHistory from "./containers/TransactionHistory";
import ViewSingleCert from "./containers/ViewSingleCert";
import AdminDashboard from "./containers/AdminDashboard";
import AdminTransHistory from "./containers/AdminTransHistory";
import UploadKyc from "./containers/UploadKyc";
import StoreSettings from "./containers/StoreSettings/StoreSettings";
import AdminOrders from "./containers/AdminOrders/AdminOrders";
import BalloonStore from "./containers/Balloon/BalloonStore";
import LandingPage from "./containers/LandingPage/LandingPage";
import BuyNow from "./containers/BuyNow";
import BalloonCollection from "./containers/Balloon/BalloonCollection";
import AdminWallet from "./containers/AdminWallet/AdminWallet";
import UserProfileContainer from "./containers/UserProfile/UserProfileContainer";
import AdminChangePasswordContainer from "./containers/AdminChangePassword/AdminChangePasswordContainer";
import HomeViewCert from "./containers/Balloon/ViewCert";
import Checkout from "./containers/Checkout";
import UserPasswordChangeContainer from "./containers/UserPasswordChange/UserPasswordChangeContainer";
import CollectionViewCert from "./containers/Balloon/BalloonCollection/ViewCert";
import PostCheckout from "./containers/PostCheckout";
import Signup from "./containers/BalloonAuthentication/Signup";
import FaqPage from "./containers/Faq";
import Forgot from "./containers/BalloonAuthentication/Forgot";
import Reset from "./containers/BalloonAuthentication/Reset";
import Signin from "./containers/BalloonAuthentication/Signin";
import UserVerifyEmail from "./containers/BalloonAuthentication/UserVerifyEmail";
import Logout from "./containers/logout/logout";
import Collectibles from "./containers/Collectibles";
import { compose } from "redux";
import moment from "moment";
import Delivery from "./containers/AdminDelivery";
import Reports from "./containers/Reports";
import DiscountCode from "./containers/DiscountCode";
import FractionNft from "./containers/FractionNft";
import Ticket from "./containers/Ticket";
import SuceessFractionNft from "./containers/FractionNft/successFraction";

function App() {
  const cookies = new Cookies();
  const [userId] = useState(cookies.get("userId"));
  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(true);

  const checkIsBetween = () => {
    const d = new Date();

    const date = new Date();
    // const offset = date.getTimezoneOffset() * 60000;
    const dx = Date.parse(d);

    const isTimeBetween = moment(dx).isBetween(
      storeOpeningDate,
      storeEndingDate
    ); // true

    if (isTimeBetween) {
      setStoreOpen(true);
    } else {
      setStoreOpen(false);
    }
    console.log(
      "between",
      isTimeBetween,
      dx,
      storeOpeningDate,
      storeEndingDate
    );
  };

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
        const date = new Date();
        const offset = date.getTimezoneOffset() * 60000;

        let countdownTimestampMsOpening =
          Date.parse(result.data.store_opening_date) + offset;
        setStoreOpeningDate(countdownTimestampMsOpening);

        let countdownTimestampMsEnding =
          Date.parse(result.data.store_ending_date) + offset;
        setStoreEndingDate(countdownTimestampMsEnding);

        // checkbetween

        // const offset = date.getTimezoneOffset() * 60000;
        const dx = Date.parse(date);
        const isTimeBetween = moment(dx).isBetween(
          countdownTimestampMsOpening,
          countdownTimestampMsEnding
        ); // true

        if (isTimeBetween) {
          setStoreOpen(true);
        } else {
          setStoreOpen(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getStoreLogoBanner();
  }, []);
  // useEffect(() => {
  //   checkIsBetween();
  // }, [storeEndingDate, storeOpeningDate]);

  return (
    <div className={`${!storeOpen ? "store__closed" : "store__open"}`}>
      <Router>
        <div className="App">
          <div className="">
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/login" exact={true}>
                <Login />
              </Route>
              <Route path="/logout" exact={true}>
                <Logout />
              </Route>
              <Route path="/forgotPassword" exact={true}>
                <ForgotPassword />
              </Route>
              <Route path="/resetPassword" exact={true}>
                <ResetPassword />
              </Route>
              <Route path="/register" exact={true}>
                <Register />
              </Route>
              <Route path="/verify" exact={true}>
                <VerifyEmail />
              </Route>
              <Route path="/verifyCert" exact={true}>
                <VerifyCert />
              </Route>
              <Route path="/dashboard" exact={true}>
                <Dashboard />
              </Route>
              <Route path="/createCert" exact={true}>
                <CreateCert />
              </Route>
              <Route path="/viewCert" exact={true}>
                <ViewCert />
              </Route>
              <Route path="/ticket" exact={true}>
                <Ticket />
              </Route>
              <Route path="/viewSingleCert" exact={true}>
                <ViewSingleCert />
              </Route>
              <Route path="/wallet" exact={true}>
                <Wallet />
              </Route>
              <Route path="/settings" exact={true}>
                <Settings />
              </Route>
              <Route path="/balloon/owner/change-password" exact={true}>
                <AdminChangePasswordContainer />
              </Route>
              <Route path="/user/profile" exact={true}>
                <UserProfileContainer />
              </Route>
              <Route path="/transactionHistory" exact={true}>
                <TransactionHistory />
              </Route>
              <Route path="/adminDashboard" exact={true}>
                <AdminDashboard />
              </Route>
              <Route path="/adminHistory" exact={true}>
                <AdminTransHistory />
              </Route>
              <Route path="/uploadKyc" exact={true}>
                <UploadKyc />
              </Route>
              <Route path="/balloonSettings" exact={true}>
                <StoreSettings />
              </Route>
              <Route path="/balloon/orders" exact={true}>
                <AdminOrders />
              </Route>
              <Route path="/balloon/deliveries" exact={true}>
                <Delivery />
              </Route>
              <Route path="/balloon/reports" exact={true}>
                <Reports />
              </Route>
              <Route path="/balloon/discountCode" exact={true}>
                <DiscountCode />
              </Route>
              <Route path="/balloon/owner/wallet" exact={true}>
                <AdminWallet />
              </Route>
              <Route path="/balloon/user/passwordUpdate" exact={true}>
                <UserPasswordChangeContainer />
              </Route>
              <Route path="/" exact={true}>
                <LandingPage />
              </Route>
              <Route path="/balloon/collection/viewCert" exact={true}>
                <CollectionViewCert />
              </Route>
              <Route exact path="/balloon/home">
                <BalloonStore />
              </Route>
              <Route exact path="/balloon/collection">
                <BalloonCollection />
              </Route>
              <Route exact path="/balloon/viewCert">
                <HomeViewCert />
              </Route>
              <Route exact path="/checkout">
                <Checkout />
              </Route>
              <Route path="/userLogin" exact={true}>
                <Signin />
              </Route>
              <Route path="/userSignup" exact={true}>
                <Signup />
              </Route>
              <Route path="/userVerifyEmail" exact={true}>
                <UserVerifyEmail />
              </Route>
              <Route path="/userForgotPassword" exact={true}>
                <Forgot />
              </Route>
              <Route path="/userResetPassword" exact={true}>
                <Reset />
              </Route>
              <Route path="/balloon/admin" exact={true}>
                <Dashboard />
              </Route>
              <Route path="/post-checkout" exact={true}>
                <PostCheckout />
              </Route>
              <Route path="/faq" exact={true}>
                <FaqPage />
              </Route>
              <Route path="/collectibles" exact={true}>
                <Collectibles />
              </Route>
              <Route path="/fractionalize" exact={true}>
                <FractionNft />
              </Route>
              <Route path="/successfractionalize" exact={true}>
                <SuceessFractionNft />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
  // }
}

export default App;
