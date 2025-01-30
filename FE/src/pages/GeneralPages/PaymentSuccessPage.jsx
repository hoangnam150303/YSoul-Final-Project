// src/PaymentSuccess.js
import React from "react";
import { Button, Result } from "antd";

const PaymentSuccess = () => {
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
