import { useEffect, useState } from 'react';
import { RequestsIcon, UsersIcon, JobPostingsIcon, ClockIcon, BellIcon, PlusIcon, ReportsIcon } from '../components/Icons';
import { dashboardApi } from '../lib/api.js';

const DashboardOverviewPage = () => {
    const [overview, setOverview] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [ov, act] = await Promise.all([
                    dashboardApi.overview(),
                    dashboardApi.recentActivity({ limit: 10 })
                ]);
                setOverview(ov?.data);
                setActivity(act?.data || []);
            } catch (e) {
                setError(e.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }z
        };
        load();
    }, []);

    const StatusBadge = ({ status }) => { const base = "px-2 py-1 text-xs font-medium rounded-full"; const colors = { Pending: "bg-yellow-100 text-yellow-800", Active: "bg-blue-100 text-blue-800", Completed: "bg-green-100 text-green-800", "Pending Review": "bg-purple-100 text-purple-800", "Under Review": "bg-indigo-100 text-indigo-800", }; return <span className={`${base} ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>; };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const statCards = overview ? [
        { icon: <RequestsIcon className="h-6 w-6 text-gray-500" />, title: "Total Pending Requests", value: String(overview.pendingRequests?.total || 0), details: `${overview.pendingRequests?.urgent || 0} Urgent • ${overview.pendingRequests?.high || 0} High • ${overview.pendingRequests?.medium || 0} Medium` },
        { icon: <UsersIcon className="h-6 w-6 text-gray-500" />, title: "New Users (24h)", value: String(overview.newUsers24h?.total || 0), details: (overview.newUsers24h?.byType || []).map(t=>`${t._id}: ${t.count}`).join(' • ') },
        { icon: <JobPostingsIcon className="h-6 w-6 text-gray-500" />, title: "Active Job Postings", value: String(overview.activeJobPostings?.total || 0), details: `${overview.activeJobPostings?.newToday || 0} new today` },
        { icon: <ClockIcon className="h-6 w-6 text-gray-500" />, title: "Average Resolution Time", value: `${overview.avgResolutionTime || 0}h`, details: `` },
    ] : [];

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, John Smith</h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with RawRecruit today</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(card => ( <div key={card.title} className="bg-white p-5 rounded-lg shadow"><div className="flex items-start justify-between"><div className="flex flex-col"><span className="text-sm font-medium text-gray-500">{card.title}</span><span className="text-3xl font-bold text-gray-900 mt-2">{card.value}</span></div><div className="p-2 bg-gray-100 rounded-lg">{card.icon}</div></div><p className="text-xs text-gray-500 mt-3">{card.details}</p></div> ))}
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow"><h2 className="font-semibold text-lg">Recent Activity</h2><ul className="mt-4 divide-y divide-gray-200">{activity.map(a => ( <li key={(a.title||'') + a.time} className="py-3 flex items-center justify-between text-sm"><p><strong className={a.highlight ? "text-black" : "font-medium"}>{a.title}</strong></p><div className="flex items-center space-x-4"><StatusBadge status={a.status} /><span className="text-gray-500 w-28 text-right">{a.user}</span></div></li> ))}</ul></div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow"><h2 className="font-semibold text-lg">Quick Actions</h2><div className="mt-4 grid grid-cols-2 gap-4 text-center">{[{icon: UsersIcon, label: "View Requests"}, {icon: PlusIcon, label: "Add Company"}, {icon: JobPostingsIcon, label: "Review Jobs"}, {icon: ReportsIcon, label: "Generate Report"}].map(action => <button key={action.label} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 flex flex-col items-center justify-center"><action.icon className="h-6 w-6 mx-auto text-gray-600" /><span className="mt-2 text-sm font-medium">{action.label}</span></button>)}</div></div>
                    <div className="bg-white p-6 rounded-lg shadow"><h2 className="font-semibold text-lg">Recent Notifications</h2><ul className="mt-4 space-y-3 text-sm">{[{icon: BellIcon, title: "Urgent:", text: "New student verification request", time: "5 min ago", color: "text-red-500"}, {icon: BellIcon, text: "Profile verification completed", time: "1 hour ago", color: "text-gray-400"}, {icon: BellIcon, text: "System maintenance scheduled", time: "2 hours ago", color: "text-gray-400"}].map(notif => <li key={notif.text} className="flex items-start"><notif.icon className={`h-4 w-4 mr-3 mt-1 ${notif.color} flex-shrink-0`} /><p>{notif.title && <strong className="font-semibold">{notif.title}</strong>} {notif.text}<span className="text-gray-500 block text-xs">{notif.time}</span></p></li>)}</ul></div>
                </div>
            </div>
        </>
    );
};

export default DashboardOverviewPage;
