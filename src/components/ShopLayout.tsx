import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, HelpCircle } from 'lucide-react';
import { BilingualText } from './BilingualText';
interface ShopLayoutProps {
  children: React.ReactNode;
  titleEnglish: string;
  showBack?: boolean;
}
export function ShopLayout({
  children,
  titleEnglish,
  showBack = true
}: ShopLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* High Contrast Header */}
      <header className="bg-black text-white p-6 shadow-xl border-b-8 border-[#FFD700]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {showBack && !isHome &&
              <button
                onClick={() => navigate(-1)}
                className="bg-[#FFD700] text-black p-4 rounded-xl hover:bg-[#FDB931] transition-colors border-4 border-white"
                aria-label="Go Back">

                <ArrowLeft size={48} />
              </button>
            }
            <div>
              <h1 className="text-4xl font-bold tracking-wider text-[#FFD700]">
                {titleEnglish}
              </h1>
            </div>
          </div>

          <div className="flex gap-4">
            {!isHome &&
              <button
                onClick={() => navigate('/')}
                className="flex flex-col items-center bg-[#0066CC] p-4 rounded-xl border-4 border-white hover:bg-[#0052A3]">

                <Home size={40} />
                <span className="text-lg font-bold mt-1">HOME</span>
              </button>
            }
            <button className="flex flex-col items-center bg-[#008000] p-4 rounded-xl border-4 border-white hover:bg-[#006400]">
              <HelpCircle size={40} />
              <span className="text-lg font-bold mt-1">HELP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full flex flex-col">{children}</div>
      </main>

      {/* Footer with Status */}
      <footer className="bg-gray-100 p-6 border-t-4 border-gray-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-600">
          <BilingualText
            english="System Online"
            size="sm"
            variant="inline"
            className="opacity-75" />

          <div className="flex gap-8 text-xl font-bold">
            <span>ID: Shope-01</span>
            <span>
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </footer>
    </div>);

}