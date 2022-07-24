import { ThemeIcon } from "@mantine/core";
import { ArrowRight, Check, CircleDashed } from "tabler-icons-react";

interface FileIconProps {
  isActive: boolean;
  isDone: boolean;
}
export function FileIcon({ isActive, isDone }: FileIconProps) {
  if (isDone && isActive) {
    return (
      <ThemeIcon size={24} radius="xl">
        <Check size="16" />
      </ThemeIcon>
    );
  }

  if (isDone) {
    return (
      <ThemeIcon size={24} radius="xl" variant="light">
        <Check size="16" />
      </ThemeIcon>
    );
  }

  if (isActive) {
    return (
      <ThemeIcon color="teal" size={24} radius="xl">
        <ArrowRight size="16" />
      </ThemeIcon>
    );
  }

  return (
    <ThemeIcon size={24} radius="xl" variant="light">
      <CircleDashed size="16" />
    </ThemeIcon>
  );
}
