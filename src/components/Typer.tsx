import { useEffect, useMemo, useState } from "react";
import cn from "classnames";

type TyperProps = {
  text: string;
  className?: string;
};

export function Typer({ text, className }: TyperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textArray = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    const handleKeydown = ({ key }: KeyboardEvent) => {
      if (key === "Enter") {
        return;
      }

      setCurrentIndex((previousIndex) =>
        Math.max(0, previousIndex + (key === "Backspace" ? -1 : 1))
      );
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className={className}>
      <pre>
        {textArray.map((char, index) => (
          <span
            className={cn({
              "bg-green-100 pt-1": currentIndex === index,
            })}
            key={index}
          >
            {char}
          </span>
        ))}
      </pre>
    </div>
  );
}
