import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import Home from '../screens/Home';
import Login from '../screens/Login';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../contexts/AuthContext';

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
  const { session, loading } = useAuth();

  if (loading) {
    // Você pode adicionar uma tela de splash aqui
    return null;
  }

  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {session && (
        <Stack.Group>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator; 