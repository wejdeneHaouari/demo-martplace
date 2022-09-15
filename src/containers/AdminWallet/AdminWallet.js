import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import AdminWallet from "../../components/AdminWallet/AdminWallet";

const AdminOrders = () => {
    const [generalSelected, setGeneralSelected] = useState(false);
    const [deliverySelected, setDeliverySelected] = useState(false);

    const [ordersSelected, setOrdersSelected] = useState(false);
    const [walletSelected, setWalletSelected] = useState(true);
    const [changePasswordSelected, setChangePasswordSelected] = useState(false);

    return (
        <Wrapper>
            <Header />

            <SettingsContainer>
                <nav className="navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-light secondHeader">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                                <li className="nav-item" key="myCert">
                                    <a
                                        href="/owner/wallet"
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
                                        href="/owner/change-password"
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
                        </div>
                    </div>
                </nav>

                <AdminWallet />
            </SettingsContainer>
        </Wrapper>
    );
};
export default AdminOrders;

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
