import React, { PropsWithChildren } from 'react';
import { AnimatedBackground } from 'shared/ui/AnimatedBackground';

export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
};
