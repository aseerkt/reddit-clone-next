import React from 'react';
import cn from 'classnames';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: 'contained' | 'outlined';
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'contained',
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        'inline-block py-2 mt-3 mb-4 text-xs border font-bold uppercase rounded ',
        className,
        {
          'bg-blue-500 border-blue-500 text-white hover:bg-blue-400 hover:border-blue-400':
            variant === 'contained',
          'bg-transparent border-blue-500 text-blue-500 hover:bg-blue-10s':
            variant === 'outlined',
          'w-full': fullWidth,
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
