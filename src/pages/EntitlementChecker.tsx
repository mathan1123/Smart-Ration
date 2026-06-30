import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { ShopLayout } from '../components/ShopLayout';
import { BilingualText } from '../components/BilingualText';
import { LargeButton } from '../components/LargeButton';
import { NumericKeypad } from '../components/NumericKeypad';

interface EntitlementItemProps {
  nameEn: string;
  total: number;
  used: number;
  unitEn: string;
}

function EntitlementItem({
  nameEn,
  total,
  used,
  unitEn,
}: EntitlementItemProps) {
  const remaining = Math.max(0, total - used);

  let statusColor = 'bg-green-500';
  let statusBg = 'bg-green-50 border-green-200';
  let Icon = CheckCircle;
  let iconColor = 'text-green-600';

  if (remaining === 0) {
    statusColor = 'bg-red-500';
    statusBg = 'bg-red-50 border-red-200';
    Icon = XCircle;
    iconColor = 'text-red-600';
  } else if ((remaining / total) < 0.3) {
    statusColor = 'bg-yellow-500';
    statusBg = 'bg-yellow-50 border-yellow-200';
    Icon = AlertTriangle;
    iconColor = 'text-yellow-600';
  }

  return (
    <div className={`p-6 rounded-2xl border-4 ${statusBg} mb-6 shadow-sm`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-full bg-white border-2 ${statusBg.split(' ')[1]}`}>
            <Icon size={40} className={iconColor} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{nameEn}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">
            Remaining
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {remaining.toFixed(1)} <span className="text-xl text-gray-600">{unitEn}</span>
          </div>
        </div>
      </div>

      <div className="relative h-12 bg-white rounded-full border-2 border-gray-300 overflow-hidden">
        <div
          className={`h-full ${statusColor} transition-all duration-1000 ease-out flex items-center justify-end px-4`}
          style={{
            width: `${Math.min(100, (used / total) * 100)}%`
          }}>
          {used > 0 &&
            <span className="text-white font-bold text-lg drop-shadow-md">
              Used: {used.toFixed(1)}
            </span>
          }
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-bold text-gray-900 bg-white/80 px-3 py-1 rounded-md text-lg">
            Total: {total.toFixed(1)} {unitEn}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EntitlementChecker() {
  const navigate = useNavigate();
  const [entitlements, setEntitlements] = useState<EntitlementItemProps[]>([]);
  const [loading, setLoading] = useState(false);

  // Verification State
  const [cardNumber, setCardNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if already logged in / verified
    const storedCard = localStorage.getItem('rationCardNumber');
    if (storedCard) {
      setCardNumber(storedCard);
      setIsVerified(true);
      fetchEntitlements(storedCard);
    }
  }, []);

  const fetchEntitlements = async (cardNo: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/entitlements/${cardNo}`);
      if (response.ok) {
        const data = await response.json();
        setEntitlements(data);
        localStorage.setItem('currentEntitlements', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching entitlements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (cardNumber.length < 12) {
      setCardNumber((prev) => prev + key);
      setError(false);
    }
  };

  const handleDelete = () => {
    setCardNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCardNumber('');
    setError(false);
  };

  const handleVerify = async () => {
    if (cardNumber.length === 12) {
      setLoading(true);
      try {
        const response = await fetch(`/api/ration-cards/${cardNumber}`);
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('rationCardNumber', cardNumber);
          localStorage.setItem('rationCardDetails', JSON.stringify(data));
          setIsVerified(true);
          fetchEntitlements(cardNumber);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error verifying card:', err);
        setError(true);
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  if (!isVerified) {
    return (
      <ShopLayout titleEnglish="Check Entitlements">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start pt-8">
          <div className="flex flex-col gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl border-4 border-gray-200">
              <label className="block mb-4">
                <BilingualText
                  english="Enter Ration Card Number"
                  size="lg" />
              </label>
              <div className={`bg-white text-5xl p-6 rounded-xl border-4 text-center tracking-widest font-mono min-h-[100px] flex items-center justify-center ${error ? 'border-red-500 text-red-600 bg-red-50' : 'border-blue-500 text-black'}`}>
                {cardNumber || <span className="text-gray-300">_ _ _ _ _ _ _ _ _ _ _ _</span>}
              </div>
              {error &&
                <div className="mt-4 flex items-center gap-2 text-red-600">
                  <AlertCircle size={32} />
                  <BilingualText
                    english="Invalid Card Number (Must be 12 digits)"
                    size="sm"
                    variant="inline" />
                </div>
              }
            </div>

            <NumericKeypad
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onClear={handleClear} />

            <LargeButton
              english={loading ? "Verifying..." : "Check Entitlements"}
              onClick={handleVerify}
              fullWidth
              disabled={cardNumber.length === 0 || loading}
              className={cardNumber.length === 0 ? 'opacity-50' : ''} />
          </div>

          <div className="bg-green-50 h-full rounded-3xl border-4 border-green-100 p-8 flex flex-col items-center justify-center text-center opacity-75">
            <div className="p-6 bg-green-100 rounded-full mb-8">
              <ShoppingBag size={80} className="text-green-600" />
            </div>
            <BilingualText
              english="Enter your card number to view your available ration quota for this month."
              size="xl"
              className="text-green-800" />
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout titleEnglish="Your Entitlements">
      <div className="flex flex-col h-full">
        <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 mb-8 flex justify-between items-center">
          <div>
            <BilingualText
              english="Below is the list of available ration for this month."
              size="lg"
              className="text-blue-900" />
            <p className="text-sm text-blue-600 mt-1 font-bold">Card: {cardNumber}</p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              setIsVerified(false);
              setCardNumber('');
              setEntitlements([]);
            }}
            className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 font-bold text-sm"
          >
            Change Card
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            entitlements.map((item, idx) => (
              <EntitlementItem key={idx} {...item} />
            ))
          )}
          {!loading && entitlements.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <p className="text-xl text-gray-500">No entitlements found for this card.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t-4 border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <LargeButton
              english="Back to Home"
              variant="secondary"
              onClick={() => navigate('/')} />

            <LargeButton
              english="Get Receipt"
              variant="primary"
              disabled={loading || entitlements.length === 0}
              icon={<ArrowRight size={32} />}
              onClick={() => navigate('/receipt')} />
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
