import React, { useMemo, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import type { ChartData, ChartOptions } from 'chart.js'; // เพิ่ม Type Options
import { jwtDecode } from 'jwt-decode';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MonthlyRevenueData {
    month: number;
    revenue: number;
}

interface MyTokenPayload {
    user: {
        id: number;
        username: string;
    };
    iat?: number;
}

// Mock Data
const fetchMonthlyRevenue = async (year: number): Promise<MonthlyRevenueData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { month: 1, revenue: 150000 }, { month: 2, revenue: 210000 },
        { month: 3, revenue: 180000 }, { month: 4, revenue: 300000 },
        { month: 5, revenue: 250000 }, { month: 6, revenue: 270000 },
        { month: 7, revenue: 320000 }, { month: 8, revenue: 350000 },
        { month: 9, revenue: 290000 }, { month: 10, revenue: 410000 },
        { month: 11, revenue: 450000 }, { month: 12, revenue: 600000 },
    ];
};

const RevenueChart: React.FC = () => {
    const [revenueData, setRevenueData] = useState<MonthlyRevenueData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<string>("");
    const currentYear = 2024;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchMonthlyRevenue(currentYear);
                setRevenueData(data);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        try {
            const decoded = jwtDecode<MyTokenPayload>(token);
            setUser(decoded.user.username);
        } catch (err) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    }, []);

    const chartData: ChartData<'line', number[], string> = useMemo(() => {
        const labels = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        const dataPoints = revenueData.map(d => d.revenue);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'รายรับรวม (บาท)',
                    data: dataPoints,
                    borderColor: 'rgb(13, 148, 136)', // Teal-600
                    backgroundColor: 'rgba(20, 184, 166, 0.2)', // Teal-500 alpha
                    tension: 0.4, // เพิ่มความโค้งให้ดู modern ขึ้น
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderWidth: 2,
                    fill: true, // ลองเปิด fill ดูถ้ารูปแบบกราฟรองรับ
                },
            ],
        };
    }, [revenueData]);

    // ปรับ Options ให้ Responsive จริงๆ
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false, // 🔴 สำคัญ: ปิดเพื่อใ้ห้เราคุมความสูงเองผ่าน CSS
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { boxWidth: 12, usePointStyle: true }
            },
            title: { display: false }, // ซ่อน Title ในกราฟเพราะเรามี Header HTML แล้ว
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (context.parsed.y !== null) {
                            label += ': ' + new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: { color: '#f3f4f6' },
                ticks: {
                    callback: function(value: any) {
                        // ย่อตัวเลขแกน Y บนมือถือ (เช่น 1k, 1M) ถ้าต้องการ หรือปล่อยไว้
                        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value);
                    },
                    font: { size: 11 }
                },
                beginAtZero: true
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-4xl p-12 text-center bg-white shadow-lg rounded-2xl border border-gray-100">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-4"></div>
                    <p className="text-teal-600 font-medium">กำลังประมวลผลข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 mt-16 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* 1. Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            แดชบอร์ดรายรับ
                        </h1>
                        <p className="text-gray-500 mt-1">
                            ยินดีต้อนรับ, <span className="text-teal-600 font-semibold">{user || "Guest"}</span>
                        </p>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-100">
                        ประจำปี {currentYear}
                    </div>
                </div>

                {/* 2. Main Chart Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700">ภาพรวมรายรับรายเดือน</h3>
                    </div>
                    
                    <div className="p-4 md:p-6">
                        {/* Wrapper เพื่อคุมความสูงกราฟ */}
                        {/* Mobile: สูง 300px, Tablet+: สูง 400px */}
                        <div className="relative h-[300px] md:h-[400px] w-full">
                            <Line options={options} data={chartData} />
                        </div>
                    </div>
                </div>

                {/* 3. Summary Cards (Grid Responsive) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card: Max */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">รายรับสูงสุด</p>
                            <p className="text-2xl font-bold text-teal-600 mt-1">
                                {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(Math.max(...revenueData.map(d => d.revenue)))}
                            </p>
                        </div>
                        <div className="p-3 bg-teal-50 rounded-full text-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>

                    {/* Card: Min */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">รายรับต่ำสุด</p>
                            <p className="text-2xl font-bold text-rose-500 mt-1">
                                {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(Math.min(...revenueData.map(d => d.revenue)))}
                            </p>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-full text-rose-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <a href='/settingPage' className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200 active:scale-95 transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        ตั้งค่าร้านค้า
                    </a>
                    <a href='/settingMenu' className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 active:scale-95 transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        จัดการเมนูอาหาร
                    </a>
                </div>

            </div>
        </div>
    );
};

export default RevenueChart;