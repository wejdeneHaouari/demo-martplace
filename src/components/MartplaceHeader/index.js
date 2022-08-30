import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StoreHeaderLogoImage from "../../assets/images/storeFront/demo.png";
import logoutImg from "../../assets/images/logout.png";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import user from "../../assets/images/user.png";
import "./index.css";
const redirectToHome = () => {
  window.location.href = "../marketplace/home";
};
const redirectToCollection = () => {
  window.location.href = "../marketplace/collection";
};
const redirectToLanding = () => {
  window.location.href = "../";
};
const MarketplaceHeader = ({ type }) => {
  const cookies = new Cookies();
  const history = useHistory();
  const userRole = cookies.get("userRole");
  const logout = () => {
    console.log("logout from marketplace header");
    cookies.remove("response", { path: "/" });
    cookies.remove("userId", { path: "/" });
    cookies.remove("username", { path: "/" });
    sessionStorage.clear();
    history.push("/");
    window.location.reload();
  };
  return (
    <Wrapper>
      <Logo
        src={StoreHeaderLogoImage}
        className=""
        onClick={() => redirectToLanding()}
      ></Logo>
      <LogoText onClick={() => redirectToLanding()}>
        New Jersey Lottery Festival of Marketplaceing
      </LogoText>
      <RightContent>
        <div onClick={() => redirectToHome()} className="white">
          Home
        </div>
        <div onClick={() => redirectToCollection()} className="white">
          Collection
        </div>
        <nav className="navigation">
          <ul>
            <li>
              <div className="nav-link">
                <div className="dropdown">
                  <button type="" className="userIcon" data-toggle="dropdown">
                    <img src={user} className="user-1 mr-5" alt="user" />
                  </button>
                  <div className="dropdown-menu">
                    {userRole === "admin" ? (
                      ""
                    ) : (
                      <>
                        <a className="dropdown-item" href="/settings">
                          Settings
                        </a>
                        <a className="dropdown-item" href="/marketplaceSettings">
                          Store Settings
                        </a>
                      </>
                    )}
                    {userRole === "admin" ? (
                      ""
                    ) : (
                      <a className="dropdown-item" href="/wallet">
                        Wallet
                      </a>
                    )}
                      <a className="dropdown-item" href="/transactionHistory">
                        History
                      </a>

                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="nav-link" onClick={logout}>
                <img
                  src={logoutImg}
                  className="logoutClass"
                  alt="logout icon"
                />
              </div>
            </li>
          </ul>
        </nav>
        {/* <Icons></Icons> */}
      </RightContent>
    </Wrapper>
  );
};

export default MarketplaceHeader;

const Wrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  margin: 0 0 0px;
  padding: 8px 60px 8px 62px;
  background-color: #111123;
`;
const Logo = styled.img`
  width: 51px;
  height: 54px;
`;

const LogoText = styled.p`
  margin: 15px 704px 0px 11.7px;
  font-family: PlayfairDisplay;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
  cursor: pointer;
`;
const RightContent = styled.div`
  justify-content: space-evenly;
  display: flex;
  align-content: center;
  width: 40%;
  margin: 15px 0px 0px 11.7px;
  font-family: AileronReguler;
  font-size: 20px;
  font-weight: bold;
  color: #fff !important;
  float: right;
  right: 0;
  position: absolute;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 62px;
`;
