import Cookies from "universal-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../constants";
import { headers, userID, userIDObj } from "../../constants/apiEndPoints";
import Moment from "moment";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from "react-data-table-component";
// import "./index.css";
import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import styled from "styled-components";
import Dropdowntriangle from "../../assets/images/storeFront/dropdownTriangle.svg";
import { toast } from "react-toastify";
const SignupData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
      const [newPerPage, setPerPage] = useState(1);
      const [toDate, setToDate] = useState("");

      const [toDateDisplay, setToDateDisplay] = useState(
        ""
      );
     const [fromDate, setFromDate] = useState("");

     const [fromDateDisplay, setFromDateDisplay] = useState("");
  const notify = (type, text) => {
    if (type === "searchError") {
      toast(text);
    }
  };
  const fetchDiscountData = async (currentPage) => {
    const response = await axios.get(
      env.apiUrl +
        `api/users/listDiscountCode`,
      headers
    );
    setTotalRows(response.data.count);
    if (response.data && response.data.data.length>0) {
      setData(response.data.data);
    } else {
      setData([
        {
          userId: "",
          firstName: "",
          discountCode: "",
          discountPercentage: "",
          expiryDate: "",
          usageCounter:""
        },
      ]);
    }
  };

  useEffect(() => {
    fetchDiscountData();
  }, []);

  const columns = [
    {
      name: "UserID",
      selector: "id",
      sortable: true,
    },

    {
      name: "First Name",
      selector: "firstName",
      sortable: true,
    },
    {
      name: "Discount Code",
      selector: "discountCode",
      sortable: true,
    },
    {
      name: "Discount Percentage",
      selector: "discountPercentage",
      sortable: true,
    },
    {
      name: "Expiry Date",
      selector: "expiryDate",
      sortable: true,
    },
    {
      name: "Usage Counter",
      selector: "usageCounter",
      sortable: true,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDiscountData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchDiscountData(page, newPerPage);
    setPerPage(newPerPage);
  };
    const serachSignUp = () => {
     setCurrentPage(1);
     fetchDiscountData(1);
}
  const tableData = {
    columns,
    data,
  };

  return (
    <>
      <div className="container ">
        <div className="mt-5 ml-5 mb-5 mr-5">
          <h4 className=" black">Discount List{totalRows}</h4>
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
export default SignupData;

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
