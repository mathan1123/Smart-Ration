import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { ShopLayout } from '../components/ShopLayout';
import { NumericKeypad } from '../components/NumericKeypad';
import { BilingualText } from '../components/BilingualText';
import { LargeButton } from '../components/LargeButton';
import { config } from '../config';
export function CardVerification() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
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
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/ration-cards/${cardNumber}`);
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('rationCardNumber', cardNumber);
          localStorage.setItem('rationCardDetails', JSON.stringify(data));
          setCardNumber(cardNumber); // Ensure state is synced
          setIsVerified(true);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error verifying card:', err);
        setError(true);
      }
    } else {
      setError(true);
    }
  };
  return (
    <ShopLayout
      titleEnglish="Customer Verification">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start pt-8">
        {/* Left Column: Input */}
        <div className="flex flex-col gap-8">
          <div className="bg-gray-50 p-8 rounded-3xl border-4 border-gray-200">
            <label className="block mb-4">
              <BilingualText
                english="Enter Ration Card Number"
                size="lg" />

            </label>
            <div
              className={`
              bg-white text-5xl p-6 rounded-xl border-4 text-center tracking-widest font-mono min-h-[100px] flex items-center justify-center
              ${error ? 'border-red-500 text-red-600 bg-red-50' : 'border-blue-500 text-black'}
            `}>

              {cardNumber ||
                <span className="text-gray-300">_ _ _ _ _ _ _ _ _ _ _ _</span>
              }
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

          {!isVerified &&
            <NumericKeypad
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onClear={handleClear} />

          }

          {!isVerified &&
            <LargeButton
              english="Verify Card"
              onClick={handleVerify}
              fullWidth
              disabled={cardNumber.length === 0}
              className={cardNumber.length === 0 ? 'opacity-50' : ''} />

          }
        </div>

        {/* Right Column: Result or Instructions */}
        <div className="h-full">
          {!isVerified ?
            <div className="bg-blue-50 h-full rounded-3xl border-4 border-blue-100 p-8 flex flex-col items-center justify-center text-center opacity-75">
              <UserCheck size={120} className="text-blue-300 mb-8" />
              <BilingualText
                english="Please enter your 12-digit ration card number to proceed."
                size="xl"
                className="text-blue-800" />

            </div> :

            <div className="bg-green-50 h-full rounded-3xl border-4 border-green-200 p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-green-700 border-b-4 border-green-200 pb-4">
                <UserCheck size={48} />
                <BilingualText
                  english="Verification Successful"
                  size="lg"
                  variant="inline" />

              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="w-48 h-48 bg-gray-200 rounded-full border-8 border-white shadow-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300"
                    alt="Customer"
                    className="w-full h-full object-cover" />

                </div>

                <div className="text-center w-full bg-white p-6 rounded-xl border-2 border-green-100 shadow-sm">
                  <BilingualText
                    english="Name"
                    size="sm"
                    className="text-gray-500 mb-1" />

                  <BilingualText
                    english={JSON.parse(localStorage.getItem('rationCardDetails') || '{}').holderName || "Verified User"}
                    size="xl" />

                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white p-4 rounded-xl border-2 border-green-100 text-center">
                    <BilingualText
                      english="Family Members"
                      size="sm"
                      className="text-gray-500 mb-1" />

                    <span className="text-3xl font-bold">{JSON.parse(localStorage.getItem('rationCardDetails') || '{}').familyMembers || "4"}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-green-100 text-center">
                    <BilingualText
                      english="Card Type"
                      size="sm"
                      className="text-gray-500 mb-1" />

                    <BilingualText english={JSON.parse(localStorage.getItem('rationCardDetails') || '{}').cardType || "PHH"} size="lg" />
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <LargeButton
                  english="Proceed to Entitlements"
                  variant="success"
                  fullWidth
                  icon={<ArrowRight size={32} />}
                  onClick={() => navigate('/entitlements')} />

              </div>
            </div>
          }
        </div>
      </div>
    </ShopLayout>);

}
