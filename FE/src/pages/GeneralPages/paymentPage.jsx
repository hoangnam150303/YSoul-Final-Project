import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import paymentApi from "../../hooks/paymentApi";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "../../reducers/user";
import { Link } from "react-router-dom";
const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  dispatch(getUserRequest());
  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleAcceptPayment = async () => {
    if (selectedPayment) {
      message.success(`Proceeding with payment via ${selectedPayment}`);
      const respone = await paymentApi.postPayment(10, userId, selectedPayment);

      if (respone.status === 200) {
        window.location.replace(respone.data.response.url);
      }
    } else {
      message.error("Please select a payment method.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      {" "}
      {/* Changed to bg-gray-800 */}
      {/* Left Column for Logo and Header */}
      <div className="w-1/3 bg-white flex flex-col items-center justify-center p-8 shadow-lg">
        <h2 className="text-xl font-semibold">Update to Become VIP User</h2>
        <img
          src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
          alt="Website Logo"
          className="mb-4"
        />
      </div>
      {/* Right Column for Payment Options */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Choose Your Payment Method
        </h1>{" "}
        {/* Changed text color to white */}
        {/* Price Display */}
        <div className="text-lg font-semibold mb-4 text-white">
          {" "}
          {/* Changed text color to white */}
          Price: <span className="text-green-400">$10.00</span>{" "}
          {/* Changed text color to a lighter green */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg">
            <input
              type="radio"
              id="momo"
              name="payment"
              value="momo"
              checked={selectedPayment === "momo"}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="momo" className="text-black">
              Momo
            </label>{" "}
            {/* Changed text color to white */}
          </Card>
          <Card className="shadow-lg">
            <input
              type="radio"
              id="stripe"
              name="payment"
              value="stripe"
              checked={selectedPayment === "stripe"}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="stripe" className="text-black">
              Stripe
            </label>{" "}
            {/* Changed text color to white */}
          </Card>
          <Card className="shadow-lg">
            <input
              type="radio"
              id="vnpay"
              name="payment"
              value="vnpay"
              checked={selectedPayment === "vnpay"}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="vnpay" className="text-black">
              VNPay
            </label>{" "}
            {/* Changed text color to white */}
          </Card>
        </div>
        <Button type="primary" className="mt-6" onClick={handleAcceptPayment}>
          Accept Payment
        </Button>
        <Link to="/">
          <Button type="default" className="mt-4">
            Back to Home
          </Button>
        </Link>
        <div className="mt-4 text-gray-500 text-sm">
          Note: Please ensure that you have a valid payment method selected.
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
