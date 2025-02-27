import React from 'react';
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
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
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarLabel: 'Notícias',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Grafico"
        component={GraficoScreen}
        options={{
          tabBarLabel: 'Gráficos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarLabel: 'Cursos',
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