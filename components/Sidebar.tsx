
import React from 'react';
import type { View } from '../types';
import { ManagementIcon, ScoringIcon, ReportsIcon } from './icons';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'management', label: 'Quản lý Tiêu chí', icon: ManagementIcon },
    { id: 'scoring', label: 'Chấm điểm', icon: ScoringIcon },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: ReportsIcon },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-indigo-600 p-2 rounded-lg mr-3">
          <ScoringIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">QLTC</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id as View)}
                className={`w-full flex items-center p-3 my-2 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>© 2024 Quality Management</p>
      </div>
    </aside>
  );
};

export default Sidebar;
