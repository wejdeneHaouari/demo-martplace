import Cookies from "universal-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../constants";
import { headers, userID, userIDObj } from "../../constants/apiEndPoints";
import Moment from "moment";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from "react-data-table-component";
import "./index.css";
import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import styled from "styled-components";
import Dropdowntriangle from "../../assets/images/storeFront/dropdownTriangle.svg";
import { toast } from "react-toastify";
const CreditOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemIdIsChecked, setItemIdIsChecked] = useState(false);
  const [itemNameIsChecked, setItemNameIsChecked] = useState(false);
  const [buyerEmailIsChecked, setBuyerEmailIsChecked] = useState(false);
  const notify = (type, text) => {
    if (type === "searchError") {
      toast(text);
    }
  };
  const fetchCreditOrders = async (currentPage) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/getSaleHistoryDetails?userId=${userID}&page=${currentPage}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };

  const searchByItemName = async (key, page) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/searchSaleHistoryByImageName?userId=${userID}&key=${key}&page=${page}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };
  const searchByItemId = async (key, page) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/searchSaleHistoryByItemId?userId=${userID}&key=${key}&page=${page}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
  };
  const searchByBuyerEmail = async (key, page) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/searchSaleHistoryByBuyerEmail?userId=${userID}&key=${key}&page=${page}`,
      headers
    );
    setTotalRows(response.data.totalCert);
    setData(response.data.data);
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
      fetchCreditOrders(currentPage);
    }
  }

  useEffect(() => {
    fetchCreditOrders();
  }, []);

  const columns = [
    {
      name: "ITEM NAME",
      selector: "itemName",
      sortable: true,
    },
    {
      name: "ID",
      cell: (row, index) => (
        <a href={"/balloon/collection/viewCert?id=" + row.soldDocumentId}>
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
      name: "PRICE",
      sortable: true,
      cell: (row, index) => <div> $ {row.price / 100}</div>,
    },
    {
      name: "DATE & TIME",
      selector: "date",
      sortable: true,
      cell: (row) => Moment(row.date).format("ddd. MMM DD, YYYY,  h:mm a"),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (searchField === "") {
      fetchCreditOrders(page);
    } else {
      handleSearch(page);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchCreditOrders(page, newPerPage);
    setPerPage(newPerPage);
  };

  const tableData = {
    columns,
    data,
  };

  const handleSearch = (page) => {
    if (searchField == "item-id") {
      searchByItemId(searchTerm, page);
    } else if (searchField === "item-name") {
      searchByItemName(searchTerm, page);
    } else if (searchField === "buyer-email") {
      searchByBuyerEmail(searchTerm, page);
    } else {
      fetchCreditOrders();
    }
  };

  return (
    <>
      <div className="container ">
        <span className="PAID-BY-USD">PAID BY USD</span>

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
            // selectableRows
          />
        </div>
      </div>
    </>
  );
};
export default CreditOrders;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: 65%;
  justify-content: space-between;
  max-width: 850px;

  @media (max-width: 800px) {
    flex-wrap: wrap;
    row-gap: 5px;
    order: 2;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 45px 40px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

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
