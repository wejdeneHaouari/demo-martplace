import React from "react";
import { toast } from "react-toastify";
import "./index.css";
import "./tabs";
import TabContent from "./tabs";


function Register(props) {
  const notify = (type, text) => {
    if (type === "showInfo") {
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
  const showInfo = () => {
    notify(
      "showInfo",
      "Creator can create the certificates and store them in Blockchain. Collector can receive certificate and transfer it to someone else."
    );
  };
  return (
    <div className="container-fluid bg-image" id="main">
      <div className="row no-gutter">
        <div className="col-sm-6 d-none centerMain d-sm-flex borderRight2">
          <div className="innerCenter">
            <img className="logo leftLogo" alt="logo" />
            <span className="A-quick-way-to-authe">
              A quick way to authenticate your products and tokenize your
              digital assets
            </span>
          </div>
        </div>
        <div className="col-sm-6 rightSide overflow-scroll">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-10 col-xl-7 mx-auto">
                  <h2 className="display-4 loginHeader">SIGNUP</h2>
                  <h6 className="Are-you-a-creator-or text-left">
                    Are you a creator or collector?
                     <i className="fa fa-info-circle ml-2" onClick={showInfo}></i>
                  </h6>
                  <TabContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
