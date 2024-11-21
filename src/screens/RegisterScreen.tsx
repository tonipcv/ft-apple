import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validações
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    const MAX_RETRIES = 3;
    let currentTry = 0;

    const attemptSignUp = async (): Promise<any> => {
      try {
        console.log(`Tentativa ${currentTry + 1} de ${MAX_RETRIES}`);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
            },
          }
        });

        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    };

    try {
      setLoading(true);
      console.log('Iniciando processo de registro...');

      let result = null;
      
      while (currentTry < MAX_RETRIES) {
        result = await attemptSignUp();
        
        // Se não houver erro de rede, saia do loop
        if (!result.error || 
            (result.error && 
             !result.error.message?.includes('Network request failed'))) {
          break;
        }

        currentTry++;
        
        if (currentTry < MAX_RETRIES) {
          console.log(`Tentando novamente em 2 segundos...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de tentar novamente
        }
      }

      const { data, error } = result;

      if (error) {
        console.log('Erro detectado:', error);
        
        if (error.message?.includes('Network request failed')) {
          Alert.alert(
            'Erro de conexão', 
            'Não foi possível conectar ao servidor após várias tentativas. Por favor, verifique sua conexão com a internet e tente novamente.'
          );
          return;
        }

        // Verifica se error.message existe antes de usar includes
        if (error.message) {
          if (error.message.includes('not authorized')) {
            Alert.alert('Erro', 'Este endereço de e-mail não está autorizado para cadastro. Por favor, use um e-mail válido ou entre em contato com o suporte.');
          } else if (error.message.includes('User already registered')) {
            Alert.alert('Erro', 'Este e-mail já está registrado. Por favor, tente fazer login ou use outro e-mail.');
          } else if (error.message.includes('Email confirmation required')) {
            Alert.alert('Sucesso', 'É necessário confirmar o e-mail antes de concluir o cadastro. Por favor, verifique sua caixa de entrada.');
            navigation.navigate('Login');
          } else {
            Alert.alert('Erro', `Erro no cadastro: ${error.message}`);
          }
        } else {
          Alert.alert('Erro', 'Ocorreu um erro desconhecido durante o cadastro');
        }
        return;
      }

      if (data) {
        console.log('Registro bem-sucedido:', data);
        Alert.alert(
          'Sucesso', 
          'Conta criada com sucesso! Por favor, verifique seu email para confirmar sua conta.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      }
    } catch (err) {
      console.log('Erro inesperado:', err);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado durante o cadastro. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/ft-icone.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Criar Conta</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#9ca3af"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
          
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.registerButtonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta? Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 60,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#4ade80',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default RegisterScreen; 