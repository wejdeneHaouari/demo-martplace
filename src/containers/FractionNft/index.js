import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import HeaderBanner from "../../components/BalloonHeader/HeaderBanner";
import Header from "../../components/Header";
import { env } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import Player from "video-react/lib/components/Player";
import { useHistory, Link, useNavigate } from "react-router-dom";

function FractionNft() {
  const [certificateArray, setcerticateArray] = useState([]);
  const [imageExt, setImageExt] = useState("");
  const [vaultName, setVaultName] = useState("");
  const [fractionCount, setFractionCount] = useState("");
  const [txHash, setTxHash] = useState("");
  const cookies = new Cookies();
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const history = useHistory();

  const ids = window.location.href.split("?id=")[1];
  const imgId = JSON.stringify({
    imageId: ids,
  });

  const certheaders = {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: authToken,
    },
  };
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  useEffect(() => {
    axios
      .post(env.apiUrl + `api/users/getFilesById`, imgId, certheaders)
      .then((res) => {
        setcerticateArray(res.data.data);
        console.log(res.data.data);
        const certArray = res.data.data;
        console.log("certificate", res.data);
        setImageExt(res.data.data.imageName.split(".").pop());
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            Cookies.remove("response");
            sessionStorage.clear();
            notify("loginError", "Token is expired. Please try to login again");
            //   history.push("/");
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });
  }, []);

  const userId = cookies.get("userId");
  const fractionalize = () => {
    console.log(vaultName, fractionCount);
    const fractionData = {
      nameNFT: vaultName,
      amount: fractionCount,
      receiverAddress: "0xFc261C75D51e7e225905f1b38997c35c3c634A5e",
      userId: userId,
    };
    if (vaultName.length > 0 && fractionCount.length > 0) {
      axios
        .post(
          env.apiUrl + `api/users/fractionTransferToken`,
          fractionData,
          certheaders
        )
        .then((res) => {
          notify("loginError", res.data.msg);
          setTxHash(res.data.data.txHash);
          history.push({
            pathname: "/successfractionalize",
            state: {
              id: res.data.data.txHash,
              name: fractionCount,
              imagesId:
                certificateArray.imageName || certificateArray.thumbNail,
            },
          });
          //   history.push("/successfractionalize", {
          //     state: { id: txHash, name: fractionCount },
          //   });
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 403) {
              Cookies.remove("response");
              sessionStorage.clear();
              notify(
                "loginError",
                "Token is expired. Please try to login again"
              );
              //   history.push("/");
            } else {
              notify("loginError", "Something went wrong");
            }
          }
        });
    } else {
      notify("loginError", "Please enter vault Name and fraction count");
    }
  };
  return (
    <div>
      <Header />
      <div className="container viewContainer nftpdp__wrapper">
        <div className="nftpdp__cards-ctn" style={{ justifyContent: "center" }}>
          {" "}
          <div className="nftpdp__card nftpdp__card--content">
            <div className="mt-4">
              <h3 className="black">Selected Nfts</h3>
              <div className="imgContainerBox">
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
              </div>
              <p className="black">Vault Details</p>
              <div className="form-group form-group--store-settings ml-2">
                <label className="grey ml-3">Vault Name</label>
                <div style={{ display: "flex" }} className="col-md-9">
                  <input
                    className="form-control"
                    placeholder="Vault Name"
                    onChange={(e) => setVaultName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="form-group form-group--store-settings ml-2">
                <label className="grey ml-3">
                  Number of fractions to create
                </label>
                <div style={{ display: "flex" }} className="col-md-9">
                  <input
                    className="form-control"
                    placeholder="Number of fractions to create"
                    onChange={(e) => setFractionCount(e.target.value)}
                  ></input>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fractionalize()}
                className="btn btn-primary w-auto ml-3"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FractionNft;
