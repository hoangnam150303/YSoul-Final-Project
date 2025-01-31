// src/PaymentSuccess.js
import React, { useEffect } from "react";
import { Button, Result } from "antd";
import paymentApi from "../../hooks/paymentApi";
import { useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const invoice_id = useParams().invoice_id;
  const handleAcceptPayment = async () => {
    try {
      await paymentApi.putReturnInvoice(invoice_id);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleAcceptPayment();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle="Thank you for your payment. Your transaction has been completed."
        extra={[
          <Button
            onClick={() => (window.location.href = "/")}
            type="primary"
            key="console"
          >
            Go to Dashboard
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;
