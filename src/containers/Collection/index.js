import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import { env } from "../../constants";
import Moment from "moment";
import Pagination from "reactjs-hooks-pagination";
import "./index.css";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import HeaderBanner from "../StoreSettings/HeaderBanner";
import styled from "styled-components";
import EthLogo from "../../assets/images/storeFront/ethLogo.svg";
import Footer from "../../components/Common/Footer/Footer";
import { userID } from "../../constants/apiEndPoints";

function Collection() {
  const cookies = new Cookies();
  const history = useHistory();
  const [result_array, setResultArray] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [firstNameShow, setFirstNameShow] = useState(false);
  const [signData, setSignData] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [showTransfer, setTransferShow] = useState(false);
  const [showTransferButton, setshowTransferButton] = useState(false);
  const [showSignUpTransfer, setSignUpTransferShow] = useState(false);
  const [showSearch, setSearchShow] = useState(true);
  const [receiverId, setReceiverID] = useState("");
  const [createCertificate, showCreateCertificate] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [activateError, setActivateError] = useState(false);
  const [isAllCertActive, setAllCertActive] = useState(false);
  const [isMyCertActive, setMyCertActive] = useState(false);
  const [isUnverifiedCertActive, setUnverifiedCertActive] = useState(false);
  const [isTransferredCertActive, setTransferredCertActive] = useState(false);
  const toggleAllCert = () => {
    setAllCertActive(!isAllCertActive);
    setMyCertActive(false);
    setTransferredCertActive(false);
    setUnverifiedCertActive(false);
  };
  const toggleMyCert = () => {
    setMyCertActive(!isMyCertActive);
    setAllCertActive(false);
    setTransferredCertActive(false);
    setUnverifiedCertActive(false);
  };
  const toggleUnverifiedCert = () => {
    setUnverifiedCertActive(!isUnverifiedCertActive);
    setAllCertActive(false);
    setMyCertActive(false);
    setTransferredCertActive(false);
  };
  const toggleTransferredCert = () => {
    setTransferredCertActive(!isTransferredCertActive);
    setAllCertActive(false);
    setMyCertActive(false);
    setUnverifiedCertActive(false);
  };

  const toggleModal = (t) => {
    setIsOpen(!isOpen);
    setTransferShow(false);
    setFirstNameShow(false);
  };
  const handlePageClick = (e) => {
    const selectedPage = e;
    setCurrentPage(selectedPage);
  };

  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };
  const userId = cookies.get("userId");
  const userName = cookies.get("username");
  const userIDObj = {
    userId: userId,
  };
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    } else if (type === "dashError") {
      toast(text, {
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        autoClose: false,
      });
    }
  };
  useEffect(() => {
    const userLoggedIn = cookies.get("userId");
    if (userLoggedIn) {
    } else {
      history.push("/login");
    }
  });

  useEffect(() => {
    axios
      .get(
        env.apiUrl + "api/users/checkUseractivated?userId=" + userId,
        headers
      )
      .then((res) => {
        callFunOnKey();
      })
      .catch((error) => {
        if (error.response.data.msg === "User is not activated by admin.") {
          // notify(
          //   "dashError",
          //   `Hi ${firstName}, You need to verify your authenticity in order to mint your NFT certificate in Blockchain, please click here to submit your request`,
          // );
          setActivateError(true);
        }
      });
  }, [currentPage]);

  useEffect(() => {
    axios
      .get(env.apiUrl + `api/users/getUserrole?userId=${userID}`, headers)
      .then((res) => {
        if (res.data.data === "owner") {
          showCreateCertificate(true);
        } else {
          showCreateCertificate(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          history.push("/login");
          cookies.remove("response");
        }
      });
  }, []);
  const callFunOnKey = () => {
    var checkKey = sessionStorage.getItem("newKey");
    if (checkKey === "1") {
      allCerts(currentPage);
    } else if (checkKey === "2") {
      myCerts(currentPage);
    } else if (checkKey === "3") {
      transferredCerts(currentPage);
    } else if (checkKey === "4") {
      unverifiedCerts(currentPage);
    } else {
      // window.location.reload();
      window.history.replaceState(null, null, "#");
      allCerts(currentPage);
    }
  };
  const allCerts = (page) => {
    console.log(page);

    sessionStorage.setItem("newKey", 1);
    // window.history.replaceState(null, null, "#");
    // setActiveClass(true);
    axios
      .post(
        env.apiUrl + `api/users/getFilesByuserId?page=` + page,
        userIDObj,
        headers
      )
      .then((res) => {
        setResultArray(res.data.data);
        setTotalRecords(res.data.totalCert);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/login");
            cookies.remove("response");
            sessionStorage.clear();
          } else {
            notify("loginError", error.response.data.msg);
          }
        } else if (error.request) {
          // The request was made but no response was received
          notify("loginError", error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          notify("loginError", error.message);
        }
      });
  };
  const myCerts = (page) => {
    console.log(page);
    sessionStorage.setItem("newKey", 2);
    axios
      .get(
        env.apiUrl +
          `api/users/getMyCertificates?userId=${userId}&page=` +
          page,
        headers
      )
      .then((res) => {
        setResultArray(res.data.data[0].data);
        setTotalRecords(res.data.data[0].count[0].count);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            cookies.remove("response");
            sessionStorage.clear();
          } else {
            notify("loginError", error.response.data.msg);
          }
        } else if (error.request) {
          // The request was made but no response was received
          notify("loginError", error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          notify("loginError", error.message);
        }
      });
  };

  const transferredCerts = (page) => {
    console.log(page);
    sessionStorage.setItem("newKey", 3);
    history.push("/dashboard?page=" + page);
    axios
      .get(
        env.apiUrl +
          `api/users/getFilesTransferred?userId=${userId}&page=` +
          page,
        headers
      )
      .then((res) => {
        setResultArray(res.data.data[0].data);
        setTotalRecords(res.data.data[0].count[0].count);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            cookies.remove("response");
            sessionStorage.clear();
          } else {
            notify("loginError", error.response.data.msg);
          }
        } else if (error.request) {
          // The request was made but no response was received
          notify("loginError", error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          notify("loginError", error.message);
        }
      });
  };

  const unverifiedCerts = (page) => {
    sessionStorage.setItem("newKey", 4);
    history.push("/dashboard?page=" + page);
    axios
      .get(
        env.apiUrl +
          `api/users/getFilesUnverified?userId=${userId}&page=` +
          page,
        headers
      )
      .then((res) => {
        setResultArray(res.data.data[0].data);
        setTotalRecords(res.data.data[0].count[0].count);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            cookies.remove("response");
            sessionStorage.clear();
          } else {
            notify("loginError", error.response.data.msg);
          }
        } else if (error.request) {
          // The request was made but no response was received
          notify("loginError", error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          notify("loginError", error.message);
        }
      });
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const searchCerts = (e) => {
    //  e.preventDefault();
    if (searchTerm.length > 0) {
      const data = {
        userId: userId,
        searchFor: searchTerm,
      };
      axios
        .post(env.apiUrl + `api/users/searchingFiles`, data, headers)
        .then((res) => {
          if (res.data.data.length > 0) {
            setResultArray(res.data.data);
            setTotalRecords(res.data.totalCert);
          } else {
            notify("loginError", "No Result");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 403) {
              notify(
                "loginError",
                "Token is expired. Please try to login again"
              );
              history.push("/");
              cookies.remove("response");
              sessionStorage.clear();
            } else {
              notify("loginError", error.response.data.msg);
            }
          } else if (error.request) {
            // The request was made but no response was received
            notify("loginError", error.message);
          } else {
            // Something happened in setting up the request that triggered an Error
            notify("loginError", error.message);
          }
        });
    } else {
      allCerts();
    }
  };
  const handleCreateCert = () => {
    history.push("./createCert");
  };

  const verifyCert = (t) => {
    // e.preventDefault();
    confirmAlert({
      title: "Confirm Verify",
      message: "Do you want to pay $1 for verify ? ",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            const data = {
              imageId: t,
              userId: userId,
            };
            axios
              .post(
                env.apiUrl + `api/users/uploadFileIntoBlockchainwithsqs`,
                data,
                headers
              )
              .then((res) => {
                notify("loginError", res.data.msg);
                callFunOnKey();
                // window.location.reload();
              })
              .catch((error) => {
                if (error.response) {
                  if (error.response.status === 403) {
                    notify(
                      "loginError",
                      "Token is expired. Please try to login again"
                    );
                    history.push("/");
                    cookies.remove("response");
                    sessionStorage.clear();
                  } else {
                    notify("loginError", error.response.data.msg);
                  }
                } else if (error.request) {
                  // The request was made but no response was received
                  notify("loginError", error.message);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  notify("loginError", error.message);
                }
              });
          },
        },
        {
          label: "Cancel",
          // onClick: () => alert("Click No"),
        },
      ],
    });
  };

  const shareCert = (t) => {
    // e.preventDefault();
    const url = env.apiUrl + `viewSingleCert?${t._id}`;
    const titles = `Check out the Certificate (${t.subject}) created by (${t.issuerName}) %0D%0A%0D%0A ${url}`;
    const u = `${env.uploadImgLink}${t.imageName}`;
    const openFb = (e) => {
      window.open(
        "http://www.facebook.com/sharer.php?u=" +
          encodeURIComponent(u) +
          "&t=" +
          encodeURIComponent(t) +
          "&quote=" +
          titles,
        "sharer",
        "toolbar=0,status=0,width=326,height=336"
      );
      return false;
    };
    const openTwitter = (e) => {
      window.open("https://twitter.com/intent/tweet?url=" + titles);
      return false;
    };
    const gmailOpen = () => {
      window.open(
        `https://mail.google.com/mail/?view=cm&amp;fs=1&amp;tf=1&amp;to=&amp;&subject=${t.subject} &body= ${titles}`
      );
      return false;
    };
    confirmAlert({
      title: "Share Certificate",
      message: (
        <>
          <i className="fa fa-facebook fa-2x mr-4" onClick={openFb}></i>
          <i className="fa fa-twitter fa-2x mr-4" onClick={openTwitter}></i>
          <i className="fa fa-envelope fa-2x" onClick={gmailOpen}></i>
        </>
      ),
      buttons: [
        {
          label: "Cancel",
          // onClick: () => alert("Click No"),
        },
      ],
    });
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string(),
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data) => {
    axios
      .get(
        env.apiUrl +
          `api/users/find-email?username=${env.username}&email=${data.email}`,
        headers
      )
      .then((res) => {
        setReceiverID(res.data.user_id[0].id);
        setTransferShow(true);
        setSearchShow(false);
        setTransferShow(true);
        setshowTransferButton(true);
      })
      .catch((err) => {
        notify("loginError", err.response.data.msg);
        if (err.response.data.msg === "No email found.") {
          setFirstNameShow(true);
          setSignData(data);
          setSearchShow(false);
          setSignUpTransferShow(true);
        }
      });
  };

  const transfer = (p) => {
    const transferData = {
      userId: userId,
      password: password,
      receiverId: receiverId,
      imageId: p,
    };
    const checkHeader = {
      headers: {
        "content-type": "application/json",
      },
    };
    axios
      .get(
        env.apiUrl +
          `api/users/checkSecondTransfer?username=${env.username}&imageId=${p}`,
        checkHeader
      )
      .then((res) => {
        setSignUpTransferShow(false);
        setshowTransferButton(true);
        if (password) {
          if (res.data.msg === "sellSafetransferfrom") {
            axios
              .post(
                env.apiUrl + "api/users/sellSafetransferfrom",
                transferData,
                headers
              )
              .then((res) => {
                notify("loginError", res.data.msg);
                // setTransferShow(true);
                setFirstNameShow(false);
                setSearchShow(false);
                callFunOnKey();
                // window.location.reload();
              })
              .catch((err) => {
                if (err.response) {
                  notify("loginError", err.response.data.msg);
                  if (err.response.data.status === false) {
                    if (
                      err.response.data.msg ===
                      "Wallet Balance Is Less Than To Transaction Fee"
                    ) {
                      history.push("/wallet");
                    }
                  }
                }
              });
          } else if (res.data.msg === "transferfile") {
            axios
              .post(
                env.apiUrl + "api/users/transferFilewithsqs",
                transferData,
                headers
              )
              .then((res) => {
                notify("loginError", res.data.msg);
                // setTransferShow(true);
                setFirstNameShow(false);
                setSearchShow(false);
                callFunOnKey();
                // window.location.reload();
              })
              .catch((err) => {
                if (err.response) {
                  notify("loginError", err.response.data.msg);
                  if (err.response.data.status === false) {
                    if (
                      err.response.data.msg ===
                      "User is not owner of the Certificate."
                    ) {
                    }
                  }
                }
              });
          } else {
          }
        } else {
          notify("loginError", "Please provide login password");
        }
      })
      .catch((err) => {
        notify("loginError", err.response.data.msg);
      });
  };
  const signUp = (data) => {
    const signnupData = {
      userRole: "client",
      email: signData.email,
      firstName: firstName,
    };
    const options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post(env.apiUrl + "api/users/newsignup", signnupData, options)
      .then((res) => {
        // notify("loginError", res.data.msg);
        setSearchShow(false);
        setFirstNameShow(false);
        setTransferShow(true);
        setReceiverID(res.data.data.id);
        transfer(data);
      })
      .catch((err) => {
        if (err.response) {
          // notify("loginError", err.response.data.msg);
        }
      });
  };

  const renderData = (e) => {
    if (result_array) {
      const trail = result_array.map((t) => {
        return (
          <div className="col-sm-3 cardContainer">
            <div className="card cardHover">
              {t.imageName.split(".").pop() === "mp4" ? (
                <div className="card-flyer">
                  <div className="text-box">
                    <div className="image-box ">
                      <a target="_blank" href={`./viewCert?id=${t._id}`}>
                        <video
                          className="card-img-top img-fluid"
                          src={`${env.uploadImgLink}${t.imageName}`}
                          alt="certifictae"
                        />
                        {/* <VideoThumbnail
                          videoUrl={`${env.uploadImgLink}${t.imageName}`}
                          thumbnailHandler={(thumbnail) =>
                            console.log(thumbnail)
                          }
                          className="card-img-top img-fluid"
                          renderThumbnail={true}
                          snapshotAtTime={1}
                        /> */}
                      </a>
                      {t.imageStatus === "Verified" && (
                        <a
                          target="_blank"
                          href={`${env.explorerLink}tx/${t.txHash}`}
                        >
                          <div className="bottomright">
                            {/* <img className="verifiedIcon" /> */}
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-flyer">
                  <div className="text-box">
                    <div className="image-box ">
                      <a target="_blank" href={`./viewCert?id=${t._id}`}>
                        <img
                          className="card-img-top img-fluid"
                          src={`${env.uploadImgLink}${t.imageName}`}
                          alt="certificate"
                        />
                      </a>
                      {t.imageStatus === "Verified" && (
                        <a
                          target="_blank"
                          href={`${env.explorerLink}tx/${t.txHash}`}
                        >
                          <div className="bottomright">
                            {/* <img className="verifiedIcon" /> */}
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {t.type === "Art" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid #ff0096" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Photograph" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid #4d96f6" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "desc" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid #4d96f6" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Painting" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid #ff4000" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Book" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid #198754" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Collectible" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(245 16 37)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Design" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(55 52 247)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Document" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(245 124 38)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Furniture" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(78 35 4)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Jersey" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(236 106 106)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Print" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(175 92 251)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              {t.type === "Sculpture" && (
                <div
                  className="trapezoid"
                  style={{ borderBottom: "24px solid rgb(162 105 83)" }}
                >
                  <div className="categoryClass">{t.type}</div>
                </div>
              )}
              <div className="text-container">
                <div className="card-block">
                  <div className="row">
                    <h3 className="card-title heading mt-3">
                      <span className="Digital-Art">{t.subject}</span>
                    </h3>
                  </div>
                  <div className="row">
                    <p className="NFTDescription">{t.category}</p>
                  </div>
                  <div className="row">
                    <div className="col-1">
                      <i
                        className="fa fa-share-alt"
                        onClick={(e) => shareCert(t)}
                      ></i>
                    </div>
                    <div className="col-9"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
      return (
        <div
          className="row"
          style={{
            margin: "0 30px",
          }}
        >
          {trail}
        </div>
      );
    }
  };
  return (
    <>
      <div className="container dashboardContainer">
        <Header />
        <HeaderBanner type="Collection" />
        {activateError && (
          <h2 className="activateerror red">
            {" "}
            Hi {userName}, You need to verify your authenticity in order to mint
            your NFT certificate in Blockchain, please{" "}
            <a href="/uploadKyc">click here</a> to submit your request.
          </h2>
        )}
        {renderData()}
        <div className="paginate">
          <Pagination
            totalRecords={totalRecords}
            pageLimit={8}
            pageRangeDisplayed={1}
            onChangePage={handlePageClick}
            // activePage={currentPage}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Collection;

const EthereumPriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  font-family: "Aileron Bold";
  p {
    color: #0a1567;
    line-height: 1.4;
    letter-spacing: normal;
    margin-bottom: 0;
    margin-right: 8px;
  }
`;

const EthLogoImg = styled.img`
  width: 13px;
  margin-right: 4px;
`;
