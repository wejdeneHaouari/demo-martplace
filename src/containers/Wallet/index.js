import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import "./index.css";
import { env } from "../../constants";
import Moment from "moment";
import "./index.css";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import AdminHeader from "../../components/AdminHeader";
import { userID } from "../../constants/apiEndPoints";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#87bbfd",
      },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
}) => (
  <div className="FormRow">
    <label htmlFor={id} className="FormRowLabel">
      {label}
    </label>
    <input
      className="FormRowInput"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);

const ErrorMessage = ({ children }) => (
  <div className="ErrorMessage" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payValue, setPayValue] = useState(30);
  const [amount, setAmount] = useState(3000);
  const history = useHistory();
  const [billingDetails, setBillingDetails] = useState({
    email: "",
    phone: "",
    name: "",
  });
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });

    setProcessing(false);

    if (payload.error) {
      setError(payload.error);
    } else {
      const cardElement = elements.getElement("card");

      stripe.createToken(cardElement).then((payload) => {
        const cookies = new Cookies();
        const token = cookies.get("response");
        const authToken = "Bearer " + token;
        const headers = {
          headers: {
            "content-type": "application/json",
            Authorization: authToken,
          },
        };
        const userId = cookies.get("userId");
        //  const userIDObj = {
        //    userId: userId,
        //  };
        const walletdata = {
          stripeToken: payload.token.id,
          amount: amount,
          userId: userId,
        };
        axios
          .post(env.apiUrl + `api/users/payment`, walletdata, headers)
          .then((res) => {
            if (res.data.status === "Success") {
              notify(
                "loginError",
                "Payment Added Successfuly ($" +
                  parseFloat(amount / 100).toFixed(2) +
                  ") "
              );
            } else {
              alert(res.data.err.raw.message);
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 403) {
                cookies.remove("response");
                notify(
                  "loginError",
                  "Token is expired. Please try to login again"
                );
                history.push("/");
                sessionStorage.clear();
              } else {
                notify("loginError", "Something went wrong");
              }
            }
          });
      });
    }
  };

  return (
    <>
      <div className="btn-toolbar">
        <button
          type="button"
          id="btnSubmit"
          className="btn btn-primary "
          onClick={() => {
            setPayValue(30);
            setAmount(3000);
          }}
        >
          Pay 30
        </button>
        <button
          type="button"
          id="btnSubmit"
          className="btn btn-primary "
          onClick={() => {
            setPayValue(40);
            setAmount(4000);
          }}
        >
          Pay 40
        </button>
        <button
          type="button"
          id="btnSubmit"
          className="btn btn-primary "
          onClick={() => {
            setPayValue(50);
            setAmount(5000);
          }}
        >
          pay 50
        </button>
        <button
          type="button"
          id="btnSubmit"
          className="btn btn-primary "
          onClick={() => {
            setPayValue(100);
            setAmount(10000);
          }}
        >
          pay 100
        </button>
      </div>

      <form className="Form" onSubmit={handleSubmit}>
        <fieldset className="FormGroup">
          <Field
            label="Name"
            id="name"
            type="text"
            placeholder="Jane Doe"
            required
            autoComplete="name"
            value={billingDetails.name}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, name: e.target.value });
            }}
          />
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="janedoe@gmail.com"
            required
            autoComplete="email"
            value={billingDetails.email}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, email: e.target.value });
            }}
          />
          <Field
            label="Phone"
            id="phone"
            type="tel"
            placeholder="(941) 555-0123"
            required
            autoComplete="tel"
            value={billingDetails.phone}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, phone: e.target.value });
            }}
          />
        </fieldset>
        <fieldset className="FormGroup">
          <CardField
            className="cardClass"
            onChange={(e) => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </fieldset>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}

        <SubmitButton
          processing={processing}
          error={error}
          disabled={!stripe}
          className="btn btn-primary"
          id="btnSubmit"
        >
          Pay {payValue}
        </SubmitButton>
        {/* </div> */}
      </form>
    </>
  );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(env.stripeKey);

