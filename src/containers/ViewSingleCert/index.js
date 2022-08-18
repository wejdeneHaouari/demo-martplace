import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import Moment from "moment";
import { ReactVideo } from "reactjs-media";
import videoBg from "../../assets/images/download.png"; // with import
import getThumb from "video-thumbnail-url";
import Modal from "react-modal";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import verifiedlogo from "../../assets/images/verifiedIcon.png"; // with import
import logoSrc from "../../assets/images/signin.jpeg"; // relative path to image
import openSeaBadge from "../../assets/images/open-sea-badge.png";
import shareIcon from "../../assets/images/storeFront/share-icon.svg";
import ListIcon from "../../assets/images/storeFront/list.svg";
import verifiedIcon from "../../assets/images/storeFront/verified.svg";
import { dataList } from "../../mock/cetificates";
import Header from "../../components/Header";
import Footer from "../../components/Common/Footer/Footer";

import {
  Document,
  Font,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import "./index.css";
import VideoThumbnail from "react-video-thumbnail";

function ViewSingleCert() {
  const [certificateArray, setcerticateArray] = useState({});
  const [imageExt, setImageExt] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const cookies = new Cookies();
  const ids = window.location.href.split("?")[1];
  const imgId = JSON.stringify({
    imageId: ids,
  });
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  function toggleModal() {
    setIsOpen(!isOpen);
  }
  const certheaders = {
    headers: {
      "content-type": "application/json",
    },
  };
  useEffect(() => {
    setcerticateArray(() => dataList.data[0]);
    console.log("cert.", dataList.data[0]);
    if (certificateArray.properties) {
      certificateArray.properties.map((item) => {
        var keyNames = Object.entries(item);
        // console.log('key', keyNames[0]);
        keyNames.map((objct) => {
          objct.map((inobjct) => {
            console.log("inobct", inobjct);
          });
        });
      });
    }

    // axios
    //   .post(env.apiUrl + `api/users/getFilesById`, imgId, certheaders)
    //   .then((res) => {
    //     setcerticateArray(res.data.data);
    //     const str = certificateArray.imageName;
    //     setImageExt(res.data.data.imageName.split('.').pop());
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       if (error.response.status === 403) {
    //         Cookies.remove('response');
    //         sessionStorage.clear();
    //         notify('loginError', 'Token is expired. Please try to login again');
    //         //   history.push("/");
    //       } else {
    //         notify('loginError', 'Something went wrong');
    //       }
    //     }
    //   });
  }, [certificateArray]);

  const Background = env.uploadImgLink + certificateArray.imageName;
  getThumb(
    env.uploadImgLink + certificateArray.imageName
  ).then((thumb_url) => {});

  const shareCert = (t) => {
    // e.preventDefault();
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
          // onClick: () => alert("Click No"),
        },
      ],
    });
  };
  const Quixote = () => (
    <Document>
      <Page style={styles.body} wrap={true}>
        <Text style={styles.header} fixed>
          <Image style={styles.headerImage} src={logoSrc} />
        </Text>
        <Image
          style={styles.image}
          src={env.uploadImgIfsLink + certificateArray.IpfsHash}
        />
        <Image style={styles.verifiedLogo} src={verifiedlogo} />
        <Text style={styles.title} break>
          Certificate of Authenticity
        </Text>
        <Text style={styles.subtitle}>{certificateArray.issuerName}</Text>
        <Text style={styles.dateofIssue}>
          {Moment(certificateArray.createdDate).format("ddd. MMM DD, YYYY")}
        </Text>
        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.th}>
              <Text>Title</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.td}>
              <Text>{certificateArray.subject}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.th}>
              <Text>Date of Issue</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.td}>
              <Text>{certificateArray.dateofIssue}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.th}>
              <Text>Valid Until</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.td}>
              <Text>{certificateArray.validUntil}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />

        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.th}>
              <Text>Dimensions</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.td}>
              <Text>{certificateArray.issuerName}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.th}>
              <Text>Origin Location</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.td}>
              <Text>{certificateArray.place}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.th}>
              <Text>Document ID</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.td}>
              <Text>{certificateArray.id}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <Text style={styles.history}>History</Text>
        <View style={styles.line} />
        {certificateArray.events
          ? certificateArray.events.map(function (object, i) {
              return (
                <>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <View style={styles.th}>
                        <Text>{object.type}</Text>
                      </View>
                    </View>
                    <View style={styles.column}>
                      <View style={styles.td}>
                        <Text style={styles.hash} wrap={true}>
                          {object.Msg} at
                          {" " +
                            Moment(object.date).format("ddd. MMM DD, YYYY")}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.line} />
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <View style={styles.th}>
                        <Text>Blockchain Registration</Text>
                      </View>
                    </View>
                    <View style={styles.column}>
                      <View style={styles.td}>
                        <Text style={styles.hash2} wrap={true}>
                          {object.txHash}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.line} />
                </>
              );
            })
          : ""}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );

  Font.register({
    family: "Aileron",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const styles = StyleSheet.create({
    body: {
      // paddingTop: 35,
      paddingBottom: 65,
      // paddingHorizontal: 35,
    },
    title: {
      // height: '16px',
      margin: "10px 34px 29px 35px",
      Family: "Aileron",
      fontSize: "24px",
      fontWeight: "600",
      fontStretch: "normal",
      fontStyle: "normal",
      // lineHeight: "0.67",
      letterSpacing: "4.4px",
      color: "#0a1567",
    },
    verifiedLogo: {
      position: "absolute",
      marginRight: "50px",
      right: 40,
      textAlign: "right",
      // zIndex:4,
      // bottom:400
    },
    subtitle: {
      margin: "0px 34px 29px 35px",
      Family: "Aileron",
      fontSize: "18px",
      fontStretch: "normal",
      fontStyle: "normal",
      // lineHeight: "0.67",
      letterSpacing: "0.25px",
      color: "#1c1c1c",
      textTransform: "capitalize",
    },
    dateofIssue: {
      margin: "0px 34px 29px 35px",
      Family: "Aileron",
      fontSize: "16px",
      fontStretch: "normal",
      fontStyle: "normal",
      // lineHeight: "0.67",
      letterSpacing: "0.93px",
      color: "#545454",
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
      paddingHorizontal: 35,
    },
    image: {
      marginVertical: 150,
      marginHorizontal: 50,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      // textAlign: "center",
      color: "grey",
      backgroundColor: "black",
      paddingVertical: "15px",
      // width: "100%",
    },
    headerImage: {
      marginVertical: 15,
      marginHorizontal: 15,
      width: "190px",
      // height: "26px",
      position: "absolute",
      fontSize: 12,
      left: 40,
      textAlign: "left",
      color: "white",
      marginBottom: "40px",
      marginLeft: "20px",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      // top: 20,
      marginVertical: 20,
      marginHorizontal: 20,
      // left: 0,
      right: 5,
      textAlign: "right",
      color: "white",
      // marginBottom: "40px",
    },
    th: {
      Family: "Aileron",
      fontSize: "14px",
      fontStretch: "normal",
      fontStyle: "normal",
      // lineHeight: "0.67",
      letterSpacing: "0.5px",
      color: "#a0a0a0",
      textTransform: "capitalize",
    },
    td: {
      Family: "Aileron",
      fontSize: "14px",
      fontStretch: "normal",
      fontStyle: "normal",
      // lineHeight: "0.67",
      letterSpacing: "0.93px",
      color: "#1c1c1c",
      textTransform: "capitalize",
      marginLeft: "150px",
      wordBreak: "break-word",
      flex: 1,
    },
    line: {
      borderBottomColor: "#d5d5d5;",
      borderBottomWidth: 1,
      marginLeft: 34,
      marginRight: 34,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      width: 100,
      whiteSpace: "unset",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexBasis: "100%",
      margin: "15px 34px 15px 35px",
      wordBreak: "break-word",
      whiteSpace: "unset",
    },
    hash: {
      whiteSpace: "unset",
      flex: 1,
      flexDirection: "column",
      width: 300,
      textWrap: "wrap",
      wordBreak: "break-all",
      overflowWrap: "anywhere",
    },
    hash2: {
      whiteSpace: "unset",
      flex: 5,
      flexDirection: "row",
      width: 300,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    history: {
      margin: "29px 34px 9px 35px",
      Family: "Aileron",
      fontSize: "18px",
      fontStretch: "normal",
      fontStyle: "normal",
      fontWeight: "bold",
      letterSpacing: "0.25px",
      color: "#1c1c1c",
      textTransform: "uppercase",
    },
  });

  const options = {
    orientation: "landscape",
    unit: "in",
    // format: [12, 7],
  };
  const ref = React.createRef();
  return (
    <>
      {/* {createThumbnail} */}
      <Header />

      <div
        className="container viewContainer"
        style={{
          backgroundImage: "url(" + Background + ")",
        }}
        ref={ref}
      >
        <div className="test">
          <div className="card">
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
                    // other props
                  />
                  {certificateArray.imageStatus === "Verified" && (
                    <img
                      src={verifiedlogo}
                      className="cornerimage"
                      style={{ bottom: "-23px" }}
                    ></img>
                  )}
                </div>

                {/* //   <div className="player-wrapper"> */}
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
            {certificateArray.category === "Art" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid #ff0096" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Photograph" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid #4d96f6" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "desc" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid #4d96f6" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Painting" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid #ff4000" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Book" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid #198754" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Collectible" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(245 16 37)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Design" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(55 52 247)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Document" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(245 124 38)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Furniture" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(78 35 4)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Jersey" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(236 106 106)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Print" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(175 92 251)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
              </div>
            )}
            {certificateArray.category === "Sculpture" && (
              <div
                className="trapezoid2"
                style={{ borderBottom: "24px solid rgb(162 105 83)" }}
              >
                <div className="categoryClass">{certificateArray.category}</div>
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
                      <img src={shareIcon} alt="share" />
                    </div>
                  </div>
                  <div>
                    <img
                      title="Check this item in opensea.io"
                      src={openSeaBadge}
                      alt="open-sea"
                      className="open__sea"
                    />
                  </div>
                </div>
              </div>

              <h2 className="coa">Certificate of Authenticity</h2>
              <div className="d-flex align-items-center">
                <h3 className=" nft__title">{certificateArray.subject}</h3>
                <img src={verifiedIcon} alt="nft verified" className="" />
              </div>

              <p className="nft__desc">{certificateArray.category}</p>
              {/* <span className='dateClass'>
                {Moment(certificateArray.createdDate).format(
                  'ddd. MMM DD, YYYY'
                )}
              </span> */}
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
                    {certificateArray.dateofIssue}
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

              <div className="row">
                <div className="col-md-5">
                  <span className="title">Traits</span>
                </div>
                {/* <div className='col-md-6'>
                  {certificateArray.properties ??
                    certificateArray.properties.map((item) => <div>hello</div>)}
                </div> */}
              </div>

              <br />
              <br />
              <div className="d-flex justify-content-between align-items-center">
                <div className="">
                  {certificateArray.imageStatus === "Verified" && (
                    <div className="Minted-on-Blockchain d-flex">
                      <p>Minted on Blockchain</p>
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
                              // onClick={(e) => verifyCert(t.id)}
                              className="black"
                              aria-disabled="true"
                              style={{ fontWeight: "bold", width: "100%" }}
                            >
                              Blockchain transaction ID:
                            </p>
                            <span>{certificateArray.txHash}</span>
                          </>
                        )}
                      </Modal>
                    </div>
                  )}
                </div>

                <button className="single__nft-btn">CHECKOUT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container viewContainer"
        style={{
          backgroundImage: "url(" + Background + ")",
        }}
      >
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
                {certificateArray.events.map(function (object, i) {
                  return (
                    <>
                      {/* <ObjectRow obj={object} key={i} /> */}
                      <div className="Line-2-Copy"></div>
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

                      <div className="row">
                        <div className="col-md-4">{object.type}</div>
                        <div className="col-md-8">
                          {object.Msg} at
                          {" " +
                            Moment(object.date).format("ddd. MMM DD, YYYY")}
                        </div>
                      </div>
                      <div
                        className="Line-2-Copy"
                        style={{ width: "100%" }}
                      ></div>

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
                    </>
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
export default ViewSingleCert;
