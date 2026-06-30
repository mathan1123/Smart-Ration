import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShoppingBag, Receipt, HelpCircle, Settings, Database } from 'lucide-react';
import { ShopLayout } from '../components/ShopLayout';
import { VoiceGuidanceButton } from '../components/VoiceGuidanceButton';
import { BilingualText } from '../components/BilingualText';
export function ShopHome() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({ days: '', hours: '', onLeave: false, message: '' });

  useEffect(() => {
    fetch('/api/shop-status')
      .then(res => res.json())
      .then(data => {
        setSchedule({
          days: data.workingDays,
          hours: data.workingHours,
          onLeave: data.onLeave,
          message: data.todayMessage
        });
      })
      .catch(console.error);
  }, []);
  return (
    <ShopLayout
      titleEnglish="Welcome to Ration Shope"
      showBack={false}>

      <div className="flex flex-col items-center justify-center h-full gap-8 py-8">
        {schedule.onLeave && (
          <div className="w-full max-w-4xl bg-red-100 border-4 border-red-500 p-8 rounded-3xl text-center mb-8">
            <BilingualText
              english="SHOP IS CLOSED TODAY"
              size="xl"
              className="text-red-700 font-black"
            />
            <p className="text-xl font-bold text-red-600 mt-2">Today is a Holiday/Leave. Please visit us next working day.</p>
          </div>
        )}

        <div className="text-center mb-8 bg-blue-50 p-8 rounded-3xl border-4 border-blue-100 w-full max-w-4xl">
          <BilingualText
            english={schedule.onLeave ? "Services are currently unavailable" : "Please select an option below"}
            size="xl"
            className="items-center text-blue-900" />

          {schedule.message && (
            <div className="mt-2 text-blue-700 font-bold text-xl italic bg-blue-100/50 py-2 rounded-xl">
              📢 {schedule.message}
            </div>
          )}

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          <VoiceGuidanceButton
            english="Verify Card"
            icon={<CreditCard size={64} />}
            onClick={() => navigate('/verify')}
            className={`h-64 text-3xl ${schedule.onLeave ? 'opacity-50 pointer-events-none' : ''}`} />

          <VoiceGuidanceButton
            english="Check Entitlement"
            icon={<ShoppingBag size={64} />}
            variant="success"
            onClick={() => navigate('/entitlements')}
            className="h-64 text-3xl" />

          <VoiceGuidanceButton
            english="Generate Receipt"
            icon={<Receipt size={64} />}
            variant="warning"
            onClick={() => navigate('/receipt')}
            className={`h-64 text-3xl ${schedule.onLeave ? 'opacity-50 pointer-events-none' : ''}`} />

          <VoiceGuidanceButton
            english="Check Stock"
            icon={<Database size={64} />}
            variant="primary"
            onClick={() => navigate('/stock')}
            className="h-64 text-3xl" />

          <VoiceGuidanceButton
            english="Admin Dashboard"
            icon={<Settings size={64} />}
            variant="secondary"
            onClick={() => navigate('/admin')}
            className="h-64 text-3xl" />

          <VoiceGuidanceButton
            english="Help & Support"
            icon={<HelpCircle size={64} />}
            variant="secondary"
            onClick={() => navigate('/help')}
            className="h-64 text-3xl" />
        </div>
      </div>
    </ShopLayout>);
}
