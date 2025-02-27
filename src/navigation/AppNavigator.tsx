import React from 'react';
import { Image, View, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterSuccessScreen from '../screens/RegisterSuccessScreen';
import Home from '../screens/Home';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, TabParamList } from '../types/navigation';

import NewsScreen from '../screens/News';
import GraficoScreen from '../screens/Grafico';
import CoursesScreen from '../screens/Courses';
import ReportsScreen from '../screens/Reports';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function LogoTitle() {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <Image
        style={{
          width: 180,
          height: 45,
          resizeMode: 'contain',
        }}
        source={require('../../assets/ft-icone.png')}
      />
    </View>
  );
}

function TabNavigator() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ],
      { cancelable: true }
    );
  };

  const headerRight = () => (
    <TouchableOpacity 
      onPress={handleLogout}
      style={{ paddingRight: 16 }}
    >
      <Ionicons 
        name="log-out-outline" 
        size={24} 
        color="#666"
      />
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#333',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#666',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#111',
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        },
        headerTitle: (props) => <LogoTitle {...props} />,
        headerTitleAlign: 'center',
        headerRight: headerRight,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Grafico"
        component={GraficoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isRegistering } = useAuth();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      {user?.id && !isRegistering ? (
        <Stack.Screen 
          name="HomeScreen" 
          component={TabNavigator} 
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