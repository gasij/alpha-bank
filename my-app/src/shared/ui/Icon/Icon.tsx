import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ icon, className }) => {
  const IconComponent = icon as React.ComponentType<{ className?: string }>;
  return React.createElement(IconComponent, { className });
};
