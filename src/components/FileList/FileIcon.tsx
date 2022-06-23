import { ArrowRight, Check, Clock } from "tabler-icons-react";
import { FileStatus } from "./FileList";

interface FileIconProps {
  status: FileStatus;
}
export function FileIcon({ status }: FileIconProps) {
  if (status === "done") {
    return <Check size={14} />;
  }

  if (status === "active") {
    return <ArrowRight size={16} strokeWidth={3} />;
  }

  return <Clock size={14} />;
}
