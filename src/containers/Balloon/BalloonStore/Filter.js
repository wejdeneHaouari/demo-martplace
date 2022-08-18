import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AileronReguler from '../../../assets/fonts/aileron/Aileron-Regular.otf';
import Dropdowntriangle from '../../../assets/images/storeFront/dropdownTriangle.svg';

const Filter = ({ type }) => {
  const sortByType = (type) => {
    console.log('type', type);
  };
  return (
    <Wrapper>
      <div class='dropdown'>
        <DropDown
          class='btn btn-secondary dropdown-toggle'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <p>Price</p>{' '}
          <span>
            {' '}
            <DropDownTriangle src={Dropdowntriangle} />
          </span>
        </DropDown>
        <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          <button class='dropdown-item'>Action</button>
          <button class='dropdown-item'>Another action</button>
          <button class='dropdown-item'>Something else here</button>
        </div>
      </div>
      <div class='dropdown'>
        <DropDown
          class='btn btn-secondary dropdown-toggle'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <p>Traits</p>{' '}
          <span>
            {' '}
            <DropDownTriangle src={Dropdowntriangle} />
          </span>
        </DropDown>
        <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          <button class='dropdown-item'>Action</button>
          <button class='dropdown-item'>Another action</button>
          <button class='dropdown-item'>Something else here</button>
        </div>
      </div>
      <div class='dropdown'>
        <DropDown
          class='btn btn-secondary dropdown-toggle'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <p>Type</p>{' '}
          <span>
            {' '}
            <DropDownTriangle src={Dropdowntriangle} />
          </span>
        </DropDown>
        <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          <button class='dropdown-item' onClick={sortByType('art')}>
            Art
          </button>
          <button class='dropdown-item'>Experience</button>
        </div>
      </div>
      <div class='dropdown'>
        <DropDown
          class='btn btn-secondary dropdown-toggle'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <p>Availability</p>{' '}
          <span>
            {' '}
            <DropDownTriangle src={Dropdowntriangle} />
          </span>
        </DropDown>
        <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          <button class='dropdown-item'>Available</button>
          <button class='dropdown-item'>Sold</button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Filter;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: 65%;
  justify-content: space-between;
  max-width: 850px;
`;

const DropDown = styled.button`
  height: 30px;
  width: 200px;

  padding: 5px 11px 5px 8px;
  border-radius: 3px;
  border: solid 1px #dedede;
  background-color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin-right: 5px;
  p {
    color: black;
  }
  span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

const DropDownTriangle = styled.img`
  width: 10px;
`;
