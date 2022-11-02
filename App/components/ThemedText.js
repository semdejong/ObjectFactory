import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@ui-kitten/components";

const ThemedText = ({ text, color, classes }) => {
  const theme = useTheme();
  return (
    <Text style={{ color: theme[color] }} className={classes}>
      {text}
    </Text>
  );
};

export default ThemedText;
