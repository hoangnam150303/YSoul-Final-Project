
import React from 'react';
import { Avatar, Input, Button } from 'antd';

const UserProfilePage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center p-5 bg-gray-100 min-h-screen">
      {/* Left Column: Avatar */}
      <div className="md:w-1/2 flex justify-center mb-4 md:mb-0">
        <Avatar size={200} src="https://via.placeholder.com/200" className="border-2 border-gray-300" />
      </div>

      {/* Right Column: User Info */}
      <div className="md:w-1/2 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">User  Profile</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input placeholder="Enter your name" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input type="email" placeholder="Enter your email" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input placeholder="Enter your phone number" />
        </div>
        <Button type="primary" className="w-full">Save Changes</Button>
      </div>
    </div>
  );
};

export default UserProfilePage;