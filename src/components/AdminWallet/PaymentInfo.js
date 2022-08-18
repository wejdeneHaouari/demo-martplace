import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { env } from "../../constants";
import Cookies from "universal-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    // className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);

const PaymentInfo = ({ payValue, amount, setProcessing, processing }) => {
  const cookies = new Cookies();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState("");
  const history = useHistory();
  const [error, setError] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    email: cookies.get("email"),
    name: cookies.get("firstname") + " " + cookies.get("lastname"),
  });

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text, {
        onClose: () => window.location.reload(true),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

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

      stripe.createToken(cardElement).then((payload) => {
        const cookies = new Cookies();
        const token = cookies.get("response");
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
        const walletdata = {
          stripeToken: payload.token.id,
          amount: amount,
          userId: userId,
        };
        axios
          .post(env.apiUrl + `api/users/payment`, walletdata, headers)
          .then((res) => {
            if (res.data.status === "Success") {
              notify(
                "loginError",
                "Payment Added Successfuly ($" +
                  parseFloat(amount / 100).toFixed(2) +
                  ") "
              );
            } else {
              alert(res.data.err.raw.message);
            }
          })
          .catch((error) => {
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
                notify("loginError", "Something went wrong");
              }
            }
          });
      });
    }
  };

  return (
    <Wrapper>
      <form className="Form" onSubmit={handleSubmit}>
        <LabelInputWraper>
          <label>Amount</label>
          <input
            id="walletAmount"
            className="form-control"
            value={"$ " + payValue + ".00"}
          ></input>
        </LabelInputWraper>
        <LabelInputWraper>
          <label>Credit Card / Debit Card</label>
          <div className="creditCardWrapper">
            {/* <input
            id="creditCardNum"
            placeholder="Credit Card Number"
            className="form-control"
          ></input>
          <input
            id="creditExpDate"
            placeholder="MM/YY"
            className="form-control"
          ></input>
          <input
            id="creditCSV"
            placeholder="CSV"
            className="form-control"
          ></input> */}
              <CardElement
                onChange={(e) => {
                  console.log(e);
                  setCardError(e.error);
                  setCardComplete(e.complete);
                }}
              />
           
            <SubmitButton
              processing={processing}
              error={error}
              disabled={!stripe}
              className="btn btn-primary"
              id="btnSubmit"
            >
              Pay {payValue}
            </SubmitButton>
          </div>
        </LabelInputWraper>
      </form>
    </Wrapper>
  );
};
export default PaymentInfo;

const Wrapper = styled.div`
  color: #272727;
  margin-top: 25px;

  #creditCSV {
    width: 89px;
  }

  #creditExpDate {
    width: 89px;
  }

  #creditCardNum {
    width: 400px;
  }

  .creditCardWrapper {
    display: flex;
    flex-direction: row;
    width: 45%;

    input {
      margin-right: 14px;
    }
  }

  .StripeElement {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-left: 0;
    margin-right: 14px;
    padding: 15px 15px 11px 15px;
  }
`;

const LabelInputWraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 10px;

  #walletAmount {
    width: 128px;
  }

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

  button {
    width: 137px;
    height: 50px;
    color: white;
    font-size: 14px;
    background-color: #5c973c;
  }
`;
