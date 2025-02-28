import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useState, useEffect } from 'react';

interface Trade {
  data: string;
  ativo: string;
  direcao: string;
  percentual: number;
  alvo: string;
}

export default function ReportsN() {
  const [initialTrades, setInitialTrades] = useState<Trade[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' },
    { number: 1, name: 'Janeiro' }
  ];

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await fetch('https://service-relatorio-server-api.dpbdp1.easypanel.host/api/trades');
      if (!response.ok) throw new Error('Failed to fetch data');
      const trades = await response.json();
      setInitialTrades(trades.filter((trade: Trade) => 
        trade.data && trade.ativo && trade.direcao && trade.percentual !== null && trade.alvo
      ));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes('/')) return dateString;
    const d = new Date(dateString);
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
  };

  const getMonthFromDateString = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month] = dateStr.split('/').map(Number);
      return month;
    }
    return new Date(dateStr).getMonth() + 1;
  };

  const openCompleteResults = () => {
    Linking.openURL('https://futurostech.com/resultados');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatório de Trades</Text>
      </View>

      <ScrollView 
        horizontal 
        style={styles.monthsScroll}
        showsHorizontalScrollIndicator={false}
      >
        {months.map((month) => (
          <TouchableOpacity
            key={month.number}
            style={[
              styles.monthButton,
              selectedMonth === month.number && styles.monthButtonActive
            ]}
            onPress={() => setSelectedMonth(month.number)}
          >
            <Text style={[
              styles.monthButtonText,
              selectedMonth === month.number && styles.monthButtonTextActive
            ]}>{month.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.completeResultsButton}
        onPress={openCompleteResults}
      >
        <Text style={styles.completeResultsButtonText}>Ver Relatório Completo</Text>
      </TouchableOpacity>

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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthsScroll: {
    maxHeight: 50,
    paddingHorizontal: 12,
  },
  monthButton: {
    padding: 12,
    marginHorizontal: 4,
  },
  monthButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4ade80',
  },
  monthButtonText: {
    color: '#666',
    fontSize: 16,
  },
  monthButtonTextActive: {
    color: '#4ade80',
  },
  completeResultsButton: {
    backgroundColor: '#4ade80',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completeResultsButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 