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

import type { ChartData } from 'chart.js';
import { jwtDecode } from 'jwt-decode';

// ลงทะเบียนส่วนประกอบ ChartJS ที่จำเป็น
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

// --- 2. Mock Data Fetching (แทนที่ด้วย API Call จริง) ---
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

// --- 3. Main Component ---
const RevenueChart: React.FC = () => {
    const [revenueData, setRevenueData] = useState<MonthlyRevenueData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<string>("")
    const currentYear = 2024;

    // Effect สำหรับการดึงข้อมูลเมื่อ Component ถูก Render
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchMonthlyRevenue(currentYear);
                setRevenueData(data);
            }
            catch (error) {
                console.error("Error fetching revenue data:", error);
            }
            finally {
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

        if (token) {
            try {
                const decoded = jwtDecode<MyTokenPayload>(token);
                setUser(decoded.user.username);
            }
            catch (err) {
                alert("Token invalid or expired");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
    }, [])

    // ใช้ useMemo สำหรับเตรียมข้อมูลให้อยู่ในรูปแบบที่ ChartJS ต้องการ
    const chartData: ChartData<'line', number[], string> = useMemo(() => {
        const labels = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        const dataPoints = revenueData.map(d => d.revenue);

        return {
            labels: labels, // แกน X: เดือน
            datasets: [
                {
                    label: 'รายรับรวม (บาท)',
                    data: dataPoints, // แกน Y: รายรับ
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.3, // ความโค้งมนของเส้น
                    pointRadius: 6, // ขนาดจุด
                    pointHoverRadius: 8,
                },
            ],
        };
    }, [revenueData]);

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' as const, labels: { boxWidth: 10 } },
            title: { display: true, text: `รายงานรายรับรวมประจำปี ${currentYear}`, font: { size: 18, weight: 'bold' as const } },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'รายรับ (บาท)', font: { weight: 'bold' as const } },
                beginAtZero: true
            },
            x: { title: { display: true, text: 'เดือน', font: { weight: 'bold' as const } } }
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-xl rounded-xl mt-20">
                <div className="p-8 text-center text-teal-600 border-2 border-dashed border-teal-300 rounded-lg">
                    <p className="animate-pulse">กำลังโหลดข้อมูลกราฟ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <div className="min-w-sm sm:min-w-3xl lg:min-w-3xl mx-auto p-0 md:p-8 bg-white shadow-2xl rounded-xl border border-gray-100">
                {/* หัวข้อ */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-center text-teal-700 mb-8 tracking-wide">
                    สวัสดีคุณ {user ? (user) : ("unknow")} <br/>แดชบอร์ดรายรับรายเดือน
                </h1>

                {/* Container สำหรับกราฟ */}
                <div className="p-2 md:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <Line options={options} data={chartData} />
                </div>

                {/* สรุปข้อมูลด้านล่าง */}
                <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-2 text-center">
                    <div className="p-2 sm:p-4 bg-teal-50 border-l-4 border-teal-500 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-gray-500">รายรับสูงสุด</p>
                        <p className="text-xl font-bold text-teal-800">
                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(Math.max(...revenueData.map(d => d.revenue)))}
                        </p>
                    </div>
                    <div className="p-2 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-gray-500">รายรับต่ำสุด</p>
                        <p className="text-xl font-bold text-blue-800">
                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(Math.min(...revenueData.map(d => d.revenue)))}
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>แสดงข้อมูลรายรับรวม 12 เดือนของปี {currentYear}</p>
                </div>
            </div>

            {/* ทำให้กว้างเท่าด้านบน */}
            <div className="max-w-4xl mx-auto mt-6 flex gap-4 justify-center">
                <a className="px-4 py-2 bg-blue-500 text-white rounded" href='/settingPage'>จัดการร้านค้า</a>
                <a className="px-4 py-2 bg-green-500 text-white rounded" href='#'>จัดการเมนูอาหาร</a>
            </div>
        </div>

    );
};

export default RevenueChart;