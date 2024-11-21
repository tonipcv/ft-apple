import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Home from '../screens/Home';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import HomeScreen from '../screens/HomeScreen';
import Courses from '../screens/Courses';
import Reports from '../screens/Reports';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppStack() {
  const { session } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!session) {
      navigation.navigate('Home' as never);
    }
  }, [session]);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animationTypeForReplace: 'push',
      }}
    >
      {/* Rotas públicas */}
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword}
      />

      {/* Rotas protegidas */}
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="Courses" 
        component={Courses}
      />
      <Stack.Screen 
        name="Reports" 
        component={Reports}
      />
    </Stack.Navigator>
  );
} 