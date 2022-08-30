import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import HeaderBanner from "../../components/MartplaceHeader/HeaderBanner";
import UserProfile from "../../components/UserProfile/UserProfile";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import { APIs } from "../../assets/MarketplaceAPIEndpoints";
import UserUpdatePasswordForm from "../../components/UserUpdatePasswordForm/UserUpdatePasswordForm";
import { toast } from "react-toastify";
import {userID} from "../../constants/apiEndPoints";

const UserPasswordChangeContainer = () => {
  const [profileSelected, setProfileSelected] = useState(false);
  const [passwordSelected, setPasswordSelected] = useState(true);
  const [newpassword, setNewPassword] = useState("");
  const [reenterNewPassword, setReenterNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState(false);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(
    false
  );
  const cookies = new Cookies();
  const authToken = "Bearer " + cookies.get("userToken");
  const userId = cookies.get("userId");

  const handleProfileNavClick = () => {
    setProfileSelected(true);
    setPasswordSelected(false);
  };

  const handlePasswordClick = (e) => {
    setProfileSelected(false);
    setPasswordSelected(true);
  };
  function password_validate(password) {
    return password.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
  }

  const handleFormSubmit = (e) => {
    let validationError = password_validate(newpassword);
    validationError
      ? setPasswordValidationError(false)
      : setPasswordValidationError(true);
    newpassword === reenterNewPassword
      ? setPasswordConfirmationError(false)
      : setPasswordConfirmationError(true);

    if (validationError && newpassword === reenterNewPassword) {
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
    }
  };

  return (
    <Wrapper>
      <Header marketplaceStore={true} />
      <HeaderBanner type="userProfile" />
      <SettingsContainer>
        <nav className="navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-light secondHeader">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item" key="allCerts">
                  <a
                    href="/user/profile"
                    className={
                      profileSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                    onClick={handleProfileNavClick}
                  >
                    PROFILE
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    href="/marketplace/user/passwordUpdate"
                    className={
                      passwordSelected
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                    onClick={handlePasswordClick}
                  >
                    PASSWORD
                  </a>
                </li>
              </ul>
              <UpdateChangesButton onClick={handleFormSubmit}>
                UPDATE CHANGES
              </UpdateChangesButton>
            </div>
          </div>
        </nav>
      </SettingsContainer>
      {/*<UserUpdatePasswordForm*/}
      {/*  handleFormSubmit={handleFormSubmit}*/}
      {/*  setCurrentPassword={setCurrentPassword}*/}
      {/*  setNewPassword={setNewPassword}*/}
      {/*  setReenterNewPassword={setReenterNewPassword}*/}
      {/*/>*/}
      <WrapperPassword>
        <SettingsForm id="storeSettingsForm" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <LabelInputWraper>
              <label>Current Password</label>
              <input
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
                placeholder="Enter current password"
              ></input>
            </LabelInputWraper>
            <LabelInputWraper>
              <label>New Password</label>
              <input
                type="password"
                id="title"
                className="form-control"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
            </LabelInputWraper>
            {passwordValidationError ? (
              <div className="invalid-feedback">
                Password Must Contain 8 Characters, One Uppercase, One
                Lowercase, One Number and one special case Character
              </div>
            ) : null}
            <LabelInputWraper>
              <label>Re-enter New Password</label>
              <input
                type="password"
                id="title"
                className="form-control"
                placeholder="Re-enter new password"
                onChange={(e) => setReenterNewPassword(e.target.value)}
              ></input>
              {passwordConfirmationError ? (
                <div className="invalid-feedback">
                  Confirm Password does not match
                </div>
              ) : null}
            </LabelInputWraper>
          </div>
        </SettingsForm>
      </WrapperPassword>
    </Wrapper>
  );
};
export default UserPasswordChangeContainer;

const Wrapper = styled.div`
  background-color: #fff;
  font-family: "Aileron Reguler";
  width: 100%;
  height: 100vh;
`;

const WrapperPassword = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: black;
  text-align: left;
  margin: 20px auto;
  font-family: "Aileron Reguler";
  width: 85%;

  label {
    margin-right: 16px;
  }

  input {
    border-radius: 10px;
    color: white;
  }

  .custom-file-label::after {
    background-color: #3e4ef1;
    color: white;
  }

  .custom-file-label {
    border-radius: 10px;
    height: 50px;
    padding-top: 13px;
    color: #a0a0a0;
    font-size: 13px;
  }

  .custom-file-input:lang(en) ~ .custom-file-label::after {
    border-radius: 0 10px 10px 0;
    height: 50px;
    font-size: 14px;
    padding-top: 14px;
    width: 109px;
  }

  .custom-file {
    height: 50px;
  }
`;

const UpdateChangesButton = styled.button`
  font-size: 14px;
  width: 201px;
  height: 50px;
  color: white;
  background-color: #3e4ef1;
  :hover {
    background-color: #313eba;
  }
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

const SettingsForm = styled.form`
  width: 400px;
  margin-right: 30px;
  margin-top: 46px;
`;

const LabelInputWraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;

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
    color: black;
  }

  textarea {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-bottom: 8px;
  }

  #title {
    width: 100%;
  }

  #contact {
    width: 388px;
  }
`;
