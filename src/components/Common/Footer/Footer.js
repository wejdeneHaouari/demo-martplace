import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./Footer.css";
import Logo from "../../../assets/images/storeFront/demo.png";
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

  return (
    <footer className="Container">

      <div className="bottomFooter">
        <p>Powered by</p>
        <img src={ChainCertsLogo} />
      </div>
    </footer>
  );
};
export default Footer;
