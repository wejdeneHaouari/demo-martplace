import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { env } from "../../../constants/index";
import "./index.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import HeaderBanner from "../../../components/MartplaceHeader/HeaderBanner";
import styled from "styled-components";
import ShareIcon from "../../../assets/images/storeFront/share-icon.svg";
import { getNftsbyUsername } from "../../../constants/apiEndPoints";
import Header from "../../../components/Header";
import Footer from "../../../components/Common/Footer/Footer";
import Pagination from "reactjs-hooks-pagination";
import Dropdowntriangle from "../../../assets/images/storeFront/dropdownTriangle.svg";
import { confirmAlert } from "react-confirm-alert";
import PriceConverter from "../../../components/PriceConvert";
import { toast } from "react-toastify";
import moment from "moment";

function MarketplaceStore() {
  const cookies = new Cookies();
  const history = useHistory();
  const [certificates, setcertificates] = useState([]);
  const [initialCertificates, setInitialcertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [availOption, setAvailOption] = useState("available");
  const [currentOrder, setCurrentOrder] = useState("");
  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(null);
  const colors = [
    "Yellow",
    "Blue",
    "Pink",
    "Orange",
    "Grey",
    "Red",
    "White",
    "Black",
    "Brown",
    "Purple",
    "Green",
    "Light Brown",
    "Violet",
  ];
  const shapes = [
    "Circle",
    "Sky",
    "Hat",
    "Smiley",
    "Square",
    "Oval",
    "Waves",
    "Spin",
    "Jersey",
    "Muscle",
    "Sunglasses",
    "Guitar",
  ];
  const background = [
    "Waves",
    "Desert Land",
    "Sky",
    "River",
    "Sea",
    "Forest",
    "Road",
    "Disco Light",
    "Glitter",
    "Shining Star",
    "Glowing Square",
    "Radian",
    "light Rays",
    "Sparkling Light",
    "Flower",
    "Smoke",
    "Fire",
    "Glowing",
    "Sea Reflection",
    "Hot Air Marketplace",
    "Mountains",
    "City",
    "Green Land",
    "Bridge",
    "City Beach",
    "Sun Rise",
    "Beach",
    "Sun Set",
    "Sea Shore",
    "Full Moon",
    "Galaxies",
    "Stars",
    "Universe",
    "Bombarding",
    "Clouds",
  ];
  const checkIsBetween = (openingDate, endingDate) => {
    const d = new Date();

    const dx = Date.parse(d);
    let isTimeBetween = moment(dx).isBetween(openingDate, endingDate); // true
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
        console.log(result);
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

  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
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

  const allHomeCerts = (page) => {
    console.log("get all home certs");
    history.push("/marketplace/home?page=" + page);
    sessionStorage.setItem("filterskey", "1");
    axios
      .get(
        env.apiUrl +
          getNftsbyUsername +
          `?username=${env.username}&page=${page}`
      )
      .then((res) => {
        if (res.data.data.length > 0) {
          setcertificates(res.data.data);
        }
        setInitialcertificates(res.data.data);
        setTotalRecords(res.data.totalCert);
      });
  };

  useEffect(() => {
    console.log("in simple use effect ");
    allHomeCerts(currentPage);
  }, []);


  const callFunOnKey = () => {
    var checkKey = sessionStorage.getItem("filterskey");
    console.log("filterskey", checkKey);
    if (checkKey === "1") {
      console.log("call all home filterkey call func");
      allHomeCerts(currentPage);
    } else if (checkKey === "2") {
      handlePriceChange(currentOrder, true, currentPage, true);
    } else if (checkKey === "3") {
      handleTypeChange(currentOrder, true, currentPage, true);
    } else if (checkKey === "4") {
      handleTraitChange(currentOrder, true, currentPage, true);
    } else if (checkKey === "5") {
      if (document.getElementById("order-sold").checked) {
        handleAvailChange("sold", true, currentPage, true);
      } else if (document.getElementById("order-available").checked) {
        handleAvailChange("available", true, currentPage, true);
      }
    } else {
      console.log("call all home else filterkey call func");
      window.history.replaceState(null, null, "#");
      allHomeCerts(currentPage);
    }
  };

  useEffect(() => {
    console.log("in use effect current page", currentPage);
    callFunOnKey();
  }, [currentPage]);

  const handlePageClick = (e) => {
    const selectedPage = e;
    setCurrentPage(selectedPage);
  };



  const handlePriceChange = (order, isPagination, page, active) => {
    console.log("in handlePriceChange ");
    if (!page) page = 1;
    sessionStorage.setItem("filterskey", "2");
    setCurrentPage(page);
    setCurrentOrder(order);
    // box is unchecked
    if (!active) {
      allHomeCerts(currentPage);
      return;
    } else if (!isPagination) {
      if (order == "ascending") {
        // document.getElementById('order-ascending').checked = true;
        document.getElementById("order-descending").checked = false;
      } else {
        // document.getElementById('order-descending').checked = true;
        document.getElementById("order-ascending").checked = false;
      }
    }
    axios
      .get(
        env.apiUrl +
          `api/users/sortForSaleCertificates40?username=${env.username}&order=${order}&page=${page}`,
        headers
      )
      .then((res) => {
        console.log("resultArray", res.data);
        if (res.data.data.length > 0) {
          setcertificates(res.data.data);
        }
        setTotalRecords(res.data.totalCert);
      });
  };

  const handleTypeChange = (order, isPagination, page, active) => {
    console.log("in handleTypeChange");
    sessionStorage.setItem("filterskey", "3");
    if (!page) page = 1;
    setCurrentOrder(order);
    setCurrentPage(page);
    if (!active) {
      allHomeCerts(currentPage);
      return;
    }
    if (!isPagination) {
      if (order == "Digital art") {
        document.getElementById("order-experience").checked = false;
        document.getElementById("order-merchandise").checked = false;
      } else if (order == "Digital art with experience") {
        document.getElementById("order-art").checked = false;
        document.getElementById("order-merchandise").checked = false;
      } else {
        document.getElementById("order-art").checked = false;
        document.getElementById("order-experience").checked = false;
      }
    }
    axios
      .get(
        env.apiUrl +
          `api/users/filterForSaleCertificates40?username=${env.username}&type=${order}&page=${page}`,
        headers
      )
      .then((res) => {
        if (res.data.data.length > 0) {
          setcertificates(res.data.data);
        }
        setTotalRecords(res.data.totalCert);
        console.log("resultArray", res.data.data);
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
        setcertificates([]);
        setTotalRecords(0);
      });
  };

  const handleTraitChange = (order, isPagination, page, active) => {
    sessionStorage.setItem("filterskey", "4");
    if (!page) page = 1;
    setCurrentOrder(order);
    setCurrentPage(page);

    if (!active) {
      allHomeCerts(currentPage);
      return;
    }
    if (isPagination) {
      colors.map((color) => {
        if (color !== order) document.getElementById(color).checked = false;
      });
      shapes.map((shape) => {
        if (shape !== order) document.getElementById(shape).checked = false;
      });
      background.map((back) => {
        if (back !== order) document.getElementById(back).checked = false;
      });

    }
    axios
      .get(
        env.apiUrl +
          `api/users/matchTraits?username=${env.username}&traitValue=${order}&page=${page}`
      )
      .then((res) => {
        if (res.data.data.length > 0) {
          setcertificates(res.data.data);
        }
        setTotalRecords(res.data.totalCert);
        console.log("resultArray", res.data.data);
      });
  };

  const handleAvailChange = (order, isPagination, page, active) => {
    sessionStorage.setItem("filterskey", "5");
    if (!page) page = 1;
    setCurrentPage(page);
    setCurrentOrder(order);
    if (!active) {
      allHomeCerts(currentPage);
      return;
    }
    if (order == "sold") {
      // document.getElementById('order-ascending').checked = true;
      document.getElementById("order-available").checked = false;
      axios
        .get(
          env.apiUrl +
            `api/users/listoftheitemsoldandquantity0?username=${env.username}&page=${page}`
        )
        .then((res) => {
          if (res.data.data.length > 0) {
            setcertificates(res.data.data);
          }
          setTotalRecords(res.data.totalCert);
        });
    } else if (order == "available") {
      // document.getElementById('order-descending').checked = true;
      document.getElementById("order-sold").checked = false;
      axios
        .get(
          env.apiUrl +
            `api/users/listofitemsoldquantitygrterthn0?username=${env.username}&page=${page}`
        )
        .then((res) => {
          if (res.data.data.length > 0) {
            setcertificates(res.data.data);
          }
          setTotalRecords(res.data.totalCert);
        });
    }
  };

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

  const RenderList = (props) => {
    return (
      <div
        className="dropdown-menu traits"
        aria-labelledby="dropdownMenuButton"
      >
        <div className="dropdown__checkbox-ctn">
          <strong>Colors</strong>
        </div>
        {colors.map((trait) => (
          <div className="dropdown__checkbox-ctn">
            &nbsp;&nbsp;&nbsp;{" "}
            <input
              type="checkbox"
              id={trait}
              onChange={(e) => {
                handleTraitChange(trait, false, currentPage, e.target.checked);
              }}
            />
            <label htmlFor="art" className="ml-2">
              {trait}
            </label>
          </div>
        ))}
        <div className="dropdown__checkbox-ctn">
          <strong>Shapes</strong>
        </div>
        {shapes.map((trait) => (
          <div className="dropdown__checkbox-ctn">
            &nbsp;&nbsp;&nbsp;{" "}
            <input
              type="checkbox"
              id={trait}
              onChange={(e) => {
                handleTraitChange(trait, false, currentPage, e.target.checked);
              }}
            />
            <label htmlFor="art" className="ml-2">
              {trait}
            </label>
          </div>
        ))}
        <div className="dropdown__checkbox-ctn">
          <strong>Backgrounds</strong>
        </div>
        {background.map((trait) => (
          <div className="dropdown__checkbox-ctn">
            &nbsp;&nbsp;&nbsp;{" "}
            <input
              type="checkbox"
              id={trait}
              onChange={(e) => {
                handleTraitChange(trait, false, currentPage, e.target.checked);
              }}
            />
            <label htmlFor="art" className="ml-2">
              {trait}
            </label>
          </div>
        ))}

      </div>
    );
  };

  let displaycertificates =
    certificates.length > 0 &&
    certificates.map((t) => {
      return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3   cardContainer card__nft">
          <div className="card">
            {t.imageName.split(".").pop() === ("mp4" && "mp3") ? (
              <div className="card-flyer">
                <div className="text-box">
                  <div className="image-box ">
                    <a href={`./viewCert?id=${t._id}`}>
                      <img
                        className="card-img-top img-fluid"
                        src={`${env.uploadImgLink}${t.thumbNail}`}
                        alt="certificate"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-flyer">
                <div className="text-box">
                  <div className="image-box ">
                    <a href={`./viewCert?id=${t._id}`}>
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
            <div
              className={
                t.type?.indexOf("with") == -1
                  ? "card__nft-wrp"
                  : "card__nft-wrp-with"
              }
            >
              <div className="card__nft-tag">
                <span>{t.type && t.type.replace("with", "+")}</span>
              </div>
              {t.salesquantity == 0 && (
                <div className=" card__nft-tag--sold">
                  <span>Sold Out</span>
                </div>
              )}

              <div className="text-container">
                <div>
                  <div className="card__nft-title-wrp">
                    <h3 className="card-title">{t.subject}</h3>
                    <h6 className="card__desc">{t.category}</h6>
                  </div>
                  {storeOpen === true && (
                    <>
                      <EthereumPriceContainer>
                        <PriceConverter
                          value={t.price}
                          fontFamily="Playfair"
                          size="small"
                        />
                      </EthereumPriceContainer>

                      <div className="d-flex card__nft--btm justify-content-between">
                        <img
                          src={ShareIcon}
                          alt="share"
                          style={{ width: "32px", cursor: "pointer" }}
                          onClick={(e) => shareCert(t)}
                        />

                        <div className="display-1 d-flex">
                          <p>${(t.price / 100).toFixed(2)}</p>
                          <span>USD</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="">
                {t.salesquantity > 0 && (
                  <a target="_blank" href={`./viewCert?id=${t._id}`}>
                    <button className="card__nft-btn">BUY NOW</button>
                  </a>
                )}
              </div>
              <div className="">
                {t.salesquantity === 0 && (
                  <button
                    className="card__nft-btn-sold_out"
                    style={{ cursor: "not-allowed" }}
                  >
                    SOLD OUT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });

  const filter = () => {
    return (
      <FilterWrapper>
        <div class="dropdown">
          <DropDown
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <p>Price</p>{" "}
            <span>
              {" "}
              <DropDownTriangle src={Dropdowntriangle} />
            </span>
          </DropDown>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-ascending"
                onChange={(e) => {
                  handlePriceChange(
                    "ascending",
                    false,
                    currentPage,
                    e.target.checked
                  );
                }}
              />
              <label for="art" className="ml-2">
                Low to High
              </label>
            </div>
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-descending"
                onChange={(e) => {
                  handlePriceChange(
                    "descending",
                    false,
                    currentPage,
                    e.target.checked
                  );
                }}
              />
              <label for="art" className="ml-2">
                High to Low
              </label>
            </div>
          </div>
        </div>

        <div class="dropdown">
          <DropDown
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <p>Type</p>{" "}
            <span>
              {" "}
              <DropDownTriangle src={Dropdowntriangle} />
            </span>
          </DropDown>
          <div class="dropdown-menu type" aria-labelledby="dropdownMenuButton">
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-art"
                onChange={(e) => {
                  handleTypeChange("Digital art", false, 1, e.target.checked);
                }}
              />
              <label for="order-art" className="ml-2">
                Digital art
              </label>
            </div>
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-experience"
                onChange={(e) => {
                  handleTypeChange(
                    "Digital art with experience",
                    false,
                    1,
                    e.target.checked
                  );
                }}
              />
              <label for="order-experience" className="ml-2">
                Digital art + experience
              </label>
            </div>
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-merchandise"
                onChange={(e) => {
                  handleTypeChange(
                    "Digital art with merchandise",
                    false,
                    1,
                    e.target.checked
                  );
                }}
              />
              <label htmlFor="order-merchandise" className="ml-2">
                Digital art + merchandise
              </label>
            </div>
          </div>
        </div>
        <div class="dropdown">
          <DropDown
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <p>Traits</p>{" "}
            <span>
              {" "}
              <DropDownTriangle src={Dropdowntriangle} />
            </span>
          </DropDown>

          {RenderList()}
        </div>
        <div class="dropdown">
          <DropDown
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <p>Availability</p>{" "}
            <span>
              {" "}
              <DropDownTriangle src={Dropdowntriangle} />
            </span>
          </DropDown>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-available"
                onChange={async (e) => {
                  handleAvailChange("available", false, 1, e.target.checked);
                  await setAvailOption(() => "available");
                }}
              />
              <label for="art" className="ml-2">
                In Stock
              </label>
            </div>
            <div className="dropdown__checkbox-ctn">
              <input
                type="checkbox"
                id="order-sold"
                onChange={async (e) => {
                  await setAvailOption(() => "sold");
                  handleAvailChange("sold", false, 1, e.target.checked);
                }}
              />
              <label for="art" className="ml-2">
                Sold Out
              </label>
            </div>
          </div>
        </div>
      </FilterWrapper>
    );
  };

  return (
    <>
      <div className="container marketplaceContainer">
        <Header />
        <HeaderBanner type="Marketplace" />
        <FiltersContainer>
          {filter()}

        </FiltersContainer>

        <div
          className="row marketplace__homepage"
          style={{
            margin: "0 30px",
          }}
        >
          {displaycertificates}
        </div>
        <div
          className="row justify-content-center"
          style={{
            margin: "0 30px",
          }}
        >
          <Pagination
            totalRecords={totalRecords}
            pageLimit={40}
            pageRangeDisplayed={1}
            onChangePage={handlePageClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <Footer />
      </div>

    </>
  );
}

export default MarketplaceStore;

const EthereumPriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 45px 40px;
  flex-wrap: wrap;
  justify-content: space-between;
`;


const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: 65%;
  justify-content: space-between;
  max-width: 850px;

  @media (max-width: 800px) {
    flex-wrap: wrap;
    row-gap: 5px;
    order: 2;
  }
`;

const DropDown = styled.button`
  height: 30px;
  width: 200px;

  padding: 5px 11px 5px 8px;
  border-radius: 3px;
  border: solid 1px #dedede;
  background-color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin-right: 5px;
  align-items: center;
  transition: none;
  p {
    color: black;
    margin: 0;
    letter-spacing: 1px;
  }
  span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  &:focus {
    outline: none;
    border: 1.6px solid black;
  }
  @media (max-width: 1200px) {
    width: 150px;
  }
  @media (max-width: 992px) {
    width: 120px;
  }
  @media (max-width: 800px) {
    width: 295px;
  }
`;

const DropDownTriangle = styled.img`
  width: 10px;
`;


