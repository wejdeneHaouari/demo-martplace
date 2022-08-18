import React, { useEffect, useState } from "react";
import Footer from "../../components/Common/Footer/Footer";
import Header from "../../components/Header";
import { authToken } from "../../constants/apiEndPoints";
import "./index.css";
import Logo from "../../assets/images/storeFront/defaultLogo.png";
import BalloonHeader from "../../components/BalloonHeader";
import Cookies from "universal-cookie";
import { env } from "../../constants";
import styled from "styled-components";
import NFTImage1 from "../../assets/images/sunglasses1.png";
import NFTImage2 from "../../assets/images/sunglasses2.png";
import NFTImage3 from "../../assets/images/sunglasses3.png";
import NFTImage4 from "../../assets/images/sunglasses4.jpeg";
import MerchandiseImage from "../../assets/images/merchandise.jpeg";
import NFTImage5 from "../../assets/images/sunglasses5.jpeg";
import NFTImage6 from "../../assets/images/sunglasses6.jpeg";
import moment from "moment";
import { Lightbox } from "react-modal-image";
import Modal from "../../components/Modal";
import useToggle from "../../components/Modal/useToggle";

const Collectibles = () => {
  const [storeTitle, setStoreTitle] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storeBanner, setStoreBanner] = useState("");
  const [storeEndingDate, setStoreEndingDate] = useState("");
  const [storeOpeningDate, setStoreOpeningDate] = useState("");
  const [storeOpen, setStoreOpen] = useState(false);
  const [isStoreClosed, setIsStoreClosed] = useState(false);
  const [showImage, setShowImage] = useState(false);

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
    <div>
      <Header storeOpen={storeOpen} />
      <div className="container viewCollectibles ">
        <div className="titleNft text-left mainTitle">NFT Collections</div>
        <div className="description mainDescription">
          These are the types of collectible NFTs that we offer{" "}
        </div>
        <div className="row text-center">
          <div className="col-md-4">
            <div>
              <img src={NFTImage1}></img>
              <div className="titleNft">Sunglasses 2 Galaxies</div>
              <div className="description">
                <span className=" green">50 </span>MINTED
              </div>
              <div className="mt-4 mx-auto typeNft">Digital Art</div>
              <div className="description">
                {" "}
                A limited-edition digital collectible NFT that reflects the
                adventurous spirit of our Hot Air Balloon Festival community.
                Unlock unlimited access to the upcoming metaverse experience and
                get entitled to receive free NFT drops in future
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <img src={NFTImage2}></img>
              <div className="titleNft">Guitar 2 Sea Reflections</div>
              <div className="description">
                <span className=" green">300 </span>MINTED
              </div>
              <div className="mt-4 mx-auto typeNft">Digital Art</div>
              <div className="description">
                {" "}
                A limited-edition digital collectible NFT that reflects the
                adventurous spirit of our Hot Air Balloon Festival community.
                Unlock unlimited access to the upcoming metaverse experience and
                get entitled to receive free NFT drops in future
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <img src={NFTImage3}></img>
              <div className="titleNft">Emoji 5 Radian</div>
              <div className="description">
                <span className=" green">30 </span>MINTED
              </div>
              <div className="mt-4 mx-auto typeNft">
                Digital Art with Experience
              </div>

              <div className="description">
                {" "}
                A limited-edition digital collectible NFT that provides all the
                features of a Digital Art NFT and also comes with a hot air
                balloon ride experience at the 39th annual New Jersey Lottery
                Festival of Ballooning on July 29-31 2022
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-4">
            <div>
              <img src={NFTImage4} className="borderRadius"></img>
              <div className="titleNft">New Jersey 3 Night</div>
              <div className="description">
                <span className=" green">180 </span>MINTED
              </div>
              <div className="mt-4 mx-auto typeNft">
                Digital Art with Merchandise
              </div>

              <div className="description">
                {" "}
                A limited-edition digital collectible NFT that provides all the
                features of a Digital Art NFT and also comes with a piece of
                physical merchandise. This NFT unlocks a limited-edition T-shirt
                featuring 1 of 6 core NFT Designs
              </div>
              <button
                onClick={() => setShowImage(true)}
                type="button"
                className="btn btn-primary mb-4 btn-sm"
              >
                Checkout Merchandise
              </button>
            </div>

            {showImage && (
              <Modal open={showImage} toggle={() => setShowImage(false)}>
                <div className="mx-auto">
                  <img class="center" src={MerchandiseImage}></img>
                </div>
              </Modal>
            )}
          </div>
          <div className="col-md-4">
            <div>
              <img src={NFTImage5} className="borderRadius"></img>
              <div className="titleNft">Muscle 4 Sunset</div>
              <div className="description">
                <span className=" green">50 </span>MINTED
              </div>
              <div className="mt-4 mx-auto typeNft">Digital Art</div>
              <div className="description">
                {" "}
                A limited-edition digital collectible NFT that reflects the
                adventurous spirit of our Hot Air Balloon Festival community.
                Unlock unlimited access to the upcoming metaverse experience and
                get entitled to receive free NFT drops in future
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <img src={NFTImage6} className="borderRadius"></img>
              <div className=" titleNft">Cowboy 1 Desert</div>
              <div className="description">
                <span className=" green">300 </span>MINTED
              </div>
              <div className="mt-4 mx-auto typeNft">Digital Art</div>
              <div className="description">
                {" "}
                A limited-edition digital collectible NFT that reflects the
                adventurous spirit of our Hot Air Balloon Festival community.
                Unlock unlimited access to the upcoming metaverse experience and
                get entitled to receive free NFT drops in future
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    // <div className="Wrapper">
    //   {/* <AnnoucementBar /> */}
    //       <Header storeOpen={storeOpen} />
    //        {/* <Collectibles2Container> */}
    //               <MainHeading>NFT Collections</MainHeading>
    //           {/* </Collectibles2Container> */}
    //   <CollectiblesContainer>
    //     <CollectiblesWrapper>
    //       <SingleNftWrapper>
    //         <img src={NFTImage1} />
    //         <MainTitle> Digital Art</MainTitle>
    //         <Description>
    //           This is an NFT Balloon Description Placeholder so it looks
    //           somewhat like this.
    //         </Description>
    //       </SingleNftWrapper>
    //       <SingleNftWrapper>
    //         <img src={NFTImage2} />
    //         <MainTitle>Digital Art with Experience</MainTitle>
    //         <Description>
    //           This is an NFT Balloon Description Placeholder so it looks
    //           somewhat like this.
    //         </Description>
    //       </SingleNftWrapper>
    //       <SingleNftWrapper>
    //         <img src={NFTImage3} />
    //         <MainTitle> Digital art With Merchandise</MainTitle>
    //         <Description>
    //           This is an NFT Balloon Description Placeholder so it looks
    //           somewhat like this.
    //         </Description>
    //       </SingleNftWrapper>
    //     </CollectiblesWrapper>
    //     <a href="./collectibles" target="_blank">
    //       Learn more about NFT Collections{" "}
    //     </a>
    //   </CollectiblesContainer>
    //   <CollectiblesContainer>
    //     <CollectiblesWrapper>
    //       <SingleNftWrapper>
    //         <img src={NFTImage4} />
    //         <MainTitle> Digital Art</MainTitle>
    //         <Description>
    //           This is an NFT Balloon Description Placeholder so it looks
    //           somewhat like this.
    //         </Description>
    //       </SingleNftWrapper>
    //       <SingleNftWrapper>
    //         <img src={NFTImage5} />
    //         <MainTitle>Digital Art with Experience</MainTitle>
    //         <Description>
    //           This is an NFT Balloon Description Placeholder so it looks
    //           somewhat like this.
    //         </Description>
    //       </SingleNftWrapper>
    //       <SingleNftWrapper>
    //         <img src={NFTImage6} />
    //         <MainTitle> Digital art With Merchandise</MainTitle>
    //         <Description>
    //           This is an NFT Balloon Description Placeholder so it looks
    //           somewhat like this.
    //         </Description>
    //       </SingleNftWrapper>
    //     </CollectiblesWrapper>
    //    <a href="./collectibles" target="_blank">
    //       Learn more about NFT Collections{" "}
    //     </a>
    //   </CollectiblesContainer>

    //   <Footer />
    // </div>
  );
};
export default Collectibles;

