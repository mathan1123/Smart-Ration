import React from 'react';
import { BilingualText } from './BilingualText';
interface LargeButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  english: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  fullWidth?: boolean;
}
export function LargeButton({
  english,
  icon,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: LargeButtonProps) {
  const baseStyles =
    'relative flex items-center justify-center gap-6 p-8 rounded-2xl transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-4 border-4 shadow-lg min-h-[120px]';
  const variants = {
    primary:
      'bg-[#0066CC] border-[#004C99] text-white hover:bg-[#0052A3] focus:ring-[#0066CC]',
    secondary:
      'bg-white border-gray-800 text-black hover:bg-gray-50 focus:ring-gray-800',
    success:
      'bg-[#008000] border-[#006400] text-white hover:bg-[#006400] focus:ring-[#008000]',
    warning:
      'bg-[#FFD700] border-[#B8860B] text-black hover:bg-[#FDB931] focus:ring-[#FFD700]',
    danger:
      'bg-[#CC0000] border-[#990000] text-white hover:bg-[#990000] focus:ring-[#CC0000]'
  };
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}>

      {icon && <div className="flex-shrink-0">{icon}</div>}
      <BilingualText
        english={english}
        inverse={
          variant === 'primary' || variant === 'success' || variant === 'danger'
        }
        size="lg" />

    </button>);

}