function Wallet() {
  const cookies = new Cookies();
  const history = useHistory();
  const [paymentData, setPaymentData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [balance, setBalance] = useState("");
  const token = cookies.get("response");
  const authToken = "Bearer " + token;
  const [coinBalance, setCoinBalance] = useState("");
  const headers = {
    headers: {
      "content-type": "application/json",
      Authorization: authToken,
    },
  };
  const userId = cookies.get("userId");
  const userIDObj = {
    userId: userId,
  };
  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };
  const fetchTransactions = async (page, size = perPage) => {
    setLoading(true);
    // &per_page=${size}&delay=1
    const response = await axios.post(
      env.apiUrl + `api/users/getTxs?username=${env.username}&page=${page}`,
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
    fetchTransactions(page);

    axios
      .get(
        env.apiUrl + `api/users/getUserById?userId=${userID}`,
        headers
      )
      .then((res) => {
        setBalance(res.data.data.amount);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            cookies.remove("response");
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            sessionStorage.clear();
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });

    axios
      .get(
        env.apiUrl + `api/users/getBalance?username=${env.username}`,
        headers
      )
      .then((res) => {
        setCoinBalance(res.data.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            cookies.remove("response");
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            sessionStorage.clear();
          } else {
            notify("loginError", "Something went wrong");
          }
        }
      });
  }, []);

  const columns = [
    {
      name: "S No.",
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
    },
    {
      name: "Payment Id",
      sortable: true,
      cell: (row, index) => paymentData[index].id,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row, index) => row.status,
    },
    {
      name: "Date",
      selector: "createdDate",
      sortable: true,
      cell: (row) => Moment(row.createdDate).format("ddd. MMM DD, YYYY"),
    },
    {
      name: "Action",
      selector: "action",
      sortable: true,
      cell: (row, index) => {
        if (
          row.status === "Credit" &&
          row.canRefund === true &&
          row.orgamount > 0
        ) {
          return (
            <div className="mt-2 mb-2">
              <button
                type="button"
                className="btn btn-sm btn-secondary refundRequest btnsText h-auto"
                data-id={row.id}
              >
                {" "}
                Refund Request
              </button>{" "}
              <button
                type="button"
                className="btn btn-sm btn-secondary pRefundRequest btnsText h-auto w-100"
                data-id={row.id}
              >
                Partial Refund Request
              </button>
            </div>
          );
        } else {
          return (
            <div className="mt-2 mb-2">
              <button
                type="button"
                className="btn btn-primary w-100 btnsText h-auto"
                disabled
              >
                {row.status}{" "}
              </button>
            </div>
          );
        }
      },
    },
    {
      name: "Document Id",
      selector: "documentId",
      sortable: true,
      cell: (row, index) => {
        var paymentData = JSON.parse(row.paymentData);
        if (row.status === "Verification" || row.status === "Transfer") {
          return (
            <a target="_blank" href={`viewCert?${paymentData.id}`}>
              {row.id}
            </a>
          );
        } else {
          return <div style="color:black;"> {row.id}</div>;
        }
      },
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

  const sendCoin = () => {
    const sendCoinData = {
      userId: userId,
      numofCertificate: 1,
    };
    axios
      .post(env.apiUrl + `api/users/sendCoin`, sendCoinData, headers)
      .then((res) => {
        notify("loginError", res.data.data.msg);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            cookies.remove("response");
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/");
            sessionStorage.clear();
          } else {
            notify("loginError", error.response.data.msg);
          }
        }
      });
  };
  const tableData = {
    columns,
    data,
  };
  return (
    <>
      <div className="container dashboardContainer wallet">
        <AdminHeader />
        <div className="text-right mr-2 mt-2">Wallet Balance: {balance}</div>
        <div className="AppWrapper card">
          <div className="card-body">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
        <div className="AppWrapper card">
          <div className="card-body">
            <div className="text-center mr-2 mt-2 mb-2">
              Matic Balance: {coinBalance}
            </div>
            <button className="btn btn-primary" onClick={sendCoin}>
              Add Money to Matic account
            </button>
          </div>
        </div>
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
    </>
  );
}

export default Wallet;
