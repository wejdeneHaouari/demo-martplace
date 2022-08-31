import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { env } from "../../../constants";
import Moment from "moment";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import verifiedlogo from "../../../assets/images/verifiedIcon.png"; // with import
import logoSrc from "../../../assets/images/logo.png"; // relative path to image
import "./index.css";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import VideoThumbnail from "react-video-thumbnail";
import { listOnSaleUrl } from "../../../constants/apiEndPoints";
import Header from "../../../components/Header";
import Footer from "../../../components/Common/Footer/Footer";
import openSeaBadge from "../../../assets/images/open-sea-badge.png";
import shareIcon from "../../../assets/images/storeFront/share-icon.svg";
import verifiedIcon from "../../../assets/images/storeFront/verified.svg";
import checkmarkIcon from "../../../assets/images/storeFront/checkmark-copy.svg";
import ListIcon from "../../../assets/images/storeFront/list.svg";
import HistoryIcon from "../../../assets/images/storeFront/history-icon.svg";
import UserProgressBar from "../../../components/Progressbar";
import Player from "video-react/lib/components/Player";

function CollectionViewCert() {
  const [certificateArray, setcerticateArray] = useState({});
  const [imageExt, setImageExt] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [firstNameShown, setFirstNameShow] = useState(false);
  const [signData, setSignData] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [showTransfer, setTransferShow] = useState(false);
  const [showSearch, setSearchShow] = useState(true);
  const [receiverId, setReceiverID] = useState("");
  const [thumbnail, setThumbnail] = useState("");
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
        console.log("df", certificateArray.price);

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
                    history.push("/");
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




  //Share Certificate
  const shareCert = (t) => {
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
        },
      ],
    });
  };



  const ref = React.createRef();




  function hasLevel() {
    if (certificateArray && certificateArray.attributes) {
      if (
        certificateArray.attributes.some(
          (e) => e.display_type === "boost_number"
        )
      ) {
        return true;
      }
      return false;
    }
  }

  return (
    <>
      <Header />
      <div className="container viewContainer" ref={ref}>
        <div className="test">
          <div className="card viewContainer--vc">
            <div className="logoContainer">
              <img src={logoSrc} className="logo text-center"></img>
            </div>

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
                  <div className="d-flex align-items-center mt-3">
                    <p className="mb-1 cc__price mr-2">Price</p>
                    <div className="cc__price-ctn d-flex align-items-center ">
                      <select disabled>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        name="listing price"
                        type="text"
                        disabled={true}
                        value={listingPrice}
                      />
                    </div>
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

              {certificateArray &&
                certificateArray.attributes &&
                certificateArray.attributes.length && (
                  <div className="row">
                    <div className="col-md-5">
                      <span className="title">Traits</span>
                    </div>
                  </div>
                )}

              <div className="cc__taits-ctn d-flex">
                {certificateArray &&
                  certificateArray.attributes &&
                  certificateArray.attributes.map(
                    (att) =>
                      att.value &&
                      att.trait_type &&
                      att.trait_type.indexOf("Access") == -1 && (
                        <div className="cc__trait">
                          <h4>{att.trait_type}</h4>
                          <h5>{att.value}</h5>
                        </div>
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
        <div className="accordion">
          <div className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => setIsActive(!isActive)}
            >
              <div className="d-flex align-items-center">
                <i alt="list-icon" className="fa fa-star mr-3"></i>
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
            </div>
            {isActive &&
              certificateArray &&
              certificateArray.attributes &&
              hasLevel() && (
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
                                        className="fa fa-star fa-9x"
                                      ></i>
                                    </div>
                                    <div className="col-md-8">
                                      <div className="">
                                        <div>
                                          <span className="Level-1">
                                            {att.trait_type}
                                          </span>
                                          <div className="black">
                                            <span className="Value">
                                              {att.value} of {att.max_value}
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

        <div className="accordion">
          <div className="accordion-item">
            <div
              className="accordion-title"
              onClick={() => setIsActive(!isActive)}
            >
              <div className="d-flex align-items-center">
                <img src={HistoryIcon} alt="list-icon" className="mr-3" />
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
                        <div className="col-md-4">Blockchain Registration</div>
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
      <Footer />
    </>
  );
}

export default CollectionViewCert;
