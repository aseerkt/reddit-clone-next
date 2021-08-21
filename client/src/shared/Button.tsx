import React from 'react';
import cn from 'classnames';
import SpinnerSvg from './SpinnerSvg';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: 'contained' | 'outlined';
  fullWidth?: boolean;
  uppercase?: boolean;
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'contained',
  fullWidth = false,
  uppercase = true,
  isLoading,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={cn(
        'inline-block py-2 text-sm border outline-none focus:outline-none font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed',
        className,
        {
          'bg-blue-500 border-blue-500 text-white hover:bg-blue-400 hover:border-blue-400':
            variant === 'contained',
          'bg-transparent border-blue-500 text-blue-500 hover:bg-gray-50':
            variant === 'outlined',
          'w-full': fullWidth,
          uppercase: uppercase,
          'opacity-50 cursor-not-allowed': isLoading,
        }
      )}
    >
      <div className='flex items-center justify-center text-center'>
        {isLoading && <SpinnerSvg />}
        {children}
      </div>
    </button>
  );
};

export default Button;
