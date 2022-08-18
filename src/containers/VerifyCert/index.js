import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { env } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import "./index.css";
import Pagination from "reactjs-hooks-pagination";
import Moment from "moment";
import { confirmAlert } from "react-confirm-alert";

function VerifyCert() {
  const [click, setClick] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [number_result, setNumberOfResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [result_array, setResultArray] = useState(null);
  const [input, setInput] = useState("");
  const handleClick = () => setClick(!click);
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const Close = () => setClick(false);
  const options = [
    { value: "documentID", label: "Document Id" },
    { value: "hash", label: "Transaction Hash" },
    { value: "orgName", label: "Organization Name" },
  ];
  let textInput = React.createRef(); // React use ref to get input value
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const history = useHistory();
  let onOnclickHandler = (e) => {
    setInput(input);
    setSelectedValue(selectedValue);
    console.log(selectedValue, input);
    if (input.length > 0 === true && selectedValue !== null) {
      apiSearch(1);
    } else {
      notify("loginError", "Please enter valid search input");
    }
  };
  const apiSearch = (currentPage) => {
    console.log(input, selectedValue);
    var data;
    if (input.length > 0 === true && selectedValue !== null) {
      if (selectedValue) {
        if (selectedValue.value) {
          if (selectedValue.value === "documentID") {
            data = {
              docId: input,
            };
          } else if (selectedValue.value === "orgName") {
            data = {
              orgName: input,
            };
          } else if (selectedValue.value === "hash") {
            data = {
              txHash: input,
            };
          }
          console.log(data);
        }
      }
    }
    const options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post(
        env.apiUrl + `api/users/searchFiles?page=${currentPage}`,
        data,
        options
      )
      .then((res) => {
        if (res.data.data.length === 0 || res.data.data === null) {
          notify("loginError", "No Results");
        } else {
          setNumberOfResults(res.data.data.length);
          setResultArray(res.data.data);
          setTotalRecords(res.data.totalData);
        }
      })
      .catch((err) => {
        notify("loginError", "No Results");
      });
  };
  const handlePageClick = (e) => {
    const selectedPage = e;
    console.log(input, selectedValue);
    setCurrentPage(selectedPage);
    if (input.length > 0 === true && selectedValue !== null) {
      apiSearch(e);
    } else {
      console.log("hi");
      console.log(input, selectedValue);
    }
  };
  const handleChange = (selectedOptions) => {
    setSelectedValue(selectedOptions);
  };
  const totalResult = number_result;
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

  const renderTrails = () => {
    if (result_array) {
      const trail = result_array.map((t) => {
        return (
          <div className="col-sm-3 cardContainer">
            <div className="card">
              {t.imageName.split(".").pop() === "mp4" ? (
                <div className="card-flyer">
                  <div className="text-box">
                    <div className="image-box ">
                      <a target="_blank" href={`./viewSingleCert?${t.id}`}>
                        <video
                          className="card-img-top img-fluid rounded"
                          src={`${env.uploadImgLink}${t.imageName}`}
                          alt="certifictae"
                        />
                      </a>
                      {t.imageStatus === "Verified" && (
                        <a
                          target="_blank"
                          href={`${env.explorerLink}tx/${t.txHash}`}
                        >
                          <div className="bottomright">
                            <img className="verifiedIcon" />
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
                      <a target="_blank" href={`./viewSingleCert?${t.id}`}>
                        <img
                          className="card-img-top img-fluid rounded"
                          src={`${env.uploadImgLink}${t.imageName}`}
                          alt="certifictae"
                        />
                      </a>
                      {t.imageStatus === "Verified" && (
                        <a
                          target="_blank"
                          href={`${env.explorerLink}tx/${t.txHash}`}
                        >
                          <div className="bottomright">
                            <img className="verifiedIcon" />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="text-container">
                <div className="card-block">
                  <h3 className="card-title heading mt-3">{t.subject}</h3>
                  <h6 className="createdDate">
                    {Moment(t.createdDate).format("ddd. MMM DD, YYYY")}
                  </h6>
                  <div className="row mt-4">
                    <div className="col-1">
                      <i
                        className="fa fa-share-alt"
                        onClick={(e) => shareCert(t)}
                      ></i>
                    </div>
                    {/* <div className="col-1">
                      <i className="fa fa-download"></i>
                    </div> */}
                    <div className="col-9">
                      {t.isOwned === "Yes"
                        ? t.imageStatus === "Unverified"
                          ? ""
                          : ""
                        : "Transferred"}
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
          }}
        >
          {trail}
        </div>
      );
    }
  };

  return (
    <>
      <div className="container verifyContainer">
        <div
          className={click ? "main-container" : ""}
          onClick={() => Close()}
        />
        <nav className="navbar verifyNav" onClick={(e) => e.stopPropagation()}>
          <div className="nav-container">
            <NavLink exact to="/" className="nav-logo">
              <img className="mainlogo" alt="chaincertLogo" />
            </NavLink>
          </div>
          <h6 className="A-quick-way-to-authe logoText  w-100">
            An easy way to search and verify issused document / certificate
          </h6>
          <div className="line w-75 logoText mb-4"></div>
          <div className="row w-100 searchContainer">
            <div className="col-md-3">
              <div className=" mb-4">
                <Select
                  options={options}
                  onChange={handleChange}
                  value={selectedValue}
                />
              </div>
            </div>
            <div className="col-md-4">
              {" "}
              <div className="form-group mb-4">
                <div className="inner-addon left-addon">
                  <i className="fa fa-search iconClass mt-2"></i>
                  <input
                    name=""
                    type="text"
                    onChange={handleInputChange}
                    value={input}
                    placeholder="Search"
                    className={"form-control searchInput"}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-2">
              {" "}
              <button
                className="btn btn-primary w-100 text-center"
                type="button"
                onClick={onOnclickHandler}
              >
                Search
              </button>
            </div>
          </div>
        </nav>
        <div className="container dashboardContainer">{renderTrails()}</div>
        <div className="paginate">
          <Pagination
            totalRecords={totalRecords}
            pageLimit={8}
            pageRangeDisplayed={1}
            onChangePage={(e) => {
              console.log("hi2", input, selectedValue);
              handlePageClick(e);
            }}
            // activePage={currentPage}
          />
        </div>
      </div>
    </>
  );
}
export default VerifyCert;
