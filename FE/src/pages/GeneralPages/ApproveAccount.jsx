import React, { useState } from "react";

export const ApproveAccount = () => {
    const [otp, setOtp] = useState("");
    const handleApprove = (e) => {
        e.preventDefault();
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

        <form className="flex flex-col md:flex-row gap-4 w-1/2">
          <div>
            <input
              type="email"
              className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
              placeholder="you@examle.com"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
};
