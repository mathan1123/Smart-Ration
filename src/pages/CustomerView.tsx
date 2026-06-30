import { useState, useEffect } from 'react';
import { ShopLayout } from '../components/ShopLayout';
import { ShoppingBag, Clock, Database, RefreshCw } from 'lucide-react';


interface Item {
    id: number;
    name: string;
    unit: string;
    pricePerUnit: number;
    stock: number;
}

interface Transaction {
    id: number;
    rationCard: {
        holderName: string;
        cardNumber: string;
    };
    transactionDate: string;
    totalAmount: number;
    items: {
        itemName: string;
        quantity: number;
        amount: number;
    }[];
}

export function CustomerView() {
    const [items, setItems] = useState<Item[]>([]);
    const [shopStatus, setShopStatus] = useState({ onLeave: false, todayMessage: '' });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const fetchData = async () => {
        try {
            const [itemsResp, statusResp, transResp] = await Promise.all([
                fetch('/api/items'),
                fetch('/api/shop-status'),
                fetch('/api/transactions')
            ]);

            if (itemsResp.ok) setItems(await itemsResp.json());
            if (statusResp.ok) {
                const statusData = await statusResp.json();
                setShopStatus({
                    onLeave: statusData.onLeave,
                    todayMessage: statusData.todayMessage || ''
                });
            }
            if (transResp.ok) {
                const transData = await transResp.json();
                setTransactions(transData.sort((a: any, b: any) =>
                    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
                ).slice(0, 5)); // Only show last 5 transactions
            }
            setLastUpdate(new Date());
        } catch (err) {
            console.error("Failed to fetch data for customer view", err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <ShopLayout titleEnglish="Customer Information Display" showBack={false}>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">

                {/* Shop Status Banner */}
                <div className={`p-8 rounded-3xl border-4 shadow-lg text-center ${shopStatus.onLeave ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                    <div className="flex flex-col items-center gap-2">
                        <Clock size={48} className={shopStatus.onLeave ? 'text-red-600' : 'text-green-600'} />
                        <h2 className={`text-4xl font-black ${shopStatus.onLeave ? 'text-red-700' : 'text-green-700'}`}>
                            {shopStatus.onLeave ? 'SHOP IS CLOSED TODAY' : 'SHOP IS OPEN'}
                        </h2>
                        {shopStatus.todayMessage && (
                            <p className="text-2xl font-bold mt-4 italic text-gray-700">
                                📢 {shopStatus.todayMessage}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Live Stock & Prices */}
                    <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                                <Database size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Available Stock & Rates</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                                        <div className="text-4xl font-black text-blue-600 mt-2">
                                            ₹{item.pricePerUnit.toFixed(2)} <span className="text-lg font-normal text-gray-500">per {item.unit}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">In Stock</div>
                                        <div className="text-3xl font-black text-gray-800">
                                            {item.stock.toFixed(1)} <span className="text-lg font-normal text-gray-500">{item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                                <ShoppingBag size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Recent Deliveries</h2>
                        </div>

                        <div className="space-y-4">
                            {transactions.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 italic">Waiting for transactions...</div>
                            ) : (
                                transactions.map(tx => (
                                    <div key={tx.id} className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-100 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-900">{tx.rationCard?.holderName}</div>
                                            <div className="text-sm text-gray-500">{new Date(tx.transactionDate).toLocaleTimeString()}</div>
                                        </div>
                                        <div className="text-xl font-black text-purple-900">₹{tx.totalAmount.toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-gray-400">
                            <div className="flex items-center gap-2">
                                <RefreshCw size={16} className="animate-spin-slow" />
                                <span className="text-sm font-medium">Auto-updating live...</span>
                            </div>
                            <span className="text-xs font-mono">Last updated: {lastUpdate.toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
