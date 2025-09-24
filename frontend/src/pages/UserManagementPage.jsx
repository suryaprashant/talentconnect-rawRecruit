import { useEffect, useState } from 'react';
import { UsersIcon, StudentIcon, ProfessionalIcon, CompanyIcon, CollegeIcon } from '../components/Icons';
import { usersApi } from '../lib/api.js';

const UserManagementPage = () => {
    const [activeTab, setActiveTab] = useState('All Users');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await usersApi.list({ page: 1, limit: 25 });
                setUsers(res.data || []);
            } catch (e) {
                setError(e.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);
    const UserTypeIcon = ({ type }) => { const icons = { Student: StudentIcon, Fresher: ProfessionalIcon, Professional: ProfessionalIcon, Company: CompanyIcon, College: CollegeIcon, }; const Icon = icons[type]; return Icon ? <Icon className="h-5 w-5 mr-2 text-gray-500" /> : null; };
    const StatusIndicator = ({ status }) => <div className="flex items-center"><div className={`h-2 w-2 rounded-full mr-2 ${status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div><span>{status}</span></div>;
    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
                {tabs.map(tab => ( <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md ${activeTab === tab.name ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-100'}`}> <tab.icon className="h-5 w-5"/> <span>{tab.name} ({tab.count})</span> </button> ))}
            </div>
            <div className="bg-white p-6 mt-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-auto"><input type="text" placeholder="Search..." className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div></div>
                    <div className="flex gap-4"><button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">Filters</button><button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">Status</button><button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">User</button></div>
                </div>
                {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th scope="col" className="px-6 py-3">User ID</th><th scope="col" className="px-6 py-3">User Name</th><th scope="col" className="px-6 py-3">Email</th><th scope="col" className="px-6 py-3">User</th><th scope="col" className="px-6 py-3">Status</th></tr></thead>
                        <tbody>{users.map(user => ( <tr key={String(user._id || user.id)} className="bg-white border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium text-gray-900">{String(user._id || user.id)}</td><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4 flex items-center"><UserTypeIcon type={user.userType || user.type} /> {user.userType || user.type}</td><td className="px-6 py-4"><StatusIndicator status={user.status} /></td></tr> ))}</tbody>
                    </table>
                </div>
                )}
                <nav className="flex items-center justify-between pt-4"><button className="px-3 py-1 text-sm font-medium border rounded-lg hover:bg-gray-50">Prev</button><div className="flex gap-1">{[1, 2, 3, 4].map(page => <button key={page} className={`px-3 py-1 text-sm rounded-lg ${page === 1 ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}>{page}</button>)}</div><button className="px-3 py-1 text-sm font-medium border rounded-lg hover:bg-gray-50">Next</button></nav>
            </div>
        </>
    );
}

export default UserManagementPage;
