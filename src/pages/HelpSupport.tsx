import { ShopLayout } from '../components/ShopLayout';
import { CreditCard, ShoppingBag, Database, Phone } from 'lucide-react';
import { BilingualText } from '../components/BilingualText';

export function HelpSupport() {
    return (
        <ShopLayout titleEnglish="Help & Support" showBack={true}>
            <div className="max-w-5xl mx-auto space-y-8 pb-12">

                {/* Contact Support */}
                <div className="bg-yellow-50 p-6 rounded-3xl border-4 border-yellow-200 flex items-center gap-6">
                    <div className="p-4 bg-yellow-500 text-white rounded-full shadow-lg">
                        <Phone size={48} />
                    </div>
                    <div>
                        <BilingualText
                            english="Need Assistance?"
                            size="xl"
                            className="text-yellow-900 font-black"
                        />
                        <p className="text-xl text-yellow-800 mt-2">
                            Call our Helpline: <span className="font-bold text-2xl">1800-425-5901</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Guide 1 */}
                    <div className="bg-white p-6 rounded-3xl border-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Verify Card</h3>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Use this option to check if your ration card is active. You will need to enter your
                            <span className="font-bold text-gray-800"> 12-digit Ration Card Number</span>.
                        </p>
                    </div>

                    {/* Guide 2 */}
                    <div className="bg-white p-6 rounded-3xl border-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Check Entitlement</h3>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            See what items you can buy this month. Shows total quota and how much you have already purchased.
                        </p>
                    </div>

                    {/* Guide 3 */}
                    <div className="bg-white p-6 rounded-3xl border-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Database size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Check Stock</h3>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            View currently available stock in this shop and the price per unit for each item.
                        </p>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
