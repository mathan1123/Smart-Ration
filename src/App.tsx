
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopHome } from './pages/ShopHome';
import { CardVerification } from './pages/CardVerification';
import { EntitlementChecker } from './pages/EntitlementChecker';
import { ReceiptGeneration } from './pages/ReceiptGeneration';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerView } from './pages/CustomerView';
import { StockAvailability } from './pages/StockAvailability';
import { HelpSupport } from './pages/HelpSupport';
export function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<ShopHome />} />
      <Route path="/verify" element={<CardVerification />} />
      <Route path="/entitlements" element={<EntitlementChecker />} />
      <Route path="/receipt" element={<ReceiptGeneration />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/customer" element={<CustomerView />} />
      <Route path="/stock" element={<StockAvailability />} />
      <Route path="/help" element={<HelpSupport />} />
    </Routes>
  </BrowserRouter>;
}