const MainTitle = styled.h6`
  font-family: "Aileron Reguler";
  font-size: 26px;
  font-weight: 900;
  font-stretch: normal;
  /* letter-spacing: 2px; */
  text-align: center;
  color: #fff;
  line-height: 120%;
  margin: 25px auto;

  @media screen and (max-width: 800px) {
    font-size: 22px;
  }
  @media screen and (min-width: 1260px) {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
`;
const MainHeading = styled.h2`
  font-family: "Aileron Reguler";
  font-size: 26px;
  font-weight: 900;
  font-stretch: normal;
  /* background-color: #101123; */
  /* letter-spacing: 2px; */
  position: absolute;
  z-index: 10;
  text-align: left;
  color: #fff;
  line-height: 120%;
  /* margin: 25px auto; */
  margin: 50px;

  @media screen and (max-width: 800px) {
    font-size: 22px;
  }
  @media screen and (min-width: 1260px) {
    width: 80%;
    /* margin-left: auto;
    margin-right: auto; */
  }
`;
const Description = styled.p`
  font-family: "Aileron Reguler";
  font-size: 24px;
  margin-bottom: 0;
  text-align: center;
  color: #fff;
  line-height: 120%;
  margin-bottom: 30px;
  text-align: left;

  @media screen and (max-width: 800px) {
    font-size: 22px;
  }
  @media screen and (min-width: 1260px) {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
`;
const CollectiblesContainer = styled.div`
  width: 100%;
  height: 600px;
  /* background-image: linear-gradient(
      to bottom,
      rgba(70, 70, 75, 0.56),
      rgba(18, 18, 25, 0.71)
    ),
    url("	https://balloonfestival.com/wp-content/themes/fob2022/images/bg-home.jpg"); */
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #101123;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  position: relative;
`;
const CollectiblesWrapper = styled.div`
  /* width: 65%; */
  height: 80%;
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 800px) {
    width: 95%;
    height: 100%;
    margin-top: 100px;
  }
`;
const Collectibles2Container = styled.div`
  /* width: 65%; */
  height: 80%;
  /* position: absolute; */
  z-index: 13;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 800px) {
    width: 95%;
    height: 100%;
    margin-top: 100px;
  }
`;
const SingleNftWrapper = styled.div`
  height: 143px;
  width: 100%;
  z-index: 11;
  text-align: center;
  p {
    color: white;
  }
`;
const SingleNft2Wrapper = styled.div`
  height: 143px;
  width: 100%;
  z-index: 13;
  text-align: center;
  p {
    color: white;
  }
`;
