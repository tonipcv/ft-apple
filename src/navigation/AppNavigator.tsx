import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterSuccessScreen from '../screens/RegisterSuccessScreen';
import HomeScreen from '../screens/HomeScreen';
import Home from '../screens/Home';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, isRegistering } = useAuth();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      {user?.id && !isRegistering ? (
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ gestureEnabled: false }}
        />
      ) : (
        <>
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen 
            name="RegisterSuccess" 
            component={RegisterSuccessScreen}
            options={{ gestureEnabled: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
} 