import React from 'react';

export default function CollegeDescription() {
  return (
    <div className="font-sans max-w-4xl mx-auto">
      {/* College Description Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold mb-1">College Description</h1>
        <p className="text-gray-600 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="border border-gray-300 rounded">
        {/* Section 1: College/University Details */}
        <div className="flex border-b border-gray-300 p-4">
          {/* Left Column - Title and Description */}
          <div className="w-1/2 pr-4">
            <h2 className="font-semibold mb-2">College/university Details</h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            </p>
          </div>
          
          {/* Right Column - Details */}
          <div className="w-1/2">
            <div className="space-y-2">
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">College/University Name :</div>
                <div className="w-1/2 text-sm">Corporate House</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Established Year :</div>
                <div className="w-1/2 text-sm">July 1, 2023</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">College Website URL :</div>
                <div className="w-1/2 text-sm"></div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Phone Number :</div>
                <div className="w-1/2 text-sm">1234567890</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Alternate Phone Number :</div>
                <div className="w-1/2 text-sm"></div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">College Location :</div>
                <div className="w-1/2 text-sm"></div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Pincode :</div>
                <div className="w-1/2 text-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 2: Placement Coordinator Details */}
        <div className="flex border-b border-gray-300 p-4">
          {/* Left Column - Title and Description */}
          <div className="w-1/2 pr-4">
            <h2 className="font-semibold mb-2">Placement Coordinator Details</h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            </p>
          </div>
          
          {/* Right Column - Details */}
          <div className="w-1/2">
            <div className="space-y-2">
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Coordinator Name :</div>
                <div className="w-1/2 text-sm">Priyanka Paridhi</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Designation :</div>
                <div className="w-1/2 text-sm">Product Designer</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Official Email ID :</div>
                <div className="w-1/2 text-sm">priyanka.talentconnect@gmail.com</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Official Contact Number :</div>
                <div className="w-1/2 text-sm">1234567890</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">LinkedIn Profile :</div>
                <div className="w-1/2 text-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 3: Placement & Recruitment Details */}
        <div className="flex p-4">
          {/* Left Column - Title and Description */}
          <div className="w-1/2 pr-4">
            <h2 className="font-semibold mb-2">Placement & Recruitment Details</h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            </p>
          </div>
          
          {/* Right Column - Details */}
          <div className="w-1/2">
            <div className="space-y-2">
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Programs Offered :</div>
                <div className="w-1/2 text-sm">UG, PG, DIPLOMA</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Preferred Hiring Companies :</div>
                <div className="w-1/2 text-sm">Any</div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 text-right pr-2 text-sm font-semibold">Recruitment Services Required :</div>
                <div className="w-1/2 text-sm">All</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}