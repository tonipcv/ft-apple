import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  HomeScreen: undefined;
  Courses: undefined;
  Reports: undefined;
  Alertas: undefined;
  Suporte: undefined;
  Perfil: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 