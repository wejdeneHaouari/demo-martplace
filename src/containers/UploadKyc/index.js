import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import { env } from "../../constants";
import * as Yup from "yup";
// import "./index.css";
import { toast } from "react-toastify";

 function UploadKyc() {
     const cookies = new Cookies();
     const notify = (type, text) => {
       if (type === "loginError") {
         toast(text);
       }
     };
     const state = {
       button: 1,
     };
     const token = cookies.get("response");
     const authToken = "Bearer " + token;
     const headers = {
       headers: {
         "content-type": "application/json",
         Authorization: authToken,
       },
     };
     const userId = cookies.get("userId");
      const FILE_SIZE = 160 * 1024;
      const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/png",
      ];
     
     const validationSchema2 = Yup.object().shape({
       fname: Yup.string().required("First Name is required"),
       lname: Yup.string().required("Last Name is required"),
       myFiles: Yup.mixed().required('A file is required')
                    .test('fileFormat', "Please select valid File", (value) => {
                       console.log(value);
                       return value && ["application/png"].includes(value.type);
                    }),
       organizationEmail: Yup.string()
         .required("Organization Email is required")
         .email("Organization Email is invalid"),
       organizationName: Yup.string()
         .required("Organization Name is required")
         .min(2, "Organization Name must be at least 6 characters")
         .max(20, "Organization Name must not exceed 20 characters"),
     });
     const {
       register: register2,
       formState: { errors: errors2 },
       handleSubmit: handleSubmit2,
     } = useForm({
       mode: "onBlur",
       resolver: yupResolver(validationSchema2),
     });
     const onSubmit2 = (data) => {
       data.userId = userId;
       axios
         .post(env.apiUrl + "api/users/uploadKycData", data, headers)
         .then((res) => {
           notify("loginError", res.data.msg);
         })
         .catch((err) => {
           if (err.response) {
             notify("loginError", err.response.data.msg);
           }
         });
     };
     return (
       <>
         <div className="container settingsContainer">
           <Header />
           <div className="container">
             <div className=" justify-content-center settingsCard w-100 ">
               <div className="card cardClass">
                 <div className="card-block">
                   <h4 className="card-title">Upload KYC</h4>
                   <form onSubmit={handleSubmit2(onSubmit2)}>
                     <div>
                       <div className="form-group mb-4">
                         <input
                           name="fname"
                           type="text"
                           placeholder="First Name"
                           {...register2("fname")}
                           className={`form-control ${
                             errors2.fname ? "is-invalid" : ""
                           }`}
                         />
                         <div className="invalid-feedback">
                           {errors2.fname?.message}
                         </div>
                       </div>
                       <div className="form-group mb-4">
                         <input
                           name="lname"
                           type="text"
                           placeholder="Last Name"
                           {...register2("lname")}
                           className={`form-control ${
                             errors2.lname ? "is-invalid" : ""
                           }`}
                         />
                         <div className="invalid-feedback">
                           {errors2.lname?.message}
                         </div>
                       </div>
                       <div className="form-group mb-4">
                         <input
                           name="organizationName"
                           type="text"
                           placeholder="Organization Name"
                           {...register2("organizationName")}
                           className={`form-control ${
                             errors2.organizationName ? "is-invalid" : ""
                           }`}
                         />
                         <div className="invalid-feedback">
                           {errors2.organizationName?.message}
                         </div>
                       </div>
                       <div className="form-group mb-4">
                         <input
                           name="organizationEmail"
                           type="text"
                           placeholder="Email"
                           {...register2("organizationEmail")}
                           className={`form-control ${
                             errors2.organizationEmail ? "is-invalid" : ""
                           }`}
                         />
                         <div className="invalid-feedback">
                           {errors2.organizationEmail?.message}
                         </div>
                       </div>
                       <div className="form-group mb-4 block">
                         <input
                           name="myFiles"
                           type="file"
                           //    placeholder="file"
                           {...register2("myFiles")}
                           accept="image/png, image/jpeg"
                           className={`form-control ${
                             errors2.myFiles ? "is-invalid" : ""
                               }`}
                            multiple={true}
                         />
                         <div className="invalid-feedback">
                           {errors2.myFiles?.message}
                         </div>
                       </div>
                       <div className=" mb-4">
                         <button
                           className="btn btn-primary "
                           type="submit"
                           onClick={() => (state.button = 2)}
                           name="infoChange"
                         >
                           Upload Kyc
                         </button>
                       </div>
                     </div>
                   </form>{" "}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </>
     );
}
export default UploadKyc;