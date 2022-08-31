import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import HeaderBanner from "../../components/MartplaceHeader/HeaderBanner";
import UserProfile from "../../components/UserProfile/UserProfile";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import { APIs } from "../../assets/MarketplaceAPIEndpoints";
import axios from "axios";
import { headers, userID, userIDObj } from "../../constants/apiEndPoints";
import { toast } from "react-toastify";
const UserProfileContainer = () => {
  const [profileSelected, setProfileSelected] = useState(true);
  const [passwordSelected, setPasswordSelected] = useState(false);

  const [newFirstName, setFirstName] = useState("");
  const [newLastName, setLastName] = useState("");
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const authToken = cookies.get("userToken");
  const firstname = cookies.get("firstname");
  const lastname = cookies.get("lastname");
  const [profileFileName, setProfleFileName] = useState("Upload");
  const [profilePicture, setProfilePicture] = useState("");
  let alertMessage = "";

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };

  const handleProfileNavClick = () => {
    setProfileSelected(true);
    setPasswordSelected(false);
  };

  const handlePasswordClick = (e) => {
    setProfileSelected(false);
    setPasswordSelected(true);
  };


  const updateFirstAndLastName = (changeFirstname, changeLastName) => {
    const data = {
      userId: userId,
      firstName: changeFirstname,
      lastName: changeLastName,
    };
    axios
      .post(env.apiUrl + "api/users/changeDetails", data, headers)
      .then((res) => {
        if (res.data.status === false) {
          notify("loginError", res.data.msg);
        } else {

          cookies.remove("firstname", { path: "/" });
          cookies.set("firstname", changeFirstname, { path: "/" });
          cookies.remove("lastname", { path: "/" });
          cookies.set("lastname", changeLastName, { path: "/" });
          toast(res.data.msg, {
            onClose: () => window.location.reload(true),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          notify("loginError", err.response.data.msg);
        }
      });
  };

  const checkVoidString = (test) => {
    return test === "";
  };

  const updateUserProfile = () => {
    console.log(newFirstName);
    console.log(newLastName);
    console.log(!newLastName);
    if (newFirstName && checkVoidString(newLastName)) {
      console.log(lastname);
      updateFirstAndLastName(newFirstName, lastname);
    }
    if (!newFirstName && newLastName) {
      updateFirstAndLastName(firstname, newLastName);
    }
    if (newFirstName && newLastName) {
      updateFirstAndLastName(newFirstName, newLastName);
    }
    if (profilePicture) {
      updateProfilePictureOnClick();
    }
  };

  const updateProfilePictureOnClick = () => {
    const formData = new FormData();
    formData.append("logo", profilePicture);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${authToken}`);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    //API request to update the users profile picture
    fetch(
      env.apiUrl + APIs.updateStore + `userId=${cookies.get("userId")}`,
      requestOptions
    ).then(() => {
      axios
        .get(
          env.apiUrl + `api/users/getUserProfile?userId=${userID}`,
          headers
        )
        .then((res) => {
          cookies.remove("profilePicture", { path: "/" });
          cookies.set("profilePicture", "https://" + res.data.data.logo, {
            path: "/",
          });
          alertMessage += " \n " + res.data.msg;

          window.location.reload(true);
        });

    });
  };

  return (
    <Wrapper>
      <Header />
      <HeaderBanner type="userProfile" />
      <SettingsContainer>
        <nav className="navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-light secondHeader">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item" key="allCerts">
                  <a
                    href="/marketplaceSettings"
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
              <UpdateChangesButton onClick={updateUserProfile}>
                UPDATE CHANGES
              </UpdateChangesButton>
            </div>
          </div>
        </nav>
      </SettingsContainer>
      <UserProfile
        setFirstName={setFirstName}
        setLastName={setLastName}
        profileFileName={profileFileName}
        profilePicture={profilePicture}
        setProfilePicture={setProfilePicture}
        setProfleFileName={setProfleFileName}
      />
    </Wrapper>
  );
};
export default UserProfileContainer;

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

