import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import HeaderBanner from "../../components/MartplaceHeader/HeaderBanner";
import UserUpdatePasswordForm from "../UserUpdatePasswordForm/UserUpdatePasswordForm";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import { toast } from "react-toastify";
import {userID} from "../../constants/apiEndPoints";

const AdminChangePasswordContainer = () => {
  const [generalSelected, setGeneralSelected] = useState(false);
  const [ordersSelected, setOrdersSelected] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [changePasswordSelected, setChangePasswordSelected] = useState(true);
  const [newpassword, setNewPassword] = useState("");
  const [reenterNewPassword, setReenterNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const cookies = new Cookies();
  const authToken = "Bearer " + cookies.get("userToken");

  const handleFormSubmit = (e) => {
    if (newpassword === reenterNewPassword) {
      fetch(env.apiUrl + "api/users/changePassword", {
        body: `userId=${userID}&oldPass=${currentPassword}&newPass=${newpassword}`,
        headers: {
          Accept: "application/json",
          Authorization: authToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      })
        .then((response) => response.json())
        .then((result) =>
          toast(result.msg, {
            onClose: () => window.location.reload(true),
          })
        );
    } else {
      toast("Password does not match");
    }
  };

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


                <div className="Line-Copy-6"></div>
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

              <div>
                <UpdateChangesButton type="submit" form="storeSettingsForm">
                  UPDATE PASSWORD
                </UpdateChangesButton>
              </div>
            </div>
          </div>
        </nav>
        <UserUpdatePasswordForm
          handleFormSubmit={handleFormSubmit}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setReenterNewPassword={setReenterNewPassword}
        />
      </SettingsContainer>
    </Wrapper>
  );
};
export default AdminChangePasswordContainer;

const Wrapper = styled.div`
  background-color: #fff;
  font-family: "Aileron Reguler";
  width: 100%;
  height: 100vh;
`;

const UpdateChangesButton = styled.button`
  font-size: 14px;
  width: 201px;
  height: 50px;
  color: white;
  background-color: #3e4ef1;
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

