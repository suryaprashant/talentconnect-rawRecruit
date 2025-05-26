
export default function EditReview({prevStep, nextStep }) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center w-full max-w-lg p-4">
          <h1 className="text-2xl font-bold mb-4">Review & Edit Your Details</h1>
          <p className="mb-8">We've pre-filled your details based on your resume. Please review the information below and make any necessary edits before submitting.</p>
          
          <div className="flex justify-between mb-6">
            <button onClick={prevStep} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Back
            </button>
            <button onClick={nextStep} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </div>
    );
}


// export default function EditReview({ prevStep, nextStep }) {
//     return (
//       <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        
//         <div className="flex justify-between">
//           <button 
//             onClick={prevStep}
//             className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button 
//             onClick={nextStep}
//             className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     );
// }