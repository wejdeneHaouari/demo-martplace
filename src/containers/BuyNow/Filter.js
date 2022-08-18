
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AileronReguler from "../../assets/fonts/aileron/Aileron-Regular.otf";
import dropDownTriangle from "../../assets/images/storeFront/dropdownTriangle.svg";

const Filter = ({ type }) => {
    return (
        <Wrapper>
            <div class="dropdown">
                <DropDown
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <p>Price</p>{" "}
                    <span>
                        {" "}
                        <DropDownTriangle src={dropDownTriangle} />
                    </span>
                </DropDown>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">
                        Action
          </a>
                    <a class="dropdown-item" href="#">
                        Another action
          </a>
                    <a class="dropdown-item" href="#">
                        Something else here
          </a>
                </div>
            </div>
            <div class="dropdown">
                <DropDown
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <p>Traits</p>{" "}
                    <span>
                        {" "}
                        <DropDownTriangle src={dropDownTriangle} />
                    </span>
                </DropDown>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">
                        Action
          </a>
                    <a class="dropdown-item" href="#">
                        Another action
          </a>
                    <a class="dropdown-item" href="#">
                        Something else here
          </a>
                </div>
            </div>
            <div class="dropdown">
                <DropDown
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <p>Type</p>{" "}
                    <span>
                        {" "}
                        <DropDownTriangle src={dropDownTriangle} />
                    </span>
                </DropDown>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">
                        Action
          </a>
                    <a class="dropdown-item" href="#">
                        Another action
          </a>
                    <a class="dropdown-item" href="#">
                        Something else here
          </a>
                </div>
            </div>
            <div class="dropdown">
                <DropDown
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <p>Availability</p>{" "}
                    <span>
                        {" "}
                        <DropDownTriangle src={dropDownTriangle} />
                    </span>
                </DropDown>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">
                        Action
          </a>
                    <a class="dropdown-item" href="#">
                        Another action
          </a>
                    <a class="dropdown-item" href="#">
                        Something else here
          </a>
                </div>
            </div>
        </Wrapper>
    );
};

export default Filter;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 45px;
`;

const DropDown = styled.button`
  height: 30px;
  width: 200px;
  margin: 24px 12px 0px 0px;
  padding: 5px 11px 5px 8px;
  border-radius: 3px;
  border: solid 1px #dedede;
  background-color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
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
