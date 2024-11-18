import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { formatMessage, formatDate } from '../utils/messageFormatting';

interface Message {
  id: number;
  text: string;
  createdAt: string;
  formattedContent?: {
    type: string;
    header: string;
    data?: any;
    message?: string;
  };
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
        const formattedMessages = data.map((message: any) => ({
          id: message.id,
          text: message.text,
          createdAt: message.createdAt,
          formattedContent: formatMessage(message.text)
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (!message.formattedContent) return <Text style={styles.messageText}>{message.text}</Text>;

    const { type, header, data, message: cancelMessage } = message.formattedContent;

    switch (type) {
      case 'take-profit':
        return (
          <>
            <Text style={styles.messageHeader}>{header}</Text>
            <Text style={styles.messageText}>{data.type}</Text>
            <Text style={styles.messageDetail}>Alvo: {data.alvo}</Text>
            <Text style={styles.messageDetail}>Lucro: {data.lucro}</Text>
            <Text style={styles.messageDetail}>Período: {data.periodo}</Text>
          </>
        );

      case 'compra':
      case 'venda':
        return (
          <>
            <Text style={styles.messageHeader}>{header}</Text>
            <Text style={styles.messageDetail}>{data.entradaZona}</Text>
            <Text style={styles.messageDetail}>{data.alavancagem}</Text>
            <View style={styles.alvosContainer}>
              {data.alvos.filter((alvo: string) => alvo.trim() !== '').map((alvo: string, index: number) => (
                <View key={index} style={styles.alvoCircle}>
                  <Text style={styles.alvoText}>{alvo}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.messageDetail}>{data.stoploss}</Text>
          </>
        );

      case 'cancelado':
        return (
          <>
            <Text style={styles.messageHeader}>{header}</Text>
            <Text style={styles.messageText}>{cancelMessage}</Text>
          </>
        );

      default:
        return <Text style={styles.messageText}>{message.text}</Text>;
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
            {renderMessageContent(message)}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageDetail: {
    color: '#ddd',
    fontSize: 14,
    marginVertical: 2,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  alvosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  alvoCircle: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 6,
    minWidth: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alvoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
}); 