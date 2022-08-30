import React, { useEffect, useState } from "react";
import styled from "styled-components";
import bannerImage from "../../assets/images/backgrnd.png";

const HeaderBanner = ({ type }) => {
  return (
    <Wrapper type={type}>
      {type == "Home" ? (
        <BannerText type={type}>Home</BannerText>
      ) : type == "Home&Settings" ? (
        <BannerText>Store Settings</BannerText>
      ) : type == "Collection" ? (
        <BannerText type={type}> My Collection</BannerText>
      ) : type == "userProfile" ? (
        <BannerText type={type}>User Profile</BannerText>
      ) : (
        <BannerText>{type}</BannerText>
      )}
      {/* Countdown timer here */}
    </Wrapper>
  );
};

export default HeaderBanner;

const Wrapper = styled.div`
  background-image: url(${bannerImage});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.type === "Home"
      ? "flex-start"
      : props.type === "Collection"
      ? "center"
      : "center"};
  align-items: center;
  justify-content: ${(props) =>
    props.type === "Home"
      ? "space-between"
      : props.type === "Collection"
      ? "center"
      : "center"};
`;
const BannerText = styled.p`
  color: white;
  font-family: "Aileron Reguler";
  font-size: 20px;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.8;
  letter-spacing: 1.43px;
  margin-bottom: 0;
  margin-left: ${(props) =>
    props.type === "Home"
      ? "66px"
      : props.type === "Collection"
      ? "66px"
      : "0"};
  justify-content: ${(props) =>
    props.type === "Home"
      ? "space-between"
      : props.type === "Collection"
      ? "center"
      : "center"};
  font-weight: bold;
  color: #fff;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 62px;
`;
