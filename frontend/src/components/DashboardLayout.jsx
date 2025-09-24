import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    DashboardIcon, UsersIcon, RequestsIcon, JobPostingsIcon, ReportsIcon,
    SettingsIcon, LogoutIcon, BellIcon
} from './Icons';

const DashboardLayout = ({ onLogout }) => {
    const NavItem = ({ to, icon: Icon, children }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center w-full px-4 py-2 text-sm font-medium text-left rounded-lg ${isActive ? 'bg-black text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`
            }
        >
            <Icon className="h-5 w-5 mr-3" />
            {children}
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 flex-shrink-0 bg-white flex flex-col border-r">
                <div className="h-16 flex items-center px-6 border-b"><h1 className="font-serif text-2xl font-bold">Logo</h1></div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    <NavItem to="/dashboard" icon={DashboardIcon}>Dashboard</NavItem>
                    <NavItem to="/dashboard/users" icon={UsersIcon}>Users</NavItem>
                    {/* Add other nav items here */}
                </nav>
                <div className="px-4 py-4 border-t"><button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"><LogoutIcon className="h-5 w-5 mr-3" />Logout</button></div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                    <div className="relative w-full max-w-xs"><input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div></div>
                    <div className="flex items-center space-x-4"><button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"><BellIcon className="h-6 w-6" /></button><div className="flex items-center"><div className="w-10 h-10 rounded-full bg-gray-300"></div><span className="ml-3 font-semibold text-sm">John Smith</span></div></div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet /> {/* Child routes will render here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
