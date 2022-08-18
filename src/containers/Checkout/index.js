import React, { useEffect, useMemo, useState } from "react";
import creditCard from "../../assets/images/storeFront/credit-card.svg";
import bitcoinLogo from "../../assets/images/storeFront/bitcoin-btc-logo.svg";

import { env } from "../../constants";
import { confirmAlert } from "react-confirm-alert";
import "./index.css";
import Header from "../../components/Header";
import Footer from "../../components/Common/Footer/Footer";
import { dataList } from "../../mock/cetificates";
import { countries } from "../../assets/countries";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import coinBaseLogo from "../../assets/images/storeFront/coinbase-logo.png";
import PriceConverter from "../../components/PriceConvert";
// import StripeCheckout from "react-stripe-checkout";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import moment from "moment";
import StoreClosed from "../../components/StoreClosed";
import { userID } from "../../constants/apiEndPoints";
    // const [promo, setPromo] = useState(null);
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "gray",
      color: "black",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      border: "1x solid black",
      "::placeholder": {
        color: "gray",
      },
    },
    invalid: {
      iconColor: "red",
      color: "red",
    },
  },
};
 
const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);
const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
}) => (
  <div className="FormRow">
    <label htmlFor={id} className="FormRowLabel">
      {label}
    </label>
    <input
      className="FormRowInput"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);

const ErrorMessage = ({ children }) => (
  <div className="ErrorMessage" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);
