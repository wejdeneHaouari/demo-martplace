import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import { env } from "../../constants";
import Pagination from "reactjs-hooks-pagination";
import "./index.css";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import shareIcon from "../../assets/images/storeFront/share-icon.svg";
import checkmarkIcon from "../../assets/images/storeFront/checkmark-copy.svg";
import styled from "styled-components";
import { userID } from "../../constants/apiEndPoints";

function Dashboard() {
  const cookies = new Cookies();
  const history = useHistory();
  const [result_array, setResultArray] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [certsPerPage, setCertsPerPage] = useState(40);
  let inputEl = useRef(null);



  const [sideDrawerOpen, setSideDrawer] = useState(false);

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
    if (type === "loginError" || type === "success") {
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
      .catch((error) => {});
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
      window.history.replaceState(null, null, "#");
      allCerts(currentPage);
    }
  };
  const allCerts = (page) => {
    history.push("/dashboard?page=" + page);

    sessionStorage.setItem("newKey", 1);
    window.history.replaceState(null, null, "#");
    axios
      .post(
        env.apiUrl + `api/users/getFilesByuserId40?page=` + page,
        userIDObj,
        headers
      )
      .then((res) => {
        if (res.data.data) {
          if (res.data.data.length > 0) {
            setResultArray(res.data.data);
            setTotalRecords(res.data.totalCert);
          } else {
          }
        } else {
          notify("loginError", res.data.msg);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
          if (error.response.status === 403) {
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/userLogin");
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
    sessionStorage.setItem("newKey", 2);
    axios
      .get(
        env.apiUrl +
          `api/users/getMyCertificates?userId=${userId}&page=` +
          page,
        headers
      )
      .then((res) => {
        if (res.data.data[0].data.length > 0) {
          setResultArray(res.data.data[0].data);
          setTotalRecords(res.data.data[0].count[0].count);
          setCertsPerPage(8);
        } else {
          notify("loginError", "No data found");
        }
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
    sessionStorage.setItem("newKey", 3);
    axios
      .get(
        env.apiUrl +
          `api/users/getFilesTransferred?userId=${userId}&page=` +
          page,
        headers
      )
      .then((res) => {
        if (res.data.data[0].data.length > 0) {
          setResultArray(res.data.data[0].data);
          setTotalRecords(res.data.data[0].count[0].count);
          setCertsPerPage(8);
        } else {
          notify("loginError", "No data found");
        }
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
    axios
      .get(
        env.apiUrl +
          `api/users/getFilesUnverified?userId=${userId}&page=` +
          page,
        headers
      )
      .then((res) => {
        if (res.data.data[0].data.length > 0) {
          setResultArray(res.data.data[0].data);
          setTotalRecords(res.data.data[0].count[0].count);
          setCertsPerPage(8);
        } else {
          notify("loginError", "No data found");
        }
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


  const searchCertificates = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateCert = () => {
    history.push("./createCert");
  };

  const verifyCertificate = (t) => {
    const data = {
      imageId: t._id,
      userId: userId,
    };
    axios
      .post(
        env.apiUrl + `api/users/uploadFileIntoBlockchainwithsqs`,
        data,
        headers
      )
      .then((res) => {
        notify("success", res.data.msg);
        callFunOnKey();
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

  const verifyCert = (t) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="cf__card">
            <div className="d-flex align-items-center justify-content-between cf__card-topbar">
              <h1>Verify Item</h1>
              <button onClick={onClose}>X</button>
            </div>

            <div className="cf__card--top">

                <div className="cf__card-flyer">
                  <div className="tcf__ext-box">
                    <div className="icf__mage-box ">
                      <a href={`./viewCert?id=${t._id}`}>
                        <img
                          className="cf__card-img-top"
                          src={`${env.uploadImgLink}${t.imageName}`}
                          alt="certificate"
                        />
                      </a>
                    </div>
                  </div>
                </div>

              <div className="cf__text-container">
                <div className="">
                  <h3 className="cf__card-title ">{t.subject}</h3>
                  <h6 className="cf__card__desc" style={{ fontSize: "20px" }}>
                    {t.id}
                  </h6>

                  <h6 className="cf__card__desc">{t.category}</h6>
                  <p className="mt-4">
                    We charge{" "}
                    <span style={{ color: "#3e4ef1", fontWeight: "bold" }}>
                      ${env.transactionFee} USD
                    </span>{" "}
                    for verification fee.
                    <br></br>Do you want to continue?{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="cf__btn-ctn">
              <button
                className="btn btn-primary mb-3"
                onClick={async () => {
                  await verifyCertificate(t);
                  onClose();
                }}
              >
                CONTINUE
              </button>
              <button className="btn btn-primary btn--sbd" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const listForSaleAPi = (t) => {
    const data = {
      imageId: t._id,
      userId: userId,
      forSaleStatus: "true",
      price: inputEl.current.value * 100,
    };
    axios
      .post(env.apiUrl + `api/users/changeForSaleStatus`, data, headers)
      .then((res) => {
        notify("loginError", "Item successfully listed for sale");
        callFunOnKey();
        console.log("list item data returned", res.data);
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

  const listForSale = (t) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="cf__card">
            <div className="d-flex align-items-center justify-content-between cf__card-topbar">
              <h1>List Item for Sale</h1>
              <button onClick={onClose}>X</button>
            </div>

            <div className="cf__card--top">
              {t.imageName.split(".").pop() === ("mp3" || "mp4") ? (
                <div className="cf__card-flyer">
                  <div className="cf__text-box">
                    <div className="cf__image-box ">
                      <a href={`./viewCert?id=${t._id}`}>
                        <img
                          className="cf__card-img-top"
                          src={`${env.uploadImgLink}${t.thumbNail}`}
                          alt="certifictae"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="cf__card-flyer">
                  <div className="tcf__ext-box">
                    <div className="icf__mage-box ">
                      <a href={`./viewCert?id=${t._id}`}>
                        <img
                          className="cf__card-img-top"
                          src={`${env.uploadImgLink}${t.imageName}`}
                          alt="certificate"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="cf__text-container">
                <div className="">
                  <h3 className="cf__card-title ">{t.subject}</h3>
                  <h6 className="cf__card__desc" style={{ fontSize: "20px" }}>
                    {t.id}
                  </h6>

                  <h6 className="cf__card__desc">{t.category}</h6>
                </div>
              </div>
            </div>
            <div className="cf__price-ctn">
              <p className="mb-1">Listing Price</p>
              <select>
                <option value="USD">USD</option>
              </select>
              <input
                name="listing price"
                className="cf__price-ctn--input-dash"
                type="number"
                ref={inputEl}
              />
            </div>
            <div className="cf__btn-ctn">
              <button
                className="btn btn-primary mb-3"
                onClick={async () => {
                  await listForSaleAPi(t);
                  onClose();
                }}
              >
                CONTINUE
              </button>
              <button className="btn btn-primary btn--sbd" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </div>
        );
      },
    });
  };
  const shareCert = (t) => {
    // e.preventDefault();
    let urlPrefix = window.location.href.split(".com")[0];
    const url = `${urlPrefix}.com/marketplace/viewCert?id=${t._id}`;
    const titles = `${url}`;
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
          // className='homeSharebtn'
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
          `api/users/find-email?userId=${userId}&email=${data.email}`,
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

    if (password) {
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
      notify("loginError", "Please provide login password");
    }

  };
  const signUp = () => {
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
        setSearchShow(false);
        setSignUpTransferShow(false)
        setFirstNameShow(true);
        setTransferShow(true);
        setshowTransferButton(true)
        setReceiverID(res.data.data.id);

      })
      .catch((err) => {
        if (err.response) {
          notify("loginError", err.response.data.msg);
        }
      });
  };


  const filteredItems = result_array.filter((item) =>
    item.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderData = (e) => {
    if (filteredItems) {
      const trail = filteredItems.map((t) => {
        return (
          <div className="col-12 col-sm-6 col-md-4 col-xl-3 cardNftAdmin">
            {t.imageStatus === "Verified" && (
              <a
                target="_blank"
                href={`${env.explorerLink}tx/${t.txHash}`}
                className="bottomright"
              >
                <img className="verifiedIcon" />
              </a>
            )}
            <div className="card listCard justify-content-between">
              {t.imageName.split(".").pop() === ("mp3" || "mp4") ? (
                <div className="card-flyer">
                  <div className="text-box">
                    <div className="image-box ">
                      <a href={`./viewCert?id=${t._id}`}>
                        <img
                          className="card-img-top img-fluid"
                          src={`${env.uploadImgLink}${t.thumbNail}`}
                          alt="certifictae"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-flyer">
                  <div className="image-box ">
                    <a href={`./viewCert?id=${t._id}`}>
                      <img
                        className="card-img-top img-fluid"
                        src={`${env.uploadImgLink}${t.imageName}`}
                        alt="certificate"
                      />
                    </a>
                  </div>
                  <div className="card__nft-tag">
                    <span>{t.type && t.type.replace("with", "+")}</span>
                  </div>
                </div>
              )}

              <div className="text-container flex-grow-1">
                <div className="card-block card-block--dash mt-auto card__nft--subctn">
                  <div className="px-4">
                    <div className="row">
                      <h3 className="card-title heading mt-0">{t.subject}</h3>
                    </div>
                    <div className="row">
                      <h6 className="card__desc">{t.category}</h6>
                    </div>
                  </div>

                  <div className="d-flex align-items-center py-2">
                    <img
                      src={shareIcon}
                      alt="share"
                      style={{ width: "32px", cursor: "pointer" }}
                      onClick={(e) => shareCert(t)}
                    />
                    <div className="ml-auto mr-4 d-flex align-items-center">
                      {t.imageStatus === "Unverified" && (
                        <div
                          onClick={(e) => verifyCert(t)}
                          className="toogleVerify text-right green w-100 mr-2"
                          id={"certVerifyStatus" + t._id}
                          style={{ padding: "0px" }}
                        >
                          <span className="btnVerify">Mint</span>
                        </div>
                      )}
                      {t.isOwned === "No" && t.imageStatus === "Verified" && (
                        <div className="d-flex align-items-center mr-2">
                          <img
                            src={checkmarkIcon}
                            alt="nft verified"
                            style={{ width: "20px", marginRight: "2px" }}
                          />
                          <p className="m-0 verified__text">Transferred</p>
                        </div>
                      )}
                      {t.imageStatus === "Queued" && (
                        <div
                          className="text-right toogleTransfer blue w-100"
                          style={{ padding: "0px" }}
                        >
                          <span className="admindash__queued d-flex align-items-center">
                            <i
                              className="fa fa-hourglass black"
                              title="Queued"
                            ></i>
                            <span
                              className="ml-2 my-0"
                              title="Certificate is queued for verification"
                            >
                              Queued
                            </span>
                          </span>
                        </div>
                      )}
                      {t.imageStatus === "Processing" && (
                        <div className="text-right toogleTransfer blue w-100 d-flex align-items-center">
                          <div class="css__loader"></div>
                          <p className="admin__verifying m-0 ml-2">
                            Minting item...
                          </p>
                        </div>
                      )}
                      {t.isOwned === "Yes" &&
                        t.imageStatus === "Verified" &&
                        t.forSaleStatus == true && (
                          <div className="d-flex align-items-center mr-2">
                            <img
                              src={checkmarkIcon}
                              alt="nft verified"
                              style={{ width: "24px", marginRight: "2px" }}
                            />
                            <p className="m-0 verified__text">For Sale</p>
                          </div>
                        )}

                      {t.isOwned === "Yes" && t.imageStatus === "Verified" && (
                        <>
                          <div className="d-flex align-items-center">
                            {t.forSaleStatus == false && (
                              <div
                                onClick={(e) => {
                                  listForSale(t);
                                }}
                                className="btnListIt mr-2"
                              >
                                List It
                              </div>
                            )}

                            <div
                              onClick={() => {
                                toggleModal();
                                setSelectedId(t._id);
                              }}
                              className="btnTransfer"
                            >
                              Transfer
                            </div>
                          </div>

                          <Modal
                            isOpen={isOpen}
                            onRequestClose={toggleModal}
                            contentLabel="My dialog"
                            className={`mymodal`}
                            overlayClassName="myoverlay"
                            closeTimeoutMS={500}
                          >
                            <>
                              <h3>Transfer Certificate</h3>
                              <form onSubmit={handleSubmit(onSubmit)}>
                                <>

                                  <div className="form-group mb-4">
                                    <input
                                      name="email"
                                      type="text"
                                      placeholder="Email"
                                      {...register("email")}
                                      className={`form-control ${
                                        errors.email ? "is-invalid" : ""
                                      }`}
                                    />

                                    <div className="invalid-feedback">
                                      {errors.email?.message}
                                    </div>
                                  </div>
                                  {firstNameShow && (
                                      <div className="form-group mb-4">
                                        <input
                                            name="firstName"
                                            type="text"
                                            placeholder="firstName"
                                            {...register("firstName")}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            className={`form-control ${
                                                errors.firstName ? "is-invalid" : ""
                                            }`}
                                        />

                                        <div className="invalid-feedback">
                                          {errors.firstName?.message}
                                        </div>
                                      </div>
                                  )}
                                </>
                                {showTransfer && (
                                  <>
                                    <h6>Provide your password</h6>{" "}
                                    <div className="form-group mb-4">
                                      <input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                          setPassword(e.target.value)
                                        }
                                        className={`form-control ${
                                          errors.password ? "is-invalid" : ""
                                        }`}
                                      />

                                      <div className="invalid-feedback">
                                        {errors.password?.message}
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="row mb-4">
                                  <div className="col-6">
                                    <div
                                      className="btn btn-secondary w-100"
                                      onClick={toggleModal}
                                    >
                                      Close
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    {showSearch && (
                                      <button
                                        className="btn btn-primary w-100"
                                        type="submit"

                                        // disabled={disableSubmit}
                                      >
                                        Search
                                      </button>
                                    )}
                                    {showTransferButton && (
                                      <button
                                        className="btn btn-primary w-100"
                                        type="button"
                                        onClick={() => transfer(selectedId)}
                                        // disabled={disableSubmit}
                                      >
                                        Transfer
                                      </button>
                                    )}
                                    {showSignUpTransfer && (
                                      <button
                                        className="btn btn-primary w-100"
                                        type="button"
                                        onClick={() => signUp(selectedId)}
                                        // disabled={disableSubmit}
                                      >
                                        Signup
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </form>
                            </>
                          </Modal>
                        </>
                      )}
                    </div>
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
            margin: "30px",
            rowGap: "24px",
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
        <nav className="navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-light secondHeader">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item" key="allCerts">
                  <a
                    className={
                      history.location.hash === ""
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                    onClick={() => allCerts()}
                    href="#"
                  >
                    ALL
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="myCert">
                  <a
                    className={
                      history.location.hash === "#myCert"
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                    onClick={(e) => myCerts(currentPage)}
                    href="#myCert"
                  >
                    MY
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="transferCert">
                  <a
                    href="#transferCert"
                    className={
                      history.location.hash === "#transferCert"
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                    onClick={() => transferredCerts(currentPage)}
                  >
                    TRANSFERRED
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <li className="nav-item" key="unverifiedCert">
                  <a
                    className={
                      history.location.hash === "#unverifiedCert"
                        ? "active subHeading nav-link"
                        : "subHeading nav-link"
                    }
                    href="#unverifiedCert"
                    onClick={() => unverifiedCerts(currentPage)}
                  >
                    UNVERIFIED
                  </a>
                </li>
                <div className="Line-Copy-6"></div>
                <form id="">
                  <input
                    className="admindash__search"
                    type="search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={searchCertificates}
                  />
                </form>
              </ul>
              {createCertificate ? (
                <form className="ml-auto mr-4 ">
                  <button
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                    }}
                    className="btn btn-primary subHeadingButton"
                    type="button"
                    onClick={handleCreateCert}
                  >
                    <span>CREATE CERTIFICATE</span>
                  </button>
                </form>
              ) : (
                ""
              )}
            </div>
          </div>
        </nav>
        {activateError && (
          <h2 className="activateerror red">
            {" "}
            Hi {userName}, You need to verify your authenticity in order to mint
            your NFT certificate in Blockchain, Please kindly send an email to info@app-scoop.com to activate your account on Chaincerts for minting
          </h2>
        )}
        {result_array && renderData()}
        {result_array && (
          <div className="paginate">
            <Pagination
              totalRecords={totalRecords}
              pageLimit={certsPerPage}
              pageRangeDisplayed={1}
              onChangePage={handlePageClick}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;

