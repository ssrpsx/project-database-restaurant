import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface StoreSettings {
    title: string;
    description: string;
}

interface MyTokenPayload {
    user: {
        id: number;
        username: string;
    };
    iat?: number;
}

interface TableData {
    ID: number;
    TABLE_NUMBER: string;
}

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<StoreSettings>({ title: '', description: '' });
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [user, setUser] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [tables, setTables] = useState<TableData[]>([]);
    const [newTableNum, setNewTableNum] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        try {
            const decoded = jwtDecode<MyTokenPayload>(token);
            setUser(decoded.user.username);
        }
        catch (err) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    }, []);

    const fetchTables = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/get_table_number`);
            if (!res.ok) throw new Error("Fetch error");
            const data = await res.json();
            setTables(data);
        }
        catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSaveRestaurantInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveMessage("กำลังบันทึก...");
        const formData = new FormData();
        formData.append("storeTitle", settings.title);
        formData.append("storeDescription", settings.description);
        if (selectedFile) formData.append("banner", selectedFile);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/post_restaurant_info`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("เกิดข้อผิดพลาด");
            setSaveMessage("✅ บันทึกสำเร็จ");
        }
        catch (err) {
            setSaveMessage("❌ Error");
        }
        finally {
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const handleAddTable = async () => {
        if (!newTableNum.trim()) {
            alert("กรุณากรอกเลขโต๊ะ");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/post_table_number`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table_number: newTableNum })
            });

            if (!res.ok) throw new Error("Add table failed");

            setNewTableNum("");
            fetchTables();
            alert("เพิ่มโต๊ะเรียบร้อย");
        }
        catch (error) {
            console.error("Error adding table:", error);
            alert("เพิ่มโต๊ะไม่สำเร็จ");
        }
    };

    // --- Handler ลบโต๊ะ ---
    const handleDeleteTable = async (id: number) => {
        if (!confirm("ยืนยันการลบโต๊ะนี้?")) return;
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/delete_table_number/${id}`, {
                method: 'DELETE'
            });
            fetchTables();
        }
        catch (error) {
            console.error("Error deleting table:", error);
        }
    };

    const handleCopyLink = (tableNumber: string) => {
        const url = `${window.location.origin}/${tableNumber}/`;

        navigator.clipboard.writeText(url)
            .then(() => {
                alert(`คัดลอกลิงก์สำเร็จ:\n${url}`);
            })
            .catch(err => {
                console.error('Copy failed', err);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-8">

            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 mt-4">
                <h2 className="text-3xl font-bold text-teal-700 text-center mb-1">⚙️ ตั้งค่าหน้าร้าน</h2>
                <p className="text-center text-gray-500 mb-8">User: {user}</p>

                <form onSubmit={handleSaveRestaurantInfo} className="space-y-6">
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-teal-50">
                        <h3 className="text-xl font-semibold text-teal-800 mb-4">รูปหน้าร้าน</h3>
                        <div className="flex justify-center mb-4">
                            <img src="/banner.png" alt="Banner" className="w-full object-cover border-2 bg-white shadow-md rounded-md" />
                        </div>
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อร้านค้า</label>
                        <input type="text" name="title" value={settings.title} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 text-lg font-bold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                        <textarea name="description" rows={3} value={settings.description} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div className="flex items-center pt-4">
                        <button type="submit" className="py-2 px-6 rounded-md text-white bg-teal-600 hover:bg-teal-700 font-medium shadow-sm transition">บันทึกข้อมูลร้าน</button>
                        {saveMessage && <span className={`ml-3 text-sm font-semibold ${saveMessage.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>{saveMessage}</span>}
                    </div>
                </form>
            </div>

            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-2xl font-bold text-teal-700 mb-6 border-b pb-2">🪑 จัดการโต๊ะอาหาร</h2>

                <div className="flex gap-4 mb-6 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            เพิ่มหมายเลขโต๊ะ / ชื่อโต๊ะ
                        </label>
                        <input
                            type="text"
                            value={newTableNum}
                            onChange={(e) => setNewTableNum(e.target.value)}
                            placeholder="เช่น A1, B5, VIP-1"
                            className="block w-full border text-gray-700 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <button
                        onClick={handleAddTable}
                        className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 font-medium h-[42px]"
                    >
                        + เพิ่มโต๊ะ
                    </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">รายการโต๊ะทั้งหมด ({tables.length})</h3>

                    {tables.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">ยังไม่มีโต๊ะในระบบ</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {tables.map((table) => (
                                <div key={table.ID} className="bg-white p-3 rounded shadow-sm flex justify-between items-center border hover:border-teal-400 transition group">
                                    <span className="font-bold text-gray-800 text-lg">
                                        {table.TABLE_NUMBER}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopyLink(table.TABLE_NUMBER)}
                                            className="text-gray-400 hover:text-blue-500 transition"
                                            title="คัดลอกลิงก์สำหรับลูกค้า"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleDeleteTable(table.ID)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                            title="ลบโต๊ะ"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default SettingsPage;