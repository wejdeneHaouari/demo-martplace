import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const UploadLogo = ({ setStoreLogo, storeLogo }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const displayPicture = (e) => {
    setStoreLogo(e.target.files[0]);
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
      <StoreLogoLabel>Store Logo</StoreLogoLabel>
      <PreviewImage
        src={selectedImage ? imageUrl : storeLogo}
        alt={selectedImage?.name}
      />

      <div className='input-group mt-4'>
        <div className='input-group-prepend'></div>
        <div className='custom-file'>
          <input
            type='file'
            className='custom-file-input'
            id='inputGroupFile01'
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
export default UploadLogo;

const Wrapper = styled.div`
  background-color: #fff;
  color: black;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    margin-right: 16px;
    cursor: pointer;
  }

  input {
    width: 142px;
    background-color: #4d96f6;
    color: white;
    cursor: pointer;
    z-index: 999;
    width: 100%;
  }
  .custom-file {
    position: relative;

    p {
      position: absolute;
      width: 100%;
      height: 100%;
      margin: 0;
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
  cursor: pointer;
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
