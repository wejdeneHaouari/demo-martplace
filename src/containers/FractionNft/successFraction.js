import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import HeaderBanner from "../../components/BalloonHeader/HeaderBanner";
import Header from "../../components/Header";
import { env } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import Player from "video-react/lib/components/Player";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../FractionNft/index.css";
import Split from "react-split-grid";
import ImageSlicer from "image-slicer"; // ES6 import
import fractionedImg from "../../assets/images/fractioned.png";
function SuceessFractionNft(props) {
  console.log(props);
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <Header />
      <div className="container viewContainer nftpdp__wrapper">
        <div className="nftpdp__cards-ctn" style={{ justifyContent: "center" }}>
          {" "}
          <div className="nftpdp__card nftpdp__card--content">
            <div className="mt-4">
              <h3 className="black">Success</h3>
              <div>{location.state.name}</div>

              <p className="black">
                We have succesfully fractioned nft into 100 parts
              </p>
              <a
                href={`https://polygonscan.com/tx/` + location.state.id}
                target="_blank"
              >
                {location.state.id}
              </a>
              <br />
              <img src={fractionedImg} className="mt-5" />
              {/* <img src={env.uploadImgLink + location.state.imagesId} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SuceessFractionNft;
