import React from 'react';

const PlanCard = () => {
  return (
    <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-sm text-white/80 mb-2">CURRENT PLAN</div>
          <h2 className="text-3xl font-bold mb-4">Researcher</h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm">API Usage</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Plan</span>
                <span className="text-sm">0/1,000 Credits</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <span className="text-sm">Pay as you go</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="w-10 h-6 bg-white/20 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>
        
        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Manage Plan</span>
        </button>
      </div>
    </div>
  );
};

export default PlanCard; 