import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { env } from "../../constants";
import { headers, userID, userIDObj } from "../../constants/apiEndPoints";
import Moment from "moment";
import Header from "../Header";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from "react-data-table-component";

const WalletTransaction = () => {
  const cookies = new Cookies();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentData, setPaymentData] = useState([]);

  const fetchWalletTX = async (currentPage) => {
    setLoading(true);
    const response = await axios.post(
      env.apiUrl +
        `api/users/getWalletTxs?userId=${userID}&page=${currentPage}`,
      userIDObj,
      headers
    );
    setTotalRows(response.data.count);
    const arr = [];
    const arrId = [];
    for (let i = 0; i < response.data.data.length; i++) {
      arr.push(JSON.parse(response.data.data[i].paymentData));
      arrId.push(response.data.data[i].id);
      setPaymentData(arr);
    }

    setData(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWalletTX();
  }, []);

  const columns = [
    {
      name: "$No.",
      selector: "title",
      cell: (row, index) => {
        let rowNumber = (currentPage - 1) * 8 + (index + 1);
        return <span>{rowNumber}</span>;
      },
    },
    {
      name: "Amount",
      selector: "amount",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
    },
    {
      name: "Date",
      selector: "createdDate",
      sortable: true,
      cell: (row) =>
        // console.log(row)
        Moment(row.createdDate).format("ddd. MMM DD, YYYY,  h:mm a"),
    },
    {
      name: "Payment Id",
      selector: "paymentId",
      cell: (row, index) => (
        <div>
          {" "}
          {paymentData[index]?.id.substring(1, 7) +
            "..." +
            paymentData[index]?.id.substring(
              paymentData[index]?.id.length - 5,
              paymentData[index]?.id.length
            )}
        </div>
      ),
    },
    {
      name: "Document Id",
      sortable: true,
      cell: (row, index) => <div> {row.id}</div>,
    },
  ];

  const handlePageChange = (page) => {
    fetchWalletTX(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchWalletTX(page, newPerPage);
    setPerPage(newPerPage);
  };

  const tableData = {
    columns,
    data,
  };

  return (
    <>
      <div className="container ">
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
            // selectableRows
          />
        </div>
      </div>
    </>
  );
};

export default WalletTransaction;
