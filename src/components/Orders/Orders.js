import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Orders = () => {
  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th scope="col">ITEM NAME</th>
            <th scope="col">ID</th>
            <th scope="col">BUYER</th>
            <th scope="col">BUYER EMAIL</th>
            <th scope="col">PRICE</th>
            <th scope="col">PAYMENT TYPE</th>
            <th scope="col">DATE & TIME</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>NFT NAME</td>
            <td>12</td>
            <td>John Doe</td>
            <td>jdoe@gmail.com</td>
            <td>$1234.5</td>
            <td>Ethereum</td>
            <td>Jan, 6, 2022 12:00AM</td>
          </tr>
          <tr>
            <td>NFT NAME</td>
            <td>12</td>
            <td>John Doe</td>
            <td>jdoe@gmail.com</td>
            <td>$1234.5</td>
            <td>Ethereum</td>
            <td>Jan, 6, 2022 12:00AM</td>
          </tr>
        </tbody>
      </Table>
    </Wrapper>
  );
};
export default Orders;

const Wrapper = styled.div`
  background-color: #fff;;
  font-family: "Aileron Bold";
  letter-spacing: 1.75px;
  font-weight: 800;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: black;
  text-align: left;
  margin: 130px auto;
  width: 85%;
`;

const Table = styled.table`
  width: 100%;
  thead {
    border-bottom: solid 1px #aeb9db;
  }

  th {
    padding-bottom: 14px;
    margin-bottom: 14px;
    color: #858585;
  }
  td {
  padding-top: 14px;
  }
`;
