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
// import "./index.css";
function AdminDashboard() {
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
  console.log(token);
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

  const fetchOrganizations = async (currentPage, size = perPage) => {
    setLoading(true);
    // &per_page=${size}&delay=1
    const token = cookies.get("response");
    console.log(token);
    //    const authToken = "Bearer " + token;
    //    const headers = {
    //        headers: {
    //            "content-type": "application/json",
    //            'Authorization': 'Bearer ' + token
    //        }
    //    };
    //    console.log(headers)
    const response = await axios.get(
      //  https://app.chaincerts.org:3030/api/users/getOwners?userId=60f60f212a050807cbf06aaa
      env.apiUrl +
        `api/users/getOwners?username=${env.username}&page=${currentPage}`,

      {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    response.data.data.forEach((photo, index) => {
      photo.serial = index + 1;
    });
    console.log(response.data.data);
    setData(response.data.data);
    setTotalRows(response.data.count);
    const arr = [];
    const arrId = [];
    //    for (let i = 0; i < response.data.data.length; i++) {
    //      arr.push(JSON.parse(response.data.data[i].paymentData));
    //        arrId.push(response.data.data[i].id);
    //      setPaymentData(arr);
    //    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const activate = async (id) => {
    const activeData = {
      userId: id,
      userStatus: "active",
    };
    const response = await axios.post(
      //  https://app.chaincerts.org:3030/api/users/getOwners?userId=60f60f212a050807cbf06aaa
      env.apiUrl + `api/admin/changeUserStatus?username=${env.username}`,
      activeData,
      {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.data.status === true) {
      notify("loginError", "User Activated Successfully");
      fetchOrganizations();
    } else {
      notify("loginError", "Something went wrong");
    }
  };
  const deactivate = async (id) => {
    const activeData = {
      userId: id,
      userStatus: "inactive",
    };
    const response = await axios.post(
      //  https://app.chaincerts.org:3030/api/users/getOwners?userId=60f60f212a050807cbf06aaa
      env.apiUrl + `api/admin/changeUserStatus?username=${env.username}`,
      activeData,
      {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.data.status === true) {
      notify("loginError", "User Deactivated Successfully");
      fetchOrganizations();
    } else {
      notify("loginError", "Something went wrong");
    }
  };
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
      name: "Id",
      selector: "id",
      sortable: true,
      // cell: (d) => <span>{d.genres.join(", ")}</span>,
    },
    {
      name: "First Name",
      selector: "firstName",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: "lastName",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Organization",
      selector: "organizationName",
      sortable: true,
    },
    {
      name: "Status",
      selector: "userStatus",
      sortable: true,
    },
    {
      name: "Action",
      selector: "action",
      sortable: true,
      cell: (row, index) => (
        //   console.log(row)
        <div className="mt-2 mb-2">
          {row.userStatus === "active" ? (
            <div
              onClick={(id) => deactivate(row.id)}
              className="btn btn-primary btnsText h-auto w-100"
            >
              Inactivate
            </div>
          ) : (
            <div
              onClick={(id) => activate(row.id)}
              //   href={`viewCert?${paymentData[index].id}`}
              className="btn btn-primary btnsText h-auto w-100"
            >
              Activate
            </div>
            // <button type="button" className="btn btn-secondary w-100" disabled>
            //   {row.status}
            // </button>
          )}
        </div>
      ),
    },
  ];
  const handlePageChange = (page) => {
    fetchOrganizations(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchOrganizations(page, newPerPage);
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
          <h4>All Organizations</h4>
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
export default AdminDashboard;
