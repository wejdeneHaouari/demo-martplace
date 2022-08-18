import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EthLogo from '../../assets/images/storeFront/ethLogo.svg';

const PriceConverter = ({ value, fontFamily, size, color }) => {
  const [ethPrice, setEthPrice] = useState(null);

  // const exchangeRate = () => {
    fetch("https://api.coinbase.com/v2/exchange-rates?currency=USD")
      .then((response) => response.json())
      .then((data) => {
        const usdToEthRate = (data.data.rates.ETH * value) / 100;
        setEthPrice(usdToEthRate.toFixed(6));

        // console.log('cd', usdToEthRate);
      });
  // };
  // useEffect(() => {
  //   exchangeRate();
  // }, []);

  return (
    <>
      <EthPriceWrapper size={size}>
        <EthImage src={EthLogo} size={size} />
        <EthPrice fontFamily={fontFamily} size={size} color={color}>
          {ethPrice}
        </EthPrice>
      </EthPriceWrapper>
    </>
  );
};

export default PriceConverter;

const EthPriceWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const EthImage = styled.img`
  width: 18px;
  height: ${(props) => (props.size === 'small' ? '18px' : '28px')};
  /* transform: translateY(-5px); */
`;

const EthPrice = styled.span`
  font-family: ${(props) =>
    props.fontFamily === 'Playfair' ? 'Playfair Display' : 'Aileron Reguler'};
  font-size: ${(props) =>
    props.size === 'small' ? '20px' : '30px'} !important;
  font-weight: bold;
  letter-spacing: 0.54px;
  color: ${(props) =>
    props.color === 'blue' ? ' #0a1567' : '#1c1c1c'} !important;
  margin-left: 3px;
  transform: translateY(-2.5px);
`;
