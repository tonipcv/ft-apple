import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import Home from '../screens/Home';
import Login from '../screens/Login';
import HomeScreen from '../screens/HomeScreen';
import ForgotPassword from '../screens/ForgotPassword';
import RegisterSuccessScreen from '../screens/RegisterSuccessScreen';
import { useAuth } from '../contexts/AuthContext';
import { CommonActions, useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  RegisterSuccess: undefined;
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
  const navigation = useNavigation();

  useEffect(() => {
    if (session) {
      // Se houver uma sessão ativa, redireciona para HomeScreen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        })
      );
    }
  }, [session]);

  if (loading) {
    // Você pode adicionar uma tela de splash aqui
    return null;
  }

  return (
    <Stack.Navigator 
      initialRouteName={session ? "HomeScreen" : "Home"}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      {/* Rotas públicas */}
      {!session ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      ) : (
        // Rotas protegidas
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator; 