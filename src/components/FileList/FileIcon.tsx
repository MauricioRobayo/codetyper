import { ArrowRight, Check, Clock } from "tabler-icons-react";

interface FileIconProps {
  isDone: boolean;
  isActive: boolean;
}
export function FileIcon({ isDone, isActive }: FileIconProps) {
  if (isDone) {
    return <Check size={16} />;
  }

  if (isActive) {
    return <ArrowRight size={16} strokeWidth={3} />;
  }

  return <Clock size={16} />;
}
