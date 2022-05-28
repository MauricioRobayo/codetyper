import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};
export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
