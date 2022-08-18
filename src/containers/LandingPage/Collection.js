import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NFTImage1 from "../../assets/images/sunglasses1.png";
import NFTImage2 from "../../assets/images/sunglasses3.png";
import NFTImage3 from "../../assets/images/sunglasses4.jpeg";
import Susan from "../../assets/images/susan.jpeg";
import Crystal from "../../assets/images/Crystal.png";
import "./LandingPage.css";
const Collection = ({ type }) => {
  return (
    <div className="container viewCollectibles ">
      <ArtistContainer>
        <h3>NFT Collections</h3>
        <ArtistWrapper>
          <img src={type === "Susan Roth" ? Susan : Crystal} />
          <div>
            <h4>{type === "Susan Roth" ? "Susan Roth" : "Crystal Bowersox"}</h4>
            <p>
              {type === "Susan Roth"
                ? "Susan Roth began her career as a performing artist and songwriter in Seattle, Washington, where she garnered multiple performance and writing awards for her albums how to say goodbye and Surfacing to Breathe, and served on the NARAS (Recording Academy - The Grammy people) Board of Governors as Songwriter Governor."
                : "Crystal Bowersox is an American singer/songwriter. Originally from northwest Ohio, Crystal currently lives in Nashville, TN, USA. Crystal’s love for music developed at an early age, stemming from the need to find peace in a chaotic world. For her, music has always been the most effective form of catharsis."}
            </p>
          </div>
        </ArtistWrapper>
      </ArtistContainer>

      <div className="mainTitle">
        {type === "Susan Roth"
          ? "Susan Roth Collection"
          : "Crystal Bowersox Collection"}
      </div>
      <div className="row text-center">
        <div className="col-md-4">
          <div>
            <img src={NFTImage1} className="borderRadius"></img>
            <div className="mt-4 mx-auto typeNft">Bluebird</div>
            <div className="description">
              {" "}
              A limited-edition digital collectible NFT that reflects the spirit
              of Music Lover from Song Source. Unlock A private zoom with Susan,
              Digital Art, Birdie Song, a signed CD in the mail and entered a
              drawing for a co-write.
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <img src={NFTImage2} className="borderRadius"></img>
            <div className="mt-4 mx-auto typeNft">Redbird</div>
            <div className="description">
              {" "}
              A limited-edition digital collectible NFT that reflects the spirit
              of Music Lover from Song Source. Unlock Digital Art, and Birdie
              Song and entered a drawing for a co-write.
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <img src={NFTImage3} className="borderRadius"></img>
            <div className="typeNft mt-4 mx-auto">Blackbird</div>
            <div className="description">
              {" "}
              A limited-edition digital collectible NFT that reflects the spirit
              of Music Lover from Song Source. Unlock the Digital Art and Birdie
              Song.
            </div>
          </div>
        </div>
      </div>
      {/* <a href="./collectibles" target="_blank" rel="noopener noreferrer">
        <p>Learn more about the collection &gt;</p>
      </a> */}
      <a
        className="mainTitle text-center green"
        href="./collectibles"
        target="_blank"
      >
        Learn More
      </a>
    </div>
  );
};
export default Collection;

const MainTitle = styled.h3`
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
  /* letter-spacing: 2px; */
  position: absolute;
  z-index: 10;
  text-align: left;
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
const CollectionContainer = styled.div`
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
const CollectionWrapper = styled.div`
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

const SingleNftWrapper = styled.div`
  height: 143px;
  width: 100%;
  z-index: 11;
  text-align: center;
  p {
    color: white;
  }
`;

const ArtistWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 35px;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    div {
      margin: 0 30px !important;
    }

    img {
      margin-bottom: 30px !important;
    }

    h4 {
      text-align: center;
    }

    p {
      text-align: center;
    }
  }

  h4 {
    font-weight: 700;
  }
  div {
    margin: 0 80px;
    p {
      font-size: 22px;
      color: white;
    }
  }

  img {
    border-radius: 80%;
    width: 300px;
    max-width: 300px;
    max-height: 300px;
    padding: 0;
    margin: 0;
    border: 5px solid white;
  }
`;

const ArtistContainer = styled.div`
  max-width: 1200px;
  margin-bottom: 50px;
  margin-top: 100px;
  margin-left: 6%;

  @media screen and (max-width: 768px) {
    h3 {
      text-align: center;
    }
  }
`;
