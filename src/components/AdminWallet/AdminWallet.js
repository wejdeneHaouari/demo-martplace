import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Elements } from "@stripe/react-stripe-js";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import PaymentInfo from "./PaymentInfo";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "../../constants";
import { toast } from "react-toastify";
import { LoaderContainer } from "../UserProfile/UserProfile";
import WalletTransaction from "./WalletTransaction";
import { userID } from "../../constants/apiEndPoints";
const stripePromise = loadStripe(env.stripeKey);

const AdminWallet = () => {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payValue, setPayValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState("");
  const cookies = new Cookies();
  const history = useHistory();
  const userId = cookies.get("userId");
  const authToken = "Bearer " + cookies.get("response");
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };

  useEffect((page) => {
    // fetchTransactions(page);

    axios
      .get(
        env.apiUrl + `api/users/getUserById?userId=${userID}`,
        headers
      )
      .then((res) => {
        setBalance(res.data.data.amount);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
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
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            window.location.reload();
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });
  }, []);

  const commas = (num) => {
    var str = num.toString().split(".");
    if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, "$1 ");
    }
    return str.join(".");
  };

  return (
    <Wrapper>
      <MainAccount>MAIN ACCOUNT</MainAccount>
      <WalletBallance>{"$" + commas(balance) + ".00"}</WalletBallance>
      <p className="walletBalanceLabel">Wallet Balance</p>
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Add Money
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <div
            class="dropdown-item"
            onClick={() => {
              setPayValue(20);
              setAmount(2000);
              setShowPaymentInfo(true);
            }}
          >
            $ 20.00
          </div>
          <div
            class="dropdown-item"
            onClick={() => {
              setPayValue(60);
              setAmount(6000);
              setShowPaymentInfo(true);
            }}
          >
            $ 60.00
          </div>
          <div
            class="dropdown-item"
            onClick={() => {
              setPayValue(80);
              setAmount(8000);
              setShowPaymentInfo(true);
            }}
          >
            $ 80.00
          </div>
        </div>
      </div>
      {processing && (
        <LoaderContainer>
          <div class="spinner-border text-dark" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </LoaderContainer>
      )}
      <Elements stripe={stripePromise}>
        {showPaymentInfo && (
          <PaymentInfo
            amount={amount}
            paymentAmount={paymentAmount}
            payValue={payValue}
            processing={processing}
            setProcessing={setProcessing}
          />
        )}
      </Elements>
      <WalletTransaction></WalletTransaction>
    </Wrapper>
  );
};
export default AdminWallet;

const Wrapper = styled.div`
  color: #272727;
  font-family: "Aileron Bold";
  width: 90%;
  margin: 85px auto 0px auto;

  .walletBalanceLabel {
    color: #85899f;
    font-size: 17px;
    margin-bottom: 21px;
  }

  .dropdown {
    width: 340px;

    .btn {
      background-color: #3e4ef1;
      font-size: 14px;
      color: white;
      border-radius: 3px;
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
    }

    .dropdown-menu {
      margin-top: 0;
      border-radius: 3px;
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
    }

    .dropdown-item {
      border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
  }

  .dropdown-toggle::after {
    margin-left: 20px;
  }

  .dropdown-menu.show {
    max-width: 169px;
  }
`;

const MainAccount = styled.p`
  font-family: "Aileron Bold";
  font-size: 16px;
  letter-spacing: 1px;
  color: #1d222f;
  margin-bottom: 28px;
`;

const WalletBallance = styled.p`
  color: #272727;
  font-size: 28px;
  margin-bottom: 0;
`;
