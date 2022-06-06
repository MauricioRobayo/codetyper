import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};
export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};
