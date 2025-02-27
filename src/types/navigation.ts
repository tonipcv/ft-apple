import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  RegisterSuccess: undefined;
  HomeScreen: undefined;
  News: undefined;
  Grafico: undefined;
  Courses: undefined;
};

export type TabParamList = {
  News: undefined;
  Grafico: undefined;
  Courses: undefined;
  Reports: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 