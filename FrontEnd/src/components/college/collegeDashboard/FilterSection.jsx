// import React from 'react';
// import PropTypes from 'prop-types';

// const FilterSection = ({
//   filterCategories,
//   activeFilters,
//   onFilterChange,
//   onClearFilters,
// }) => {
//   return (
//     <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Filters</h2>
//         <button
//           onClick={() => onClearFilters()}
//           className="text-sm text-blue-600 hover:text-blue-800"
//         >
//           Clear all
//         </button>
//       </div>

//       {activeFilters.length > 0 && (
//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2">
//             {activeFilters.map((filter) => (
//               <div
//                 key={`${filter.category}-${filter.value}`}
//                 className="inline-flex items-center bg-gray-100 rounded-full py-1 px-3 text-sm"
//               >
//                 <span className="mr-1">{filter.value}</span>
//                 <button
//                   onClick={() => {
//                     const category = filterCategories.find(c => c.id === filter.category);
//                     if (category) {
//                       const filterItem = category.filters.find(f => f.label === filter.value);
//                       if (filterItem) {
//                         onFilterChange(category.id, filterItem.id, false);
//                       }
//                     }
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="text-sm text-gray-600 mb-4">
//         Showing 0 of 100
//       </div>

//       {filterCategories?.map((category) => (
//         <div key={category._id} className="mb-6 border-t pt-4">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-semibold text-gray-800">{category.label}</h3>
//             <button
//               onClick={() => onClearFilters(category._id)}
//               className="text-xs text-blue-600 hover:text-blue-800"
//             >
//               Clear
//             </button>
//           </div>
//           <div className="space-y-2">
//             {category.filters.map((filter) => (
//               <div key={filter._id} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={`${category._id}-${filter._id}`}
//                   checked={filter.checked}
//                   onChange={(e) => onFilterChange(category._id, filter._id, e.target.checked)}
//                   className="h-4 w-4 text-blue-600 focus:ring-[#1e4ed8] border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor={`${category._id}-${filter._id}`}
//                   className="ml-2 text-sm text-gray-700 select-none"
//                 >
//                   {filter.label} ({filter.count})
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}

//     </div>
//   );
// };

// FilterSection.propTypes = {
//   filterCategories: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     label: PropTypes.string.isRequired,
//     filters: PropTypes.arrayOf(PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       count: PropTypes.number.isRequired,
//       checked: PropTypes.bool.isRequired
//     })).isRequired
//   })).isRequired,
//   activeFilters: PropTypes.arrayOf(PropTypes.shape({
//     category: PropTypes.string.isRequired,
//     value: PropTypes.string.isRequired
//   })).isRequired,
//   onFilterChange: PropTypes.func.isRequired,
//   onClearFilters: PropTypes.func.isRequired
// };

// export default FilterSection;
import React from 'react';

