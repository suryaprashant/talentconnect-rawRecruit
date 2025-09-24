import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
// Import the 'City' utility from the new package
import { City } from 'country-state-city';


export default function RegisterPage({ onBackClick }) {
    const initialFormState = {
        degree: '',
        lookingFor: ['job'],
        employmentType: [],
        salaryRange: 'USD',
        salaryValue: '',
        tentativeStartDate: '',
        tentativeEndDate: '',
        rounds: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '' })),
        collegeLocation: null,
        coordinatorName: '',
        coordinatorDesignation: '',
        email: '',
        mobile: '',
        linkedinProfile: '',
        minStudentsToBePlaced: '',
        amenities: [],
        description: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // --- Dropdown and Input State Management ---
    const [dropdownOpen, setDropdownOpen] = useState({ amenities: false });
    const [customAmenity, setCustomAmenity] = useState('');

    const amenitiesRef = useRef(null);

    // --- Options ---
    const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
    const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
    const designationOptions = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];

    // --- City Options generated from the npm package ---
    // useMemo ensures this list is generated only once per component lifecycle
    const cityOptions = useMemo(() =>
        City.getCitiesOfCountry('IN').map(city => ({
            value: city.name,
            label: city.name,
        })),
    []);


    // --- Handlers ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, amenities: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleMultiToggle = (field, value) => {
        const currentValues = formData[field];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        setFormData({ ...formData, [field]: newValues });
    };

    const handleRoundChange = (id, field, value) => {
        const updatedRounds = formData.rounds.map(round =>
            round.id === id ? { ...round, [field]: value } : round
        );
        setFormData({ ...formData, rounds: updatedRounds });
    };

    const addItem = (field, item, setCustomInput) => {
        if (item.trim() && !formData[field].includes(item.trim())) {
            setFormData(prev => ({ ...prev, [field]: [...prev[field], item.trim()] }));
        }
        setCustomInput('');
    };

    const removeItem = (field, valueToRemove) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(item => item !== valueToRemove)
        }));
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.degree || !formData.collegeLocation || !formData.email || !formData.mobile) {
            showAlert('Please fill all the required fields marked with *', 'error');
            return;
        }

        let aggregatedSkills = [];
        let studentStreams = [];
        let roundNames = [];
        let studentCounts = [];

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.branch || round.skills);
        nonEmptyRounds.forEach(round => {
            if (round.skills) aggregatedSkills = [...new Set([...aggregatedSkills, ...round.skills.split(',').map(s => s.trim()).filter(Boolean)])];
            if (round.branch) studentStreams = [...new Set([...studentStreams, round.branch])];
            if (round.students) studentCounts.push(round.students);
            roundNames.push(`Round ${round.id}`);
        });

        let backendLookingFor = '';
        if (formData.lookingFor.includes('job') && formData.lookingFor.includes('internship')) {
            backendLookingFor = 'Both';
        } else if (formData.lookingFor.includes('internship')) {
            backendLookingFor = 'Internship';
        } else if (formData.lookingFor.includes('job')) {
            backendLookingFor = 'Job';
        }

        const payload = {
            jobType: 'On-campus',
            degree: [formData.degree],
            studentStreams: studentStreams,
            numberOfStudent: studentCounts,
            lookingFor: backendLookingFor,
            employmentType: formData.employmentType,
            minPackage: {
                currency: formData.salaryRange,
                amount: parseFloat(formData.salaryValue) || 0,
            },
            startDate: formData.tentativeStartDate,
            endDate: formData.tentativeEndDate,
            location: formData.collegeLocation ? [formData.collegeLocation.value] : [],
            contactPerson: {
                name: formData.coordinatorName,
                designation: formData.coordinatorDesignation,
                email: formData.email,
                mobile: formData.mobile,
                linkedin: formData.linkedinProfile,
            },
            noOfplacedStudents: formData.minStudentsToBePlaced,
            skills: aggregatedSkills,
            rounds: roundNames,
            amenitiesRequired: formData.amenities,
            description: formData.description
        };

        try {
            const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';
            const response = await axios.post(`${backendUrl}/api/hiring-channels/on-campus/college-request`, payload, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            toast.success(response?.data?.message);
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8 font-inter">
            {alert.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className={`relative p-6 rounded-lg shadow-lg w-full max-w-md text-center ${alert.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="flex flex-col items-center">
                            {alert.type === 'success' && (
                                <div className="w-12 h-12 rounded-full bg-green-200 p-2 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            )}
                            <strong className={`text-xl font-bold mb-2 ${alert.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {alert.type === 'success' ? 'Success!' : 'Error!'}
                            </strong>
                            <span className={`text-sm ${alert.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{alert.message}</span>
                            <button onClick={() => setAlert({ show: false, message: '', type: '' })} className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors">
                                <X size={20} className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Revolutionizing Campus Recruitment</h1>
                <p className="text-sm text-gray-600 max-w-lg mx-auto">Our platform connects colleges with skilled employers, offering tools for targeted training and data-driven insights to refine recruitment strategies.</p>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-gray-700">Register for Campus Placement</h2>
                <p className="text-sm text-gray-500">Please fill out the form below to register your college for campus placements.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">Degree <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select id="degree" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10" value={formData.degree} onChange={(e) => handleChange('degree', e.target.value)} required>
                            <option value="">Select Degree</option>
                            {degreeOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tentative Date Range</label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input type="date" placeholder="Start Date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.tentativeStartDate} onChange={(e) => handleChange('tentativeStartDate', e.target.value)} />
                        <input type="date" placeholder="End Date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.tentativeEndDate} onChange={(e) => handleChange('tentativeEndDate', e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
                    <div className="flex space-x-2">
                        {['job', 'internship', 'both'].map((type) => (
                            <button key={type} type="button" className={`px-4 py-2 text-sm border rounded-md capitalize transition-colors ${formData.lookingFor.includes(type) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`} onClick={() => handleMultiToggle('lookingFor', type)}>{type}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment type</label>
                    <div className="flex space-x-2">
                        {['Part-time', 'Full-time', 'Contract'].map((type) => (
                            <button key={type} type="button" className={`px-4 py-2 text-sm border rounded-md transition-colors ${formData.employmentType.includes(type) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`} onClick={() => handleMultiToggle('employmentType', type)}>{type}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Cut-off Salary</label>
                    <div className="flex rounded-md shadow-sm">
                        <select className="border border-gray-300 rounded-l-md px-3 py-2 w-24" value={formData.salaryRange} onChange={(e) => handleChange('salaryRange', e.target.value)}>
                            <option>USD</option><option>INR</option><option>EUR</option>
                        </select>
                        <input type="number" className="border border-gray-300 rounded-r-md px-3 py-2 flex-1" placeholder="Enter amount" value={formData.salaryValue} onChange={(e) => handleChange('salaryValue', e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rounds</label>
                    <div className="overflow-x-auto border border-gray-300 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. of Students</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills (comma separated)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {formData.rounds.map((round) => (
                                    <tr key={round.id}>
                                        <td className="px-4 py-2 text-sm">{round.id}</td>
                                        <td className="px-4 py-2">
                                            <div className="relative">
                                                <select className="w-full px-2 py-1 border rounded-md text-sm appearance-none pr-8" value={round.branch} onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}>
                                                    <option value="">Select Branch</option>
                                                    {branchOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none"><ChevronDown size={14} className="text-gray-400" /></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2"><input type="number" className="w-full px-2 py-1 border rounded-md text-sm" value={round.students} onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)} min="0" /></td>
                                        <td className="px-4 py-2"><input type="text" className="w-full px-2 py-1 border rounded-md text-sm" value={round.skills} onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)} placeholder="e.g., Python, SQL" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div ref={amenitiesRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campus Facilities/Amenities Provided</label>
                    <div className="relative">
                        <div className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer" onClick={() => setDropdownOpen(prev => ({ ...prev, amenities: !prev.amenities }))}>
                            {formData.amenities.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {formData.amenities.map(item => (
                                        <span key={item} className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            {item}
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('amenities', item); }} className="ml-1.5"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            ) : <span className="text-gray-500">Select facilities</span>}
                        </div>
                        {dropdownOpen.amenities && (
                            <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                                {amenitiesOptions.map(opt => (
                                    <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.amenities.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('amenities', opt)}>{opt}</div>
                                ))}
                                <div className="p-2">
                                    <input type="text" placeholder="Add custom facility..." className="w-full border-gray-300 border rounded-md px-2 py-1" value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('amenities', customAmenity, setCustomAmenity); } }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / Message</label>
                    <textarea id="description" className="block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Any additional information..." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows="3"></textarea>
                </div>

                <hr />

                <div>
                    <label htmlFor="collegeLocation" className="block text-sm font-medium text-gray-700 mb-1">College Location <span className="text-red-500">*</span></label>
                    <CreatableSelect
                        id="collegeLocation"
                        isClearable
                        options={cityOptions}
                        value={formData.collegeLocation}
                        onChange={(selectedOption) => handleChange('collegeLocation', selectedOption)}
                        placeholder="Select or type to add a city..."
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: '#d1d5db', // gray-300
                                minHeight: '42px',
                            }),
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="coordinatorName" className="block text-sm font-medium text-gray-700 mb-1">Coordinator Name</label>
                    <input id="coordinatorName" type="text" placeholder="Enter name" className="w-full border p-2 rounded-md" value={formData.coordinatorName} onChange={(e) => handleChange('coordinatorName', e.target.value)} />
                </div>
                <div>
                    <label htmlFor="coordinatorDesignation" className="block text-sm font-medium text-gray-700 mb-1">Coordinator Designation <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select id="coordinatorDesignation" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10" value={formData.coordinatorDesignation} onChange={(e) => handleChange('coordinatorDesignation', e.target.value)} required>
                            <option value="">Select Designation</option>
                            {designationOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Official Email <span className="text-red-500">*</span></label>
                    <input id="email" type="email" placeholder="hello@xyz.com" className="w-full border p-2 rounded-md" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Official Mobile <span className="text-red-500">*</span></label>
                    <input id="mobile" type="tel" placeholder="1234567890" className="w-full border p-2 rounded-md" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                    <input id="linkedinProfile" type="url" placeholder="https://linkedin.com/in/username" className="w-full border p-2 rounded-md" value={formData.linkedinProfile} onChange={(e) => handleChange('linkedinProfile', e.target.value)} />
                </div>

                <div>
                    <label htmlFor="minStudentsToBePlaced" className="block text-sm font-medium text-gray-700 mb-1">Minimum Students to be Placed <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select id="minStudentsToBePlaced" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10" value={formData.minStudentsToBePlaced} onChange={(e) => handleChange('minStudentsToBePlaced', e.target.value)} required >
                            <option value="">Select Range</option>
                            {minStudentsOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                    </div>
                </div>

                <div className="flex justify-between pt-6">
                    <button type="button" onClick={onBackClick} className="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</button>
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">Register</button>
                </div>
            </form>
        </div>
    );
}