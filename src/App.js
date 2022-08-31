import React, { useState, useEffect } from "react";
import { env } from "./constants/index";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./containers/Dashboard";
import VerifyEmail from "./containers/VerifyEmail";
import CreateCert from "./containers/CreateCert";
import ViewCert from "./containers/ViewCert";
import StoreSettings from "./containers/StoreSettings/StoreSettings";
import AdminOrders from "./containers/AdminOrders/AdminOrders";
import MarketplaceStore from "./containers/Marketplace/MarketplaceStore";
import LandingPage from "./containers/LandingPage/LandingPage";
import MarketplaceCollection from "./containers/Marketplace/MarketplaceCollection";
import UserProfileContainer from "./containers/UserProfile/UserProfileContainer";
import AdminChangePasswordContainer from "./containers/AdminChangePassword/AdminChangePasswordContainer";
import HomeViewCert from "./containers/Marketplace/ViewCert";
import UserPasswordChangeContainer from "./containers/UserPasswordChange/UserPasswordChangeContainer";
import CollectionViewCert from "./containers/Marketplace/MarketplaceCollection/ViewCert";
import Signup from "./containers/MarketplaceAuthentication/Signup";
import Forgot from "./containers/MarketplaceAuthentication/Forgot";
import Reset from "./containers/MarketplaceAuthentication/Reset";
import Signin from "./containers/MarketplaceAuthentication/Signin";
import UserVerifyEmail from "./containers/MarketplaceAuthentication/UserVerifyEmail";
import Logout from "./containers/logout/logout";
import moment from "moment";
import Delivery from "./containers/AdminDelivery";

function App() {
  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(true);


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
        const date = new Date();
        const offset = date.getTimezoneOffset() * 60000;

        let countdownTimestampMsOpening =
          Date.parse(result.data.store_opening_date) + offset;
        setStoreOpeningDate(countdownTimestampMsOpening);

        let countdownTimestampMsEnding =
          Date.parse(result.data.store_ending_date) + offset;
        setStoreEndingDate(countdownTimestampMsEnding);


        const dx = Date.parse(date);
        const isTimeBetween = moment(dx).isBetween(
          countdownTimestampMsOpening,
          countdownTimestampMsEnding
        );

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

  return (
    <div className={`${!storeOpen ? "store__closed" : "store__open"}`}>
      <Router>
        <div className="App">
          <div className="">
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>

              <Route path="/logout" exact={true}>
                <Logout />
              </Route>
              <Route path="/marketplace/user/passwordUpdate" exact={true}>
                <UserPasswordChangeContainer />
              </Route>
              <Route path="/marketplace/owner/change-password" exact={true}>
                <AdminChangePasswordContainer />
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
              <Route path="/verify" exact={true}>
                <VerifyEmail />
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
              <Route path="/user/profile" exact={true}>
                <UserProfileContainer />
              </Route>
              <Route path="/marketplaceSettings" exact={true}>
                <StoreSettings />
              </Route>
              <Route path="/marketplace/orders" exact={true}>
                <AdminOrders />
              </Route>
              <Route path="/marketplace/deliveries" exact={true}>
                <Delivery />
              </Route>
              <Route path="/marketplace/collection/viewCert" exact={true}>
                <CollectionViewCert />
              </Route>
              <Route exact path="/marketplace/home">
                <MarketplaceStore />
              </Route>
              <Route exact path="/marketplace/collection">
                <MarketplaceCollection />
              </Route>
              <Route exact path="/marketplace/viewCert">
                <HomeViewCert />
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
