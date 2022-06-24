import {
  ArrowRightIcon,
  ClockIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";

interface FileIconProps {
  isDone: boolean;
  isActive: boolean;
}
export function FileIcon({ isDone, isActive }: FileIconProps) {
  if (isDone) {
    return <CheckCircledIcon />;
  }

  if (isActive) {
    return <ArrowRightIcon />;
  }

  return <ClockIcon />;
}
