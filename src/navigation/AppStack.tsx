import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animationTypeForReplace: 'push',
      }}
    >
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
    </Stack.Navigator>
  );
} 