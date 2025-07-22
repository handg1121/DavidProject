import React from 'react';

const Notification = ({ notification, setNotification }) => {
  if (!notification.show) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
      notification.type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-3">
        {notification.type === 'success' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="font-medium">{notification.message}</span>
        <button
          onClick={() => setNotification({ show: false, message: '', type: 'success' })}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification; 