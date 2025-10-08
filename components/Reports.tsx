
import React from 'react';
import type { CriterionGroup, SubItem } from '../types';
import { ScoringType } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Global declaration for jsPDF from CDN
declare const jspdf: any;
declare const XLSX: any;

interface ReportsProps {
  data: CriterionGroup[];
}

const COLORS = ['#4f46e5', '#ef4444', '#8b5cf6', '#10b981', '#f59e0b'];

const Reports: React.FC<ReportsProps> = ({ data }) => {
  const allSubItems = data.flatMap(g => g.criteria.flatMap(c => c.subItems));
  const scoredItems = allSubItems.filter(si => si.score);
  const completionPercentage = allSubItems.length > 0 ? (scoredItems.length / allSubItems.length) * 100 : 0;

  const statusCounts = scoredItems.reduce((acc, item) => {
    const status = String(item.score?.status);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  const departmentScores = data.reduce((acc, group) => {
    const groupSubItems = group.criteria.flatMap(c => c.subItems);
    const scored = groupSubItems.filter(si => si.score && si.scoringType === ScoringType.SCALE_10);
    if (scored.length > 0) {
      const totalScore = scored.reduce((sum, item) => sum + Number(item.score?.status || 0), 0);
      const avgScore = totalScore / scored.length;
      acc[group.department] = {
        name: group.department,
        'Điểm Trung Bình': parseFloat(avgScore.toFixed(2)),
      };
    } else {
       acc[group.department] = {
        name: group.department,
        'Điểm Trung Bình': 0,
      };
    }
    return acc;
  }, {} as Record<string, {name: string; 'Điểm Trung Bình': number}>);

  const barData = Object.values(departmentScores);

  const exportToPDF = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    doc.text("Báo cáo Thống kê Chất lượng", 14, 16);
    doc.setFontSize(12);
    doc.text(`Tỷ lệ hoàn thành: ${completionPercentage.toFixed(2)}%`, 14, 24);

    const tableData = allSubItems.map(item => [
      item.description,
      item.score?.status ?? 'Chưa chấm',
      item.score?.date ?? '',
      item.score?.notes ?? '',
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [['Tiểu mục', 'Trạng thái', 'Ngày', 'Ghi chú']],
      body: tableData,
    });
    
    doc.save('bao_cao_chat_luong.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allSubItems.map(item => ({
      'Nhóm': data.find(g => g.criteria.some(c => c.subItems.includes(item)))?.name,
      'Tiêu chí': data.find(g => g.criteria.some(c => c.subItems.includes(item)))?.criteria.find(c => c.subItems.includes(item))?.name,
      'Tiểu mục': item.description,
      'Trạng thái': item.score?.status ?? 'Chưa chấm',
      'Ngày chấm': item.score?.date,
      'Ghi chú': item.score?.notes,
      'Loại chấm': item.scoringType,
      'Trọng số': item.weight,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCao');
    XLSX.writeFile(workbook, 'bao_cao_chat_luong.xlsx');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Báo cáo & Thống kê</h1>
        <div className="space-x-2">
            <button onClick={exportToPDF} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Xuất PDF</button>
            <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Xuất Excel</button>
        </div>
      </div>
      
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Tỷ lệ hoàn thành</h3>
          <p className="text-3xl font-semibold text-white mt-2">{completionPercentage.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Tổng số tiểu mục</h3>
          <p className="text-3xl font-semibold text-white mt-2">{allSubItems.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Đã chấm</h3>
          <p className="text-3xl font-semibold text-white mt-2">{scoredItems.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white">Phân bổ trạng thái</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-12">Không có dữ liệu để hiển thị.</p>}
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white">Điểm trung bình theo Khoa/Phòng ban</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }} />
                    <Legend />
                    <Bar dataKey="Điểm Trung Bình" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-12">Không có dữ liệu điểm thang 10 để hiển thị.</p>}
        </div>
      </div>
    </div>
  );
};

export default Reports;
