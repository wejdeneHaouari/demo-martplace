import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { APIs } from "../../assets/MarketplaceAPIEndpoints";
import UploadLogo from "./UploadLogo";
import { env } from "../../constants";
import UploadBanner from "./UploadBanner";

const StoreSettingsForm = ({
  handleSettingSubmit,
  setUserID,
  setStoreLogo,
  setBanner,
  setStoreEndingDate,
  setTitle,
  setDescription,
  setContact,
  setBannerDetails,
  setStoreDetails,
  setStoreOpeningDate,
}) => {
  return (
    <Wrapper>
      <SettingsForm id="storeSettingsForm" onSubmit={handleSettingSubmit}>
        <div className="form-group">
          <LabelInputWraper>
            <label>Store Name</label>
            <input
              className="form-control"
              placeholder="Enter name of your store"
              onChange={(e) => setStoreDetails(e.target.value)}
            ></input>
          </LabelInputWraper>
          <LabelInputWraper>
            <label>Title</label>
            <input
              id="title"
              className="form-control"
              placeholder="Enter headline of your home page"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </LabelInputWraper>
          <LabelInputWraper>
            <label>Banner Details</label>
            <textarea
              className="form-control"
              placeholder="Short description of your store"
              onChange={(e) => setBannerDetails(e.target.value)}
              style={{ height: "111px" }}
            ></textarea>
          </LabelInputWraper>
          <LabelInputWraper>
            <label>Contact Us</label>
            <input
              id="contact"
              className="form-control"
              placeholder="Enter Headline of your contact form"
              onChange={(e) => setContact(e.target.value)}
            ></input>
          </LabelInputWraper>
          <LabelInputWraper>
            <label>Store Open Date&Time</label>
            <input
              className="form-control"
              type="datetime-local"
              placeholder="Month, Day, Time"
              onChange={(e) => setStoreEndingDate(e.target.value)}
            ></input>
          </LabelInputWraper>
          <LabelInputWraper>
            <label>Store End Date&Time</label>
            <input
              className="form-control"
              type="datetime-local"
              placeholder="Month, Day, Time"
              onChange={(e) => setStoreEndingDate(e.target.value)}
            ></input>
          </LabelInputWraper>
        </div>
      </SettingsForm>
      <ImageUploadWrapper>
        <UploadLogo setStoreLogo={setStoreLogo} />
        <UploadBanner setBanner={setBanner} />
      </ImageUploadWrapper>
    </Wrapper>
  );
};

export default StoreSettingsForm;

const Wrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: black;
  text-align: left;
  margin: 130px auto;
  width: 60%;

  div {
    margin: 0px 30px;
  }
`;

const SettingsForm = styled.form`
  width: 320px;
  margin-right: 30px;
`;

const LabelInputWraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 10px;

  label {
    font-weight: 600;
    color: #545454;
    letter-spacing: 0.5px;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 10px;
  }

  input {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-bottom: 8px;
  }

  textarea {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-bottom: 8px;
  }

  #title {
    width: 388px;
  }

  #contact {
    width: 388px;
  }
`;

const ImageUploadWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  width: 520px;
`;
