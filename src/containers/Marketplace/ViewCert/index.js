import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { env } from "../../../constants";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./index.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Common/Footer/Footer";
import HeaderBanner from "../../../components/MartplaceHeader/HeaderBanner";
import openSeaBadge from "../../../assets/images/open-sea-badge.png";
import shareIcon from "../../../assets/images/storeFront/share-icon.svg";
import HistoryIcon from "../../../assets/images/storeFront/history-icon.svg";
import Moment from "moment";
import { getNftsbyUsername } from "../../../constants/apiEndPoints";
import ListIcon from "../../../assets/images/storeFront/list.svg";

import SwiperCore, { Pagination } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/pagination/pagination.scss";
import PriceConverter from "../../../components/PriceConvert";
import { Player } from "video-react";
import "video-react/dist/video-react.css"; // import css
import UserProgressBar from "../../../components/Progressbar";
import moment from "moment";

function HomeViewCert() {
  const [certificateArray, setcerticateArray] = useState([]);
  const [imageExt, setImageExt] = useState("");
  const [token_id, settokenId] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [certificates, setcertificates] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(null);

  const checkIsBetween = (openingDate, endingDate) => {
    const d = new Date();

    const dx = Date.parse(d);

    const isTimeBetween = moment(dx).isBetween(openingDate, endingDate); // true

    if (isTimeBetween) {
      setStoreOpen(true);
    } else {
      setStoreOpen(false);
    }
  };

  const getStoreLogoBanner = () => {
    let myHeaders = new Headers();

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      env.apiUrl + `api/users/getUserProfile?username=${env.username}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const date = new Date();
        const offset = date.getTimezoneOffset() * 60000;

        let countdownTimestampMsOpening =
          Date.parse(result.data.store_opening_date) + offset;
        setStoreOpeningDate(countdownTimestampMsOpening);

        let countdownTimestampMsEnding =
          Date.parse(result.data.store_ending_date) + offset;
        setStoreEndingDate(countdownTimestampMsEnding);
        checkIsBetween(countdownTimestampMsOpening, countdownTimestampMsEnding);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getStoreLogoBanner();
  }, []);


  SwiperCore.use([Pagination]);

  const cookies = new Cookies();
  const token = cookies.get("response");
  const authToken = "Bearer " + token;

  const ids = window.location.href.split("?id=")[1];
  const imgId = JSON.stringify({
    imageId: ids,
  });
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
  useEffect(() => {
    axios
      .post(env.apiUrl + `api/users/getFilesById`, imgId, certheaders)
      .then((res) => {
        setcerticateArray(res.data.data);
        console.log(res.data.data);
        const certArray = res.data.data;
        console.log("certificate", res.data);
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
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });
  }, []);

  useEffect(() => {
    allHomeCerts();
  }, [certificateArray]);

  const allHomeCerts = () => {
    axios
      .get(env.apiUrl + getNftsbyUsername + `?username=marketplacefestival`)
      .then((res) => {
        const filteredItems = res.data.data.filter((i) => {
          return i._id !== certificateArray._id;
        });
        setcertificates(filteredItems.slice(0, 10));
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

  return (
    <>
      {certificateArray.price && (
        <div>
          <Header />
          <HeaderBanner type="Checkout" />
          <div className="container viewContainer nftpdp__wrapper">
            <div className="nftpdp__cards-ctn">
              <div className="nftpdp__card nftpdp__card--image">
                {imageExt === ("mp4" && "mp3") ? (
                  <>
                    <div className="containerdiv">
                      <Player
                        // playsInline
                        src={`${env.uploadImgLink}${certificateArray.imageName}`}
                        poster={`${env.uploadImgLink}${certificateArray.thumbNail}`}
                      />
                    </div>
                  </>
                ) : (
                  <img
                    src={`${env.uploadImgLink}${certificateArray.imageName}`}
                    alt="Avatar"
                    className="certImg"
                  />
                )}
                <div className="nftpdp__tag">
                  <span>
                    {certificateArray.type &&
                      certificateArray.type.replace("with", "+")}
                  </span>
                </div>
              </div>
              <div className="nftpdp__card nftpdp__card--content">
                <div className="d-flex align-items-center justify-content-between cert__single">
                  <h3 className="nftpdp__title">{certificateArray.subject}</h3>
                  <div className="d-flex align-items-center  icons__ctn mr-4">
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
                      ;
                    </div>
                  </div>
                </div>
                <p className="nftpdp__desc">{certificateArray.category}</p>

                <div className="certpdp__specs-ctn">
                  <div className="d-flex flex-column">
                    <span>Title</span>
                    <h5>{certificateArray.subject}</h5>
                  </div>
                  <div className="d-flex certpdp__specs-subctn">
                    {certificateArray.salesquantity &&
                      certificateArray.forSaleStatus && (
                        <div className="d-flex flex-column">
                          <span>QTY</span>
                          <h5>{certificateArray.salesquantity}</h5>
                        </div>
                      )}
                    {!certificateArray.salesquantity &&
                      certificateArray.forSaleStatus && (
                        <div className="d-flex flex-column">
                          <span>QTY</span>
                          <h5>0</h5>
                        </div>
                      )}

                    <div className="d-flex flex-column">
                      <span>Date of Issue</span>
                      {certificateArray.dateofIssue && (
                        <h5>
                          {Moment(certificateArray.dateofIssue).format(
                            "MMM DD, YYYY"
                          )}
                        </h5>
                      )}
                    </div>
                  </div>
                </div>

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
                    certificateArray.attributes.map((att) =>
                      att.display_type === "boost_number" ? (
                        <></>
                      ) : (
                        <div className="cc__trait">
                          <h4>{att.trait_type}</h4>
                          <h5>{att.value}</h5>
                        </div>
                      )
                    )}
                </div>
                {storeOpen === true && (
                  <div className="nftpdp__price-ctn">
                    <h3>Current Price</h3>
                    <div className="nftpdp__price-subctn">
                      <PriceConverter
                        value={certificateArray.price}
                        fontFamily="Playfair"
                        size="large"
                      />
                      <span>${(certificateArray.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="container"

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
                              {certificateArray.events.map(function (
                                object,
                                i
                              ) {
                                return (
                                  <div className="accordion-subcontent">
                                    <div className="row">
                                      <div className="col-md-4">
                                        {object.type}
                                      </div>
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
                                          certificateArray.attributes.map(
                                            (att) =>
                                              att.display_type ===
                                              "boost_number" ? (
                                                att.value.length > 0 && (
                                                  <>
                                                    <div className="row">
                                                      <div className="col-md-1">
                                                        <i
                                                          class="fa fa-star fa-9x"
                                                          // style="color:#6610f2"
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
                  <div className="accordion">
                    <div className="accordion-item">
                      <div
                        className="accordion-title"
                        onClick={() => setIsActive(!isActive)}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={ListIcon}
                            alt="list-icon"
                            className="mr-3"
                          />
                          <div>ADDITIONAL INFO</div>
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
                                    <span className="title">
                                      Dimension (H x W)
                                    </span>
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
                              <div className="col-md-8">
                                {certificateArray.place}
                              </div>
                            </div>
                            <div className="Line-2-Copy"></div>
                            <div className="row">
                              <div className="col-md-4">Document ID</div>
                              <div className="col-md-8">
                                {certificateArray.id}
                              </div>
                            </div>
                            <div className="Line-2-Copy"></div>
                          </>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
}

export default HomeViewCert;
