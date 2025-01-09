import React, { useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { FaSignOutAlt } from 'react-icons/fa';
import './Logout.css';

const Logout = ({ isSidebarOpen }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    googleLogout();
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/'; // Redirigir al usuario a la página de login
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <div onClick={handleLogoutClick} className="logout-button">
        <FaSignOutAlt className="logout-icon" />
        {isSidebarOpen && <span className="logout-text">Sortir</span>}
      </div>

      {showModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p className="logout-modal-text">
              Estàs segur/a de que vols sortir de CERCLES?
            </p>
            <div className="logout-modal-buttons">
              <button
                onClick={handleCancelLogout}
                className="logout-cancel-button"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="logout-confirm-button"
              >
                Sortir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
