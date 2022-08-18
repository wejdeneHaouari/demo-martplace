import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import Moment from "moment";
import { ReactVideo } from "reactjs-media";
import videoBg from "../../assets/images/download.png"; // with import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import logoSrc from "../../assets/images/logo.png"; // relative path to image
import "./index.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import * as Yup from "yup";
import Header from "../../components/Header";
import Footer from "../../components/Common/Footer/Footer";
import Modal from "react-modal";

function Ticket() {
  const [certificateArray, setcerticateArray] = useState({});
  const [newCertificateArray, setNewCertificateArray] = useState({});
  const [imageExt, setImageExt] = useState("");
  const [listingPrice, setListingPrice] = useState(1);
  const [loader, setLoader] = useState(false);
  const inputEl = useRef(null);
  const [token_id, settokenId] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [redeemButtonDisable, setRedeemButtonDisable] = useState(false);
  const [latestImageId, setLatestImageID] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newImageId, setNewImageId] = useState("");
  const cookies = new Cookies();
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const ids = window.location.href.split("?id=")[1];
  const imgId = JSON.stringify({
    imageId: ids,
  });
  const newNFTImageID = JSON.stringify({
    imageId: newImageId,
  });

  const userId = cookies.get("userId");
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

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  function getValue(e) {
    setNewImageId(e.target.value);
    console.log(e.target.value);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const getFileById = () => {
    axios
      .post(env.apiUrl + `api/users/getFilesById`, imgId, certheaders)
      .then((res) => {
        setcerticateArray(res.data.data);
        console.log(res.data.data);
        setListingPrice(res.data.data.price / 100);
        console.log("df", certificateArray.price);

        const certArray = res.data.data;
        certArray.events.map((item) => {
          if (item.type == "Creation") {
            setContactAddress(item.contract_address);
            settokenId(item.token_id);
          }
        });
        const str = certificateArray.imageName;
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
  };

  const getNewNFTInfo = () => {
    axios
      .post(env.apiUrl + `api/users/getFilesById`, newNFTImageID, certheaders)
      .then((res) => {
        setNewCertificateArray(res.data.data);
        console.log(res.data.data);
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
  };

  useEffect(() => {
    getFileById();
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string(),
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const ref = React.createRef();

  console.log(certificateArray);

  const getImageSecondTransferDropshop = async (imageId) => {
    try {
      getNewNFTInfo();
      const data = {
        userId: userId,
        imageId: certificateArray.id,
      };
      axios
        .post(
          env.apiUrl + "api/users/imageSecondTransferdropshop",
          data,
          certheaders
        )
        .then((res) => {
          if (res.data.status === false) {
            toast("Something went wrong");
          } else {
            toast("Success");
            setLatestImageID(res.data.imageId);
            redeemTicket(res.data.imageId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };

  const redeemTicket = (LatestImageID) => {
    setRedeemButtonDisable(true);
    setLoader(true);

    const data = {
      userId: userId,
      imageId: LatestImageID,
    };
    axios
      .post(env.apiUrl + "api/users/burnToken", data, certheaders)
      .then((res) => {
        if (res.data.status === false) {
          toast("Something went wrong");
        } else {
          toast("Success");
          AirdropNFT();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AirdropNFT = () => {
    setLoader(false);
    const data = {
      userId: userId,
      receiverId: "62df188225066f5ed803677d",
      imageId: newImageId,
    };
    axios
      .post(env.apiUrl + "api/users/airdropsinglewithsqs", data, certheaders)
      .then((res) => {
        if (res.data.status === false) {
          toast("Something went wrong");
        } else {
          toast("Success");
          openModal();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Header />
      {/* {createThumbnail} */}
      <div className="container viewContainer" ref={ref}>
        <div className="test">
          <div className="card viewContainer--vc">
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
                </div>
              </>
            ) : (
              <div className="containerdiv">
                <img
                  src={`${env.uploadImgLink}${certificateArray.imageName}`}
                  alt="Avatar"
                  className="certImg"
                />
              </div>
            )}
            {!loader && (
              <button
                className="btn btn-primary cc__btn-transfer ticket"
                disable={redeemButtonDisable}
                onClick={getImageSecondTransferDropshop}
              >
                Redeem Ticket
              </button>
            )}
            {loader && (
              <LoaderContainer>
                <div class="spinner-border text-dark" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </LoaderContainer>
            )}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <h2 className="newNFTModalTitle">You have recieved a new NFT!</h2>
              <img
                className="newNFTImage"
                src={`${env.uploadImgLink}${newCertificateArray.imageName}`}
              />
              <a
                className="btn btn-primary cc__btn-transfer ticket"
                href={`viewCert?id=${newImageId}`}
                onClick={closeModal}
              >
                Go To NFT
              </a>
            </Modal>
          </div>
        </div>
      </div>
      <div className="containerdiv">
        <div className="hh">
          <input type="text" onChange={getValue} />
          <h4 className="h4">{"New Id :" + newImageId}</h4>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 65px;
  align-items: center;
`;

export default Ticket;
