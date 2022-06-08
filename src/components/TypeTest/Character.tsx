import { memo } from "react";

type CharProps = {
  key: string | number;
  className: string;
  textChar: string;
  typedKey: string;
};

const Character = memo(function Char({
  key,
  className,
  textChar,
  typedKey,
}: CharProps) {
  return (
    <span key={key} className={className}>
      {typedKey || textChar}
    </span>
  );
});

export default Character;
