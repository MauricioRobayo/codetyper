import {
  Center,
  Code,
  createStyles,
  CSSObject,
  MantineTheme,
  Text,
} from "@mantine/core";
import { TypeTest } from "./TypeTest";

type TypeTestWrapperProps = {
  text: string;
  onFinish: () => void;
};
export const TypeTestWrapper = ({ text, onFinish }: TypeTestWrapperProps) => {
  const useStyles = createStyles((theme: MantineTheme) => ({
    error: {
      color: theme.colors.red[8],
    },
    idle: {
      color: "inherit",
    },
    success: {
      color: theme.colors.lime[6],
    },
    active: {
      backgroundColor: theme.colors.lime[6],
    },
    background: {
      whiteSpace: "pre-wrap",
      fontSize: theme.fontSizes.xl,
      backgroundColor: theme.colors.gray[8],
      color: theme.colors.lime[9],
      padding: theme.spacing.lg,
    },
  }));

  const { classes } = useStyles();

  return (
    <Center>
      <TypeTest text={text} onFinish={onFinish} classes={classes} />
    </Center>
  );
};
