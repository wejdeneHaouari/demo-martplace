import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import Moment from "moment";
import { env } from "../../constants";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import {userID} from "../../constants/apiEndPoints";
// import "./index.css";
function AdminTransHistory() {
  const cookies = new Cookies();
  const history = useHistory();
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const [paymentData, setPaymentData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = cookies.get("userId");
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };
  const userIDObj = {
    userId: userId,
  };
  const customStyles = {
    rows: {
      style: {
        minHeight: "72px", // override the row height
      },
    },
    columns: {
      style: {
        padding: "72px", // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const fetchTransactions = async (page, size = perPage) => {
    setLoading(true);
    // &per_page=${size}&delay=1
    const response = await axios.post(
      env.apiUrl + `api/users/getAllTxs?userId=${userID}&page=${page}`,
      userIDObj,
      headers
    );
    response.data.data.forEach((photo, index) => {
      photo.serial = index + 1;
    });
    setData(response.data.data);
    setTotalRows(response.data.count);
    const arr = [];
    const arrId = [];
    for (let i = 0; i < response.data.data.length; i++) {
      arr.push(JSON.parse(response.data.data[i].paymentData));
      arrId.push(response.data.data[i].id);
      setPaymentData(arr);
    }

    setLoading(false);
  };

  useEffect((page) => {
    // fetchTransactions(page);
  }, []);

  const columns = [
    {
      name: "S No.",
      // selector: "serial",
      sortable: true,
      grow: 0,
      cell: (row, index) => {
        let rowNumber = (currentPage - 1) * 8 + (index + 1);
        return <span>{rowNumber}</span>;
      },
    },

    {
      name: "Amount",
      selector: "amount",
      sortable: true,
      // cell: (d) => <span>{d.genres.join(", ")}</span>,
    },
    {
      name: "Deduct Type",
      selector: "status",
      sortable: true,
    },
    {
      name: "Date",
      selector: "createdDate",
      sortable: true,
      cell: (row) =>
        // console.log(row)
        Moment(row.createdDate).format("ddd. MMM DD, YYYY"),
      // (row.createdDate)
    },
    {
      name: "Action",
      selector: "action",
      sortable: true,
      cell: (row, index) => (
        <div className="mt-2 mb-2">
          {row.status === "Verification" || row.status === "Transfer" ? (
            <a
              target="_blank"
              href={`viewCert?${paymentData[index].id}`}
              className="btn btn-primary btnsText h-auto"
            >
              View Details
            </a>
          ) : (
            <button type="button" className="btn btn-secondary w-100" disabled>
              {row.status}
            </button>
          )}
          {/* ( <a target="_blank" href="certificate.html?id=` ${paymentData.id}`" className="btn btn-outline-secondary w-100">View Details</a>): */}

          {/* <button type="button" className="btn btn-secondary w-100" disabled>' {row.status}</button> */}
        </div>
      ),
    },
    {
      name: "Payment Id",
      sortable: true,
      cell: (row, index) => paymentData[index].id,
    },
    {
      name: "Document Id",
      selector: "documentId",
      sortable: true,
      cell: (row, index) => <div> {row.id}</div>,
    },
  ];
  const handlePageChange = (page) => {
    fetchTransactions(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchTransactions(page, newPerPage);
    setPerPage(newPerPage);
  };

  const tableData = {
    columns,
    data,
  };
  return (
    <>
      <div className="container settingsContainer">
        <Header />
        <div className="mt-5 ml-5 mb-5 mr-5">
          <h4>Transaction History</h4>
          <DataTableExtensions
            {...tableData}
            export={false}
            print={false}
            filterPlaceholder="Search ..."
          >
            <DataTable
              columns={columns}
              data={data}
              noHeader
              pagination
              highlightOnHover
              pointerOnHover
              paginationPerPage={8}
              pageLength={8}
              paginationComponentOptions={{ noRowsPerPage: true }}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              // selectableRows
            />
          </DataTableExtensions>
        </div>
      </div>
    </>
  );
}
export default AdminTransHistory;
