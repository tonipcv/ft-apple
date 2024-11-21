import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import Home from '../screens/Home';
import Login from '../screens/Login';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  HomeScreen: undefined;
  ForgotPassword: undefined;
  Courses: undefined;
  Reports: undefined;
  Alertas: undefined;
  Suporte: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator; 