// 'use client';

// import { useState } from 'react';

// export default function EmailSender() {
//   const [excelFile, setExcelFile] = useState(null);
//   const [htmlFile, setHtmlFile] = useState(null);
//   const [subject, setSubject] = useState('');
//   const [status, setStatus] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleExcelFileUpload = (e) => {
//     const uploadedFile = e.target.files?.[0];
//     setExcelFile(uploadedFile || null);
//   };

//   const handleHtmlFileUpload = (e) => {
//     const uploadedFile = e.target.files?.[0];
//     setHtmlFile(uploadedFile || null);
//   };

//   const sendEmails = async (e) => {
//     e.preventDefault();
    
//     if (!excelFile || !htmlFile) {
//       setStatus('Please select both Excel and HTML files');
//       return;
//     }

//     setIsLoading(true);
//     setStatus('');

//     const formData = new FormData();
//     formData.append('excelFile', excelFile);
//     formData.append('htmlFile', htmlFile);
//     formData.append('subject', subject);

//     try {
//       const response = await fetch('/api/send-emails', {
//         method: 'POST',
//         body: formData
//       });

//       const result = await response.json();

//       console.log('Server response:', result);

//       if (response.ok) {
//         setStatus('Emails sent successfully!');
//       } else {
//         setStatus(result.error || 'Failed to send emails');
//       }
//     } catch (error) {
//       console.error('Client-side error:', error);
//       setStatus('An error occurred while sending emails');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto pt-24 bg-slate-700 p-6 max-w-md">
//       <h1 className="text-2xl font-bold mb-4">Email Sender</h1>
//       <form onSubmit={sendEmails} className="space-y-4">
//         <div>
//           <label className="block mb-2">Excel File (with email list)</label>
//           <input 
//             type="file" 
//             accept=".xlsx,.xls" 
//             onChange={handleExcelFileUpload} 
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-2">HTML Template</label>
//           <input 
//             type="file" 
//             accept=".html" 
//             onChange={handleHtmlFileUpload} 
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-2">Email Subject</label>
//           <input 
//             type="text" 
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             placeholder="Enter email subject"
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={isLoading}
//           className="w-full bg-blue-500 text-white p-2 rounded 
//             hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {isLoading ? 'Sending...' : 'Send Emails'}
//         </button>
//       </form>

//       {status && (
//         <div className={`mt-4 p-2 rounded ${
//           status.includes('successfully') 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {status}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState } from 'react';

export default function EmailSender() {
  const [excelFile, setExcelFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExcelFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    setExcelFile(uploadedFile || null);
  };

  const sendEmails = async (e) => {
    e.preventDefault();
    
    if (!excelFile) {
      setStatus('Please select an Excel file');
      return;
    }

    setIsLoading(true);
    setStatus('');

    const formData = new FormData();
    formData.append('excelFile', excelFile);
    formData.append('subject', subject);

    try {
      const response = await fetch('/api/send-emails', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      console.log('Server response:', result);

      if (response.ok) {
        setStatus('Emails sent successfully!');
      } else {
        setStatus(result.error || 'Failed to send emails');
      }
    } catch (error) {
      console.error('Client-side error:', error);
      setStatus('An error occurred while sending emails');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-24 bg-slate-700 p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Email Sender</h1>
      <form onSubmit={sendEmails} className="space-y-4">
        <div>
          <label className="block mb-2">Excel File (with email list)</label>
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleExcelFileUpload} 
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Email Subject</label>
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded 
            hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Sending...' : 'Send Emails'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-2 rounded ${
          status.includes('successfully') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}