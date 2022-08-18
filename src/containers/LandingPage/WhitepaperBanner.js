import React, { useEffect, useState } from "react";
import styled from "styled-components";
import whitePaperImage from "../../assets/images/whitePaper.png";

const WhiitepaperBanner = () => {
  return (
    <WhitepaperBannerContainer>
      <WBCTAWrapper>
        <DescriptionButtonWrapper>
          <MainTitle> Song Source Susan Roth and Crystal Bowersox</MainTitle>
          <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
            <button>Learn More</button>
          </a>
        </DescriptionButtonWrapper>
      </WBCTAWrapper>
    </WhitepaperBannerContainer>
  );
};
export default WhiitepaperBanner;

const MainTitle = styled.h2`
  font-family: "Aileron Reguler";
  font-size: 32px;
  margin-bottom: 0;
  font-weight: 900;
  font-stretch: normal;
  letter-spacing: 2px;
  text-align: center;
  color: #fff;
  line-height: 120%;
  margin-bottom: 30px;

  @media screen and (max-width: 800px) {
    font-size: 22px;
  }
  @media screen and (min-width: 1260px) {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const WhitepaperBannerContainer = styled.div`
  width: 100%;
  height: 411px;
  background-image: linear-gradient(
      to bottom,
      rgba(70, 70, 75, 0.56),
      rgba(18, 18, 25, 0.71)
    ),
    url(${whitePaperImage});
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  position: relative;
`;
const WBCTAWrapper = styled.div`
  width: 65%;
  height: 80%;
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 800px) {
    width: 95%;
    height: 100%;
    margin-top: 100px;
  }
`;

const DescriptionButtonWrapper = styled.div`
  height: 143px;
  width: 100%;
  z-index: 11;
  text-align: center;
  p {
    color: white;
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
    }
  }
`;
