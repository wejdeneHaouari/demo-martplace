import Header from "../../components/Header";
import HeaderBanner from "../../components/MartplaceHeader/HeaderBanner";
import React, {useState} from "react";
import styled from "styled-components";
import CreditDelivery from "./CreditDelivery";
import CryptoDelivery from "./CryptoDelivery";

const Delivery = () => {
    const [generalSelected, setGeneralSelected] = useState(false);
    const [ordersSelected, setOrdersSelected] = useState(false);
    const [deliverySelected, setDeliverySelected] = useState(true);
    const [changePasswordSelected, setChangePasswordSelected] = useState(false);
    const [showCredit, setShowCredit] = React.useState(true)
    const [showCrypto, setShowCrypto] = React.useState(false)
    let creditClass = showCredit ? "btn btn-primary" : "btn btn-light";
    let cryptoClass = showCrypto ? "btn btn-primary" : "btn btn-light";
    return (
        <Wrapper>
            <Header />
            <HeaderBanner type="Home&Settings"/>
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

                        </div>
                    </div>
                </nav>
                <div className="ml-5 mt-5 btn-group" role="group" aria-label="Basic example">
                    <button className={creditClass} type="button"  onClick = {() => {setShowCrypto(false) ;setShowCredit(true)}}>Credit</button>
                    <button  className={cryptoClass} type="button"  onClick = {() => {setShowCrypto(true) ; setShowCredit(false)}}>Crypto</button>
                </div>





                { showCredit ? <CreditDelivery /> : null }
                { showCrypto ? <CryptoDelivery /> : null }
            </SettingsContainer>
        </Wrapper>
    );
}

export default Delivery;

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


