import { Center, createStyles, MantineTheme } from "@mantine/core";
import { TypingTest, TypingTestResult } from "./TypeTest";

type TypeTestWrapperProps = {
  text: string;
  onFinish: (results: TypingTestResult) => void;
};
export const TypeTestWrapper = ({ text, onFinish }: TypeTestWrapperProps) => {
  const useStyles = createStyles((theme: MantineTheme) => ({
    error: {
      color: theme.colors.red[6],
      fontWeight: "bold",
      textDecoration: "underline",
    },
    correct: {
      color: theme.colors.lime[4],
    },
    active: {
      backgroundColor: theme.colors.lime[8],
      color: "inherit",
    },
    corrected: {
      backgroundColor: theme.colors.yellow[6],
    },
    background: {
      whiteSpace: "pre-wrap",
      fontSize: theme.fontSizes.xl,
      backgroundColor: theme.colors.dark[4],
      color: theme.colors.gray[6],
      padding: theme.spacing.lg,
    },
  }));

  const { classes } = useStyles();

  return (
    <Center>
      <TypingTest text={text} onFinish={onFinish} classes={classes} />
    </Center>
  );
};
