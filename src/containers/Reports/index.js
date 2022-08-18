import Header from "../../components/Header";
import HeaderBanner from "../../components/BalloonHeader/HeaderBanner";
import CreditOrders from "../../components/Orders/CreditOrders";
import CryptoOrders from "../../components/Orders/CryptoOrders";
import React, { useState } from "react";
import styled from "styled-components";
import SignupData from "./SignupData";

const Reports = () => {
  const [generalSelected, setGeneralSelected] = useState(false);
  const [ordersSelected, setOrdersSelected] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [walletSelected, setWalletSelected] = useState(false);
    const [changePasswordSelected, setChangePasswordSelected] = useState(false);
    const [reportsSelected, setReportsSelected] = useState(true);
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
                    href="/balloonSettings"
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
                    href="/balloon/orders"
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
                    href="/balloon/deliveries"
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
                <li className="nav-item">
                  <a
                    href="/balloon/owner/wallet"
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
                    href="/balloon/owner/change-password"
                    className={
                      changePasswordSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    PASSWORD
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    href="/balloon/reports"
                    className={
                    reportsSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                  >
                    REPORTS
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <SignupData />
      </SettingsContainer>
    </Wrapper>
  );
};

export default Reports;

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
