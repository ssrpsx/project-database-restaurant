import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// เปลี่ยนตรงนี้เป็น URL ของ Backend มึงนะ (เช็ค Port ด้วย)

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

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<StoreSettings>({
        title: '',
        description: '',
    });
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [user, setUser] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveMessage("กำลังบันทึก...");

        const formData = new FormData();
        formData.append("storeTitle", settings.title);
        formData.append("storeDescription", settings.description);

        if (selectedFile) {
            formData.append("banner", selectedFile); // 👈 ชื่อ input ต้องตรงกับ backend
        }
        
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/settings/save`,
                {
                    method: "POST",
                    body: formData, // ❗ ห้าม set headers manually
                }
            );
            
            if (!response.ok) throw new Error("เกิดข้อผิดพลาด");
            
            setSaveMessage("✅ บันทึกสำเร็จ");
        }
        catch (err) {
            console.error(err);
            setSaveMessage("❌ ไม่สามารถบันทึกข้อมูลได้" + err);
        }
        finally {
            setTimeout(() => window.location.reload(), 1200);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 mt-4">
                <h2 className="text-3xl font-bold text-teal-700 text-center mb-1">
                    ⚙️ ตั้งค่าหน้าร้าน
                </h2>
                <p className="text-center text-gray-500 mb-8">จัดการข้อมูลร้านค้าของคุณ: {user}</p>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* ส่วนแสดงผลและอัปโหลดรูป */}
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-teal-50">
                        <h3 className="text-xl font-semibold text-teal-800 mb-4">รูปหน้าร้าน (Banner)</h3>

                        <div className="flex justify-center mb-4">
                            <img
                                src="/banner.png"
                                alt="Store Banner"
                                className="w-full object-cover border-2 border-gray-200 bg-white shadow-md rounded-md"
                            />
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            เปลี่ยนรูปภาพ (*.png, *.jpeg)
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            accept="image/png, image/jpeg"
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-teal-100 file:text-teal-700
                                hover:file:bg-teal-200 cursor-pointer"
                        />
                    </div>

                    {/* Input: ชื่อร้าน */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            ชื่อร้านค้า
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={settings.title}
                            onChange={handleTextChange}
                            className="mt-1 block w-full border text-gray-700 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 text-lg font-bold"
                            placeholder="ใส่ชื่อร้านของคุณ"
                        />
                    </div>

                    {/* Input: คำอธิบาย */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            คำอธิบายร้านค้า
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            value={settings.description}
                            onChange={handleTextChange}
                            className="mt-1 block w-full border text-gray-700 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="คำอธิบายเพิ่มเติม"
                        />
                    </div>

                    {/* ปุ่มบันทึก */}
                    <div className="flex items-center pt-4">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 w-full sm:w-auto"
                        >
                            บันทึกข้อมูล
                        </button>
                        {saveMessage && (
                            <span className={`ml-3 text-sm font-semibold ${saveMessage.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
                                {saveMessage}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;