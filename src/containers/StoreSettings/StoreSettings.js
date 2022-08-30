import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Orders from "../../components/Orders/Orders";
import HeaderBanner from "../../components/MartplaceHeader/HeaderBanner";
import { env } from "../../constants";
import { APIs } from "../../assets/MarketplaceAPIEndpoints";
import Cookies from "universal-cookie";
import Moment from "moment";
import { toast } from "react-toastify";
import UploadLogo from "../../components/StoreSettings/UploadLogo";

import UploadBanner from "../../components/StoreSettings/UploadBanner";
import axios from "axios";

const StoreSettings = () => {
  const cookies = new Cookies();
  const [generalSelected, setGeneralSelected] = useState(true);
  const [ordersSelected, setOrdersSelected] = useState(false);
  const [walletSelected, setWalletSelected] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [changePasswordSelected, setChangePasswordSelected] = useState(false);
  const [userID, setUserID] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [bannerDetails, setBannerDetails] = useState("");
  const [loader, setLoader] = useState(false);
  const [storeDetails, setStoreDetails] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [storeOpeningDateDisplay, setStoreOpeningDateDisplay] = useState("");
  const [storeEndingDateDisplay, setStoreEndingDateDisplay] = useState("");
  const [couponExpiryDisplay, setCouponExpiryDisplay] = useState(new Date());
  const [couponExpiryDate, setCouponExpiryDate] = useState(new Date());
  const [storeUsername, setStoreUsername] = useState("");
  const userId = cookies.get("userId");
  const token = cookies.get("response");

  const authToken = "Bearer " + token;
  const [promo, setPromo] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const handlePromo = (e) => {
    setPromo(e.target.value);
  };
  const handlePromoCode = (e) => {
    setPromoCode(e.target.value);
  };
  const firstName = cookies.get("firstname");

  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    } else if (type === "dashError") {
      toast(text, {
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        autoClose: false,
      });
    }
  };

  const handleSettingSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("logo", storeLogo);
    formData.append("banner", banner);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    setLoader(true);
    //API request to update the store settings
    fetch(
      env.apiUrl +
        APIs.updateStore +
        `userId=${cookies.get(
          "userId"
        )}&title=${title}&description=${description}&contact=${contact}&banner_details=${bannerDetails}&store_details=${storeDetails}&store_opening_date=${storeOpeningDate}&store_ending_date=${storeEndingDate}`,
      requestOptions
    ).then((res) => {
      setLoader(false);
      notify("loginError", "Store Details Updated Successfully");
    });
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
      env.apiUrl + `api/users/getUserProfile?userId=${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        setTitle(result.data.title);
        setBannerDetails(result.data.banner_details);
        setStoreDetails(result.data.store_details);
        setContact(result.data.contact);

        setStoreLogo("https://" + result.data.logo);
        setBanner("https://" + result.data.banner);
        const date = new Date();
        const offset = date.getTimezoneOffset() * 60000;

        let countdownTimestampMsOpening =
          Date.parse(result.data.store_opening_date) + offset;
        setStoreOpeningDateDisplay(countdownTimestampMsOpening);

        let countdownTimestampMsEnding =
          Date.parse(result.data.store_ending_date) + offset;
        setStoreEndingDateDisplay(countdownTimestampMsEnding);
      })
      .catch((error) => console.log("error", error));

    //call second API to get users profile picture
    //getUserProfilePicture();
  };

  const headers2 = {
    "Content-Type": "application/json",
    Authorization: authToken,
  };
  const storeUsernameData = {
    userId: cookies.get("userId"),
    username: storeUsername,
  };
  const updateStoreUsername = () => {
    if (storeUsername.length > 0) {
      axios
        .post(env.apiUrl + `api/users/setUsername`, storeUsernameData, {
          headers: headers2,
        })
        .then((res) => {
          notify("loginError", res.data.msg);
        });
    }
  };
  useEffect(() => {
    getStoreLogoBanner();
  }, [loader]);

  return (
    <Wrapper>
      <Header />
      <HeaderBanner type="Home&Settings" />
      <SettingsContainer>
        <nav className="navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-light secondHeader">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item" key="allCerts">
                  <a
                    href="/marketplaceSettings"
                    className={
                      generalSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    GENERAL
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    href="/marketplace/orders"
                    className={
                      ordersSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    ORDERS
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    href="/marketplace/deliveries"
                    className={
                      deliverySelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    ITEMS TO DELIVER
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    href="/marketplace/owner/wallet"
                    className={
                      walletSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    WALLET
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    href="/marketplace/owner/change-password"
                    className={
                      changePasswordSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    PASSWORD
                  </a>
                </li>
              </ul>
              <UpdateChangesButton type="submit" form="storeSettingsForm">
                UPDATE CHANGES
              </UpdateChangesButton>
            </div>
          </div>
        </nav>
        {!loader && (
          <>
            <div>
              <div className="form-group form-group--store-settings ml-2">
                <label>Store Username</label>
                <div style={{ display: "flex" }} className="col-md-6 ml-5">
                  <input
                    className="form-control"
                    placeholder="Enter Username of your store"
                    onChange={(e) => setStoreUsername(e.target.value)}
                  ></input>
                  <button
                    type="button"
                    onClick={() => updateStoreUsername()}
                    className="btn btn-primary w-auto ml-3"
                  >
                    Update Username
                  </button>
                </div>
              </div>
            </div>
            <FormWrapper>
              <SettingsForm
                id="storeSettingsForm"
                onSubmit={handleSettingSubmit}
              >
                <div className="form-group form-group--store-settings">
                  <LabelInputWraper>
                    <label>Store Name</label>
                    <input
                      id="store-name"
                      className="form-control"
                      placeholder="Enter name of your store"
                      onChange={(e) => setStoreDetails(e.target.value)}
                      value={storeDetails}
                    ></input>
                  </LabelInputWraper>
                  <LabelInputWraper>
                    <label>Title</label>
                    <input
                      id="title"
                      className="form-control"
                      placeholder="Enter headline of your home page"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    ></input>
                  </LabelInputWraper>
                  <LabelInputWraper>
                    <label>Banner Details</label>
                    <textarea
                      className="form-control"
                      placeholder="Short description of your store"
                      onChange={(e) => setBannerDetails(e.target.value)}
                      style={{ height: "111px" }}
                      value={bannerDetails}
                    ></textarea>
                  </LabelInputWraper>
                  <LabelInputWraper>
                    <label>Contact Us</label>
                    <input
                      id="contact"
                      className="form-control"
                      placeholder="Enter Headline of your contact form"
                      onChange={(e) => setContact(e.target.value)}
                      value={contact}
                    ></input>
                  </LabelInputWraper>
                  <LabelInputWraper>
                    <label>Store Open Date&Time</label>
                    <input
                      className="form-control datetime"
                      type="datetime-local"
                      onChange={(e) => {
                        setStoreOpeningDate(e.target.value);
                        setStoreOpeningDateDisplay(e.target.value);
                      }}
                    ></input>
                    <p>
                      {Moment(storeOpeningDateDisplay).format(
                        "ddd. MMM DD, YYYY,  h:mm a"
                      )}
                    </p>
                  </LabelInputWraper>
                  <LabelInputWraper>
                    <label>Store End Date&Time</label>
                    <input
                      className="form-control datetime"
                      type="datetime-local"
                      onChange={(e) => {
                        setStoreEndingDate(e.target.value);
                        setStoreEndingDateDisplay(e.target.value);
                      }}
                    ></input>
                    <p>
                      {Moment(storeEndingDateDisplay).format(
                        "ddd. MMM DD, YYYY,  h:mm a"
                      )}
                    </p>
                  </LabelInputWraper>
                </div>
              </SettingsForm>

              <ImageUploadWrapper>
                <UploadLogo setStoreLogo={setStoreLogo} storeLogo={storeLogo} />
                <UploadBanner setBanner={setBanner} banner={banner} />
              </ImageUploadWrapper>
            </FormWrapper>
          </>
        )}

        {loader && (
          <LoaderContainer>
            <div class="spinner-border text-dark" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </LoaderContainer>
        )}
      </SettingsContainer>
    </Wrapper>
  );
};

export default StoreSettings;

const Wrapper = styled.div`
  background-color: #fff;
  font-family: "Aileron Reguler";
  width: 100%;
  height: 100vh;
