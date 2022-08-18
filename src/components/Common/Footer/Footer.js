import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./Footer.css";
import Logo from "../../../assets/images/storeFront/defaultLogo.png";
import InstagramLogo from "../../../assets/images/storeFront/instagram.svg";
import YoutubeLogo from "../../../assets/images/storeFront/play.svg";
import FacebookLogo from "../../../assets/images/storeFront/facebook.svg";
import TwitterLogo from "../../../assets/images/storeFront/twitter.svg";
import ChainCertsLogo from "../../../assets/images/storeFront/blackChainCertsLogo.svg";
import VisaLogo from "../../../assets/images/visa.svg";
import MasterCardLogo from "../../../assets/images/mastercard.svg";
import AmexLogo from "../../../assets/images/amex.svg";
import BitcoinLogo from "../../../assets/images/bitcoin-logo.svg";
import EthereumLogo from "../../../assets/images/ethereum-logo.svg";
import DogeCoinLogo from "../../../assets/images/dogecoin-logo.svg";
import UsdcCoinLogo from "../../../assets/images/usdc-logo.svg";
import Cookies from "universal-cookie";
import { env } from "../../../constants";

const Footer = () => {
  const [storeLogo, setStoreLogo] = useState(Logo);
  const [contactUsHeader, setContactUsHeader] = useState("");

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
        setContactUsHeader(result.data.contact);
      })
      .catch((error) => console.log("error", error));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //regex for checking is email is valid
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let topic = e?.target[0]?.value;
    let firstName = e?.target[1]?.value;
    let lastName = e?.target[2]?.value;
    let email;
    let phoneNumber = e?.target[4]?.value;
    let message = e?.target[5]?.value;

    //validate email
    if (re.test(e?.target[3]?.value)) {
      email = e?.target[3]?.value;
    } else {
      email = null;
    }

    console.log(topic, firstName, lastName, email, phoneNumber, message);

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        subject: topic,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phoneNumber,
        message: message,
      }),
    };
    if (email !== null) {
      fetch(env.apiUrl + "api/users/sendMail", config).then(() =>
        window.location.reload(true)
      );
    } else {
      alert("Please enter valid email address");
    }
  };

  useEffect(() => {
    getStoreLogoBanner();
  }, []);

  return (
    <footer className="Container">
      <div className="contentWrapper">
        <div className="leftFooter">
          <div className="socialMediaColumn">
            <img src={"https://" + storeLogo} />
            <div className="socialMediaLogoWrapper">
              <a href="https://www.instagram.com/njballoonfest/">
                <img src={InstagramLogo} />
              </a>
              <a href="https://twitter.com/njballoonfest">
                <img src={TwitterLogo} />
              </a>
              <a href="https://www.youtube.com/channel/UCB41nN1pvgl3ZyHs2xE0fUw">
                <img src={YoutubeLogo} />
              </a>
              <a href="https://www.facebook.com/NJBalloonFest/?ref=ts">
                <img src={FacebookLogo} />
              </a>
            </div>
            <a target="_blank" href="https://discord.gg/7hjTPdgDWn">
              <button>JOIN DISCORD</button>
            </a>
          </div>
          <div className="footer--ss-wrp">
            <div className="d-flex">
              <div className="footerLinksCol1">
                <a
                  href="/TermsAndCondition.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms And Conditions
                </a>
                <a href="https://discord.gg/7hjTPdgDWn">Discord Server</a>
                <a href="https://www.chaincerts.org/about-us.html">About Us</a>
              </div>
              <div className="footerLinksCol2">
                <a href="https://balloonfestival.com/">Song Source</a>
                <a href="https://discord.gg/7hjTPdgDWn">Support & feedback</a>
                <a href="/faq">FAQ</a>
              </div>
            </div>
            <div className="footer__payment-methods">
              <h5>PAYMENT METHODS</h5>
              <div className="d-flex footer__payment-methods-ctn">
                <div className="footer__payment-methods-cards">
                  <img src={VisaLogo} alt="visa" style={{ width: "32px" }} />
                  <img
                    src={MasterCardLogo}
                    alt="mastercard"
                    style={{ width: "32px" }}
                  />
                  <img src={AmexLogo} alt="amex" style={{ width: "32px" }} />
                </div>

                <div className="footer__payment-methods--crypto">
                  <img
                    src={BitcoinLogo}
                    alt="bitcoin"
                    style={{ width: "32px" }}
                  />
                  <img
                    src={EthereumLogo}
                    alt="ethereum"
                    style={{ width: "32px" }}
                  />
                  <img
                    src={DogeCoinLogo}
                    alt="dogecoin"
                    style={{ width: "32px" }}
                  />
                  <img
                    src={UsdcCoinLogo}
                    alt="usdc"
                    style={{ width: "32px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightFooter">
          <div className="formWrapper">
            <p>{contactUsHeader}</p>
            <form onSubmit={handleFormSubmit}>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option>Please choose a topic </option>
                <option value="Found a Bug">Found a Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Question">General Question</option>
                <option value="Delete Account">Delete Account</option>
                <option value="Account Problem">Account Problem</option>
                <option value="Item Problem">Item Problem</option>
              </select>
              <div className="inputWrapper">
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
              </div>
              <div className="inputWrapper">
                <input type="email" placeholder="Email" required />
                <input type="tel" placeholder="Phone" />
              </div>
              <textarea placeholder="Message" required />

              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="bottomFooter">
        <p>Powered by</p>
        <img src={ChainCertsLogo} />
      </div>
    </footer>
  );
};
export default Footer;
