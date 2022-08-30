import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import styled from "styled-components";

import "./index.css";
// import NavOptions from "./content";
import user from "../../assets/images/user.png";
import logoutImg from "../../assets/images/logout.png";
import AileronReguler from "../../assets/fonts/aileron/Aileron-Regular.otf";
// import defaultLogo from "../../assets/images/demo.png";

function AdminHeader() {
  const cookies = new Cookies();
  const history = useHistory();
  const userRole = cookies.get("userRole");
  const logout = () => {
    cookies.remove("userToken",{ path: '/' });
    cookies.remove("response",{ path: '/' });
    cookies.remove("userId",{ path: '/' });
    cookies.remove("username",{ path: '/' });
    cookies.remove("firstname",{ path: '/' });
    cookies.remove("lastname",{ path: '/' });
    cookies.remove("email",{ path: '/' });
    cookies.remove("profilePicture",{ path: '/' });
    sessionStorage.clear();
    history.push("/login");
  };
  

  const [scrolled, setScrolled] = React.useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  let x = ["navbar"];
  if (scrolled) {
    x.push("scrolled");
  }
  return (
    <header className={`${x.join(" ")} verifyNav`}>
      {userRole === "admin" ? (
        <a className="logo" href="/adminDashboard">
          <img className="logo logoClass" alt="logo" height="36" />{" "}
        </a>
      ) : (
        <a className="logo" href="/dashboard#">
          <img className="logo logoClass" alt="logo" height="36" />{" "}
        </a>
      )}

      {/* once we have API to send the logo from store settings, make condition if there is a logo from the backend use that, otherwis use this deafult image */}
      {/* {userRole === "admin" ? (
          <img className="storeLogo" src={defaultLogo} />
      ) : (
        <img className="storeLogo" src={defaultLogo} />
      )} */}

      <nav className="navigation">
        <ul>
          <li>
            <div className="nav-link">
              <div className="dropdown">
                <button type="button" className="" data-toggle="dropdown">
                  <img src={user} className="user-1 mr-5" alt="user" />
                  {/* <i className="fa fa-user"></i> */}
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
                  {userRole === "admin" ? (
                    <a className="dropdown-item" href="/adminHistory">
                      History
                    </a>
                  ) : (
                    <a className="dropdown-item" href="/transactionHistory">
                      History
                    </a>
                  )}
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="nav-link" onClick={logout}>
              <img src={logoutImg} className="logoutClass" alt="logout icon" />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default AdminHeader;

const NavLinkWrapper = styled.li`
  &&& a {
    margin: 0px 27px;
    font-family: "Aileron Reguler";
    font-size: 16px;
    line-height: 1.14;
    letter-spacing: 1px;
    color: #fff;
  }
`;
