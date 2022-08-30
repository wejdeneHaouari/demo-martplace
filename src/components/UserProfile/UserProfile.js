import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import metamaskSVG from '../../assets/images/metamask.svg';
import Cookies from 'universal-cookie';
import { env } from '../../constants';
import { APIs } from '../../assets/MarketplaceAPIEndpoints';
import { Connect } from '../MetaMask/metamask-auth';

import MetaMaskAuth from '../MetaMask/metamask-auth';
import axios from 'axios';
import { headers, userID } from '../../constants/apiEndPoints';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const UserProfile = ({
  setFirstName,
  setLastName,
  profileFileName,
  profilePicture,
  setProfilePicture,
  setProfleFileName,
}) => {
  const cookies = new Cookies();
  const history = useHistory();
  const authToken = 'Bearer ' + cookies.get('userToken');
  const [loader, setLoader] = useState(false);
  const [metamask, setMetamask] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [metaPassword, setMetaPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const notify = (type, text) => {
    if (type === 'loginError') {
      toast(text);
    }
  };
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const profileOnChange = (e) => {
    console.log(e.target.files[0]);
    setProfleFileName(e.target.files[0].name);
    setProfilePicture(e.target.files[0]);
  };

  const handleMetaMaskClick = () => {
    setMetamask(true);
  };

  const exportPrivateKey = () => {
    const data = {
      userId: userID,
      password: metaPassword,
    };
    axios
      .post(env.apiUrl + `api/users/getuserPrivateKeybyPwd`, data, headers)
      .then((res) => {
        setPrivateKey(res.data.data);
        handleOpen();
      })
      .catch((err) => {
        if (err.response) {
          notify('loginError', err.response.data.msg);
        }
      });
  };

  const updateEmail = () => {
    console.log(email);
    console.log(password);
    const data = {
      userId: userID,
      newemail: email,
      password: password,
    };
    axios
      .post(env.apiUrl + 'api/users/updateEmail', data, headers)
      .then((res) => {
        if (res.data.status === false) {
          notify('loginError', res.data.msg);

          if (res.data.msg === 'User email is Not Verified.') {
            history.push('/verify');
          }
        } else {
          notify('loginError', res.data.msg);

          history.push('/logout');
          // cookies.remove("email",{ path: '/' });
          // cookies.set("email", email,{ path: '/' });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          notify('loginError', err.response.data.msg);
        }
      });
  };

  return (
    <Wrapper>
      <LeftContainer>
        {/*<UsernameWrapper>*/}
        {/*  <p>Username</p>*/}
        {/*  <p className="username">test</p>*/}
        {/*</UsernameWrapper>*/}
        <SettingsForm id="storeSettingsForm">
          <div className="form-group">
            <LabelInputWraper>
              <label>First Name</label>
              <input
                className="form-control"
                placeholder="Update your first name"
                defaultValue={cookies.get("firstname")}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
            </LabelInputWraper>
            <LabelInputWraper>
              <label>Last Name</label>
              <input
                id="title"
                className="form-control"
                placeholder="Update your last name"
                defaultValue={cookies.get("lastname")}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </LabelInputWraper>

            <LabelInputWraper>
              <label>Email</label>
              <input
                className="form-control"
                placeholder="Update your first name"
                defaultValue={cookies.get("email")}
                disabled={true}
              ></input>
            </LabelInputWraper>
          </div>
        </SettingsForm>
        <EmailWrapper>
          <button
            onClick={() => {
              setShowUpdateEmail(!showUpdateEmail);
            }}
          >
            Update Email
          </button>

          {showUpdateEmail ? (
            <LabelInputWraper>
              <label>New Email</label>
              <input
                id="title"
                className="form-control"
                placeholder="Update your email"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </LabelInputWraper>
          ) : null}
          {showUpdateEmail ? (
            <LabelInputWraper>
              <label>Current Password</label>
            </LabelInputWraper>
          ) : null}
        </EmailWrapper>

        <UpdateEmail>
          {showUpdateEmail ? (
            <input
              placeholder="Enter Current Password"
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          ) : null}

          {showUpdateEmail ? (
            <button onClick={updateEmail}>Update</button>
          ) : null}
        </UpdateEmail>
      </LeftContainer>
      <RightContainer>
        <FileUploadWrapper>
          <div className="input-group-prepend">
            <StoreLogoLabel>Profile Image</StoreLogoLabel>
            {/* <small>Drag and drop files to upload orders</small> */}
          </div>
          <div className="custom-file">
            <input
              onChange={profileOnChange}
              type="file"
              className="custom-file-input"
              id="inputGroupFile01"
              accept="image/png, image/jpeg"
            />
            <label className="custom-file-label" htmlFor="inputGroupFile01">
              {profileFileName}
            </label>
          </div>
        </FileUploadWrapper>
        {/* <FileUploadWrapper>
          <StoreLogoLabel>Connect to Metamask</StoreLogoLabel>
          <MetaMaskAuth />
        </FileUploadWrapper> */}
        <FileUploadWrapper>
          <StoreLogoLabel>
            Export the Chaincert Blockchain Private Key{" "}
            <img src={metamaskSVG} className="metaImg" />
          </StoreLogoLabel>
          <label>Current Password</label>
          <PrivateKeyWrapper>
            <input
              placeholder="Enter Current Password"
              type={"password"}
              onChange={(e) => setMetaPassword(e.target.value)}
            ></input>

            <button onClick={exportPrivateKey}>
              Export Blockchain Private Key{" "}
            </button>
          </PrivateKeyWrapper>

          <Dialog maxWidth="400px" open={show} onClose={handleClose}>
            <DialogTitle>Private Key</DialogTitle>
            <DialogContent>
              <Box
                noValidate
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                }}
              >
                <input
                  style={{ width: 600 }}
                  disabled={true}
                  value={privateKey}
                ></input>
              </Box>
            </DialogContent>
            <DialogActions>
              {/*<ButtonStyle>*/}
              {/*  <Button onClick={() => {navigator.clipboard.writeText(privateKey)}}>Copy</Button>*/}
              {/*</ButtonStyle>*/}
              <ButtonStyle>
                <Button onClick={handleClose}>Close</Button>
              </ButtonStyle>
            </DialogActions>
          </Dialog>
        </FileUploadWrapper>
      </RightContainer>
      {loader && (
        <LoaderContainer>
          <div class="spinner-border text-dark" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </LoaderContainer>
      )}
    </Wrapper>
  );
};

