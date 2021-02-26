import React from 'react';
import cn from 'classnames';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        'w-full py-2 mt-3 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded',
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
