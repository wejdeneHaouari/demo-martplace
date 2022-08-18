import React, { useEffect, useState } from "react";
import styles from "./metamask-auth.module.css";
import styled from "styled-components";
import metamaskSVG from "../../assets/images/metamask.svg";

function isMobileDevice() {
  return "ontouchstart" in window || "onmsgesturechange" in window;
}

async function connect(onConnected) {
  if (!window.ethereum) {
    alert("Get MetaMask!");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  onConnected(accounts[0]);
}

async function checkIfWalletIsConnected(onConnected) {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      const account = accounts[0];
      onConnected(account);
      return;
    }

    if (isMobileDevice()) {
      await connect(onConnected);
    }
  }
}

export default function MetaMaskAuth({ onAddressChanged }) {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected(setUserAddress);
  }, []);

  // useEffect(() => {
  //   onAddressChanged(userAddress);
  // }, [userAddress]);

  return userAddress ? (
    <div>
      Connected with <Address userAddress={userAddress} />
    </div>
  ) : (
    <Connect setUserAddress={setUserAddress} />
  );
}

export function Connect({ setUserAddress }) {
  if (isMobileDevice()) {
    const dappUrl = "metamask-auth.ilamanov.repl.co"; // TODO enter your dapp URL. For example: https://uniswap.exchange. (don't enter the "https://")
    const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
    return (
      <a href={metamaskAppDeepLink}>
        <MetaMaskWrapper onClick={() => connect(setUserAddress)}>
          <img src={metamaskSVG} />
          <p>Link Metamask Wallet</p>
        </MetaMaskWrapper>
      </a>
    );
  }

  return (
    <MetaMaskWrapper onClick={() => connect(setUserAddress)}>
      <img src={metamaskSVG} />
      <p>Link Metamask Wallet</p>
    </MetaMaskWrapper>
  );
}

function Address({ userAddress }) {
  return (
    <span className={styles.address}>
      {userAddress.substring(0, 5)}…
      {userAddress.substring(userAddress.length - 4)}
    </span>
  );
}

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
