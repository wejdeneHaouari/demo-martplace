import Header from "../../components/Header";
import HeaderBanner from "../../components/BalloonHeader/HeaderBanner";
import CreditOrders from "../../components/Orders/CreditOrders";
import CryptoOrders from "../../components/Orders/CryptoOrders";
import React, { useState } from "react";
import styled from "styled-components";
import DiscountData from "./DiscountData";

const DiscountCode = () => {
  return (
    <Wrapper>
      <Header />
      <HeaderBanner type="Home&Settings" />
      <SettingsContainer>
       

        <DiscountData />
      </SettingsContainer>
    </Wrapper>
  );
};

export default DiscountCode;

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
//Same component used in admin and store front banner
export const SearchButton = styled.button`
  font-size: 14px;
  width: 201px;
  height: 50px;
  color: white;
  background-color: #3e4ef1;
  margin-left: ${(props) => (props.type === "Home&Collection" ? "29px" : 0)};
`;

//Same component used in admin and store front banner
export const SearchBar = styled.input`
  height: 50px;
  width: 310px;
  border-left: solid 2px #e9e9e9;
  border-top: none;
  border-right: none;
  border-bottom: none;
  padding-left: 10px;
`;
