import React, { useEffect, useState } from "react";
import shareIcon from "../../assets/images/storeFront/share-icon.svg";
import EthLogo from "../../assets/images/storeFront/ethLogo.svg";
import { env } from "../../constants";
import { confirmAlert } from "react-confirm-alert";

function NftCard({ t }) {
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
  return (
    <div className="card" style={{ width: "100%" }}>
      {t.imageName.split(".").pop() === ("mp3" || "mp4") ? (
        <div className="card-flyer">
          <div className="text-box">
            <div className="image-box ">
              <a target="_blank" href={`./viewCert?id=${t._id}`}>
                <img
                  className="card-img-top img-fluid"
                  src={`${env.uploadImgLink}${t.thumbNail}`}
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
                src={shareIcon}
                alt="share"
                style={{ width: "32px", cursor: "pointer" }}
                onClick={(e) => shareCert(t)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NftCard;
