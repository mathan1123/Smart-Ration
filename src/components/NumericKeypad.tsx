import React from 'react';
import { Delete } from 'lucide-react';
interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}
export function NumericKeypad({
  onKeyPress,
  onDelete,
  onClear
}: NumericKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
      {keys.map((key) =>
      <button
        key={key}
        onClick={() => onKeyPress(key)}
        className="h-24 text-5xl font-bold bg-white border-4 border-gray-300 rounded-xl shadow-sm hover:bg-blue-50 hover:border-blue-500 active:bg-blue-100 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500">

          {key}
        </button>
      )}

      <button
        onClick={onClear}
        className="h-24 text-2xl font-bold bg-red-100 border-4 border-red-300 text-red-800 rounded-xl hover:bg-red-200">

        CLEAR
        <div className="text-lg">साफ़ करें</div>
      </button>

      <button
        onClick={() => onKeyPress('0')}
        className="h-24 text-5xl font-bold bg-white border-4 border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-500">

        0
      </button>

      <button
        onClick={onDelete}
        className="h-24 flex flex-col items-center justify-center bg-yellow-100 border-4 border-yellow-300 text-yellow-900 rounded-xl hover:bg-yellow-200">

        <Delete size={32} />
        <span className="text-sm font-bold">DELETE</span>
      </button>
    </div>);

}