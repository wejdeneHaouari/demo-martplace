import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../constants";
import { headers, userID, userIDObj } from "../../constants/apiEndPoints";
import Moment from "moment";
import DataTable from "react-data-table-component";
import "./index.css";
import Dropdowntriangle from "../../assets/images/storeFront/dropdownTriangle.svg";
import styled from "styled-components";
import { toast } from "react-toastify";
const CryptoOrders = () => {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemIdIsChecked, setItemIdIsChecked] = useState(false);
  const [itemNameIsChecked, setItemNameIsChecked] = useState(false);
  const [buyerEmailIsChecked, setBuyerEmailIsChecked] = useState(false);

  const fetchCryptoOrders = async (currentPage) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/cryptoBuyDetails?userId=${userID}&page=${currentPage}`,
      headers
    );

    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };

  useEffect(() => {
    fetchCryptoOrders();
  }, []);

  const notify = (type, text) => {
    if (type === "searchError") {
      toast(text);
    }
  };
  const columns = [
    {
      name: "ITEM NAME",
      selector: "itemName",
      sortable: true,
    },
    {
      name: "ID",
      cell: (row, index) => (
        <a href={"/marketplace/collection/viewCert?id=" + row.soldDocumentId}>
          {" "}
          {row.soldDocumentId}
        </a>
      ),
      sortable: true,
    },
    {
      name: "BUYER",
      selector: "buyerName",
      sortable: true,
    },
    {
      name: "BUYER EMAIL",
      selector: "buyerAdress",
      sortable: true,
    },
    {
      name: "STATUS",
      selector: "cryptoStatus",
      sortable: true,
    },
    {
      name: "PRICE",
      sortable: true,
      selector: "price",
      cell: (row, index) => <div> $ {row.price}</div>,
    },
    {
      name: "DATE & TIME",
      selector: "date",
      sortable: true,
      cell: (row) => Moment(row.date).format("ddd. MMM DD, YYYY,  h:mm a"),
    },
  ];

  const handlePageChange = (page) => {
    if (searchField === "") {
      fetchCryptoOrders(page);
    } else {
      handleSearch(page);
    }

    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchCryptoOrders(page, newPerPage);
    setPerPage(newPerPage);
  };

  function handleChange(event) {
    const target = event.target.id;
    const value = event.target.checked;

    if (target == "item-id") {
      setItemIdIsChecked(value);
      setBuyerEmailIsChecked(false);
      setItemNameIsChecked(false);
    } else if (target == "item-name") {
      setItemNameIsChecked(value);
      setBuyerEmailIsChecked(false);
      setItemIdIsChecked(false);
    } else if (target == "buyer-email") {
      setBuyerEmailIsChecked(value);
      setItemNameIsChecked(false);
      setItemIdIsChecked(false);
    }
    if (value) {
      setSearchField(target);
    } else {
      setSearchField("");
      fetchCryptoOrders(currentPage);
    }
  }

  const searchByItemName = async (key, page) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/searchCryptoBuyByItemName?userId=${userID}&key=${key}&page=${page}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };
  const searchByItemId = async (key, page) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/SearchCryptoBuyByItemId?userId=${userID}&key=${key}&page=${page}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };
  const searchByBuyerEmail = async (key, page) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/searchCryptoBuyByBuyerEmail?userId=${userID}&key=${key}&page=${page}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };

  const handleSearch = (page) => {
    if (searchField == "item-id") {
      searchByItemId(searchTerm, page);
    } else if (searchField === "item-name") {
      searchByItemName(searchTerm, page);
    } else if (searchField === "buyer-email") {
      searchByBuyerEmail(searchTerm, page);
    } else {
      fetchCryptoOrders();
    }
  };



  return (
    <>
      <div className="container ">
        <span style={{ fontWeight: "bolder" }} className="PAID-BY-CRYPTO">
          PAID BY CRYPTO
        </span>
        <div className="d-flex flex-row-reverse">
          <div className="home__search-ctn d-flex align-items-center">
            <input
              className="search"
              type="search"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" onClick={(e) => handleSearch()}>
              Search
            </button>
          </div>
          <div className="dropdown ">
            <DropDown
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <p>Search By</p>{" "}
              <span>
                {" "}
                <DropDownTriangle src={Dropdowntriangle} />
              </span>
            </DropDown>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <div className="dropdown__checkbox-ctn">
                <input
                  type="checkbox"
                  id="item-id"
                  onChange={handleChange}
                  checked={itemIdIsChecked}
                />
                <label htmlFor="item-id" className="ml-2">
                  Item Id
                </label>
              </div>
              <div className="dropdown__checkbox-ctn">
                <input
                  type="checkbox"
                  id="item-name"
                  onChange={handleChange}
                  checked={itemNameIsChecked}
                />
                <label htmlFor="item-name" className="ml-2">
                  Item Name
                </label>
              </div>
              <div className="dropdown__checkbox-ctn">
                <input
                  type="checkbox"
                  id="buyer-email"
                  onChange={handleChange}
                  checked={buyerEmailIsChecked}
                />
                <label htmlFor="buyer-email" className="ml-2">
                  Buyer Email
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 ml-5 mb-5 mr-5">
          <DataTable
            columns={columns}
            data={data}
            noHeader
            highlightOnHover
            pointerOnHover
            paginationPerPage={8}
            pageLength={8}
            paginationComponentOptions={{ noRowsPerPage: true }}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            noDataComponent=""
          />
        </div>
      </div>
    </>
  );
};
export default CryptoOrders;

const DropDown = styled.button`
  height: 30px;
  width: 200px;
  margin-left: 50px;
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
  align-items: center;
  transition: none;
  p {
    color: black;
    margin: 0;
    letter-spacing: 1px;
  }
  span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  &:focus {
    outline: none;
    border: 1.6px solid black;
  }
  @media (max-width: 1200px) {
    width: 150px;
  }
  @media (max-width: 992px) {
    width: 120px;
  }
  @media (max-width: 800px) {
    width: 295px;
  }
`;

const DropDownTriangle = styled.img`
  width: 10px;
`;
