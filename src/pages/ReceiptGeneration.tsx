import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Check, Home } from 'lucide-react';
import { ShopLayout } from '../components/ShopLayout';
import { BilingualText } from '../components/BilingualText';
import { LargeButton } from '../components/LargeButton';

interface EntitlementData {
  nameEn: string;
  total: number;
  used: number;
  unitEn: string;
  price: number;
}

export function ReceiptGeneration() {
  const navigate = useNavigate();
  const [printing, setPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [entitlements, setEntitlements] = useState<EntitlementData[]>([]);
  const cardNumber = localStorage.getItem('rationCardNumber');

  useEffect(() => {
    const data = localStorage.getItem('currentEntitlements');
    if (data) {
      setEntitlements(JSON.parse(data));
    }
    if (!cardNumber) {
      navigate('/verify');
    }
  }, [cardNumber, navigate]);

  // Calculate items being purchased (everything that is remaining)
  const purchaseItems = entitlements.filter(e => e.total - e.used > 0).map(e => ({
    itemName: e.nameEn,
    quantity: e.total - e.used,
    price: e.price,
    unit: e.unitEn,
    amount: (e.total - e.used) * e.price
  }));

  const totalAmount = purchaseItems.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = async () => {
    setPrinting(true);

    try {
      // POST to backend to record transaction
      const response = await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: cardNumber,
          totalAmount: totalAmount,
          items: purchaseItems.map(item => ({
            itemName: item.itemName,
            quantity: item.quantity,
            amount: item.amount
          }))
        }),
      });

      if (response.ok) {
        // Simulate physical printing delay
        setTimeout(() => {
          setPrinting(false);
          setPrinted(true);
        }, 2000);
      } else {
        alert("Failed to record transaction. Please try again.");
        setPrinting(false);
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert("Error reaching backend server.");
      setPrinting(false);
    }
  };

  return (
    <ShopLayout titleEnglish="Transaction Receipt">
      <div className="flex flex-col lg:flex-row gap-12 h-full pt-4">
        {/* Receipt Preview */}
        <div className="flex-1 bg-white border-4 border-gray-200 shadow-2xl p-8 rounded-xl max-w-2xl mx-auto w-full flex flex-col">
          <div className="text-center border-b-4 border-dashed border-gray-300 pb-8 mb-8">
            <h2 className="text-3xl font-bold uppercase tracking-widest mb-2">
              Ration Receipt
            </h2>
            <p className="mt-4 text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-500">Card: {cardNumber}</p>
          </div>

          <div className="space-y-6 flex-1">
            {purchaseItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-end border-b border-gray-100 pb-4">
                <div>
                  <div className="text-xl font-bold">{item.itemName}</div>
                  <div className="text-gray-500">{item.quantity.toFixed(1)} {item.unit} @ ₹{item.price.toFixed(1)}/{item.unit}</div>
                </div>
                <div className="text-2xl font-bold">₹{item.amount.toFixed(2)}</div>
              </div>
            ))}
            {purchaseItems.length === 0 && (
              <div className="text-center py-8 text-gray-400 italic">
                No items to purchase (All used)
              </div>
            )}
          </div>

          <div className="border-t-4 border-gray-900 pt-6 mt-8">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">TOTAL</div>
              <div className="text-5xl font-bold">₹{totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Thank you for using Public Distribution System</p>
          </div>
        </div>

        {/* Actions */}
        <div className="lg:w-1/3 flex flex-col gap-6 justify-center">
          {!printed ?
            <>
              <div className="bg-yellow-50 p-6 rounded-2xl border-l-8 border-yellow-500 mb-4">
                <BilingualText
                  english="Please review your transaction details before printing."
                  size="lg"
                  className="text-yellow-900" />
              </div>
              <LargeButton
                english={printing ? 'Printing...' : 'Print Receipt'}
                variant="primary"
                disabled={printing || purchaseItems.length === 0}
                icon={
                  <Printer
                    size={48}
                    className={printing ? 'animate-bounce' : ''} />
                }
                onClick={handlePrint}
                className="h-40" />
            </> :
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom duration-500">
              <div className="bg-green-100 p-8 rounded-3xl border-4 border-green-500 text-center">
                <div className="inline-flex p-4 bg-green-500 text-white rounded-full mb-6 shadow-lg">
                  <Check size={64} />
                </div>
                <BilingualText
                  english="Receipt Printed Successfully!"
                  size="xl"
                  className="text-green-900" />
                <p className="mt-4 text-green-800 text-lg">
                  Please collect your receipt from the printer slot below.
                </p>
              </div>

              <LargeButton
                english="Return to Home"
                variant="secondary"
                icon={<Home size={40} />}
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }} />
            </div>
          }
        </div>
      </div>
    </ShopLayout>
  );
}