export default UserProfile;

const Wrapper = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: black;
  text-align: left;
  margin: 150px auto;
  font-family: 'Aileron Reguler';
  width: 80%;

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

export const LoaderContainer = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MetaMaskWrapper = styled.div`
  width: 250px;
  height: 50px;
  border-radius: 10px;
  box-shadow: 0 2px 22px 0 rgba(63, 63, 63, 0.29);
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  img {
    width: 35px;
  }
  p {
    margin: 0;
    padding-left: 7px;
    color: #545454;
    font-weight: 600;
  }
`;

const LeftContainer = styled.div`
  width: 500px;
  height: 676px;
  margin-left: 80px;
`;

const RightContainer = styled.div`
  width: 500px;
  height: 676px;
`;
const UsernameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  p {
    margin: 0;
    color: black;
    &:nth-child(2) {
      font-weight: 600;
    }
  }
`;

const SettingsForm = styled.form`
  width: 320px;
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

const UpdateProfileForm = styled.form``;
const StoreLogoLabel = styled.span`
  margin-right: 23px;
  margin-top: 4px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #0a1567;
  letter-spacing: 0.5px;
  font-size: 16px;
  letter-spacing: 0.56px;
  .metaImg {
    width: 50px;
  }
`;

const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;
const PrivateKeyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  input {
    ::placeholder {
      color: #a0a0a0;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    padding-left: 10px;
    color: black;
    height: 50px;
    border-radius: 10px 0px 0px 10px;
    width: 330px;
    border: solid 1px #858585;
  }
  button {
    height: 50px;
    letter-spacing: 1.2px;
    min-width: 282px;
    background-color: #3e4ef1;
    color: white;
    font-size: 14px;
    font-weight: 500;
    border-radius: 0 10px 10px 0;
    :hover {
      background-color: #313eba;
    }
  }
`;

const UpdateEmail = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 50px;
  input {
    ::placeholder {
      color: #a0a0a0;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    padding-left: 10px;
    color: black;
    height: 50px;
    border-radius: 10px 0px 0px 10px;
    width: 330px;
    border: solid 1px #858585;
  }
  button {
    height: 50px;
    letter-spacing: 1.2px;
    width: 100px;
    background-color: #3e4ef1;
    color: white;
    font-size: 14px;
    font-weight: 500;
    border-radius: 0 10px 10px 0;
    :hover {
      background-color: #313eba;
    }
  }
`;

const ButtonStyle = styled.div`
  button {
    height: 30px;
    letter-spacing: 1.2px;
    min-width: 80px;
    background-color: #3e4ef1;
    color: white;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px 10px 10px 10px;
    :hover {
      background-color: #313eba;
    }
  }
`;

const EmailWrapper = styled.div`
  width: 320px;
  margin-right: 30px;
  margin-top: 46px;

  button {
    height: 50px;
    margin-bottom: 25px;
    letter-spacing: 1.2px;
    min-width: 150px;
    background-color: #3e4ef1;
    color: white;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px 10px 10px 10px;
    :hover {
      background-color: #313eba;
    }
  }
`;
