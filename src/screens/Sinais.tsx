/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: number;
  text: string;
  createdAt: string;
}

export default function Sinais() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const dummyMessages: Message[] = [
    {
      id: 1,
      text: "COMPRA #BTCUSDT\nEntrada na zona 42.500\nALAVANCAGEM ISOLADA 10x\nAlvos: 43.000 - 43.500 - 44.000\nStooploss: 42.000",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: 2,
      text: "VENDA #ETHUSDT\nEntrada na zona 2.250\nALAVANCAGEM ISOLADA 10x\nAlvos: 2.200 - 2.150 - 2.100\nStooploss: 2.300",
      createdAt: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
      id: 3,
      text: "Take-Profit #BTCUSDT\nFuturos Tech\nLucro: +1.85%\nPeríodo: 35min ⏰\nAlvo: 1",
      createdAt: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
      id: 4,
      text: "COMPRA #SOLUSDT\nEntrada na zona 125.50\nALAVANCAGEM ISOLADA 10x\nAlvos: 127.00 - 128.50 - 130.00\nStooploss: 124.00",
      createdAt: new Date(Date.now() - 60 * 60000).toISOString()
    },
    {
      id: 5,
      text: "Take-Profit #ETHUSDT\nFuturos Tech\nLucro: +2.15%\nPeríodo: 1h20min ⏰\nAlvo: 2",
      createdAt: new Date(Date.now() - 75 * 60000).toISOString()
    },
    {
      id: 6,
      text: "VENDA #BNBUSDT\nEntrada na zona 315.00\nALAVANCAGEM ISOLADA 10x\nAlvos: 312.00 - 310.00 - 308.00\nStooploss: 317.00",
      createdAt: new Date(Date.now() - 90 * 60000).toISOString()
    },
    {
      id: 7,
      text: "AVISO\nEntrada editada, zona de entrada atualizada\nÓtimo dia a todos!\nAtt Futuros Tech",
      createdAt: new Date(Date.now() - 105 * 60000).toISOString()
    },
    {
      id: 8,
      text: "Take-Profit #SOLUSDT\nFuturos Tech\nLucro: +1.95%\nPeríodo: 45min ⏰\nAlvo: 1",
      createdAt: new Date(Date.now() - 120 * 60000).toISOString()
    },
    {
      id: 9,
      text: "COMPRA #ADAUSDT\nEntrada na zona 0.585\nALAVANCAGEM ISOLADA 10x\nAlvos: 0.595 - 0.605 - 0.615\nStooploss: 0.575",
      createdAt: new Date(Date.now() - 135 * 60000).toISOString()
    },
    {
      id: 10,
      text: "Take-Profit #BNBUSDT\nFuturos Tech\nLucro: +2.25%\nPeríodo: 1h05min ⏰\nAlvo: 3",
      createdAt: new Date(Date.now() - 150 * 60000).toISOString()
    }
  ];

  useEffect(() => {
    if (user) {
      pollMessages();
    }
  }, [user]);

  const pollMessages = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedMessages = dummyMessages.map(msg => ({
        ...msg,
        createdAt: new Date(Date.now() - Math.random() * 180 * 60000).toISOString()
      }));
      
      setMessages(updatedMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages(dummyMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const brazilTime = date.toLocaleString('pt-BR', options);
    const datePart = date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const nowDatePart = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDatePart = yesterday.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    if (datePart === nowDatePart) {
      return `Hoje, ${brazilTime}`;
    } else if (datePart === yesterdayDatePart) {
      return `Ontem, ${brazilTime}`;
    } else {
      return `${datePart}, ${brazilTime}`;
    }
  };

  const formatMessage = (text: string) => {
    const lines = text.split('\n');
    
    if (text.includes('COMPRA')) {
      return (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>{lines[0]}</Text>
          <View style={styles.blurredContent}>
            <Text style={styles.messageText}>Entrada na zona •••••</Text>
            <Text style={styles.messageText}>ALAVANCAGEM •••••</Text>
            <Text style={styles.messageText}>Alvos: •••••</Text>
            <Text style={styles.messageText}>Stooploss: •••••</Text>
          </View>
        </View>
      );
    } else if (text.includes('Take-Profit')) {
      return (
        <View style={styles.takeProfitCard}>
          <Text style={styles.takeProfitTitle}>{lines[0]}</Text>
          <View style={styles.blurredContent}>
            <Text style={styles.messageText}>Futuros Tech</Text>
            <Text style={[styles.messageText, styles.profitText]}>Lucro: •••••</Text>
            <Text style={styles.messageText}>Período: •••••</Text>
            <Text style={styles.messageText}>Alvo: •••••</Text>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.messageCard}>
        <View style={styles.blurredContent}>
          {lines.map((line, i) => (
            <Text key={i} style={styles.messageText}>{line.split(':')[0]}: •••••</Text>
          ))}
        </View>
      </View>
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    pollMessages().then(() => setRefreshing(false));
  }, []);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Banner de Versão Gratuita */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Versão gratuita. Acesso limitado</Text>
        <TouchableOpacity>
          <Text style={styles.bannerLink}>Fazer Upgrade</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas de Entradas</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.blurContainer}>
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              {formatMessage(message.text)}
              <Text style={styles.timestamp}>{formatDate(message.createdAt)}</Text>
            </View>
          ))}
          <View style={styles.blurOverlay}>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Faça upgrade para ver os sinais</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  messageWrapper: {
    padding: 16,
  },
  messageCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  takeProfitCard: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  messageTitle: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  takeProfitTitle: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  profitText: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 8,
    borderRadius: 20,
  },
  bannerText: {
    color: '#999',
    fontSize: 12,
  },
  bannerLink: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '500',
  },
  blurContainer: {
    position: 'relative',
    opacity: 0.1,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  upgradeButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '500',
  },
  blurredContent: {
    opacity: 0.5,
  },
  blurredText: {
    color: '#666',
    letterSpacing: 2,
  },
});