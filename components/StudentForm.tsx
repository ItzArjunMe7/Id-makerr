
import React, { useRef, useState } from 'react';
import { IDCardData } from '../types.ts';

interface StudentFormProps {
  data: IDCardData;
  onChange: (updates: Partial<IDCardData>) => void;
  onSubmit: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ data, onChange, onSubmit }) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'signatureUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onChange({ photoUrl: dataUrl });
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all shadow-sm";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4">
        <h2 className="text-xl font-extrabold text-gray-800">Student Information</h2>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Form</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <input type="text" value={data.name} onChange={(e) => onChange({ name: e.target.value })} className={inputClasses} placeholder="Enter full name" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700">ID Number <span className="text-red-500">*</span></label>
          <input type="text" value={data.idNo} onChange={(e) => onChange({ idNo: e.target.value })} className={inputClasses} placeholder="e.g. EN241005" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700">Level</label>
          <select value={data.level} onChange={(e) => onChange({ level: e.target.value })} className={inputClasses}>
            <option value="">Select Academic Level</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700">Branch</label>
          <select value={data.branch} onChange={(e) => onChange({ branch: e.target.value })} className={inputClasses}>
            <option value="">Select Department</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="EXTC Engineering">EXTC Engineering</option>
            <option value="AI & Data Science">AI & Data Science</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-gray-700">Student Photo</label>
            <button onClick={startCamera} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Use Camera
            </button>
          </div>
          {showCamera ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-w-[200px] mx-auto group">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-2">
                <button onClick={capturePhoto} className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold">Capture</button>
                <button onClick={stopCamera} className="flex-1 py-1.5 bg-gray-600 text-white rounded-lg text-[10px] font-bold">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {data.photoUrl ? (
                    <img src={data.photoUrl} className="w-20 h-20 object-cover rounded-lg mb-2 border border-gray-200 shadow-sm" alt="Preview" />
                  ) : (
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  )}
                  <p className="text-xs text-gray-500 font-bold">Click to {data.photoUrl ? 'Replace' : 'Upload'}</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photoUrl')} />
              </label>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">Signature</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {data.signatureUrl ? <img src={data.signatureUrl} className="h-12 object-contain mb-2" alt="Preview" /> : <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>}
                <p className="text-xs text-gray-500 font-bold">Click to {data.signatureUrl ? 'Replace' : 'Upload'}</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'signatureUrl')} />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-gray-100">
        <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Contact & Address
        </h3>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700">Permanent Address</label>
          <textarea rows={2} value={data.address} onChange={(e) => onChange({ address: e.target.value })} className={inputClasses} placeholder="House no., Street, City, State, ZIP" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
            <input type="tel" value={data.mobile} onChange={(e) => onChange({ mobile: e.target.value })} className={inputClasses} placeholder="+91 00000 00000" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Date of Birth</label>
            <input type="date" value={data.dob} onChange={(e) => onChange({ dob: e.target.value })} className={inputClasses} />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button onClick={onSubmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Submit for Approval
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-4 font-medium italic">* Information once submitted cannot be changed until administrative review.</p>
      </div>
    </div>
  );
};

export default StudentForm;
