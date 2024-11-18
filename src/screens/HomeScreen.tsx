import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  createdAt: string;
}

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastNotifiedId = useRef<number | null>(null);

  useEffect(() => {
    pollMessages();
    const intervalId = setInterval(pollMessages, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const pollMessages = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://servidor-servidor-telegram.dpbdp1.easypanel.host/messages/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length > 0) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const time = date.toLocaleTimeString('pt-BR', options);
    const today = now.toDateString();
    const messageDate = date.toDateString();

    if (messageDate === today) {
      return `Hoje, ${time}`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Alertas de Entradas:</Text>
        <TouchableOpacity onPress={pollMessages} disabled={isLoading}>
          <Text style={styles.refreshButton}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.messageList}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={pollMessages} />
        }
      >
        {messages.map((message, index) => (
          <View key={index} style={styles.messageCard}>
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.dateText}>{formatDate(message.createdAt)}</Text>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    color: '#fff',
    fontSize: 24,
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
}); 