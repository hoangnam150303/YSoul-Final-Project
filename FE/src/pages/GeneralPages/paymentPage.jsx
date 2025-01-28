import React, { useState } from "react";
import { Card, Radio, Button, Row, Col, Typography, Image } from "antd";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method!");
      return;
    }
    alert(`Proceeding with ${selectedMethod} payment!`);
  };

  const paymentMethods = [
    {
      id: "stripe",
      name: "Stripe",
      logo: "https://via.placeholder.com/50?text=Stripe",
    },
    {
      id: "vnpay",
      name: "VNPay",
      logo: "https://via.placeholder.com/50?text=VNPay",
    },
    {
      id: "momo",
      name: "MoMo",
      logo: "https://via.placeholder.com/50?text=MoMo",
    },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-3xl p-4" title="Payment Page">
        <Row gutter={24}>
          {/* Cột bên trái: Thông tin và logo */}
          <Col span={12}>
            <div className="flex flex-col items-start">
              <Typography.Title level={4}>
                Pay for Update Account
              </Typography.Title>
              <Image
                src="https://via.placeholder.com/150?text=Logo"
                alt="Website Logo"
                width={150}
                preview={false}
              />
            </div>
          </Col>

          {/* Cột bên phải: Phương thức thanh toán và nút */}
          <Col span={12}>
            <div className="space-y-3">
              <Radio.Group
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full"
              >
                <Row gutter={16}>
                  {paymentMethods.map((method) => (
                    <Col span={8} key={method.id}>
                      <Radio.Button
                        value={method.id}
                        className={`w-full flex items-center justify-between p-3 border rounded-lg ${
                          selectedMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={method.logo}
                          alt={method.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <span className="font-medium text-gray-700">
                          {method.name}
                        </span>
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
              <Button
                className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handlePayment}
              >
                Proceed to Pay
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PaymentPage;
