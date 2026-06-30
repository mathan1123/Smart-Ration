import { useState, useEffect } from 'react';
import { ShopLayout } from '../components/ShopLayout';
import { Database, Search } from 'lucide-react';
import { BilingualText } from '../components/BilingualText';

interface Item {
    id: number;
    name: string;
    unit: string;
    pricePerUnit: number;
    stock: number;
}

export function StockAvailability() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/items')
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch items", err);
                setLoading(false);
            });
    }, []);

    return (
        <ShopLayout titleEnglish="Check Stock Availability" showBack={true}>
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-100 flex items-center gap-6">
                    <div className="p-4 bg-blue-500 text-white rounded-full shadow-lg">
                        <Search size={48} />
                    </div>
                    <div>
                        <BilingualText
                            english="Current Stock Status"
                            size="xl"
                            className="text-blue-900 font-black"
                        />
                        <p className="text-xl text-blue-700 mt-2">
                            Check availability of ration items below
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-2 text-center py-20 text-gray-400 text-2xl font-bold animate-pulse">
                            Loading stock details...
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-3xl border-4 border-gray-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-colors">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                            <Database size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
                                    </div>
                                    <div className="text-lg font-medium text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-lg">
                                        Price: <span className="text-gray-900 font-bold">₹{item.pricePerUnit.toFixed(2)}</span> / {item.unit}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Available</div>
                                    <div className={`text-4xl font-black ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {item.stock.toFixed(1)}
                                    </div>
                                    <div className="text-sm font-bold text-gray-400 uppercase">{item.unit}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && items.length === 0 && (
                    <div className="text-center py-20 text-gray-400 text-2xl font-bold">
                        No items found in the system.
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
