import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamsList } from './types';
import {
  RootScreen,
  FlatListExampleScreen,
  SectionListExampleScreen,
  ScrollViewExampleScreen,
  ViewExampleScreen,
  NavigatorExample,
  CustomHandleExample,
  ShadowOverlayExample,
  MapExample
} from './screens';

const Stack = createStackNavigator<AppStackParamsList>();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen
          name="Root"
          component={RootScreen}
          options={{ headerShown: false }}
        />
        {/* basic examples */}
        <Stack.Screen
          name="FlatListExample"
          component={FlatListExampleScreen}
        />
        <Stack.Screen
          name="SectionListExample"
          component={SectionListExampleScreen}
        />
        <Stack.Screen
          name="ScrollViewExample"
          component={ScrollViewExampleScreen}
        />
        <Stack.Screen name="ViewExample" component={ViewExampleScreen} />
        {/* advanced examples */}
        <Stack.Screen name="NavigatorExample" component={NavigatorExample} />
        <Stack.Screen
          name="CustomHandleExample"
          component={CustomHandleExample}
        />
        <Stack.Screen
          name="ShadowOverlayExample"
          component={ShadowOverlayExample}
        />
        <Stack.Screen
          name="MapExample"
          component={MapExample}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
