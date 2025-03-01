// src/LoadingPage.js
import React from "react";
import { Spin } from "antd";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Spin size="large" />
      <div className="ml-4 text-lg">Loading...</div>
    </div>
  );
};

export default LoadingPage;