const useOptions = () => {
  const fontSize = 22;
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "black",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};
function alphaOnly(event) {
  var key = event.keyCode;
  return ((key >= 65 && key <= 90) || key == 8);
};
const ShippingForm = ({
  certificateArray,
  shippingDetails,
  setShippingDetails,
}) => {
  return (
    <>
      <input
        label="Name"
        id="name"
        type="text"
        required
        autoComplete="name"
        placeholder="Full Name"
        className="checkout__page-input"
        value={shippingDetails.name}
        onChange={(e) => {
          setShippingDetails({ ...shippingDetails, name: e.target.value });
        }}
      />
      <input
        label="Phone Number"
        id="phoneNumber"
        type="text"
        maxlength="12"
        required
        autoComplete="tel"
        placeholder="Phone Number"
        className="checkout__page-input"
        value={shippingDetails.phoneNumber}
        onChange={(e) => {
          setShippingDetails({
            ...shippingDetails,
            phoneNumber: e.target.value.replace(/\D/g, ""),
          });
        }}
      />
      <input
        label="Address"
        id="address"
        type="text"
        required
        autoComplete="street-address"
        placeholder="Address"
        className="checkout__page-input"
        value={shippingDetails.line1}
        onChange={(e) => {
          setShippingDetails({
            ...shippingDetails,
            line1: e.target.value,
          });
        }}
      />
      <input
        label="City"
        id="city"
        type="text"
        required
        autoComplete="address-level2"
        placeholder="City"
        className="checkout__page-input"
        value={shippingDetails.city}
        onChange={(e) => {
          setShippingDetails({
            ...shippingDetails,
            city: e.target.value.replace(/[^a-z]/gi, ""),
          });
        }}
      />
      <input
        label="Province"
        id="province"
        type="text"
        required
        autoComplete="address-level1"
        placeholder="Province"
        className="checkout__page-input"
        value={shippingDetails.province}
        onChange={(e) => {
          setShippingDetails({
            ...shippingDetails,
            province: e.target.value,
          });
        }}
      />
      <select
        label="Country"
        id="country"
        type="text"
        required
        autoComplete="country"
        placeholder="Country"
        className="checkout__page-select"
        value={shippingDetails.country}
        onChange={(e) => {
          setShippingDetails({
            ...shippingDetails,
            country: e.target.value,
          });
        }}
      >
        {countries.map((element) => {
          if (element.code == "US") {
            return (
              <option value={element.code} selected>
                {element.name}
              </option>
            );
          } else {
            return <option value={element.code}>{element.name}</option>;
          }
        })}
      </select>
      <input
        label="Postal Code"
        id="postal code"
        type="text"
        required
        autoComplete="postal-code"
        placeholder="Postal Code"
        className="checkout__page-input"
        value={shippingDetails.postal_code}
        onChange={(e) => {
          setShippingDetails({
            ...shippingDetails,
            postal_code: e.target.value,
          });
        }}
      />
    </>
  );
};
const PromoInput = ({
  certificateArray,
  shippingDetails,
  promo,
  setPromo,
  discountPercent,
  setDiscountPercent,
  discontCodevalid,
  setDiscountCodeValid
}) => {
  const cookies = new Cookies();
const handlePromo = (e) => {
  setPromo(e.target.value);
  if (e.target.value === "") {
    setDiscountPercent(0);
    setDiscountCodeValid(false);
  }
};
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
const discountCodeData = {
  discountCode: promo,
};
  const validatePromo = (e) => {
    if (promo != null && promo!="") {
      axios
        .post(env.apiUrl + `api/users/validateDiscountCode`, discountCodeData)
        .then((res) => {
          if (res.data.status === true) {
            //notify("loginError", res.data.msg);
            setDiscountCodeValid(true);
            notify("loginError", res.data.msg);
            setDiscountPercent(res.data.data.discountPercentage);
          } else if (res.data.status === false) {
            notify("loginError", res.data.msg);
            // alert(res.data.err.raw.message);
            setDiscountPercent(0);
            setDiscountCodeValid(false);

          } else if (res.data.status === "Fail") {
            const errCode = res.data.err.code;
            notify("loginError", "Error: " + errCode);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 403) {
              cookies.remove("response");
              notify("loginError", "Token is expired. Please try to login again");
            } else {
              const msg = error.response.data.msg;
              notify("loginError", error.response.data.msg);
              setDiscountPercent(0);
              setDiscountCodeValid(false);
            }
          }
        });
    }
};
  console.log("promo", promo, discountPercent)
    var percent = (discountPercent * 10) / 1000;
  return (
    <>
    <h5>Add Promo code</h5>
              <input
                type="text"
                placeholder="Enter Promo Code"
                className="form-control"
                onChange={handlePromo}
                onBlur={validatePromo}
                value={promo}
      />
      </>
  )
}
const CheckoutForm = ({
  certificateArray,
  shippingDetails,
  setShippingDetails,
  promo,
  setPromo
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(undefined);
  const history = useHistory();
  const [cert, setCert] = useState(dataList.data[0]);
  const options = useOptions();
  const params = new URL(window.location.href).searchParams;
  const certImageId = params.get("id");

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    // address: { line1: "", city:"", state:"", country:"", postal_code: '' }
    address: { postal_code: "" },
  });
  const [paymentMethod, setPaymentMethod] = useState({
    payByCredit: true,
    payByCrypto: false,
  });
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const notifyWithRefresh = (type, text) => {
    toast(text, {
      onClose: () => window.location.reload(false),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (recaptchaValue) {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      if (error) {
        elements.getElement("card").focus();
        return;
      }

      // if (cardComplete) {
      //   setProcessing(true);
      // }

      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: billingDetails,
      });

      setProcessing(false);

      if (payload.error) {
        setError(payload.error);
      } else {
        const cardElement = elements.getElement("card");

        if (certificateArray.type === "Digital art with merchandise") {
          stripe.createToken(cardElement).then((payload) => {
            const cookies = new Cookies();
            const token = cookies.get("balloonUserToken");
            const authToken = "Bearer " + token;
            const headers = {
              headers: {
                "content-type": "application/json",
                Authorization: authToken,
              },
            };
            const userId = cookies.get("userId");
            //  const userIDObj = {
            //    userId: userId,
            //  };
            const buyCertData = {
              stripeToken: payload.token.id,
              imageId: certImageId,
              userId: userId,
              fullName: shippingDetails.name,
              phoneNumber: shippingDetails.phoneNumber,
              address: shippingDetails.line1,
              city: shippingDetails.city,
              province: shippingDetails.province,
              country: shippingDetails.country,
              postalCode: shippingDetails.postal_code,
              discountCode: promo
            };
            setProcessing(true);
            axios
              .post(
                env.apiUrl + `api/users/buyCertificatewithshipping`,
                buyCertData,
                headers
              )
              .then((res) => {
                if (res.data.status === true) {
                  //notify("loginError", res.data.msg);
                  setProcessing(false);
                  setTimeout(() => {
                    history.push("/post-checkout");
                  }, 5000);
                } else if (res.data.status === false) {
                  setProcessing(false);
                  notify("loginError", res.data.msg);

                  // alert(res.data.err.raw.message);
                } else if (res.data.status === "Fail") {
                  const errCode = res.data.err.code;
                  notify("loginError", "Payment error: " + errCode);

                  setProcessing(false);
                  // alert(res.data.err.raw.message);
                }
              })
              .catch((error) => {
                setProcessing(false);
                if (error.response) {
                  if (error.response.status === 403) {
                    cookies.remove("response");
                    notify(
                      "loginError",
                      "Token is expired. Please try to login again"
                    );
                    history.push("/");
                    sessionStorage.clear();
                  } else {
                    const msg = error.response.data.msg;
                    if (msg.indexOf("equal") !== -1) {
                      setTimeout(() => {
                        setProcessing(false);
                        window.location.reload(false);
                      }, 3000);
                    } else {
                      setProcessing(false);
                      notifyWithRefresh("loginError", error.response.data.msg);
                    }
                  }
                }
              });
          });
        } else {
          stripe.createToken(cardElement).then((payload) => {
            const cookies = new Cookies();
            const token = cookies.get("balloonUserToken");
            const authToken = "Bearer " + token;
            const headers = {
              headers: {
                "content-type": "application/json",
                Authorization: authToken,
              },
            };
            const userId = cookies.get("userId");
            //  const userIDObj = {
            //    userId: userId,
            //  };
            const buyCertData = {
              stripeToken: payload.token.id,
              imageId: certImageId,
              userId: userId,
              discountCode: promo
            };
            setProcessing(true);
            axios
              .post(
                env.apiUrl + `api/users/buyCertificate`,
                buyCertData,
                headers
              )
              .then((res) => {
                if (res.data.status === true) {
                  //notify("loginError", res.data.msg);
                  setProcessing(false);
                  setTimeout(() => {
                    history.push("/post-checkout");
                  }, 5000);
                } else if (res.data.status === false) {
                  setProcessing(false);
                  notify("loginError", res.data.msg);

                  // alert(res.data.err.raw.message);
                } else if (res.data.status === "Fail") {
                  const errCode = res.data.err.code;
                  notify("loginError", "Payment error: " + errCode);

                  setProcessing(false);
                  // alert(res.data.err.raw.message);
                }
              })
              .catch((error) => {
                setProcessing(false);
                if (error.response) {
                  if (error.response.status === 403) {
                    cookies.remove("response");
                    notify(
                      "loginError",
                      "Token is expired. Please try to login again"
                    );
                    history.push("/");
                    sessionStorage.clear();
                  } else {
                    const msg = error.response.data.msg;
                    if (msg.indexOf("equal") !== -1) {
                      setTimeout(() => {
                        setProcessing(false);
                        window.location.reload(false);
                      }, 3000);
                    } else {
                      setProcessing(false);
                      notifyWithRefresh("loginError", error.response.data.msg);
                    }
                  }
                }
              });
          });
        }
      }
    } else {
      notify("loginError", "Recaptcha is Required");
    }
  };
  function onChange(value) {
    setRecaptchaValue(value);
  }
  return (
    <>
      <form className="Form" onSubmit={handleSubmit}>
        <div className="checkout__page__cd">
          <div className="checkout__page__cd-ctn">
            <input
              label="Name"
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Cardholder Name"
              className="checkout__page-input"
              value={billingDetails.name}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, name: e.target.value });
              }}
            />
            <div className="checkout__page__cd-ctn">
              <CardField
                className="cardClass"
                onChange={(e) => {
                  setError(e.error);
                  setCardComplete(e.complete);
                }}
              />
            </div>
            <h5>Shipping Info</h5>
            {certificateArray.type === "Digital art with merchandise" && (
              <ShippingForm
                certificateArray={certificateArray}
                shippingDetails={shippingDetails}
                setShippingDetails={setShippingDetails}
              />
            )}

            {error && <ErrorMessage>{error.message}</ErrorMessage>}
            <ReCAPTCHA
              sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
              data-size="compact"
              // theme="dark"
              required={true}
              render="explicit"
              onChange={onChange}
              // onChange={useCallback(() => setDisableSubmit(false))}
            />
            <div className="invalid-feedback"></div>
            {paymentMethod.payByCredit && (
              <SubmitButton
                processing={processing}
                error={error}
                disabled={!stripe}
                className="btn btn-primary"
                id="btnSubmit"
              >
                PAY BY CARD
              </SubmitButton>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

const stripePromise = loadStripe(env.stripeKey);

function Checkout() {
  const [certificateArray, setcerticateArray] = useState({});
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    phoneNumber: "",
    line1: "",
    city: "",
    province: "",
    country: "US",
    postal_code: "",
  });
  const [promo, setPromo] = useState(null);
  const [discountPercent, setDiscountPercent] = useState("");
  const [discontCodevalid, setDiscountCodeValid]=useState(false);
  // const [hostedUrl, setHostedUrl] = useState('');
  // const [imageExt, setImageExt] = useState('');
  const [paymentMethod, setPaymentMethod] = useState({
    payByCredit: true,
    payByCrypto: false,
  });

  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(null);

  const checkIsBetween = (openingDate, endingDate) => {
    const d = new Date();

    const date = new Date();
    // const offset = date.getTimezoneOffset() * 60000;
    const dx = Date.parse(d);

    const isTimeBetween = moment(dx).isBetween(openingDate, endingDate); // true

    if (isTimeBetween) {
      setStoreOpen(true);
    } else {
      setStoreOpen(false);
    }
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

        checkIsBetween(countdownTimestampMsOpening, countdownTimestampMsEnding);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getStoreLogoBanner();
  }, []);
  // useEffect(() => {
  //   checkIsBetween();
  // }, [storeEndingDate, storeOpeningDate]);

  const cookies = new Cookies();
  const params = new URL(window.location.href).searchParams;
  const certImageId = params.get("id");
  const userId = cookies.get("userId");
  const userName = cookies.get("username");
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const [recaptchaValue2, setRecaptchaValue2] = useState(null);
  const ids = window.location.href.split("?id=")[1];
  const imgId = JSON.stringify({
    imageId: ids,
  });

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const headers = {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: authToken,
    },
  };
  useEffect(() => {
    axios
      .post(env.apiUrl + `api/users/getFilesById`, imgId, headers)
      .then((res) => {
        setcerticateArray(res.data.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            Cookies.remove("response");
            sessionStorage.clear();
            notify("loginError", "Token is expired. Please try to login again");
            //   history.push("/");
          }
        }
      });
  }, []);

  const certheaders = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };

  const handlePayByCoinbase = (event) => {
    if (recaptchaValue2) {
      if (certificateArray.type === "Digital art with merchandise") {
        const cookies = new Cookies();
        const token = cookies.get("balloonUserToken");
        const authToken = "Bearer " + token;
        const headers = {
          headers: {
            "content-type": "application/json",
            Authorization: authToken,
          },
        };
        const userId = cookies.get("userId");
        const data = {
          userId: userId,
          imageId: certImageId,
          fullName: shippingDetails.name,
          phoneNumber: shippingDetails.phoneNumber,
          address: shippingDetails.line1,
          city: shippingDetails.city,
          province: shippingDetails.province,
          country: shippingDetails.country,
          postalCode: shippingDetails.postal_code,
          discountCode: promo
        };
        axios
          .post(
            env.apiUrl + `api/users/createChargewithshipping`,
            data,
            headers
          )
          .then((res) => {
            console.log("list item data returned", res.data);
            //setHostedUrl(res.data.hosted_url);
            window.location.href = res.data.hosted_url;
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        const data = {
          userId: userId,
          imageId: certImageId,
          discountCode: promo,
        };
        axios
          .get(
            env.apiUrl +
            `api/users/createCharge?userId=${userID}&imageId=${certImageId}&discountCode=${promo}`,
            certheaders
          )
          .then((res) => {
            console.log("list item data returned", res.data);
            //setHostedUrl(res.data.hosted_url);
            window.location.href = res.data.hosted_url;
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    } else {
      notify("loginError", "Recaptcha is Required");
    }
  };

  const handlePurchase = () => {
    window.location.href = "/post-checkout";
  };
  const handleCreditCheck = () => {
    setPaymentMethod({ payByCredit: true, payByCrypto: false });
  };
  const handleCryptoCheck = () => {
    setPaymentMethod({ payByCredit: false, payByCrypto: true });
  };
  function onChange(value) {
    setRecaptchaValue2(value);
  }
  // useEffect(() => {
  //   handleCreditCheck();
  // }, []);
 var percent = (discountPercent * 10) / 1000;
  const renderPayment = () => {
    if (certificateArray.salesquantity === 0) {
      return (
        <div className="col-md-12 text-center">
          <button disabled={true} className="SoldoutButton" id="btnSubmit">
            Sorry, this NFT is sold out , Please click here to go{" "}
            <a style={{ color: "#0a1567" }} href={"/balloon/home"}>
              back to marketplace{" "}
            </a>
          </button>
        </div>
      );
    } else if (certificateArray.salesquantity > 0) {
      return (
        <div className="checkout__page-grid d-flex">
          <div className="checkout__page-pm">
            <h1>Payment Method</h1>
            <div className="checkout__page-icons">
              <div
                className={`${
                  paymentMethod.payByCredit
                    ? "checkout__page-pay-op-active"
                    : ""
                } checkout__page-pay-op checkout__page-pay-credit`}
                id="check-credit"
                onClick={handleCreditCheck}
              >
                <img src={creditCard} />
                <div>
                  <p>Pay by</p>
                  <span>Credit Card</span>
                </div>
              </div>
              <div
                className={`${
                  paymentMethod.payByCrypto
                    ? "checkout__page-pay-op-active"
                    : ""
                } checkout__page-pay-op checkout__page-pay-crypto`}
                id="check-crypto"
                onClick={handleCryptoCheck}
              >
                <img src={bitcoinLogo} />
                <div>
                  <p>Pay by</p>
                  <span>Crypto</span>
                </div>
              </div>
            </div>

            {paymentMethod.payByCrypto &&
              certificateArray.type === "Digital art with merchandise" && (
                <ShippingForm
                  shippingDetails={shippingDetails}
                  setShippingDetails={setShippingDetails}
                  certificateArray={certificateArray}
                />
              )}
            {paymentMethod.payByCredit && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  shippingDetails={shippingDetails}
                  setShippingDetails={setShippingDetails}
                  certificateArray={certificateArray}
                  promo={promo}
                />
              </Elements>
            )}
          </div>
          <div className="checkout__page-os-card">
            <div className="checkout__page-os-top">
              <h2>ORDER SUMMARY</h2>
            </div>
            <div className="checkout__page-os-card-inner">
              <p>
                <h4>{certificateArray.category}</h4>
              </p>
              <div className="checkout__page-os-total">
                <div className="checkout__page-os-total-wrp checkout__page-os-total-top">
                  <div className="checkout__page-os-total-ctn checkout__page-os-total-ctn--1">
                    <p>Item</p>
                    <h4>{certificateArray.subject}</h4>
                  </div>
                  <div className="checkout__page-os-total-ctn">
                    {certificateArray && paymentMethod.payByCredit && (
                      <p>Price</p>
                    )}
                    {certificateArray && paymentMethod.payByCredit && (
                      <h4>${certificateArray?.price / 100}</h4>
                    )}
                    {paymentMethod.payByCrypto && <p>Ethereum</p>}
                    {certificateArray && paymentMethod.payByCrypto && (
                      <PriceConverter
                        value={certificateArray?.price}
                        fontFamily="Aileron"
                        size="small"
                      />
                    )}
                  </div>
                  <div className="checkout__page-os-total-ctn">
                    <p>Total Price</p>
                    {paymentMethod.payByCredit && (
                      <h4>${certificateArray.price / 100}</h4>
                    )}
                    {paymentMethod.payByCrypto && (
                      <PriceConverter
                        value={certificateArray.price}
                        fontFamily="Aileron"
                        size="small"
                      />
                    )}
                  </div>
                </div>
                <hr></hr>
                <div className="checkout__page-os-total-mid">
                  <div className="checkout__page-os-total-ctn d-flex flex-row justify-content-between">
                    <p>Subtotal</p>
                    {paymentMethod.payByCredit && (
                      <h4>${certificateArray.price / 100}</h4>
                    )}
                    {paymentMethod.payByCrypto && (
                      <PriceConverter
                        value={certificateArray.price}
                        fontFamily="Aileron"
                        size="small"
                      />
                    )}
                  </div>
                  {paymentMethod.payByCrypto && (
                    certificateArray.type ===
                      "Digital art with merchandise" && (
                    <div className="checkout__page-os-total-ctn d-flex flex-row justify-content-between">
                      <p>Shipping</p>
                      {paymentMethod.payByCrypto && (
                        <PriceConverter
                          value={shippingDetails.country === "US" ? 1000 : 1500}
                          fontFamily="Aileron"
                          size="small"
                        />
                      )}
                    </div>
                  ))}
                  {paymentMethod.payByCredit &&
                    certificateArray.type ===
                      "Digital art with merchandise" && (
                      <div className="checkout__page-os-total-ctn d-flex flex-row justify-content-between ">
                        <p>Shipping</p>
                        <h4>${shippingDetails.country === "US" ? 10 : 15}</h4>
                      </div>
                    )}
                  {paymentMethod.payByCredit && (
                    <div className="checkout__page-os-total-ctn d-flex flex-row justify-content-between ">
                      <p>Tax</p>
                      <h4>${certificateArray.price / 100}</h4>
                    </div>
                  )}
                </div>
                <hr></hr>
                <div className="checkout__page-os-total-wrp checkout__page-os-total-bot">
                  <div className="checkout__page-os-total-ctn">
                    <h4>Total</h4>
                  </div>

                  <div className="checkout__page-os-total-ctn">
                    {paymentMethod.payByCredit && (
                      <h4>
                        $
                        {discountPercent
                          ? certificateArray.price / 100 -
                          (
                            (certificateArray.price / 100) *
                            percent
                          ).toPrecision(3) +
                          (certificateArray.type ===
                            "Digital art with merchandise" ? 
                            (shippingDetails.country === "US" ? 10 : 15) : 0
                            )
                          : certificateArray.price / 100 +
                            ( certificateArray.type ===
                            "Digital art with merchandise" ? (shippingDetails.country === "US" ? 10 : 15):0)}
                      </h4>
                    )}
                    {paymentMethod.payByCrypto && (
                      <PriceConverter
                        value={
                          discountPercent
                            ? certificateArray.price -
                              (certificateArray.price * percent).toPrecision(
                                3
                            ) +
                            (certificateArray.type ===
                            "Digital art with merchandise" ? 
                              (shippingDetails.country === "US" ? 1000 : 1500):0)
                            : certificateArray.price +
                               ( certificateArray.type ===
                            "Digital art with merchandise" ?(shippingDetails.country === "US" ? 1000 : 1500):0)
                        }
                        fontFamily="Aileron"
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* {paymentMethod.payByCredit && (
                <button onClick={handlePurchase}>CONFIRM PURCHASE</button>
              )} */}
              <PromoInput
                promo={promo}
                setPromo={setPromo}
                certificateArray={certificateArray}
                shippingDetails={shippingDetails}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                setDiscountCodeValid={setDiscountCodeValid}
                discontCodevalid={discontCodevalid}
              />
              {discontCodevalid && (
                <h6 className="greenColor">
                  Discount Code applied successfully
                </h6>
              )}

              {paymentMethod.payByCrypto && (
                <ReCAPTCHA
                  sitekey="6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y"
                  data-size="compact"
                  // theme="dark"
                  required={true}
                  render="explicit"
                  onChange={onChange}
                  // onChange={useCallback(() => setDisableSubmit(false))}
                  className={"mb-4"}
                />
              )}

              {paymentMethod.payByCrypto && (
                <button onClick={handlePayByCoinbase}>PAY WITH COINBASE</button>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  
  }
  return (
    <>
      {storeOpen && certificateArray && certificateArray.price && (
        <div>
          <Header />
          <div className="checkout__page">
            <div className="checkout__page-top-card">
              <div className="d-flex checkout__page-img-wrp">
                <img
                  src={`${env.uploadImgLink}${certificateArray.imageName}`}
                  alt="Avatar"
                  className="checkout__page-img"
                />
                <span className="checkout__page-tag">
                  {certificateArray.type}
                </span>
                <div className="checkout__page-top-subcard d-flex">
                  <div className="d-flex flex-column checkout__page-headings">
                    <h2 className="mb-4">{certificateArray.subject}</h2>
                    <p>{certificateArray.category}</p>
                  </div>

                  <div className="d-flex flex-column checkout__page-eth">
                    <h3 className="mb-4">ETHEREUM</h3>
                    <PriceConverter
                      value={certificateArray?.price}
                      fontFamily="Playfair"
                    />
                  </div>
                  <div className="d-flex flex-column checkout__page-dollar">
                    <h3 className="mb-4">PRICE</h3>
                    <span>${certificateArray?.price / 100}</span>
                  </div>
                </div>
              </div>
            </div>
            {renderPayment()}
          </div>
          <Footer />
        </div>
      )}
      {storeOpen === false && <StoreClosed />}
    </>
  );
}

export default Checkout;