`;
const SettingsContainer = styled.div`
  background-color: #fff;
  #navbarTogglerDemo01 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 40px;
    background-color: #f5f3f5;
  }
  .spinner-border {
    margin: 0 auto;
    margin-top: 100px;
  }

  .container-fluid {
    padding: 0;
  }

  .Line-Copy-6 {
    height: 24px;
    margin-top: 8px;
  }

  .nav-link {
    padding: 0;
  }

  .nav-item .active {
    color: #3e4ef1 !important;
  }

  .navbar-nav {
    padding-left: 50px;
  }
`;

const Options = styled.nav`
  height: 50px;
  width: 100%;
  background-color: #fff;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  &&& a {
    font-family: "Aileron Reguler";
    color: black;
    text-decoration: none;
    padding: 0 37.5px;
  }
`;

const UpdateChangesButton = styled.button`
  font-size: 14px;
  width: 201px;
  height: 50px;
  color: white;
  background-color: #3e4ef1;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  display: flex;
  column-gap: 40px;
  color: black;
  text-align: left;
  margin: 130px auto;
  width: 80%;
  padding-bottom: 100px;
`;

const SettingsForm = styled.form`
  /* width: 320px; */
  margin-right: 30px;

  .form-group--store-settings {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
`;

const LabelInputWraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 10px;
  position: relative;

  label {
    font-weight: 600;
    color: #545454;
    letter-spacing: 0.5px;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 10px;
  }

  input {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-bottom: 8px;
  }

  input.datetime {
    color: transparent;
    cursor: pointer;
  }
  input.datetime:focus {
    color: transparent !important;
    opacity: 0;
  }
  input.datetime::-webkit-inner-spin-button,
  input.datetime::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  p {
    color: #545454;
    margin: 0;
    position: absolute;
    top: 40px;
    left: 10px;
    height: 30%;
    z-index: 10;
  }

  textarea {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-bottom: 8px;
    width: 388px;
  }

  #title,
  #store-name {
    width: 388px;
  }

  #contact {
    width: 388px;
  }
`;

const ImageUploadWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  width: 520px;
  row-gap: 30px;
`;
