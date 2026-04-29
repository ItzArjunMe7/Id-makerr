
import React from 'react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your ID card details have been sent to the administration. You can check your status on this dashboard.
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-200"
        >
          Great, thanks!
        </button>
      </div>
    </div>
  );
};

export default SubmissionModal;
