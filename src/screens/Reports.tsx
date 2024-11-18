import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';

interface Trade {
  data: string;
  ativo: string;
  direcao: string;
  percentual: number;
  alvo: string;
}

export default function Reports() {
  const [initialTrades, setInitialTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
  ];

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    console.log('Trades por mês:', 
        initialTrades.reduce((acc, trade) => {
            const month = new Date(trade.data).getMonth() + 1;
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<number, number>)
    );
  }, [initialTrades]);

  const fetchTrades = async () => {
    try {
      const response = await fetch('https://service-relatorio-server-api.dpbdp1.easypanel.host/api/trades');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const trades = await response.json();
      const validTrades = trades.filter((trade: Trade) => {
        return trade.data && trade.ativo && trade.direcao && trade.percentual !== null && trade.alvo;
      });
      setInitialTrades(validTrades);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredData = initialTrades.filter(trade => {
    const matchesSearch = trade.ativo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection = selectedDirection === 'ALL' || trade.direcao === selectedDirection;
    
    const tradeDate = new Date(trade.data);
    const tradeMonth = tradeDate.getMonth() + 1;
    const matchesMonth = tradeMonth === selectedMonth;
    
    return matchesSearch && matchesDirection && matchesMonth;
  });

  const totalOperacoes = filteredData.length;
  const operacoesLucrativas = filteredData.filter(t => t.percentual > 0).length;
  const taxaAcerto = totalOperacoes > 0 ? ((operacoesLucrativas / totalOperacoes) * 100) : 0;
  const valorizacaoTotal = Number(filteredData.reduce((acc, curr) => acc + Number(curr.percentual), 0));

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
        <Text style={styles.headerSubtitle}>Análise de {initialTrades.length} operações</Text>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ativo..."
          placeholderTextColor="#666"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={styles.directionFilter}>
          {['ALL', 'LONG', 'SHORT'].map((direction) => (
            <TouchableOpacity
              key={direction}
              style={[
                styles.directionButton,
                selectedDirection === direction && styles.directionButtonActive
              ]}
              onPress={() => setSelectedDirection(direction as 'ALL' | 'LONG' | 'SHORT')}
            >
              <Text style={styles.directionButtonText}>{direction}</Text>
            </TouchableOpacity>
          ))}
        </View>
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

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statValue}>{taxaAcerto.toFixed(1)}%</Text>
          <Text style={styles.statSubtext}>{operacoesLucrativas}/{totalOperacoes}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Resultado Total</Text>
          <Text style={[
            styles.statValue,
            valorizacaoTotal >= 0 ? styles.positiveResult : styles.negativeResult
          ]}>
            {valorizacaoTotal > 0 ? '+' : ''}{valorizacaoTotal.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total de Sinais</Text>
          <Text style={styles.statValue}>{totalOperacoes}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.tradesContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTrades} />
        }
      >
        {filteredData.map((trade, index) => (
          <View key={index} style={styles.tradeCard}>
            <View style={styles.tradeHeader}>
              <Text style={styles.tradeDate}>{formatDate(trade.data)}</Text>
              <View style={[
                styles.directionTag,
                trade.direcao === 'LONG' ? styles.longTag : styles.shortTag
              ]}>
                <Text style={[
                  styles.directionTagText,
                  trade.direcao === 'LONG' ? styles.longTagText : styles.shortTagText
                ]}>{trade.direcao}</Text>
              </View>
            </View>
            <Text style={styles.tradeAtivo}>{trade.ativo}</Text>
            <View style={styles.tradeFooter}>
              <Text style={[
                styles.tradeResult,
                trade.percentual >= 0 ? styles.positiveResult : styles.negativeResult
              ]}>
                {trade.percentual >= 0 ? '+' : ''}{trade.percentual}%
              </Text>
              <Text style={styles.tradeAlvo}>{trade.alvo}</Text>
            </View>
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
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  filters: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  directionFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#222',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  directionButtonActive: {
    backgroundColor: '#333',
  },
  directionButtonText: {
    color: '#666',
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
  },
  monthButtonTextActive: {
    color: '#4ade80',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statSubtext: {
    color: '#666',
    fontSize: 10,
  },
  tradesContainer: {
    flex: 1,
    padding: 16,
  },
  tradeCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tradeDate: {
    color: '#666',
  },
  directionTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  longTag: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  shortTag: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
  },
  longTagText: {
    color: '#4ade80',
  },
  shortTagText: {
    color: '#f87171',
  },
  directionTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tradeAtivo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tradeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tradeResult: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  positiveResult: {
    color: '#4ade80',
  },
  negativeResult: {
    color: '#f87171',
  },
  tradeAlvo: {
    color: '#666',
  },
}); 