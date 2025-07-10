import React, { useEffect, useState } from 'react';

interface FadeOutWrapperProps {
  children: React.ReactElement;
  onDone: () => void;
}

export const FadeOutWrapper: React.FC<FadeOutWrapperProps> = ({ children, onDone }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (fading) {
      const timeout = setTimeout(onDone, 300); // match fade duration
      return () => clearTimeout(timeout);
    }
  }, [fading, onDone]);

  const triggerFade = () => setFading(true);

  return (
    <div className={`transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      {React.cloneElement(children, {
        onCancel: triggerFade, // override onCancel
      })}
    </div>
  );
};
