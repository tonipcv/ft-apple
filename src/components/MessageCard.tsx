import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MessageCard = ({ message }: { message: any }) => {
  const renderTakeProfit = () => (
    <View style={styles.card}>
      <Text style={styles.headerGreen}>{message.header}</Text>
      <Text style={styles.text}>{message.data.type}</Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Alvo</Text>
          <Text style={styles.text}>{message.data.alvo}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Lucro</Text>
          <Text style={styles.profitText}>{message.data.lucro}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Período</Text>
          <Text style={styles.text}>{message.data.periodo}</Text>
        </View>
      </View>
    </View>
  );

  const renderCompraVenda = () => (
    <View style={styles.card}>
      <Text style={styles.headerGreen}>{message.header}</Text>
      {message.data.entradaZona && (
        <Text style={styles.text}>{message.data.entradaZona}</Text>
      )}
      {message.data.alavancagem && (
        <Text style={styles.text}>{message.data.alavancagem}</Text>
      )}
      {message.data.alvos.length > 0 && (
        <View style={styles.targetsContainer}>
          <Text style={styles.label}>Alvos:</Text>
          <View style={styles.targetsGrid}>
            {message.data.alvos.map((alvo: string, index: number) => (
              <View key={index} style={styles.targetTag}>
                <Text style={styles.targetText}>{alvo}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {message.data.stoploss && (
        <Text style={styles.stoplossText}>{message.data.stoploss}</Text>
      )}
    </View>
  );

  const renderCancelado = () => (
    <View style={styles.card}>
      <Text style={styles.headerGray}>{message.header}</Text>
      <Text style={styles.cancelText}>{message.message}</Text>
    </View>
  );

  switch (message.type) {
    case 'take-profit':
      return renderTakeProfit();
    case 'compra':
    case 'venda':
      return renderCompraVenda();
    case 'cancelado':
      return renderCancelado();
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerGreen: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: 8,
  },
  headerGray: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    marginTop: 8,
  },
  gridItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
    fontWeight: '600',
  },
  profitText: {
    fontSize: 14,
    color: '#4ade80',
  },
  targetsContainer: {
    marginTop: 8,
  },
  targetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  targetTag: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  targetText: {
    fontSize: 12,
    color: '#000',
  },
  stoplossText: {
    fontSize: 14,
    color: '#e5e7eb',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 14,
    color: '#9ca3af',
  },
}); 