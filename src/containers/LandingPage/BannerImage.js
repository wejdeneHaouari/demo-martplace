import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import CountdownTimer from "../../components/CountDownTimer/index";
import Moment from "moment";

const BannerImage = ({
  storeTitle,
  storeDesc,
  storeBanner,
  storeEndingDate,
  storeOpeningDate,
  setStoreOpen,
  storeOpen,
  isStoreClosed,
}) => {
  const [loading, setLoading] = useState(true);
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }, [loading]);

  let countdownTimestampMsOpening = Date.parse(storeOpeningDate) + offset;
  let countdownTimestampMsEnding = Date.parse(storeEndingDate) + offset;

  return (
    <BannerImageContainer storeBanner={storeBanner}>
      <CTAWrapper>
        <Introducing>INTRODUCING</Introducing>
        <MainTitle>{storeTitle}</MainTitle>
        <DescriptionButtonWrapper>
          <p>{storeDesc}</p>
          <CountdownTimer
            countdownTimestamp={storeOpeningDate}
            setStoreOpen={setStoreOpen}
            storeOpen={storeOpen}
            showCounter={true}
          />
          {storeOpen && !loading && !isStoreClosed && (
            <div>
              <h5 style={{ fontSize: "22px" }}>Store Closes on</h5>
              <p style={{ color: "#faa110", fontSize: "22px" }}>
                {Moment(countdownTimestampMsEnding).format(
                  "ddd. MMM DD, YYYY,  h:mm a"
                )}
              </p>
              <a href="/marketplace/home">
                <button>Collect Now</button>
              </a>
            </div>
          )}
          {isStoreClosed && (
            <div>
              <h5 style={{ fontSize: "22px" }}>Store Closed on</h5>
              <p style={{ color: "#faa110", fontSize: "22px" }}>
                {Moment(countdownTimestampMsEnding).format(
                  "ddd. MMM DD, YYYY,  h:mm a"
                )}
              </p>
            </div>
          )}
        </DescriptionButtonWrapper>
      </CTAWrapper>
    </BannerImageContainer>
  );
};
export default BannerImage;

const BannerImageContainer = styled.div`
  width: 100%;
  height: 80%;
 background-image: linear-gradient(
    to right,
    #0f1133,
    #0b0d15 100%,
    rgba(0, 0, 0, 0.5) 100%
  );
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  position: relative;
`;
const CTAWrapper = styled.div`
  width: 65%;
  height: 80%;
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media screen and (max-width: 800px) {
    width: 95%;
    height: 100%;
    margin-top: 100px;
  }
`;

const Introducing = styled.p`
  font-size: 26px;
  font-family: "Aileron Reguler";
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 1.11px;
  text-align: center;
  color: #faa110;
  margin-bottom: 0;
`;

const MainTitle = styled.p`
  font-family: "Termina";
  font-size: 40px;
  margin-bottom: 0;
  font-weight: 900;
  font-stretch: normal;
  font-style: italic;
  letter-spacing: 2px;
  text-align: center;
  color: #fff;
  line-height: 110%;
  margin-bottom: 10px;

  @media screen and (max-width: 800px) {
    font-size: 22px;
  }
  @media screen and (min-width: 1260px) {
    width: 80%;
    margin: 0 auto;
  }
`;
const DescriptionButtonWrapper = styled.div`
  height: 143px;
  width: 100%;
  z-index: 11;
  text-align: center;
  p {
    color: white;
    margin-bottom: 20px;
    font-size: 22px;
    @media screen and (min-width: 1260px) {
      width: 80%;
      margin: 0 auto 20px auto;
    }

    @media screen and (max-width: 768px) {
      font-size: 18px;
    }
  }

  button {
    width: 201px;
    height: 50px;
    padding: 15px 16px 18px 15px;
    background-color: #3e4ef1;
    font-family: "Aileron Reguler";
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 1px;
    text-align: center;
    color: #fff;

    &:disabled {
      background-color: #2b36a8;
      color: #c5c5c5;
      opacity: initial.5;
      cursor: not-allowed;
    }
  }
`;
