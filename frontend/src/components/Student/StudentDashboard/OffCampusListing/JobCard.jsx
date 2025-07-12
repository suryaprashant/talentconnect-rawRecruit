function JobCard({ job, onClick }) {
  // console.log(job)
  return (
    <div className="border border-gray-300 rounded bg-white p-4 flex flex-col h-full" onClick={() => onClick(job._id)}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 mr-3"></div>
        <div>
          <h3 className="font-semibold">{job.companyId?.companyDetails.companyName ? job.companyId?.companyDetails.companyName : "No Name"}</h3>
          {job.workModes.map((workMode, i) => (<span className="text-xs bg-gray-100 px-2 py-1 rounded" key={i}>{workMode}</span>))}
        </div>
      </div>

      <div className="flex items-center mb-2">
        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span className="text-sm">{job.workLocations}</span>
      </div>

      <div className="flex items-center mb-3">
        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <span className="text-sm">{job.workModes}</span>
      </div>

      <div className="flex gap-1 mb-2">
        {job?.tags?.map((tag, index) => (
          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>

      <div className="mb-2">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
          </svg>
          <span className="text-sm font-medium">{job.jobRoles}</span>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded ">{job.workLocations}</span>
      </div>

      <div className="flex items-center mb-3">
        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="text-sm">{job.minPackage?.currency} {job.minPackage.amount ? job.minPackage.amount : 'Not Mentioned'}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4 flex-grow">{job.description ? job.description : job.criteria}</p>

      <div className="mt-auto">
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>Hiring Process:</span>
          <div className="flex">
            {job?.selectionProcess?.map((step, index) => (
              <span key={index} className="mx-1">
                {step}
                {index < job.selectionProcess.length - 1 && " - "}
              </span>
            ))}
          </div>
        </div>

        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Register Now
        </button>
      </div>
    </div>
  );
}

export default JobCard;