const FilterSection = ({ filters, onFilterChange, onClearFilter, college }) => {
  // Filter sections data
  const filterSections = [
    {
      title: 'Work mode',
      type: 'workMode',
      options: [
        { id: 'work-office', value: 'on-site', label: 'Work from office', count: 28692 },
        { id: 'work-hybrid', value: 'hybrid', label: 'Hybrid', count: 756 },
        { id: 'work-remote', value: 'remote', label: 'Remote', count: 709 }
      ]
    },
    {
      title: 'Degree',
      type: 'degree',
      options: [
        { id: 'degree-polytechnic', value: 'polytechnic', label: 'Polytechnic' },
        { id: 'degree-iti', value: 'iti', label: 'ITI' },
        { id: 'degree-diploma', value: 'diploma', label: 'Diploma' },
        { id: 'degree-undergraduate', value: 'undergraduate', label: 'Undergraduate' },
        { id: 'degree-postgraduate', value: 'postgraduate', label: 'Postgraduate' },
      ]
    },
    {
      title: 'Courses',
      type: 'courses',
      options: [
        { id: 'course-engineering', value: 'engineering', label: 'Engineering' },
        { id: 'course-pharmacy', value: 'pharmacy', label: 'Pharmacy' },
        { id: 'course-mechanical', value: 'mechanical', label: 'Mechanical Engineering' },
        { id: 'course-civil', value: 'civil', label: 'Civil Engineering' },
        { id: 'course-electrical', value: 'electrical', label: 'Electrical' },
        { id: 'course-fitter', value: 'fitter', label: 'Fitter' },
        { id: 'course-welding', value: 'welding', label: 'Welding' },
        { id: 'course-electronics', value: 'electronics', label: 'Electronics' },
        { id: 'course-btech', value: 'btech', label: 'B.Tech' },
        { id: 'course-bba', value: 'bba', label: 'BBA' },
        { id: 'course-bsc', value: 'bsc', label: 'BSc' },
        { id: 'course-bca', value: 'bca', label: 'BCA' },
        { id: 'course-be', value: 'be', label: 'BE' },
        { id: 'course-ba', value: 'ba', label: 'BA' },
        { id: 'course-bbm', value: 'bbm', label: 'BBM' },
        { id: 'course-puc-humanities', value: 'puc-humanities', label: 'PUC Humanities Combinations' },
        { id: 'course-puc-commerce', value: 'puc-commerce', label: 'PUC Commerce Combinations' },
        { id: 'course-b-pharma', value: 'b-pharma', label: 'B.Pharma' },
        { id: 'course-d-pharma', value: 'd-pharma', label: 'D.Pharma' },
        { id: 'course-m-tech', value: 'm-tech', label: 'M.Tech' },
        { id: 'course-mba', value: 'mba', label: 'MBA' },
        { id: 'course-ma', value: 'ma', label: 'MA' },
        { id: 'course-mca', value: 'mca', label: 'MCA' },
        { id: 'course-me', value: 'me', label: 'ME' },
        { id: 'course-msc', value: 'msc', label: 'MSc' },
        { id: 'course-mcom', value: 'mcom', label: 'MCom' },
        { id: 'course-m-pharma', value: 'm-pharma', label: 'M.Pharma' }
      ]
    },
    {
      title: 'Employment Type',
      type: 'employmentType',
      options: [
        { id: 'employment-full-time', value: 'Full-time', label: 'Full-time' },
        { id: 'employment-part-time', value: 'Part-time', label: 'Part-time' },
        { id: 'employment-contract', value: 'Contract', label: 'Contract' }
      ]
    }
  ];

  const dropdownFilters = [
    { title: 'Location', type: 'location', placeholder: 'Multi - Select' },
    { title: 'College', type: 'college', placeholder: 'Multi - Select' }
  ];

  return (
    <div className="space-y-6">
      {/* Checkbox filter sections */}
      {filterSections.map((section) => (
        <div key={section.type} className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{section.title}</h3>
            <button
              onClick={() => onClearFilter(section.type)}
              className="text-xs text-gray-500"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {section.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={Array.isArray(filters[section.type]) && filters[section.type].includes(option.value)}
                  onChange={() => onFilterChange(section.type, option.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor={option.id} className="ml-2 text-sm text-gray-700 flex-grow">
                  {option.label}
                </label>
                {option.count && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Dropdown filter sections */}
      {dropdownFilters.map((filter) => (
        <div key={filter.type} className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{filter.title}</h3>
            <button
              onClick={() => onClearFilter(filter.type)}
              className="text-xs text-gray-500"
            >
              Clear
            </button>
          </div>
          <div className="relative">
            <select
              value={filters[filter.type] || ''}
              onChange={(e) => onFilterChange(filter.type, e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">{filter.placeholder}</option>
              {college && Array.isArray(college) &&
                [...new Set(
                  college.map(c =>
                    filter.type === 'location'
                      ? c.location
                      : c.collegePosted?.collegeUniversityDetails?.collegeName
                  )
                )].filter(Boolean).map((value, idx) => (
                  <option key={idx} value={value}>
                    {value}
                  </option>
                ))
              }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSection;
