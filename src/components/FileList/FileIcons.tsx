import { ThemeIcon } from "@mantine/core";
import { ArrowRight, CircleCheck, CircleDashed } from "tabler-icons-react";

interface FileIconProps {
  isActive: boolean;
  isDone: boolean;
}
export function FileIcon({ isActive, isDone }: FileIconProps) {
  if (isActive) {
    return (
      <ThemeIcon color={isDone ? "teal" : "blue"} size={24} radius="xl">
        <ArrowRight size={16} />
      </ThemeIcon>
    );
  }
  if (isDone) {
    return (
      <ThemeIcon color="teal" size={24} radius="xl">
        <CircleCheck size={16} />
      </ThemeIcon>
    );
  }

  return (
    <ThemeIcon size={24} radius="xl">
      <CircleDashed size={16} />
    </ThemeIcon>
  );
}
