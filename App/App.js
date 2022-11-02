import "react-native-gesture-handler";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";

//https://colors.eva.design/

import ContextWrapper from "./context/ContextWrapper";

import Navigation from "./shared/Navigation";

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

export default function App() {
  return (
    <ContextWrapper>
      <NavigationContainer theme={NavigationTheme}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <TailwindProvider>
            <Navigation />
          </TailwindProvider>
        </ApplicationProvider>
      </NavigationContainer>
    </ContextWrapper>
  );
}
