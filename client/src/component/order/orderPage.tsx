import React, { useState, useEffect } from 'react';

interface KitchenItem {
    item_id: number;
    name: string;
    quantity: number;
    image: string;
}

interface KitchenOrder {
    id: number;
    table_number: string;
    status: 'pending' | 'preparing' | 'served' | 'paid';
    created_at: string;
    items: KitchenItem[];
}

const KitchenPage: React.FC = () => {
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/get_kitchen_orders`);
            const data = await res.json();
            setOrders(data);
            setLoading(false);
        } 
        catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNextStatus = async (orderId: number, currentStatus: string) => {
        let nextStatus = '';
        switch (currentStatus) {
            case 'pending': nextStatus = 'preparing'; break;
            case 'preparing': nextStatus = 'served'; break;
            case 'served': nextStatus = 'paid'; break;
            default: return;
        }

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/update_status/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (nextStatus === 'paid') {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus as any } : o));
            }
        } catch (error) {
            alert("Update failed");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'border-l-8 border-red-500 bg-red-50';
            case 'preparing': return 'border-l-8 border-orange-400 bg-orange-50';
            case 'served': return 'border-l-8 border-green-500 bg-green-50';
            default: return 'bg-white';
        }
    };

    const getButtonConfig = (status: string) => {
        switch (status) {
            case 'pending': return { text: '👨‍🍳 รับออเดอร์ / เริ่มทำ', color: 'bg-red-600 hover:bg-red-700' };
            case 'preparing': return { text: '✅ อาหารเสร็จ / เสิร์ฟ', color: 'bg-orange-500 hover:bg-orange-600' };
            case 'served': return { text: '💰 แจ้งชำระเงิน', color: 'bg-green-600 hover:bg-green-700' };
            default: return { text: 'Error', color: 'bg-gray-400' };
        }
    };

    if (loading) return <div className="p-10 text-center text-2xl font-bold animate-pulse text-white">Loading Orders...</div>;

    return (
        <div className="min-h-screen pt-20 bg-gray-900 p-6">
            <header className="flex justify-between items-center mb-8 text-white">
                    <span className="text-sm font-normal bg-gray-700 px-3 py-1 rounded-full">
                        {orders.length} ออเดอร์
                    </span>
                <div className="text-sm text-gray-400 animate-pulse">● Live Updating</div>
            </header>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                    <p className="text-2xl">ครัวว่างครับเชฟ! 👨‍🍳</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orders.map((order) => {
                        const btnConfig = getButtonConfig(order.status);
                        return (
                            <div key={order.id} className={`rounded-lg shadow-xl overflow-hidden flex flex-col  text-gray-800 ${getStatusColor(order.status)} transition-all duration-300`}>
                                
                                <div className="p-4 border-b border-black/5 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800">โต๊ะ {order.table_number}</h2>
                                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {order.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-white/50 border border-gray-200">
                                            {order.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-3 flex-1 bg-white/60">
                                    <ul className="space-y-3">
                                        {order.items.map((item) => (
                                            <li key={item.item_id} className="flex items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                                                
                                                <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-200 mr-3">
                                                    <img 
                                                        src={item.image ? `${item.image}` : '/image.png'} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => e.currentTarget.src = "https://placehold.co/100"}
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <span className="font-bold text-gray-800 block text-lg leading-tight">
                                                        {item.name}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg ml-2">
                                                    {item.quantity}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-3 bg-white/80 mt-auto">
                                    <button
                                        onClick={() => handleNextStatus(order.id, order.status)}
                                        className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transform active:scale-95 transition-transform flex items-center justify-center gap-2 ${btnConfig.color}`}
                                    >
                                        {btnConfig.text}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default KitchenPage;