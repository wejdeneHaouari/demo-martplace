import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const UploadBanner = ({ setBanner, banner }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const displayPicture = (e) => {
    setBanner(e.target.files[0]);
    setSelectedImage(e.target.files[0]);
  };

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
    console.log(selectedImage);
  }, [selectedImage]);

  return (
    <Wrapper>
      <StoreLogoLabel>Store Banner</StoreLogoLabel>
      <PreviewImage
        src={selectedImage ? imageUrl : banner}
        alt={selectedImage?.name}
      />

      <div className='input-group mt-2'>
        <div className='input-group-prepend'>
          {/* <small>Drag and drop files to upload or</small> */}
        </div>

        <div className='custom-file'>
          <input
            type='file'
            className='custom-file-input'
            id='inputGroupFile02'
            form='storeSettingsForm'
            onChange={displayPicture}
            accept='image/png, image/jpeg'
          />
          <p>Update</p>
        </div>
      </div>
    </Wrapper>
  );
};
export default UploadBanner;

const Wrapper = styled.div`
  background-color: #fff;
  color: black;
  width: 100%;
  display: flex;
  margin-top: 14px;
  flex-direction: column;
  align-items: center;
  label {
    margin-right: 16px;
  }

  input {
    width: 142px;
    background-color: #4d96f6;
    color: white;
    cursor: pointer;
    width: 100%;
  }

  .custom-file {
    position: relative;

    p {
      position: absolute;
      height: 100%;
      margin: 0;
      width: 100%;
      text-align: center;
      color: #3e4ef1;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;

const InputFile = styled.input`
  width: 142px;
  height: 40px;
  padding: 11px 0 12px;
  border-radius: 3px;
  background-color: red;
`;

const StoreLogoLabel = styled.span`
  margin-right: 23px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #545454;
  letter-spacing: 0.5px;
  font-size: 16px;
`;

const PreviewImage = styled.img`
  max-width: 200px;
  margin: 0 auto;
`;
