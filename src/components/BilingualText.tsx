
interface BilingualTextProps {
  english: string;
  variant?: 'stacked' | 'inline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverse?: boolean;
}
export function BilingualText({
  english,
  variant = 'stacked',
  size = 'md',
  className = '',
  inverse = false
}: BilingualTextProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const textColor = inverse ? 'text-white' : 'text-black';
  return (
    <div
      className={`flex ${variant === 'stacked' ? 'flex-col' : 'flex-row gap-4 items-baseline'} ${className}`}>

      <span
        className={`font-bold ${sizeClasses[size]} ${textColor} tracking-wide`}>

        {english}
      </span>
    </div>);

}