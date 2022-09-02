import { defineLocale } from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Cookies from "universal-cookie";

const UserUpdatePasswordForm = ({
  setReenterNewPassword,
  setNewPassword,
  setCurrentPassword,
  handleFormSubmit,
}) => {
  const cookies = new Cookies();
  return (
    <Wrapper>
      <SettingsForm id="storeSettingsForm" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <LabelInputWraper>
            <label>Current Password</label>
            <input
              type="password"
              onChange={e => setCurrentPassword(e.target.value)}
              className="form-control"
              placeholder="Enter current password"
            ></input>

          </LabelInputWraper>
          <LabelInputWraper>
            <label>New Password</label>
            <input
              type="password"
              id="title"
              className="form-control"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            ></input>
          </LabelInputWraper>
          <LabelInputWraper>
            <label>Re-enter New Password</label>
            <input
              type="password"
              id="title"
              className="form-control"
              placeholder="Re-enter new password"
              onChange={(e) => setReenterNewPassword(e.target.value)}
            ></input>
          </LabelInputWraper>
        </div>
      </SettingsForm>
    </Wrapper>
  );
};

export default UserUpdatePasswordForm;

const Wrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: black;
  text-align: left;
  margin: 20px auto;
  font-family: "Aileron Reguler";
  width: 85%;

  label {
    margin-right: 16px;
  }

  input {
    border-radius: 10px;
    color: white;
  }

  .custom-file-label::after {
    background-color: #3e4ef1;
    color: white;
  }

  .custom-file-label {
    border-radius: 10px;
    height: 50px;
    padding-top: 13px;
    color: #a0a0a0;
    font-size: 13px;
  }

  .custom-file-input:lang(en) ~ .custom-file-label::after {
    border-radius: 0 10px 10px 0;
    height: 50px;
    font-size: 14px;
    padding-top: 14px;
    width: 109px;
  }

  .custom-file {
    height: 50px;
  }
`;

const SettingsForm = styled.form`
  width: 400px;
  margin-right: 30px;
  margin-top: 46px;
`;

const LabelInputWraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;

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
    color: black;
  }

  textarea {
    border-radius: 10px;
    border: solid 1px #858585;
    margin-bottom: 8px;
  }

  #title {
    width: 100%;
  }

  #contact {
    width: 388px;
  }
`;
