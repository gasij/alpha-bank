import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    className = '',
  children,
  ...rest
}) => {
    return (
        <button className={`btn ${className}`} {...rest}>
            {children}
        </button>
    )
}