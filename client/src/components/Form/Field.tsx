import React from 'react';

interface FieldProps {
  children: React.ReactNode;
}

const Field = ({ children }: FieldProps) => {
  return <div className="relative z-50 my-3">{children}</div>;
};

export { Field as default, type FieldProps };
