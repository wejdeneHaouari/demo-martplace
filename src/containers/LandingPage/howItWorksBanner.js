import React, { useState } from "react";
import styled from "styled-components";
import HowItWorksSVG from "../../assets/images/storeFront/howItWorks.svg";
import HowItWorksBannerImg from "../../assets/images/backgrnd.png";
import NFTImage from "../../assets/images/signin.jpeg";
const HowItWorksBanner = () => {
  return (
    <Wrapper>
      <ContentWrapper>
        <div className="textImageWrapper">
          <div className="textWrapper">
            <h2>How to Get Your NFTs</h2>
            <p>Your NFTs are just at your fingertips.</p>

            <div className="step">
              <Number>
                <p>1</p>
              </Number>
              <div>
                <h3 className="stepText">Select the NFT to purchase</h3>
                <span>
                  Each NFT has unique characteristics. Some NFTs unlock a
                  private zoom with Susan, Digital Art, Birdie Song and a signed
                  CD in the mail.
                </span>
              </div>
            </div>
            <div className="step">
              <Number>
                <p>2</p>
              </Number>
              <div>
                <h3 className="stepText">Make the Best Investment</h3>
                <span>Pay via credit card or crypto</span>
              </div>
            </div>
            <div className="step">
              <Number>
                <p>3</p>
              </Number>
              <div>
                <h3 className="stepText">Enjoy the NFT Your Way</h3>
                <span>
                  Leave the NFT on NJs Festival of ballooning platform or move
                  the NFT to your crypto wallet. You can also exchange Song NFTs
                  on marketplaces like OpenSea, which connect buyers and
                  sellers.{" "}
                </span>
              </div>
            </div>
          </div>
          {/* <img src={NFTImage} /> */}
        </div>
      </ContentWrapper>
    </Wrapper>
  );
};

export default HowItWorksBanner;

const Wrapper = styled.div`
  height: 520px;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${NFTImage});
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;

  @media screen and (max-width: 1000px) {
    height: auto;
  }
`;

const Number = styled.div`
  min-width: 40px;
  min-height: 40px;
  border-radius: 25px;
  display: inline-block;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  background-color: #495057;
  p {
    font-size: 20px;
    font-family: "Aileron Bold";
    color: white;
    margin: 0;
  }
`;

const ContentWrapper = styled.div`
  height: 90%;
  margin-top: 10px;
  /* width: 70%; */
  font-family: "Aileron Bold";
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  p {
    color: #fff;
    font-size: 20px;
  }

  .textImageWrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 900px) {
      flex-direction: column;
    }

    img {
      height: 500px;
      width: auto;

      @media screen and (max-width: 800px) {
        width: 80%;
        height: auto;
      }
    }
  }

  .textWrapper {
    margin-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
    width: 100%;
  }

  .step {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 25px;
    column-gap: 20px;
    width: 70%;
    .stepText {
      color: white;
      margin-bottom: 0;
      font-weight: 600;
      font-size: 22px;
    }
    span {
      font-size: 20px;
    }
  }

  #whiteText {
    color: white;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 800px) {
    width: 95%;
  }
  img {
    width: 80%;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 32px;
    font-weight: 900;
    font-style: bold;
    letter-spacing: 2.22px;
    color: #ffffff;
    margin-bottom: 5px;
  }
`;
