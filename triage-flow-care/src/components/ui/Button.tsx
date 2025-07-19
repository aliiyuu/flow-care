import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 border font-sans';
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white border-primary-500 focus:ring-primary-400 shadow-teal',
    secondary: 'bg-white hover:bg-primary-50 text-primary-700 border-primary-200 focus:ring-primary-400 shadow-teal',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500 shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 focus:ring-emerald-500 shadow-sm',
    outline: 'bg-transparent hover:bg-primary-50 text-primary-600 border-primary-300 focus:ring-primary-400',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;