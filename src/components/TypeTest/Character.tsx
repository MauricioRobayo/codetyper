import { memo } from "react";

type CharProps = {
  className: string;
  textChar: string;
  typedKey: string;
};

const Character = memo(function Char({
  className,
  textChar,
  typedKey,
}: CharProps) {
  return <span className={className}>{typedKey || textChar}</span>;
});

export default Character;
