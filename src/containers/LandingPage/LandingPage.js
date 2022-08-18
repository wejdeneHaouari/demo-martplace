import React, { useEffect, useState } from "react";
import Footer from "../../components/Common/Footer/Footer";
import Header from "../../components/Header";
import { authToken } from "../../constants/apiEndPoints";
import BannerImage from "./BannerImage";
import HowItWorksBanner from "./howItWorksBanner";
import "./LandingPage.css";
import NFTCarousel from "./NFTCarousel";
import Logo from "../../assets/images/storeFront/defaultLogo.png";
import BalloonHeader from "../../components/BalloonHeader";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import AnnoucementBar from "../../components/AnnoucementBar";
import WhitepaperBanner from "./WhitepaperBanner";
import Collection from "./Collection";

import moment from "moment";

const LandingPage = () => {
  const [storeTitle, setStoreTitle] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storeBanner, setStoreBanner] = useState("");
  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(false);
  const [isStoreClosed, setIsStoreClosed] = useState(false);

  const checkIsStoreClosed = () => {
    const d = new Date();

    // const date = new Date();
    // const offset = date.getTimezoneOffset() * 60000;
    const dx = Date.parse(d);

    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;

    let countdownTimestampMsEnding = Date.parse(storeEndingDate) + offset;

    const isTimeAfter = moment(dx).isAfter(countdownTimestampMsEnding); // true
    if (isTimeAfter) {
      setIsStoreClosed(true);
    }
    console.log("after", isTimeAfter, dx, storeEndingDate);
  };
  useEffect(() => {
    checkIsStoreClosed();
  }, [storeEndingDate]);

  useEffect(() => {
    checkIsStoreClosed();
  }, [storeEndingDate]);

  const getStoreLogoBanner = () => {
    let cookies = new Cookies();
    let myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "connect.sid=s%3AdNCAgjeHH2wJwWN7qh9Ar3M0lExpAhtB.P4OCs94J%2FTGPs63CXpBD947wAfhVZduWnrvZBxXQYYk"
    );

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
        setStoreTitle(result.data.title);
        setStoreDesc(result.data.banner_details);
        setStoreBanner(result.data.banner);
        setStoreEndingDate(result.data.store_ending_date);
        setStoreOpeningDate(result.data.store_opening_date);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getStoreLogoBanner();
  }, []);

  return (
    <div className="Wrapper">
      {/* <AnnoucementBar /> */}
      <Header storeOpen={storeOpen} />
      <BannerImage
        setStoreOpen={setStoreOpen}
        storeOpen={storeOpen}
        storeBanner={storeBanner}
        storeTitle={storeTitle}
        setStoreTitle={setStoreTitle}
        storeDesc={storeDesc}
        setStoreDesc={setStoreDesc}
        storeEndingDate={storeEndingDate}
        storeOpeningDate={storeOpeningDate}
        isStoreClosed={isStoreClosed}
      />
      <NFTCarousel />
      <Collection type="Susan Roth" />
      <Collection type="Crystal Bowersox"/>
      <HowItWorksBanner />
      <Footer />
    </div>
  );
};
export default LandingPage;
