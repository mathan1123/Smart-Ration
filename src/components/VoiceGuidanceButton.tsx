import React, { useState, ComponentProps } from 'react';
import { Volume2 } from 'lucide-react';
import { LargeButton } from './LargeButton';
interface VoiceGuidanceButtonProps extends ComponentProps<typeof LargeButton> {
  voiceText?: string; // Text to speak if we were implementing real TTS
}
export function VoiceGuidanceButton({
  voiceText,
  onClick,
  ...props
}: VoiceGuidanceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Simulate voice guidance feedback
    if (voiceText) {
      console.log(`Speaking: ${voiceText}`);
    }
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <LargeButton
      {...props}
      onClick={handleClick}
      icon={
        <div
          className={`
          p-4 rounded-full border-4 
          ${props.variant === 'secondary' || props.variant === 'warning' ? 'bg-black text-white border-black' : 'bg-white text-black border-white'}
        `}>

          {isPlaying ?
            <Volume2 size={48} className="animate-pulse" /> :

            <Volume2 size={48} />
          }
        </div>
      } />);


}