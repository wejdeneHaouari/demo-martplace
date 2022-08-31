import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./index.css";
import axios from "axios";
import { env } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Common/Footer/Footer";
import checkmarkIcon from "../../assets/images/storeFront/checkmark-copy.svg";
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from "react-confirm-alert";
import UserProgressBar from "../../components/Progressbar";
import {
  adler32,
  md4,
  md5,
  crc32,
  crc32c,
  blake2b,
  blake2s,
  blake3,
  sha1,
  sha224,
  sha256,
  sha384,
  sha512,
  sha3,
  keccak,
  ripemd160,
  xxhash32,
  xxhash64,
  xxhash3,
  xxhash128,
  createHMAC,
  createSHA256,
  pbkdf2,
  sm3,
  whirlpool,
  argon2id,
  bcrypt,
} from "hash-wasm";

import Modal from "../../components/Modal";
import useToggle from "../../components/Modal/useToggle";
const sha256Algo = createSHA256();
var a;

function CreateCert() {
  const cookies = new Cookies();
  const history = useHistory();
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [thumbnail, setThumbnail] = useState({ preview: "", raw: "" });
  const [selectedOption, setSelectedOption] = useState("Cm");
  const [input] = React.useState("Example text");
  const [hash, setHash] = React.useState("");
  const [open, setOpen] = useToggle(false);
  const [openLevel, setOpenLevel] = useToggle(false);

  const [inputList, setInputList] = useState([{ value: "", trait_type: "" }]);
  const [levelsList, setLevelsList] = useState([
    { trait_type: "", value: "", max_value: "", display_type: "boost_number" },
  ]);


  const [buttonName, setButtonName] = useState("Play");

  const [audio, setAudio] = useState();

  useEffect(() => {
    if (a) {
      a.pause();
      a = null;
      setButtonName("Play");
    }
    if (audio) {
      a = new Audio(audio);
      a.onended = () => {
        setButtonName("Play");
      };
    }
  }, [audio]);




  const computeHMAC = async () => {
    const hasher = await createHMAC(sha256Algo, "apple");
    hasher.update(input);
    return hasher.digest();
  };
  const userID = cookies.get("userId");

  const computeHash = async () => {
    const ret = {};
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);

    await Promise.all([
      (async () => (ret.adler32 = await adler32(input)))(),
      (async () => (ret.md4 = await md4(input)))(),
      (async () => (ret.md5 = await md5(input)))(),
      (async () => (ret.crc32 = await crc32(input)))(),
      (async () => (ret.crc32c = await crc32c(input)))(),
      (async () => (ret.blake2b = await blake2b(input, 256)))(),
      (async () => (ret.blake2s = await blake2s(input, 128)))(),
      (async () => (ret.blake3 = await blake3(input)))(),
      (async () => (ret.sha1 = await sha1(input)))(),
      (async () => (ret.sha224 = await sha224(input)))(),
      (async () => (ret.sha256 = await sha256(input)))(),
      (async () => (ret.sha384 = await sha384(input)))(),
      (async () => (ret.sha512 = await sha512(input)))(),
      (async () => (ret.sha3 = await sha3(input)))(),
      (async () => (ret.keccak = await keccak(input)))(),
      (async () => (ret.ripemd160 = await ripemd160(input)))(),
      (async () => (ret.xxhash32 = await xxhash32(input)))(),
      (async () => (ret.xxhash64 = await xxhash64(input)))(),
      (async () => (ret.xxhash3 = await xxhash3(input)))(),
      (async () => (ret.xxhash128 = await xxhash128(input)))(),
      (async () => (ret.sm3 = await sm3(input)))(),
      (async () => (ret.whirlpool = await whirlpool(input)))(),
      (async () => (ret.hmac = await computeHMAC()))(),
      (async () =>
        (ret.pbkdf2 = await pbkdf2({
          password: input,
          salt: "salt",
          iterations: 16,
          hashLength: 32,
          hashFunction: createSHA256(),
        })))(),
      (async () =>
        input
          ? (ret.argon2id = await argon2id({
              password: input,
              salt,
              parallelism: 1,
              memorySize: 128,
              iterations: 4,
              hashLength: 16,
              outputType: "encoded",
            }))
          : "")(),
      (async () =>
        input && input.length < 72
          ? (ret.bcrypt = await bcrypt({
              password: input,
              salt,
              costFactor: 8,
              outputType: "encoded",
            }))
          : "")(),
    ]);

    setHash(ret);
  };

  React.useEffect(() => {
    computeHash();
  }, [input]);

  const notify = (type, text) => {
    if (type === "loginError") {
      toast(text);
    }
  };

  const handleFileChange = (e) => {
    // console.log(e.target.files[0], URL.createObjectURL(e.target.files[0]));
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
      console.log(e.target.files[0], URL.createObjectURL(e.target.files[0]));
      //
      setAudio(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleThumbnail = (e) => {
    if (e.target.files.length) {
      setThumbnail({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { value: "", trait_type: "" }]);
  };

  // handle input change
  const handleLevelInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...levelsList];
    list[index][name] = value;
    setLevelsList(list);
  };

  // handle click event of the Remove button
  const handleLevelRemoveClick = (index) => {
    const list = [...levelsList];
    list.splice(index, 1);
    setLevelsList(list);
  };

  // handle click event of the Add button
  const handleLevelAddClick = () => {
    setLevelsList([
      ...levelsList,
      {
        trait_type: "",
        value: "",
        max_value: "",
        display_type: "boost_number",
      },
    ]);
  };
  const validationSchema = Yup.object().shape({
    subject: Yup.string()
      .required("Title is required")
      .min(2, "Title must be at least 2 characters")
      .max(40, "Title must not exceed 40 characters"),
    category: Yup.string()
      .required("Description is required")
      .min(2, "Description must be at least 2 characters"),
    type: Yup.string().required("This field is required.").nullable(),
    productionYear: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .required("Production Date is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .test(
        "Is positive?",
        "ERROR: The number must be greater than 0!",
        (value) => value > 0
      )
      .typeError("Quantity must be a number"),
    dateofIssue: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .required("Start Date is required"),
    place: Yup.string()
      .required("Origin Location is required")
      .min(2, "Origin Location must be at least 2 characters")
      .max(40, "Origin Location must not exceed 40 characters"),

  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const resetInputField = () => {
    reset();
    setImage({
      preview: "",
      raw: "",
    });
    setAudio("");
  };
  const resetImage = (e) => {
    setImage({
      preview: "",
      raw: "",
    });
  };

  const cancelModal = () => {

    setOpen(false);
  };
  const continueModal = () => {
    setOpen(false);
  };

  const cancelLevelModal = () => {

    setOpenLevel(false);
  };
  const continueLevelModal = () => {
    setOpenLevel(false);
  };
  const properties = inputList.concat(levelsList);
  const formSubmit = (data) => {
    const formData = new FormData();
    formData.append("file", image.raw);
    formData.append("thumbnail", thumbnail.raw);
    console.log(image, audio, thumbnail);
    const fileHash = hash.sha256;
    var queryTosend2 =
      "category=" +
      data.category +
      "&type=" +
      data.type +
      "&subject=" +
      data.subject +
      "&quantity=" +
      data.quantity +
      "&attributes=" +
      JSON.stringify(properties) +
      "&productionYear=" +
      data.productionYear;
    queryTosend2 +=
      "&height=" +
      data.height +
      "&width=" +
      data.width +
      "&depth=" +
      data.depth +
      "&unit=" +
      selectedOption +
      "&validUntil=" +
      data.validUntil;
    queryTosend2 +=
      "&place=" +
      data.place +
      "&location=" +
      data.location +
      "&stockDetails=" +
      data.stockDetails +
      "&dateofIssue=" +
      data.dateofIssue;
    const token = cookies.get("response");
    const authToken = "Bearer " + token;
    const headers = {
      headers: {
        "content-type": "application/json",
        Authorization: authToken,
      },
    };
    axios
      .post(
        env.apiUrl +
          `api/users/uploadFile?userId=${userID}&imageHash=${fileHash}&${queryTosend2}`,
        formData,
        headers
      )
      .then((res) => {
        if (res.data.msg === "Same Certificate uploaded on IPFS") {
          reset();
          setImage({
            preview: "",
            raw: "",
          });
          certificateCreated(res.data.data.id);
        } else {
          certificateCreated(res.data.data.id);
          reset();
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            notify("loginError", "Token is expired. Please try to login again");
            history.push("/userLogin");
            cookies.remove("response");
            sessionStorage.clear();
          } else {
            notify("loginError", error.response.data.msg);
          }
        } else if (error.request) {
          // The request was made but no response was received
          notify("loginError", error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          notify("loginError", error.message);
        }
      });
  };

  const certificateCreated = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="cf__card cf__card--create">
            <div className="d-flex align-items-center justify-content-between cf__card-topbar">
              <h1>Success</h1>
              <button onClick={onClose}>X</button>
            </div>
            <div className="cf__card--top">
              <div className="cf__text-container">
                <div className="">
                  <div className="d-flex align-items-center justify-content-center">
                    <img
                      src={checkmarkIcon}
                      alt="nft verified"
                      style={{ width: "30px", marginRight: "2px" }}
                    />
                    <h3 className="cf__card-title ml-2">Certificate Created</h3>
                  </div>

                  <h6 className="cf__card__desc">
                    Your certificate is created and added to your collection,
                    <br></br>
                    You should be able to see it in a moment.
                  </h6>
                </div>
              </div>
            </div>
            <div className="cf__btn-ctn">
              <a href={`./viewCert?id=${id}`}>
                <button className="btn btn-primary mb-3">
                  Go to NFT Certificate
                </button>
              </a>

              <button className="btn btn-primary btn--sbd" onClick={onClose}>
                Add More NFT Certificate
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <>
      <Header />
      <div className="container createContainer dashboardContainer">
        <form onSubmit={handleSubmit(formSubmit)}>
          <nav className="navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-light secondHeader fixed">
            <div className="container-fluid">
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo01"
              >
                <div className="container-fluid">
                  <div
                    className="collapse navbar-collapse"
                    id="navbarTogglerDemo01"
                  >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                        <span className="CREATE-CERTIFICATE">
                          CREATE CERTIFICATE
                        </span>
                      </li>
                    </ul>

                    <div className="d-flex ml-auto mr-4">
                      <button
                        className="btn  clearBtn bg-white btnsText"
                        type="button"
                        //   onClick={}
                        onClick={resetInputField}
                      >
                        Clear
                      </button>

                      <button
                        className="btn btn-primary clearBtn btnsText"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="">
            <div className="">
              <div className="createCertContainer">
                <div className="row">
                  <div className="col-md-6">
                    {/* <div className="imageContainer"> */}
                    <span className="labelTxt control-label labelClass mb-2">
                      File <span className="mandatory">*</span>
                    </span>
                    <div className="traitsDesc">
                      File type supported: JPEG and PNG
                      size: 100MB
                    </div>
                    <div className="previewContainer">
                      <div className="innerDiv">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className={`  choseFile  `}
                        />

                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="thumbnailContainer">
                      <span className="labelTxt control-label labelClass mb-2">
                        Upload thumbnail{" "}
                      </span>
                      <div className="traitsDesc">
                        Drag and drop files to upload
                      </div>
                      <div className="previewContainer">
                        <div className="innerDiv">
                          <input
                            type="file"
                            className="thumbnailClass"
                            onChange={handleThumbnail}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="leftContainer">
                    <div className="form-group mb-4 w-75">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Title <span className="mandatory">*</span>
                      </label>
                      <input
                        name="subject"
                        type="text"
                        placeholder="Title of your art work"
                        {...register("subject")}
                        className={`form-control ${
                          errors.subject ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.subject?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4 w-75">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Description <span className="mandatory">*</span>
                      </label>
                      <input
                        name="category"
                        type="text"
                        placeholder="Short description of your art work"
                        {...register("category")}
                        className={`form-control ${
                          errors.category ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.category?.message}
                      </div>
                    </div>{" "}
                    <div className="form-group mb-4">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ textAlign: "left", width: "100%" }}
                      >
                        Type <span className="mandatory">*</span>
                      </label>
                      <select
                        name="type"
                        id="trait_type"
                        {...register("type")}
                        className={`form-control ${
                          errors.type ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" disabled defaultValue={true}>
                          Select type of your art work
                        </option>
                        <option value="Digital art">Digital art</option>
                        <option value="Digital art with experience">
                          Digital art with experience
                        </option>
                        <option value="Digital art with merchandise">
                          Digital art with merchandise
                        </option>
                      </select>
                      <div className="invalid-feedback">
                        {errors.type?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4" id="quantity">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Qty <span className="mandatory">*</span>
                      </label>
                      <input
                        name="quantity"
                        type="number"
                        placeholder="Enter Quantity"
                        {...register("quantity")}
                        className={`form-control ${
                          errors.quantity ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.quantity?.message}
                      </div>
                    </div>{" "}
                    <div className="form-group mb-4" id="quantity">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Production Year <span className="mandatory">*</span>
                      </label>
                      <input
                        type="date"
                        data-date=""
                        data-date-format="YYYY"
                        // value="2015-08-09"
                        className={`form-control ${
                          errors.productionYear ? "is-invalid" : ""
                        }`}
                        name="productionYear"
                        {...register("productionYear")}
                      />
                      <div className="invalid-feedback">
                        {errors.productionYear?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4" id="quantity">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Date of Issue <span className="mandatory">*</span>
                      </label>
                      <input
                        type="date"
                        data-date=""
                        data-date-format="DD MMMM YYYY"
                        className={`form-control ${
                          errors.dateofIssue ? "is-invalid" : ""
                        }`}
                        name="dateofIssue"
                        {...register("dateofIssue")}
                      />
                      <div className="invalid-feedback">
                        {errors.dateofIssue?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4" id="location">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Origin Location <span className="mandatory">*</span>
                      </label>
                      <input
                        name="place"
                        type="text"
                        placeholder="Origin Location of the item"
                        {...register("place")}
                        className={`form-control ${
                          errors.place ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.place?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4" id="quantity">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Valid Until
                      </label>
                      <input
                        type="date"
                        data-date=""
                        data-date-format="DD MMMM YYYY"
                        className={`form-control ${
                          errors.validUntil ? "is-invalid" : ""
                        }`}
                        name="validUntil"
                        {...register("validUntil")}
                      />
                      <div className="invalid-feedback">
                        {errors.validUntil?.message}
                      </div>
                    </div>
                    <div className="form-group mb-4 w-75">
                      <label
                        htmlFor="name"
                        className="control-label labelClass"
                        style={{ float: "left" }}
                      >
                        Stock Details
                      </label>
                      <input
                        name="stockDetails"
                        type="text"
                        placeholder="Stock Details of item"
                        {...register("stockDetails")}
                        className={`form-control`}
                      />

                      <div className="invalid-feedback">
                        {errors.stockDetails?.message}
                      </div>
                    </div>
                    <div className="row">
                      <label
                        htmlFor="name"
                        className="control-label labelClass ml-3"
                        style={{
                          float: "left",
                          display: "flex",
                        }}
                      >
                        Dimensions
                      </label>
                    </div>
                    <div id="dimensions">
                      <div>
                        <input
                          name="height"
                          type="number"
                          placeholder="Height"
                          {...register("height")}
                          className={`form-control`}
                        />
                      </div>
                      <div>
                        <input
                          name="width"
                          type="number"
                          placeholder="Width"
                          {...register("width")}
                          className={`form-control`}
                        />
                      </div>
                      <div>
                        <input
                          name="depth"
                          type="number"
                          placeholder="Depth"
                          {...register("depth")}
                          className={`form-control`}
                        />
                      </div>
                      <div>
                        {" "}
                        <div
                          className="btn-group btn-group-toggle"
                          data-toggle="buttons"
                          name="unit"
                        >
                          <label className="btn btn-secondary active">
                            <input
                              type="radio"
                              name="options"
                              id="option1"
                              onChange={() => setSelectedOption("Cm")}
                              defaultChecked
                            />{" "}
                            CM
                          </label>
                          <label className="btn btn-secondary inactive">
                            <input
                              type="radio"
                              name="options"
                              id="option2"
                              onChange={() => setSelectedOption("In")}
                            />{" "}
                            In
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="Line-4"></div>
                    <div className="form-group mb-4">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="property">TRAITS</div>
                          <div className="traitsDesc">
                            Textual traits that show up as rectangles underneath
                            your item.
                          </div>
                        </div>
                        <div className="col-md-2">
                          <i className="fa-duotone fa-square-plus"></i>
                          <i
                            className="fa fa-plus-square fa-2x mt-0 blueColorIcon"
                            onClick={() => setOpen()}
                          ></i>

                          {open && (
                            <Modal open={open} toggle={setOpen}>
                              <div className="headerModal">
                                <h1 className="blueColorIcon">Add Trait</h1>
                              </div>
                              <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group mb-4">
                                  <div className="row mb-4">
                                    {inputList.map((x, i) => {
                                      return (
                                        <div className="box">
                                          <label
                                            htmlFor="type"
                                            className="control-label labelClass"
                                            style={{ float: "left" }}
                                          >
                                            Type
                                          </label>
                                          <input
                                            type="text"
                                            name="trait_type"
                                            placeholder="Type"
                                            value={x.trait_type}
                                            onChange={(e) =>
                                              handleInputChange(e, i)
                                            }
                                            className={`form-control`}
                                          />
                                          <label
                                            htmlFor="lastName"
                                            className="control-label labelClass"
                                            style={{ float: "left" }}
                                          >
                                            Name
                                          </label>
                                          <input
                                            name="value"
                                            placeholder="Name"
                                            value={x.value}
                                            className={`form-control mb-4`}
                                            onChange={(e) =>
                                              handleInputChange(e, i)
                                            }
                                          />

                                          <div className="btn-box">
                                            {inputList.length !== 1 && (
                                              <i
                                                onClick={() =>
                                                  handleRemoveClick(i)
                                                }
                                                className="fa fa-trash"
                                                type="button"
                                              >
                                                Remove
                                              </i>
                                            )}
                                            {inputList.length - 1 === i && (
                                              <i
                                                onClick={handleAddClick}
                                                className="fa fa-plus"
                                                type="button"
                                              >
                                                Add
                                              </i>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="row mb-4">
                                    <div className="col-md-12">
                                      <button
                                        className="btn btn-primary w-100"
                                        type="button"
                                        onClick={() => {
                                          continueModal();
                                        }}

                                      >
                                        Continue{" "}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <button
                                        className="btn btn-secondary w-100"
                                        type="button"
                                        onClick={() => {
                                          cancelModal();
                                        }}
                                      >
                                        Cancel{" "}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </Modal>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="Line-4"></div>
                    <div className="form-group mb-4">
                      <div className="row traitsContent">
                        <div className="traitsContent">
                          {inputList.map(
                            (obj, index) =>
                              obj &&
                              obj.value.length > 0 &&
                              obj &&
                              obj.trait_type.length > 0 && (
                                <>
                                  <div className="Rectangle">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div>Type: {obj.trait_type}</div>
                                        <br />
                                        <div>Name: {obj.value}</div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="property">LEVELS</div>
                          <div className="traitsDesc">
                            Numerical traits that show as a progress bar
                          </div>
                        </div>
                        <div className="col-md-2">
                          <i
                            className="fa fa-plus-square fa-2x mt-0 blueColorIcon"
                            type="button"
                            onClick={() => setOpenLevel()}
                          ></i>

                          {openLevel && (
                            <Modal open={openLevel} toggle={setOpenLevel}>
                              <h1 className="blueColorIcon">Add Levels</h1>

                              <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group mb-4">
                                  <div className="row mb-4">
                                    {levelsList.map((x, i) => {
                                      return (
                                        <div className="box">
                                          <label
                                            htmlFor="type"
                                            className="control-label labelClass"
                                            style={{ float: "left" }}
                                          >
                                            Name
                                          </label>
                                          <input
                                            name="trait_type"
                                            placeholder="Name"
                                            value={x.trait_type}
                                            className={`form-control mb-4`}
                                            onChange={(e) =>
                                              handleLevelInputChange(e, i)
                                            }
                                          />
                                          <label
                                            className="control-label labelClass w-100"
                                            style={{ float: "left" }}
                                          >
                                            Value
                                          </label>
                                          <div className=" row">
                                            <div className="col-md-5">
                                              <input
                                                type="text"
                                                name="value"
                                                placeholder="Minimum Value"
                                                value={x.value}
                                                onChange={(e) =>
                                                  handleLevelInputChange(e, i)
                                                }
                                                className={`form-control row`}
                                              />
                                            </div>
                                            <div className="mt-2">Of</div>
                                            <div className="col-md-6">
                                              <input
                                                type="text"
                                                name="max_value"
                                                placeholder="Maximum Value"
                                                value={x.max_value}
                                                onChange={(e) =>
                                                  handleLevelInputChange(e, i)
                                                }
                                                className={`form-control`}
                                              />
                                            </div>
                                          </div>
                                          <div className="btn-box">
                                            {levelsList.length !== 1 && (
                                              <i
                                                onClick={() =>
                                                  handleLevelRemoveClick(i)
                                                }
                                                className="fa fa-trash"
                                                type="button"
                                              >
                                                Remove
                                              </i>
                                            )}
                                            {levelsList.length - 1 === i && (
                                              <i
                                                onClick={handleLevelAddClick}
                                                className="fa fa-plus"
                                                type="button"
                                              >
                                                Add
                                              </i>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="row mb-4">
                                    <div className="col-md-12">
                                      <button
                                        className="btn btn-primary w-100"
                                        type="button"
                                        onClick={() => {
                                          continueLevelModal();
                                        }}

                                      >
                                        Continue{" "}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <button
                                        className="btn btn-secondary w-100"
                                        type="button"
                                        onClick={() => {
                                          cancelLevelModal();
                                        }}
                                      >
                                        Cancel{" "}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </Modal>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <div className="row traitsContent">
                        <div className="traitsContent">
                          {levelsList.map(
                            (obj, index) =>
                              obj &&
                              obj.value.length > 0 &&
                              obj &&
                              obj.max_value.length > 0 &&
                              obj &&
                              obj.trait_type.length > 0 && (
                                <>
                                  <div className="Rectangle">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="d-flex justify-content-around">
                                          <div className="blue">
                                            {obj.trait_type}
                                          </div>
                                          <div className="text-right">
                                            {obj.value} of {obj.max_value}
                                          </div>
                                        </div>
                                        <UserProgressBar
                                          now={obj.value}
                                          max={obj.max_value}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
export default CreateCert;
