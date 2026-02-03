import React, { useState, useEffect } from 'react';
import { ShopLayout } from '../components/ShopLayout';
import { Users, RefreshCw, Clock, Lock, LogOut, Database, Trash2, ShoppingBag, ExternalLink } from 'lucide-react';

interface RationCard {
    id: number;
    cardNumber: string;
    holderName: string;
    cardType: string;
    familyMembers: number;
}

interface Item {
    id: number;
    name: string;
    unit: string;
    pricePerUnit: number;
    stock: number;
}

interface Transaction {
    id: number;
    rationCard: RationCard;
    transactionDate: string;
    totalAmount: number;
    items: {
        itemName: string;
        quantity: number;
        amount: number;
    }[];
}

export function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('adminAuth') === 'true');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [isOnLeave, setIsOnLeave] = useState(false);
    const [todayMessage, setTodayMessage] = useState('');
    const [rationCards, setRationCards] = useState<RationCard[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchShopStatus();
            fetchRationCards();
            fetchItems();
            fetchTransactions();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginUsername === 'admin' && loginPassword === 'admin123') {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
            setLoginError('');
        } else {
            setLoginError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
    };

    const fetchShopStatus = async () => {
        try {
            const resp = await fetch('http://localhost:8080/api/shop-status');
            const data = await resp.json();
            setIsOnLeave(data.onLeave);
            setTodayMessage(data.todayMessage || '');
        } catch (err) {
            console.error("Failed to fetch shop status", err);
        }
    };

    const fetchRationCards = async () => {
        try {
            const resp = await fetch('http://localhost:8080/api/ration-cards');
            const data = await resp.json();
            setRationCards(data);
        } catch (err) {
            console.error("Failed to fetch ration cards", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const resp = await fetch('http://localhost:8080/api/items');
            const data = await resp.json();
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch items", err);
        }
    };

    const fetchTransactions = async () => {
        try {
            const resp = await fetch('http://localhost:8080/api/transactions');
            const data = await resp.json();
            // Sort by date descending
            setTransactions(data.sort((a: any, b: any) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()));
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    const deleteCard = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        try {
            const resp = await fetch(`http://localhost:8080/api/ration-cards/${id}`, { method: 'DELETE' });
            if (resp.ok) {
                fetchRationCards();
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    const updateItemStock = async (id: number, currentStock: number) => {
        const newStock = window.prompt("Enter new stock quantity:", currentStock.toString());
        if (newStock === null) return;

        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
            const resp = await fetch(`http://localhost:8080/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, stock: parseFloat(newStock) })
            });
            if (resp.ok) {
                fetchItems();
            }
        } catch (err) {
            alert("Update failed");
        }
    };

    const updateItemPrice = async (id: number, currentPrice: number) => {
        const newPrice = window.prompt("Enter new price per unit:", currentPrice.toString());
        if (newPrice === null) return;

        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
            const resp = await fetch(`http://localhost:8080/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, pricePerUnit: parseFloat(newPrice) })
            });
            if (resp.ok) {
                fetchItems();
            }
        } catch (err) {
            alert("Update failed");
        }
    };

    const addCard = async () => {
        const cardNumber = window.prompt("Enter 12-digit Card Number:");
        if (!cardNumber) return;
        const holderName = window.prompt("Enter Holder Name:");
        if (!holderName) return;
        const cardType = window.prompt("Enter Card Type (PHP/AAY):", "PHH");
        if (!cardType) return;
        const members = window.prompt("Enter Number of Family Members:", "1");
        if (!members) return;

        try {
            const resp = await fetch('http://localhost:8080/api/ration-cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardNumber,
                    holderName,
                    cardType,
                    familyMembers: parseInt(members)
                })
            });
            if (resp.ok) {
                fetchRationCards();
            }
        } catch (err) {
            alert("Add failed");
        }
    };

    const saveSchedule = async () => {

        try {
            const resp = await fetch('http://localhost:8080/api/shop-status/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    onLeave: isOnLeave,
                    todayMessage
                })
            });
            if (resp.ok) {
                alert("Settings updated successfully!");
                fetchShopStatus();
            } else {
                const errorData = await resp.text();
                alert("Failed to update: " + resp.status + " " + errorData);
            }
        } catch (err: any) {
            alert("Failed to update (Network Error): " + err.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <ShopLayout titleEnglish="Admin Login" showBack={true}>
                <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border-4 border-gray-100 shadow-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                            <Lock size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Admin Authentication</h2>
                        <p className="text-gray-500 mt-2 text-center">Please enter your credentials to access the dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Username</label>
                            <input
                                type="text"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-lg focus:border-blue-500 focus:ring-0 transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Password</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-lg focus:border-blue-500 focus:ring-0 transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {loginError && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-center border-2 border-red-100 italic">
                                ❌ {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Login to Dashboard
                        </button>
                    </form>
                </div>
            </ShopLayout>
        );
    }

    return (
        <ShopLayout titleEnglish="Admin Dashboard" showBack={true}>
            <div className="max-w-6xl mx-auto p-8 space-y-8 pb-32">

                {/* Dashboard Header Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={() => window.open('/customer', '_blank', 'width=1200,height=800')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors border-2 border-blue-100"
                    >
                        <ExternalLink size={20} />
                        Launch Customer Display
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border-2 border-red-100"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

                {/* Stock Management Section */}
                <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-full bg-green-100 text-green-600">
                                <Database size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Stock & Price Management</h2>
                        </div>
                        <button onClick={fetchItems} className="p-3 text-green-600 hover:bg-green-50 rounded-xl">
                            <RefreshCw size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">{item.unit}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">₹{(item.pricePerUnit || 0).toFixed(2)}</div>
                                        <div className="text-sm text-gray-500 font-bold">Price / Unit</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 mb-4 shadow-sm">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase">Available Stock</div>
                                        <div className="text-3xl font-black text-gray-800">{(item.stock || 0).toFixed(1)} <span className="text-sm font-normal text-gray-500">{item.unit}</span></div>
                                    </div>
                                    <button
                                        onClick={() => updateItemStock(item.id, item.stock)}
                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors"
                                    >
                                        Update Stock
                                    </button>
                                </div>

                                <button
                                    onClick={() => updateItemPrice(item.id, item.pricePerUnit)}
                                    className="w-full py-2 border-2 border-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                                >
                                    Modify Price
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Status Section */}
                <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 rounded-full bg-orange-100 text-orange-600">
                            <Clock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Daily Status & Leave</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-orange-50 rounded-2xl border-2 border-orange-100">
                            <div>
                                <h3 className="text-xl font-bold text-orange-900">Today is Leave (Holiday)</h3>
                                <p className="text-orange-700">Checking this will show a "Closed Today" banner on Home page</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={isOnLeave}
                                onChange={(e) => setIsOnLeave(e.target.checked)}
                                className="w-12 h-12 rounded-xl text-orange-600 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Today's Daily Message / Special Timing</label>
                            <input
                                type="text"
                                value={todayMessage}
                                onChange={(e) => setTodayMessage(e.target.value)}
                                placeholder="e.g. Open until 1 PM only today"
                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-lg focus:border-orange-500 focus:ring-0 transition-colors"
                            />
                        </div>

                        <button
                            onClick={saveSchedule}
                            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-xl hover:bg-orange-700 active:scale-95 transition-all shadow-lg"
                        >
                            Update Daily Status
                        </button>
                    </div>
                </div>


                {/* Data Management Section */}
                <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                                <Users size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Ration Card Management</h2>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={addCard}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
                            >
                                + Add New Card
                            </button>
                            <button
                                onClick={fetchRationCards}
                                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                                <RefreshCw size={24} />
                            </button>
                        </div>

                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-50 uppercase text-xs font-bold text-gray-400 tracking-wider">
                                    <th className="px-6 py-4">Card Number</th>
                                    <th className="px-6 py-4">Holder Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Members</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading card data...</td>
                                    </tr>
                                ) : rationCards.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No records found</td>
                                    </tr>
                                ) : (
                                    rationCards.map(card => (
                                        <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium">{card.cardNumber}</td>
                                            <td className="px-6 py-4 font-bold text-gray-700">{card.holderName}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                                                    {card.cardType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{card.familyMembers}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => deleteCard(card.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Card"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customer Activity Section */}
                <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                                <ShoppingBag size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Recent Customer Activity</h2>
                        </div>
                        <button onClick={fetchTransactions} className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl">
                            <RefreshCw size={24} />
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                        {transactions.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 italic">No customer activity recorded yet</div>
                        ) : (
                            transactions.map(tx => (
                                <div key={tx.id} className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-100 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-bold">
                                                ID: #{tx.id}
                                            </span>
                                            <span className="text-gray-500 font-medium">
                                                {new Date(tx.transactionDate).toLocaleString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {tx.rationCard?.holderName} <span className="text-sm font-normal text-gray-500">({tx.rationCard?.cardNumber})</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {tx.items?.map((item: any, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm font-medium text-purple-700">
                                                    {item.item?.name}: {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-center">
                                        <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Total Amount</div>
                                        <div className="text-3xl font-black text-purple-900">₹{tx.totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </ShopLayout>
    );
}

