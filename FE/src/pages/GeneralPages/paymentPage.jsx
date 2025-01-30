import React, { useState } from "react";
import { Card, Button } from "antd";

const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleAcceptPayment = () => {
    if (selectedPayment) {
      alert(`Proceeding with payment via ${selectedPayment}`);
      // Here you would typically handle the payment processing logic
    } else {
      alert("Please select a payment method.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Column for Logo and Header */}
      <div className="w-1/3 bg-white flex flex-col items-center justify-center p-8 shadow-lg">
        <img src="/path/to/your/logo.png" alt="Website Logo" className="mb-4" />
        <h2 className="text-xl font-semibold">Update to Become VIP User</h2>
      </div>

      {/* Right Column for Payment Options */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-6">Choose Your Payment Method</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg">
            <input
              type="radio"
              id="momo"
              name="payment"
              value="Momo"
              checked={selectedPayment === "Momo"}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="momo">Momo</label>
          </Card>
          <Card className="shadow-lg">
            <input
              type="radio"
              id="stripe"
              name="payment"
              value="Stripe"
              checked={selectedPayment === "Stripe"}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="stripe">Stripe</label>
          </Card>
          <Card className="shadow-lg">
            <input
              type="radio"
              id="vnpay"
              name="payment"
              value="VNPay"
              checked={selectedPayment === "VNPay"}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="vnpay">VNPay</label>
          </Card>
        </div>
        <Button type="primary" className="mt-6" onClick={handleAcceptPayment}>
          Accept Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
