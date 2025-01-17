import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import userApi from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

export const ApproveAccount = () => {
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]{5}$/, "OTP must be 5 digits.")
      .required("Please enter OTP."),
  });

  const handleInputChange = (value, setFieldValue) => {
    const deletedValue = value.replace(/[^0-9]/g, "");
    setFieldValue("otp", deletedValue);
    if (otpError) {
      setOtpError("");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const verifyToken = localStorage.getItem("verify_token");
      const payload = { ...values, verifyToken };
      const respone = await userApi.postVerify(payload);
      console.log(respone);
      if (respone.status === 200) {
        localStorage.removeItem("verify_token");
        navigate("/login");
      } else {
        setOtpError("OTP is incorrect.");
      }
    } catch (error) {}
    setSubmitting(false);
  };

  return (
    <div className="approve-bg w-full h-screen">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4 pb-10">
        <img
          src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
          alt="Logo"
          className="h-20 w-auto"
        />
      </header>

      <div className="flex flex-col items-center justify-center text-center py-40 text-white max-w-6x1 mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Input OTP to approve your account
        </h1>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="otp"
                  maxLength={5}
                  placeholder="Enter OTP code"
                  className="w-full px-4 py-2 mb-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-black"
                  onChange={(e) =>
                    handleInputChange(e.target.value, setFieldValue)
                  }
                />
                {errors.otp && touched.otp && (
                  <div className="text-red-500 text-sm mt-1">{errors.otp}</div>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Approve
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
