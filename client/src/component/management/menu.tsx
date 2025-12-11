import React, { useState, useEffect } from 'react';

interface Category {
    ID: number;
    NAME: string;
}

interface dataMenuItem {
    ID: number;
    NAME: string;
    CATEGORY_ID: number;
    PRICE: number;
    IMAGE_URL: string;
}

const MenuPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menus, setMenus] = useState<dataMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // --- Fetch Data ---
    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            // ดึงหมวดหมู่
            const catRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/get_category`);
            const catData = await catRes.json();

            // ดึงเมนู
            const menuRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/get_menus`);
            const menuData = await menuRes.json()

            setCategories(catData);
            setMenus(menuData);
            setLoading(false);
        }
        catch (error) {
            console.error("Error loading data:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        fetchData();
    }, []);

    // --- Actions: Category ---
    const handleAddCategory = async () => {
        const name = prompt("กรุณากรอกชื่อหมวดหมู่ใหม่:");
        if (name === null) return;

        if (!name) {
            alert("Input is empty")
            return
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/post_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name })
            });

            const data = await res.json();

            alert(data.message);
            window.location.reload();
            return;
        }
        catch (err) {
            console.error("Fetch/JSON Error:", err);
        }

        fetchData();
    };

    // --- Actions: Menu ---
    const handleAddMenu = async (categoryId: number) => {
        const name = prompt("ชื่อเมนูอาหาร:");
        if (name === null) return;

        if (!name) {
            alert("Input is empty")
            return
        };

        const priceStr = prompt("ราคา (บาท):", "0");
        if (priceStr === null) return;

        if (!priceStr) {
            alert("Input is empty")
            return
        };
        const price = parseFloat(priceStr || "0");

        const desc = prompt("คำอธิบายเพิ่มเติม (สามารถเว้นไว้ได้)");
        if (desc === null) return;

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/post_menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category_id: categoryId, name, price, desc })
        });

        const data = await res.json();

        fetchData();
        alert(data.message);
        window.location.reload();
    };

    const handleUpdateCategory = async (id: number) => {
        const name = prompt("กรุณากรอกชื่อหมวดหมู่ใหม่:");
        if (name === null) return;

        if (!name) {
            alert("Input is empty")
            return
        };

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/update_category/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name })
        });

        fetchData();
        window.location.reload();
    };

    const handleUpdateMenu = async (id: number, fileToUpload: File | null) => {

        const name = prompt("ชื่อเมนูอาหารใหม่ (ถ้าไม่เปลี่ยนเว้นไว้): ");
        if (name === null) return;

        const priceStr = prompt("ราคา (บาท)(ถ้าไม่เปลี่ยนเว้นไว้): ");
        if (priceStr === null) return;

        const desc = prompt("คำอธิบายเพิ่มเติม (ถ้าไม่เปลี่ยนเว้นไว้): ");
        if (desc === null) return;

        const formData = new FormData();

        if (name) formData.append('name', name);
        if (priceStr) formData.append('price', priceStr);
        if (desc) formData.append('desc', desc);

        if (fileToUpload) {
            formData.append('image', fileToUpload);
        }

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/update_menu/${id}`, {
                method: 'PUT',
                body: formData
            });

            setSelectedFile(null);
            fetchData();
            window.location.reload();
        }
        catch (error) {
            console.error("Update failed", error);
            alert("Error");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("ยืนยันการลบหมวดหมู่นี้? (เมนูข้างในจะหายหมด)")) return;

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/delete_category/${id}`, {
            method: 'DELETE'
        });

        fetchData();
        window.location.reload();
    };

    const handleDeleteMenu = async (id: number) => {
        if (!confirm("ยืนยันการลบเมนูนี้?")) return;

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/delete_menu/${id}`, {
            method: 'DELETE'
        });

        fetchData();
        window.location.reload();
    };

    if (loading) return <div className="p-10 text-center mt-20 text-gray-700">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-teal-800">จัดการรายการอาหาร</h1>
                    <button
                        onClick={handleAddCategory}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                    >
                        + เพิ่มหมวดหมู่หลัก
                    </button>
                </div>

                {/* Section 1: Categories List (แบบง่าย) */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">📂 รายการหมวดหมู่ทั้งหมด</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-400">ยังไม่มีหมวดหมู่</p>
                    )
                        :
                        (
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <div key={cat.ID} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                                        <span className="font-semibold text-lg text-gray-700">{cat.NAME}</span>
                                        <div className="space-x-2">
                                            {/* ปุ่มแก้ไข (คุณอาจจะทำเพิ่มทีหลัง) */}
                                            <button
                                                onClick={() => handleUpdateCategory(cat.ID)}
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat.ID)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    <button
                        onClick={handleAddCategory}
                        className="mt-6 bg-teal-600 h-10 hover:bg-teal-700 text-white rounded-sm p-4 shadow-xl transition-transform transform hover:scale-105 flex items-center gap-2 z-8"
                    >
                        {/* ไอคอนบวก (+) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-bold text-lg hidden md:inline">เพิ่มหมวดหมู่</span>
                    </button>
                </div>

                {/* Section 2: Menu by Category (แบบ Parent -> Child) */}
                <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">🍽️ เมนูอาหาร (แยกตามหมวดหมู่)</h2>

                    {categories.map(category => {
                        // Filter หาเมนูที่อยู่ในหมวดหมู่นี้
                        console.log("category : ", category)
                        const categoryMenus = menus.filter(m => m.CATEGORY_ID === category.ID);

                        return (
                            <div key={category.ID} className="bg-white rounded-lg shadow overflow-hidden">
                                {/* หัวข้อหมวดหมู่ */}
                                <div className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-teal-800">{category.NAME}</h3>
                                    <span className="text-sm text-gray-500">{categoryMenus.length} รายการ</span>
                                </div>

                                {/* รายการเมนูภายใน */}
                                <div className="p-4">
                                    {categoryMenus.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic mb-4">ยังไม่มีเมนูในหมวดนี้</p>
                                    )
                                        :
                                        (
                                            <ul className="divide-y divide-gray-100 mb-4">
                                                {categoryMenus.map(menu => (
                                                    <li key={menu.ID} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                                                        <div className='mr-2 md:mr-0'>
                                                            <img src={menu.IMAGE_URL} className='w-[150px] md:w-[300px] md:h-[300px]' alt="" />
                                                            <span className="font-medium text-gray-800">{menu.NAME}</span>
                                                            <span className="ml-4 text-teal-600 font-bold">{menu.PRICE} ฿</span>
                                                        </div>
                                                        <div className="space-x-3 text-sm">
                                                            <div className="space-x-3 text-sm">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                                                                        เปลี่ยนรูปภาพ (*.png, *.jpeg)
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        // เมื่อเลือกไฟล์ ให้เก็บลง State กลาง (selectedFile)
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

                                                                <div className='w-full text-center gap-6 mt-4 flex pl-1'>
                                                                    <button
                                                                        onClick={() => {
                                                                            // ส่ง selectedFile (State) เข้าไปในฟังก์ชัน
                                                                            handleUpdateMenu(menu.ID, selectedFile);
                                                                        }}
                                                                        className="text-gray-400 hover:text-blue-600"
                                                                    >
                                                                        แก้ไข
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleDeleteMenu(menu.ID)}
                                                                        className="text-gray-400 hover:text-red-600"
                                                                    >
                                                                        ลบ
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    {/* ปุ่มเพิ่มเมนูเฉพาะหมวดหมู่นี้ */}
                                    <button
                                        onClick={() => handleAddMenu(category.ID)}
                                        className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-teal-500 hover:text-teal-600 transition"
                                    >
                                        + เพิ่มเมนูใน "{category.NAME}"
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default MenuPage;