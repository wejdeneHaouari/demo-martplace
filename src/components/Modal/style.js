import styled from "styled-components";

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 30;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  /* position: absolute; */
  /* z-index: 1000; */
`;

const ModalBody = styled.div`
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  @media (max-width: 985px) {
    width: 60%;
  }
  @media (min-width: 985px) {
    width: 30%;
  }
`;

const CloseButton = styled.span`
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;
export const modalStyle = {
  overlay: {
    position: "absolute",
    top: "95px",
    bottom: "70px",
    left: "50%",
    marginLeft: "35px",
    marginRight: "auto",
    transform: "translate(-50%, -0%)",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    border: "none",
    opacity: 0
  },
  content: {
    position: "absolute",
    top: "0px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
    border: "none",
    opacity:1
  },
};
export const StyledModal = {
  ModalWrapper,
  ModalBody,
  CloseButton
};