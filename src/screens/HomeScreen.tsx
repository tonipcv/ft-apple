import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Courses from './Courses';
import Reports from './Reports';

const Tab = createBottomTabNavigator();

function WhatsAppScreen() {
  const openWhatsApp = async () => {
    const whatsappNumber = '557391778075';
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}`;
    
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(`https://wa.me/${whatsappNumber}`);
      }
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whatsappContainer}>
        <TouchableOpacity 
          style={styles.whatsappButton}
          onPress={openWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={32} color="#fff" />
          <Text style={styles.whatsappText}>Abrir WhatsApp</Text>
        </TouchableOpacity>
        <Text style={styles.whatsappDescription}>
          Clique no botão acima para entrar em contato com nosso suporte via WhatsApp
        </Text>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#111',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: '#fff',
        },
        headerRight: () => (
          <TouchableOpacity 
            onPress={signOut}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out-outline" size={24} color="#666" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#333',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#666',
      })}
      initialRouteName="Cursos"
    >
      <Tab.Screen 
        name="WhatsApp" 
        component={WhatsAppScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cursos" 
        component={Courses}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/ft-icone.png')}
              style={[
                styles.tabBarLogo,
                { opacity: focused ? 1 : 0.5 }
              ]}
              resizeMode="contain"
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen 
        name="Relatórios" 
        component={Reports}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  logoutButton: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  whatsappContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  whatsappDescription: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
    maxWidth: 300,
  },
  tabBarLogo: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
}); 