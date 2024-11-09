import React from 'react';
import { googleLogout } from '@react-oauth/google';
import { FaSignOutAlt } from 'react-icons/fa';

const Logout = () => {
  const handleLogout = () => {
    googleLogout();
  };

  return (
    <div
      onClick={handleLogout}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
    >
      <FaSignOutAlt />
    </div>
  );
};

export default Logout;
