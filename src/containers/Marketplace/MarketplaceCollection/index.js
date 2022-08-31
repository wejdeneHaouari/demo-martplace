import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { env } from "../../../constants";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import HeaderBanner from "../../../components/MartplaceHeader/HeaderBanner";
import "./index.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Common/Footer/Footer";
import ShareIcon from "../../../assets/images/storeFront/share-icon.svg";
import { confirmAlert } from "react-confirm-alert";
import Pagination from "reactjs-hooks-pagination";
import { toast } from "react-toastify";
import MarketplaceImage from "../../../assets/images/marketplaces.png";
import InstagramLogo from "../../../assets/images/storeFront/instagram-blue.svg";
import TwitterLogo from "../../../assets/images/storeFront/twitter-blue.svg";
import YoutubeLogo from "../../../assets/images/storeFront/play-blue.svg";
import FacebookLogo from "../../../assets/images/storeFront/facebook-blue.svg";

function MarketplaceCollection() {
  const cookies = new Cookies();
  const history = useHistory();
  const [result_array, setResultArray] = useState(null);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [emptyCollection, setEmptyCollection] = useState(null);
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

  useEffect(() => {
    allCollectionCerts(currentPage);
  }, [currentPage]);

  const allCollectionCerts = (page) => {
    axios
      .post(
        env.apiUrl + `api/users/getFilesByuserId?page=` + page,
        userIDObj,
        headers
      )
      .then((res) => {
        setResultArray(res.data.data);
        setTotalRecords(res.data.totalCert);
        console.log("data", res);
        if (res.data.data && res.data.data.length > 0) {
          setEmptyCollection(false);
        } else {
          setEmptyCollection(true);
        }
      })
      .catch((error) => {
        if (error.response.data.msg === "User is not activated by admin.") {
        }
      });
  };
  const handlePageClick = (e) => {
    const selectedPage = e;
    setCurrentPage(selectedPage);
  };
  const searchCerts = (e) => {
    //  e.preventDefault();
    const data = {
      searchFor: searchTerm,
      userId: userId,
    };
    if (searchTerm.length > 0) {
      axios
        .post(
          env.apiUrl +
            `api/users/searchingFiles?userId=${userId}&searchFor=${searchTerm}`,
          headers
        )
        .then((res) => {
          if (res.data.data.length > 0) {
            // setResultArray(res.data.data);
            res.data.data.map((x) => setResultArray(x.data));

            setTotalRecords(res.data.totalCert);
          } else {
            notify("loginError", "No Result");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      allCollectionCerts(currentPage);
    }
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

  //Share Certificate
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

  // const filteredItems = result_array.filter((item) =>
  //   item.subject.toLowerCase().includes(searchField.toLowerCase())
  // );

  return (
    <>
      <div className="container marketplaceContainer">
        <Header />
        <HeaderBanner type="Collection" />
        {/* <Filter /> */}

        {!emptyCollection && result_array && (
          <>
            <div
              style={{
                margin: "20px 45px",
              }}
              className="home__search-ctn home__search-ctn--collection  d-flex align-items-center"
            >
              <input
                className="search"
                type="search"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="search__btn"
                onClick={(e) => searchCerts()}
              >
                Search
              </button>
            </div>
            <div
              className="row"
              style={{
                margin: "30px",
                rowGap: "20px",
              }}
            >
              {result_array &&
                result_array.map((t) => (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 cardContainer cardContainer--collection ">
                    <div className="card">
                      {t.imageName.split(".").pop() === "mp4" ? (
                        <div className="card-flyer">
                          <div className="text-box">
                            <div className="image-box ">
                              <a href={`./collection/viewCert?id=${t._id}`}>
                                <video
                                  className="card-img-top img-fluid"
                                  src={`${env.uploadImgLink}${t.imageName}`}
                                  alt="certifictae"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="card-flyer">
                          <div className="text-box">
                            <div className="image-box ">
                              <a href={`./collection/viewCert?id=${t._id}`}>
                                <img
                                  className="card-img-top img-fluid"
                                  src={`${env.uploadImgLink}${t.imageName}`}
                                  alt="certificate"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="card__nft-wrp">
                        <div className="card__nft-tag">
                          <span>{t.type}</span>
                        </div>
                        <div className="text-container">
                          <div className="">
                            <h3 className="card-title ">{t.subject}</h3>

                            <h6 className="card__desc mb-4">{t.category}</h6>

                            <div className="d-flex card__nft--btm justify-content-between">
                              <img
                                src={ShareIcon}
                                alt="share"
                                style={{ width: "32px", cursor: "pointer" }}
                                onClick={(e) => shareCert(t)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div
              className="row justify-content-center"
              style={{
                margin: "0 30px",
              }}
            >
              <Pagination
                totalRecords={totalRecords}
                pageLimit={8}
                pageRangeDisplayed={1}
                onChangePage={handlePageClick}
                // activePage={currentPage}
              />
            </div>
          </>
        )}
        {emptyCollection && (
          <div className="post__checkout">
            {/*<img*/}
            {/*    src={MarketplaceImage}*/}
            {/*    alt='Marketplaces'*/}
            {/*    className='post__checkout-img'*/}
            {/*/>*/}
            <div className="mt-5"></div>
            <h1 style={{ margin: "0" }}>NFT acquired will showcase here</h1>
            <a href="/" className="post__checkout-btn">
              <button>Go Back to Home</button>
            </a>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default MarketplaceCollection;
