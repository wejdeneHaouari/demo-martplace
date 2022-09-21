import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import Moment from "moment";
import { ReactVideo } from "reactjs-media";
import videoBg from "../../assets/images/download.png"; // with import
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import verifiedlogo from "../../assets/images/verifiedIcon.png"; // with import
import logoSrc from "../../assets/images/logo.png"; // relative path to image
import "./index.css";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Header from "../../components/Header";
import Footer from "../../components/Common/Footer/Footer";
import openSeaBadge from "../../assets/images/open-sea-badge.png";
import shareIcon from "../../assets/images/storeFront/share-icon.svg";
import verifiedIcon from "../../assets/images/storeFront/verified.svg";
import checkmarkIcon from "../../assets/images/storeFront/checkmark-copy.svg";
import ListIcon from "../../assets/images/storeFront/list.svg";
import HistoryIcon from "../../assets/images/storeFront/history-icon.svg";

import "./download.js";
import UserProgressBar from "../../components/Progressbar";

function ViewCert() {
  const [certificateArray, setcerticateArray] = useState({});
  const [imageExt, setImageExt] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferOpen, setTransferIsOpen] = useState(false);
  const [firstNameShown, setFirstNameShow] = useState(false);
  const [signData, setSignData] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [showTransfer, setTransferShow] = useState(false);
  const [showSearch, setSearchShow] = useState(true);
  const [receiverId, setReceiverID] = useState("");
  const [showTransferButton, setshowTransferButton] = useState(false);
  const [showSignUpTransfer, setSignUpTransferShow] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const history = useHistory();
  const [listingPrice, setListingPrice] = useState(1);
  const inputEl = useRef(null);
  const [saleStatus, setSaleStatus] = useState(false);
  const [token_id, settokenId] = useState("");
  const [contact_address, setContactAddress] = useState("");

  const cookies = new Cookies();
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };
  const ids = window.location.href.split("?id=")[1];
  const imgId = JSON.stringify({
    imageId: ids,
  });
  const userId = cookies.get("userId");
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const certheaders = {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: authToken,
    },
  };

  const getFileById = () => {
    axios
      .post(env.apiUrl + `api/users/getFilesById`, imgId, certheaders)
      .then((res) => {
        setcerticateArray(res.data.data);
        console.log(res.data.data);
        setListingPrice(res.data.data.price / 100);

        const certArray = res.data.data;
        certArray.events.map((item) => {
          if (item.type == "Creation") {
            setContactAddress(item.contract_address);
            settokenId(item.token_id);
          }
        });
        setImageExt(res.data.data.imageName.split(".").pop());
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            Cookies.remove("response");
            sessionStorage.clear();
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/userLogin");
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });
  };

  useEffect(() => {
    getFileById();
  }, []);

  function toggleModal() {
    setIsOpen(!isOpen);
  }
  function toggleTransferModal() {
    setTransferIsOpen(!isTransferOpen);
  }

  const verifyCert = (id) => {

    confirmAlert({
      title: "Confirm Verify",
      message: "Do you want to pay $1 for verify ? ",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            const data = {
              imageId: id,
              userId: userId,
            };
            axios
              .post(
                env.apiUrl + `api/users/uploadFileIntoBlockchainwithsqs`,
                data,
                headers
              )
              .then((res) => {
                setIsVerified(false);
                notify("loginError", res.data.msg);
              })
              .catch((error) => {
                if (error.response) {
                  if (error.response.status === 403) {
                    notify(
                      "loginError",
                      "Token is expired. Please try to login again"
                    );
                    history.push("/userLogin");
                    cookies.remove("response");
                  } else {
                    notify("loginError", error.response.data.msg);
                  }
                }
              });
          },
        },
        {
          label: "Cancel",
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
    console.log(p);
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

    if (password) {
      axios
          .post(
              env.apiUrl + "api/users/transferFilewithsqs",
              transferData,
              headers
          )
          .then((res) => {
            notify("loginError", res.data.msg);
            setFirstNameShow(false);
            setSearchShow(false);
            window.location.reload();
          })
          .catch((err) => {
            if (err.response) {
              notify("loginError", err.response.data.msg);

            }
          });

    } else {
      notify("loginError", "Please provide login password");
    }

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
        setSearchShow(false);
        setSignUpTransferShow(false)
        setFirstNameShow(true);
        setTransferShow(true);
        setshowTransferButton(true)
        setReceiverID(res.data.data.id);
      })
      .catch((err) => {
        if (err.response) {
          // notify("loginError", err.response.data.msg);
        }
      });
  };



  const shareCert = (t) => {
    const url = env.apiUrl + `viewSingleCert?${t.id}`;
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
        },
      ],
    });
  };
  const updatePrice = (t) => {
    const data = {
      imageId: t._id,
      userId: userId,
      forSaleStatus: "true",
      price: listingPrice * 100,
    };
    axios
      .post(env.apiUrl + `api/users/changeForSaleStatus`, data, headers)
      .then((res) => {
        notify("loginError", "Item price updated");
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

  const ref = React.createRef();



  //List For Sale
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
        getFileById();
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
              {t.imageName.split(".").pop() === "mp4" ? (
                <div className="cf__card-flyer">
                  <div className="cf__text-box">
                    <div className="cf__image-box ">
                      <a target="_blank" href={`./viewCert?id=${t._id}`}>
                        <video
                          className="cf__card-img-top"
                          src={`${env.uploadImgLink}${t.imageName}`}
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
            <div className="cf__price-ctn cf__price-ctn-2">
              <p className="mb-1">Listing Price</p>
              <select>
                <option value="USD">USD</option>
              </select>
              <input
                name="listing price"
                className="cf__price-ctn--input-vc"
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
                  setSaleStatus(true);
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

  //List For Sale
  const unListForSaleAPi = (t) => {
    const data = {
      imageId: t._id,
      userId: userId,
      forSaleStatus: "false",
      price: 10,
    };
    axios
      .post(env.apiUrl + `api/users/changeForSaleStatus`, data, headers)
      .then((res) => {
        notify("loginError", "Item successfully removed from sale");
        getFileById();
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

  const unListForSale = (t) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="cf__card">
            <div className="d-flex align-items-center justify-content-between cf__card-topbar">
              <h1>Unlist</h1>
              <button onClick={onClose}>X</button>
            </div>

            <div className="cf__card--top">
              <div className="cf__text-container">
                <h3 className="cf__card-title my-4">
                  Are you sure to remove this item from sale ?
                </h3>
              </div>
            </div>
            <div className="cf__btn-ctn">
              <button
                className="btn btn-primary mb-3"
                onClick={async () => {
                  await unListForSaleAPi(t);
                  onClose();
                  setSaleStatus(false);
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

  return (
    <>
      <Header />
      <div className="container viewContainer" ref={ref}>
        <div className="test">
          <div className="card viewContainer--vc">
            <div className="logoContainer">
              <img src={logoSrc} className="logo text-center"></img>
            </div>
            {imageExt === "mp4" ? (
              <>
                <div className="containerdiv">
                  <ReactVideo
                    src={`${env.uploadImgLink}${certificateArray.imageName}`}
                    poster={videoBg}
                    alt=""
                    primaryColor="red"
                    style={{
                      width: "100%",
                      height: "346px",
                      margin: "130px 0 130px 0",
                      objectFit: "contain",
                    }}
                    className="certImg"
                  />

                  {certificateArray.imageStatus === "Verified" && (
                    <img
                      src={verifiedlogo}
                      className="cornerimage"
                      style={{ bottom: "-23px" }}
                    ></img>
                  )}
                </div>

              </>
            ) : (
              <div className="containerdiv">
                <img
                  src={`${env.uploadImgLink}${certificateArray.imageName}`}
                  alt="Avatar"
                  className="certImg"
                />
                {certificateArray.imageStatus === "Verified" && (
                  <img src={verifiedlogo} className="cornerimage"></img>
                )}
              </div>
            )}
          </div>
          <div className="card card2 card__nftsingle">
            <div className="container text-left ml-4">
              <div className="d-flex align-items-center justify-content-between cert__single">
                <h2 className="d-block">Non Fungible Token</h2>
                <div className="d-flex align-items-center icons__ctn mr-4">
                  <div className="">
                    <div className="share mr-3">
                      <img
                        src={shareIcon}
                        alt="share"
                        onClick={(e) => shareCert(certificateArray)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  <div>
                    <a
                      title="Check this item in opensea.io"
                      href={`https://opensea.io/assets/matic/${contact_address}/${token_id}`}
                    >
                      <img
                        src={openSeaBadge}
                        alt="open-sea"
                        className="open__sea"
                        style={{ cursor: "pointer" }}
                      />
                    </a>
                  </div>
                </div>
              </div>

              <h2 className="coa">Certificate of Authenticity</h2>
              <div
                className="d-flex align-items-center"
                style={{ width: "88%" }}
              >
                <h3 className=" nft__title">{certificateArray.subject}</h3>
                <img
                  src={verifiedIcon}
                  alt="nft verified"
                  className="verfied__icon"
                  style={{ width: "23px", marginLeft: "7px" }}
                />
              </div>
              <p className="nft__desc">{certificateArray.category}</p>

              {certificateArray.forSaleStatus &&
                certificateArray.isOwned === "Yes" && (
                  <div className="d-flex align-items-center my-3">
                    <img
                      src={checkmarkIcon}
                      alt="nft verified"
                      style={{ width: "24px", marginRight: "5px" }}
                    />
                    <p className="m-0 verified__text">For Sale</p>
                  </div>
                )}

              {certificateArray.forSaleStatus &&
                certificateArray.isOwned === "Yes" && (
                  <div className="d-flex align-items-center mt-3">
                    <p className="mb-1 cc__price mr-2">Price</p>
                    <div className="cc__price-ctn d-flex align-items-center ">
                      <select>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        name="listing price"
                        type="text"
                        onChange={(e) => setListingPrice(e.target.value)}
                        value={listingPrice}
                      />
                    </div>
                    <button
                      className="cc__update-btn ml-2"
                      onClick={(e) => {
                        updatePrice(certificateArray);
                      }}
                    >
                      Update
                    </button>
                  </div>
                )}

              <div className="Line-2-Copy"></div>
              <div className="row">
                <div className="col-md-5">
                  <span className="title">Title</span>
                </div>
                <div className="col-md-6">
                  <span className="subject">{certificateArray.subject}</span>
                </div>
              </div>
              <div className="Line-2-Copy"></div>
              <div className="row">
                <div className="col-md-5">
                  <span className="title">Date of Issue</span>
                </div>
                <div className="col-md-6">
                  <span className="subject">
                    {certificateArray.dateofIssue &&
                      certificateArray.dateofIssue.slice(0, 15)}
                  </span>
                </div>
              </div>
              <div className="Line-2-Copy"></div>

              <div className="row">
                <div className="col-md-5">
                  <span className="title">QTY</span>
                </div>
                <div className="col-md-6">
                  <span className="subject">{certificateArray.quantity}</span>
                </div>
              </div>

              <div className="Line-2-Copy"></div>

              {certificateArray &&
                certificateArray.attributes &&
                certificateArray.attributes.length &&
                certificateArray.attributes[0].trait_type.length > 0 && (
                  <div className="row">
                    <div className="col-md-5">
                      <span className="title">Traits</span>
                    </div>
                  </div>
                )}

              <div className="cc__taits-ctn d-flex">
                {certificateArray &&
                  certificateArray.attributes &&
                  certificateArray.attributes.map((att) =>
                    att.display_type === "boost_number" ? (
                      <></>
                    ) : (
                      certificateArray.attributes[0].trait_type.length > 0 && (
                        <div className="cc__trait">
                          <h4>{att.trait_type}</h4>
                          <h5>{att.value}</h5>
                        </div>
                      )
                    )
                  )}
              </div>

              <br />
              <div className="flex cc__btns-ctn">
                <div className="">
                  {certificateArray.imageStatus === "Verified" && (
                    <span className="Minted-on-Blockchain">
                      Minted on Blockchain
                      <i
                        className="fa fa-info-circle ml-1"
                        onClick={toggleModal}
                      ></i>{" "}
                      <Modal
                        isOpen={isOpen}
                        onRequestClose={toggleModal}
                        contentLabel="My dialog"
                        className="mymodal"
                        overlayClassName="myoverlay"
                        closeTimeoutMS={500}
                        ariaHideApp={false}
                      >
                        <h3>
                          What is the meaning of certificate minted on
                          Blockchain:
                        </h3>
                        <h6>
                          We mint and register each certificate details
                          including owner id, the hash of the image, the URI and
                          organization which issued the certificate inside of
                          Blockchain. Each image has a unique hash in which that
                          if someone tamper it the hash will be changed and we
                          can recognize that who did this.
                        </h6>
                        <br />
                        <h6>
                          Each certificate assigned with unique hash in
                          Blockchain with time stamps so we can trace the
                          authenticity of certificate.
                        </h6>
                        <br />
                        {certificateArray.imageStatus === "Verified" && (
                          <>
                            <p
                              aria-disabled="true"
                              style={{ fontWeight: "bold", width: "100%" }}
                            >
                              Blockchain transaction ID:
                            </p>
                            <span>{certificateArray.txHash}</span>
                          </>
                        )}
                      </Modal>
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center justify-content-end">
                  {certificateArray.imageStatus === "Unverified" &&
                    (isVerified ? (
                      <button
                        onClick={(e) => verifyCert(certificateArray.id)}
                        className="btn btn-primary cc__btn-verify"
                        id={"certVerifyStatus" + certificateArray._id}
                        isVerified
                      >
                        Mint
                      </button>
                    ) : (
                      <button
                        className=""
                      >
                        <span className="Transferred">
                          <i className="fa fa-hourglass" title="Queued"></i>
                        </span>
                      </button>
                    ))}
                  {certificateArray.isOwned === "No" &&
                    certificateArray.imageStatus === "Verified" && (
                      <div className="d-flex align-items-center mr-2">
                        <img
                          src={checkmarkIcon}
                          alt="nft verified"
                          style={{
                            width: "20px",
                            marginRight: "5px",
                            marginTop: "3.5px",
                          }}
                        />
                        <p className="m-0 verified__text">Transferred</p>
                      </div>
                    )}
                  {certificateArray.imageStatus === "Queued" && (
                    <div
                      className="text-right toogleTransfer blue w-100"
                      style={{ padding: "0px" }}
                    >
                      <span className="admindash__queued d-flex align-items-center d-flex align-items-center justify-content-end">
                        <i className="fa fa-hourglass black" title="Queued"></i>
                        <span
                          className="ml-2 my-0"
                          title="Certificate is queued for verification"
                        >
                          Queued
                        </span>
                      </span>
                    </div>
                  )}
                  {certificateArray.imageStatus === "Processing" && (
                    <button

                    >
                      <span>
                        <i
                          className="fa fa-spinner fa-pulse fa-lg black"
                          title="Processing"
                        ></i>
                      </span>
                    </button>
                  )}


                  {certificateArray.isOwned === "Yes" &&
                    certificateArray.imageStatus === "Verified" && (
                      <div className="d-flex align-items-center">
                        {certificateArray.forSaleStatus == false && (
                          <div
                            onClick={(e) => {
                              listForSale(certificateArray);
                            }}
                            className="btnListIt btnListIt-cc mr-2"
                          >
                            List It
                          </div>
                        )}
                      </div>
                    )}
                  {certificateArray.isOwned === "Yes" &&
                    certificateArray.imageStatus === "Verified" && (
                      <div className="d-flex align-items-center">
                        {certificateArray.forSaleStatus == true && (
                          <div
                            onClick={(e) => {
                              unListForSale(certificateArray);
                            }}
                            className="btnListIt btnListIt-cc mr-2"
                          >
                            Unlist It
                          </div>
                        )}
                      </div>
                    )}
                  {certificateArray.isOwned === "Yes" &&
                    certificateArray.imageStatus === "Verified" && (
                      <>
                        <a
                          onClick={toggleTransferModal}
                          className="btn btn-primary cc__btn-transfer"
                        >
                          Transfer
                        </a>

                        <Modal
                          isOpen={isTransferOpen}
                          onRequestClose={toggleTransferModal}
                          contentLabel="My dialog"
                          className="mymodal"
                          overlayClassName="myoverlay"
                          closeTimeoutMS={500}
                          ariaHideApp={false}
                        >
                          <h3>Transfer Certificate</h3>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <>
                              {firstNameShown && (
                                  <div className="form-group mb-4">
                                    <input
                                        name="firstName"
                                        type="text"
                                        placeholder="Recipient First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={`form-control ${
                                            errors.firstName ? "is-invalid" : ""
                                        }`}
                                    />

                                    <div className="invalid-feedback">
                                      {errors.firstName?.message}
                                    </div>
                                  </div>
                              )  }
                              <div className="form-group mb-4">
                                <input
                                  name="email"
                                  type="text"
                                  placeholder="Recipient Email"
                                  {...register("email")}
                                  className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                  }`}
                                />

                                <div className="invalid-feedback">
                                  {errors.email?.message}
                                </div>
                              </div>
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
                                <a
                                  className="btn btn-secondary w-100"
                                  onClick={toggleTransferModal}
                                >
                                  Close
                                </a>
                              </div>
                              <div className="col-6">
                                {showSearch && (
                                  <button
                                    className="btn btn-primary w-100"
                                    type="submit"

                                  >
                                    Search
                                  </button>
                                )}
                                {showTransferButton && (
                                  <button
                                    className="btn btn-primary w-100"
                                    type="button"
                                    onClick={(e) =>
                                      transfer(certificateArray.id)
                                    }
                                  >
                                    Transfer
                                  </button>
                                )}
                                {showSignUpTransfer && (
                                  <button
                                    className="btn btn-primary w-100"
                                    type="button"
                                    onClick={(e) => signUp(certificateArray.id)}
                                  >
                                    SIGNUP
                                  </button>
                                )}
                              </div>
                            </div>
                          </form>
                        </Modal>
                      </>
                    )}
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>
      <div
        className="container viewContainer"

      >
        <div className="test">
          <div className="accordions__ctn">
            <div className="row">
              <div className="col-md-6">
                <div className="accordion">
                  <div className="accordion-item">
                    <div
                      className="accordion-title"
                      onClick={() => setIsActive(!isActive)}
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={HistoryIcon}
                          alt="list-icon"
                          className="mr-3"
                        />
                        <div>HISTORY</div>
                      </div>
                      <div>
                        {isActive ? (
                          <div>
                            <i className="fa fa-chevron-up"></i>
                          </div>
                        ) : (
                          <div>
                            <i className="fa fa-chevron-down"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <div className="accordion-content">
                        {certificateArray.events.map(function (object, i) {
                          return (
                            <div className="accordion-subcontent">
                              <div className="row">
                                <div className="col-md-4">{object.type}</div>
                                <div className="col-md-8">
                                  {object.Msg} on
                                  {" " +
                                    Moment(object.date).format(
                                      "ddd. MMM DD, YYYY,  h:mm a"
                                    )}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4">
                                  Blockchain Registration
                                </div>
                                <div className="col-md-8">
                                  <a
                                    target="_blank"
                                    href={`${env.explorerLink}tx/${object.txHash}`}
                                  >
                                    {object.txHash}
                                  </a>
                                </div>
                              </div>
                              <div
                                className="Line-2-Copy"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                {certificateArray &&
                  certificateArray.attributes &&
                  certificateArray.attributes.length > 0 && (
                    <div className="accordion">
                      <div className="accordion-item">
                        <div
                          className="accordion-title"
                          onClick={() => setIsActive(!isActive)}
                        >
                          <>
                            <div className="d-flex align-items-center">
                              <i
                                alt="list-icon"
                                className="fa fa-star mr-3"
                              ></i>
                              <div className="row">&nbsp; LEVELS</div>
                            </div>
                            <div>
                              {isActive ? (
                                <div>
                                  <i className="fa fa-chevron-up"></i>
                                </div>
                              ) : (
                                <div>
                                  <i className="fa fa-chevron-down"></i>
                                </div>
                              )}
                            </div>
                          </>
                        </div>
                        {isActive && (
                          <div className="accordion-content">
                            <div className="accordion-subcontent">
                              <div className="card">
                                <div className="card-body">
                                  {certificateArray &&
                                    certificateArray.attributes &&
                                    certificateArray.attributes.map((att) =>
                                      att.display_type === "boost_number" ? (
                                        att.value.length > 0 && (
                                          <>
                                            <div className="row">
                                              <div className="col-md-1">
                                                <i
                                                  class="fa fa-star fa-9x"
                                                ></i>
                                              </div>
                                              <div className="col-md-8">
                                                <div className="">
                                                  <div>
                                                    <span class="Level-1">
                                                      {att.trait_type}
                                                    </span>
                                                    <div className="black">
                                                      <span class="Value">
                                                        {att.value} of{" "}
                                                        {att.max_value}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <UserProgressBar
                                                    now={att.value}
                                                    max={att.max_value}
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            <br></br>
                                          </>
                                        )
                                      ) : (
                                        <> </>
                                      )
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="accordion">
          <div className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => setIsActive(!isActive)}
            >
              <div className="d-flex align-items-center">
                <img src={ListIcon} alt="list-icon" className="mr-3" />
                <div>ADDITIONAL INFO</div>
              </div>

              <div>
                {isActive ? (
                  <div>
                    <i class="fa fa-chevron-up"></i>
                  </div>
                ) : (
                  <div>
                    <i class="fa fa-chevron-down"></i>
                  </div>
                )}
              </div>
            </div>
            {isActive && (
              <div className="accordion-content">
                <>
                  <div className="row">
                    <div className="col-md-4">Valid Until</div>
                    <div className="col-md-8">
                      {certificateArray.validUntil}
                    </div>
                  </div>

                  {certificateArray.height ||
                  certificateArray.width ||
                  certificateArray.depth ? (
                    <>
                      <div className="Line-2-Copy"></div>
                      <div className="row">
                        <div className="col-md-5">
                          <span className="title">Dimension (H x W)</span>
                        </div>
                        <div className="col-md-6">
                          <span className="subject">
                            {certificateArray.height *
                              certificateArray.width *
                              certificateArray.depth +
                              "" +
                              certificateArray.unit}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="Line-2-Copy"></div>
                  <div className="row">
                    <div className="col-md-4">Origin Location</div>
                    <div className="col-md-8">{certificateArray.place}</div>
                  </div>
                  <div className="Line-2-Copy"></div>
                  <div className="row">
                    <div className="col-md-4">Document ID</div>
                    <div className="col-md-8">{certificateArray.id}</div>
                  </div>
                  <div className="Line-2-Copy"></div>
                </>
                );
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ViewCert;
