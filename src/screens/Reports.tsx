import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, RefreshControl, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' },
    { number: 1, name: 'Janeiro' }
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

  useEffect(() => {
    if (initialTrades.length > 0) {
        console.log('Exemplo de data:', initialTrades[0].data);
        console.log('Meses disponíveis:', 
            [...new Set(initialTrades.map(trade => {
                const [day, month, year] = trade.data.split('/').map(Number);
                return month;
            }))]
        );
    }
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
    if (dateString.includes('/')) {
      return dateString;
    }
    const d = new Date(dateString);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const getMonthFromDateString = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      return month;
    }
    return new Date(dateStr).getMonth() + 1;
  };

  const filteredData = initialTrades.filter(trade => {
    const matchesSearch = trade.ativo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection = selectedDirection === 'ALL' || trade.direcao === selectedDirection;
    
    const tradeMonth = getMonthFromDateString(trade.data);
    console.log('Trade:', trade.data, 'Month:', tradeMonth);
    
    return matchesSearch && matchesDirection && tradeMonth === selectedMonth;
  }).concat(
    selectedMonth === 11 ? [
      {"data": "01/11/2024", "ativo": "SUI/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "01/11/2024", "ativo": "TROY/USDT", "direcao": "LONG", "percentual": 140.40, "alvo": "8"},
      {"data": "01/11/2024", "ativo": "SYN/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "01/11/2024", "ativo": "ENA/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "02/11/2024", "ativo": "OGN/USDT", "direcao": "LONG", "percentual": 180.80, "alvo": "10"},
      {"data": "02/11/2024", "ativo": "RARE/USDT", "direcao": "LONG", "percentual": 21.20, "alvo": "2"},
      {"data": "02/11/2024", "ativo": "NEIRO/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
      {"data": "02/11/2024", "ativo": "BICO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "02/11/2024", "ativo": "SANTOS/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "03/11/2024", "ativo": "CHR/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
      {"data": "03/11/2024", "ativo": "APE/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "03/11/2024", "ativo": "SOL/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "03/11/2024", "ativo": "DODOX/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "03/11/2024", "ativo": "GHTS/USDT", "direcao": "LONG", "percentual": 200.40, "alvo": "11"},
      {"data": "03/11/2024", "ativo": "ZEC/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
      {"data": "04/11/2024", "ativo": "SCR/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "04/11/2024", "ativo": "ARB/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "04/11/2024", "ativo": "UXLINK/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
      {"data": "04/11/2024", "ativo": "SAGA/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "04/11/2024", "ativo": "TROY/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "05/11/2024", "ativo": "POPCAT/USDT", "direcao": "SHORT", "percentual": 120.00, "alvo": "7"},
      {"data": "05/11/2024", "ativo": "MASK/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "05/11/2024", "ativo": "LTC/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "05/11/2024", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "06/11/2024", "ativo": "UXLINK/USDT", "direcao": "SHORT", "percentual": -90.00, "alvo": "-"},
      {"data": "06/11/2024", "ativo": "MANA/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "06/11/2024", "ativo": "METIS/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "06/11/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "07/11/2024", "ativo": "RARE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "07/11/2024", "ativo": "SKL/USDT", "direcao": "LONG", "percentual": 200.20, "alvo": "11"},
      {"data": "07/11/2024", "ativo": "VOXEL/USDT", "direcao": "SHORT", "percentual": 40.40, "alvo": "3"},
      {"data": "08/11/2024", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "08/11/2024", "ativo": "POL/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "08/11/2024", "ativo": "NOT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "08/11/2024", "ativo": "STORJ/USDT", "direcao": "LONG", "percentual": 180.40, "alvo": "10"},
      {"data": "09/11/2024", "ativo": "REF/USDT", "direcao": "SHORT", "percentual": 30.10, "alvo": "4"},
      {"data": "09/11/2024", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "09/11/2024", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "12/11/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 80.80, "alvo": "5"},
      {"data": "12/11/2024", "ativo": "NEIRO/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "12/11/2024", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "13/11/2024", "ativo": "CETUS/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "13/11/2024", "ativo": "SUI/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "13/11/2024", "ativo": "IOTX/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
      {"data": "13/11/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "14/11/2024", "ativo": "BNX/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "14/11/2024", "ativo": "1000RATS/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "14/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "14/11/2024", "ativo": "PNUT/USDT", "direcao": "SHORT", "percentual": 100.00, "alvo": "6"},
      {"data": "15/11/2024", "ativo": "HMSTR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "16/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "16/11/2024", "ativo": "HBAR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "16/11/2024", "ativo": "IOTX/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "16/11/2024", "ativo": "1INCH/USDT", "direcao": "SHORT", "percentual": 80.00, "alvo": "5"},
      {"data": "16/11/2024", "ativo": "HIPPO/USDT", "direcao": "SHORT", "percentual": 60.20, "alvo": "4"},
      {"data": "17/11/2024", "ativo": "ALGO/USDT", "direcao": "LONG", "percentual": 201.00, "alvo": "11"},
      {"data": "17/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "17/11/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 205.60, "alvo": "11"},
      {"data": "17/11/2024", "ativo": "GRASS/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "17/11/2024", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "18/11/2024", "ativo": "KAVA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "18/11/2024", "ativo": "ANKR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "18/11/2024", "ativo": "XVG/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "18/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "19/11/2024", "ativo": "BRETT/USDT", "direcao": "SHORT", "percentual": 200.00, "alvo": "11"},
      {"data": "19/11/2024", "ativo": "PEOPLE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "19/11/2024", "ativo": "FIO/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "19/11/2024", "ativo": "HOT/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "20/11/2024", "ativo": "LDO/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "21/11/2024", "ativo": "CRV/USDT", "direcao": "SHORT", "percentual": -90.00, "alvo": "-"},
      {"data": "21/11/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "21/11/2024", "ativo": "SUISHI/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
      {"data": "21/11/2024", "ativo": "IO/USDT", "direcao": "LONG", "percentual": 200.20, "alvo": "11"},
      {"data": "21/11/2024", "ativo": "EIGEN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "21/11/2024", "ativo": "ACT/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "22/11/2024", "ativo": "INJ/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "22/11/2024", "ativo": "10000MOG/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "22/11/2024", "ativo": "1MBABYDOGE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "22/11/2024", "ativo": "1000SATS/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "23/11/2024", "ativo": "LRC/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "23/11/2024", "ativo": "1000PEPE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "23/11/2024", "ativo": "ATA/USDT", "direcao": "LONG", "percentual": 40.80, "alvo": "3"},
      {"data": "23/11/2024", "ativo": "MANTA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "24/11/2024", "ativo": "DYM/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "24/11/2024", "ativo": "SAGA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "24/11/2024", "ativo": "SANTOS/USDT", "direcao": "SHORT", "percentual": 100.40, "alvo": "6"},
      {"data": "24/11/2024", "ativo": "NEAR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "24/11/2024", "ativo": "ALICE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "24/11/2024", "ativo": "YGG/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "25/11/2024", "ativo": "AVAX/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "25/11/2024", "ativo": "MKR/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "25/11/2024", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 120.20, "alvo": "7"},
      {"data": "25/11/2024", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 140.60, "alvo": "7"},
      {"data": "26/11/2024", "ativo": "OP/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "26/11/2024", "ativo": "WIF/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "26/11/2024", "ativo": "HIFI/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
      {"data": "26/11/2024", "ativo": "DYM/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "26/11/2024", "ativo": "KAVA/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
      {"data": "26/11/2024", "ativo": "IOTX/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
      {"data": "27/11/2024", "ativo": "ZEC/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "27/11/2024", "ativo": "LDO/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "28/11/2024", "ativo": "MORPHO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "28/11/2024", "ativo": "VANRY/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "28/11/2024", "ativo": "SNX/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
      {"data": "28/11/2024", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 60.60, "alvo": "4"},
      {"data": "28/11/2024", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "28/11/2024", "ativo": "ARKM/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "29/11/2024", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
    ].filter(trade => 
        trade.ativo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDirection === 'ALL' || trade.direcao === selectedDirection)
    ) : selectedMonth === 12 ? [
      {"data": "01/12/2024", "ativo": "BLUR/USDT", "direcao": "SHORT", "percentual": 87.00, "alvo": "11"},
      {"data": "01/12/2024", "ativo": "IO/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "01/12/2024", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "02/12/2024", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "02/12/2024", "ativo": "GTM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "03/12/2024", "ativo": "JASMY/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "03/12/2024", "ativo": "ADA/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "03/12/2024", "ativo": "ALT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "03/12/2024", "ativo": "MEW/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "04/12/2024", "ativo": "THE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "04/12/2024", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "04/12/2024", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "04/12/2024", "ativo": "RLP/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "05/12/2024", "ativo": "OTX/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
      {"data": "05/12/2024", "ativo": "ICP/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "05/12/2024", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "05/12/2024", "ativo": "SWELL/USDT", "direcao": "LONG", "percentual": 100.20, "alvo": "6"},
      {"data": "06/12/2024", "ativo": "RENDER/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "06/12/2024", "ativo": "FTM/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "06/12/2024", "ativo": "OMNI/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "06/12/2024", "ativo": "XRP/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "07/12/2024", "ativo": "OP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "07/12/2024", "ativo": "WIF/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "08/12/2024", "ativo": "1000PEPE/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "08/12/2024", "ativo": "LOKA/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
      {"data": "09/12/2024", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "09/12/2024", "ativo": "FIO/USDT", "direcao": "LONG", "percentual": 80.20, "alvo": "5"},
      {"data": "09/12/2024", "ativo": "CELO/USDT", "direcao": "LONG", "percentual": 21.00, "alvo": "2"},
      {"data": "09/12/2024", "ativo": "1MBABYDOGE/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "09/12/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "09/12/2024", "ativo": "DOT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "09/12/2024", "ativo": "1000FLOKI/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "09/12/2024", "ativo": "1MBABYDOGE/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "10/12/2024", "ativo": "ONE/USDT", "direcao": "SHORT", "percentual": 200.00, "alvo": "11"},
      {"data": "10/12/2024", "ativo": "AMB/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "10/12/2024", "ativo": "MTL/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "10/12/2024", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "10/12/2024", "ativo": "ATOM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "10/12/2024", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "10/12/2024", "ativo": "ATA/USDT", "direcao": "LONG", "percentual": 201.40, "alvo": "11"},
      {"data": "11/12/2024", "ativo": "COTI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "11/12/2024", "ativo": "AAVE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "11/12/2024", "ativo": "ZRO/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "12/12/2024", "ativo": "DYM/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "12/12/2024", "ativo": "CHESS/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "12/12/2024", "ativo": "TLM/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "12/12/2024", "ativo": "ALPACA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "14/12/2024", "ativo": "BB/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "14/12/2024", "ativo": "BICO/USDT", "direcao": "LONG", "percentual": 140.40, "alvo": "8"},
      {"data": "14/12/2024", "ativo": "ZK/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "14/12/2024", "ativo": "MORPHO/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "14/12/2024", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "14/12/2024", "ativo": "ENA/USDT", "direcao": "SHORT", "percentual": 120.00, "alvo": "7"},
      {"data": "14/12/2024", "ativo": "XVG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "21/12/2024", "ativo": "ZRO/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "21/12/2024", "ativo": "CHR/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "21/12/2024", "ativo": "BICO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "21/12/2024", "ativo": "IO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "21/12/2024", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "21/12/2024", "ativo": "SOL/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "21/12/2024", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "22/12/2024", "ativo": "ACH/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "22/12/2024", "ativo": "BCH/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "22/12/2024", "ativo": "DEGEN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "22/12/2024", "ativo": "PNUT/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "22/12/2024", "ativo": "AGLD/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "22/12/2024", "ativo": "STEEM/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "22/12/2024", "ativo": "SUSHI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "22/12/2024", "ativo": "REZ/USDT", "direcao": "LONG", "percentual": 200.40, "alvo": "11"},
      {"data": "22/12/2024", "ativo": "C98/USDT", "direcao": "LONG", "percentual": 200.60, "alvo": "11"},
      {"data": "22/12/2024", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "23/12/2024", "ativo": "CGPT/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "23/12/2024", "ativo": "VIRTUAL/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "23/12/2024", "ativo": "10000MOG/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "23/12/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
      {"data": "23/12/2024", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "24/12/2024", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "24/12/2024", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "24/12/2024", "ativo": "DYDX/USDT", "direcao": "LONG", "percentual": 120.60, "alvo": "7"},
      {"data": "24/12/2024", "ativo": "SFP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "24/12/2024", "ativo": "HBAR/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "24/12/2024", "ativo": "1000RATS/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
      {"data": "24/12/2024", "ativo": "ADA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "24/12/2024", "ativo": "LUMIA/USDT", "direcao": "LONG", "percentual": 60.60, "alvo": "4"},
      {"data": "25/12/2024", "ativo": "AIXB/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "25/12/2024", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "25/12/2024", "ativo": "KOMA/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "25/12/2024", "ativo": "ME/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "25/12/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 21.60, "alvo": "2"},
      {"data": "26/12/2024", "ativo": "DODX/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "26/12/2024", "ativo": "ZEC/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "26/12/2024", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "26/12/2024", "ativo": "ZEN/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "26/12/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "26/12/2024", "ativo": "LIT/USDT", "direcao": "LONG", "percentual": 201.40, "alvo": "11"},
      {"data": "27/12/2024", "ativo": "STEEM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "27/12/2024", "ativo": "THE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "27/12/2024", "ativo": "VIDT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "27/12/2024", "ativo": "NEAR/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
      {"data": "28/12/2024", "ativo": "SSV/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "28/12/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "28/12/2024", "ativo": "LIT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "29/12/2024", "ativo": "ICP/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "29/12/2024", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 20.60, "alvo": "2"},
      {"data": "29/12/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "29/12/2024", "ativo": "AVA/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "30/12/2024", "ativo": "NEIROETH/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
      {"data": "30/12/2024", "ativo": "SXP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "30/12/2024", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 41.60, "alvo": "3"},
      {"data": "30/12/2024", "ativo": "QNT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "30/12/2024", "ativo": "HOOK/USDT", "direcao": "LONG", "percentual": 60.40, "alvo": "4"},
      {"data": "30/12/2024", "ativo": "ALICE/USDT", "direcao": "LONG", "percentual": 80.80, "alvo": "5"},
      {"data": "31/12/2024", "ativo": "ACTION/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "31/12/2024", "ativo": "MEU/USDT", "direcao": "LONG", "percentual": 20.40, "alvo": "2"},
      {"data": "31/12/2024", "ativo": "CGPT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "31/12/2024", "ativo": "1000BONK/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "31/12/2024", "ativo": "TROY/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"}
    ].filter(trade => 
        trade.ativo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDirection === 'ALL' || trade.direcao === selectedDirection)
    ) : selectedMonth === 1 ? [
      {"data": "01/01/2025", "ativo": "GRT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "01/01/2025", "ativo": "XRP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "01/01/2025", "ativo": "POPCAT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "01/01/2025", "ativo": "ONODO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "02/01/2025", "ativo": "XAI/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "02/01/2025", "ativo": "ATA/USDT", "direcao": "SHORT", "percentual": 40.60, "alvo": "3"},
{"data": "02/01/2025", "ativo": "1000FLOKI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "02/01/2025", "ativo": "SYN/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
{"data": "02/01/2025", "ativo": "CELO/USDT", "direcao": "LONG", "percentual": 181.20, "alvo": "10"},
{"data": "03/01/2025", "ativo": "1000CHEEMS/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "03/01/2025", "ativo": "GRIFFAIN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "03/01/2025", "ativo": "1000CAT/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "04/01/2025", "ativo": "ATA/USDT", "direcao": "LONG", "percentual": 20.40, "alvo": "2"},
{"data": "04/01/2025", "ativo": "STEEM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "04/01/2025", "ativo": "SXP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "04/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 81.00, "alvo": "4"},
{"data": "04/01/2025", "ativo": "DF/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "05/01/2025", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "5"},
{"data": "05/01/2025", "ativo": "AIXBT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "05/01/2025", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 140.40, "alvo": "8"},
{"data": "05/01/2025", "ativo": "AXS/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
{"data": "05/01/2025", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "05/01/2025", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "06/01/2025", "ativo": "ONE/USDT", "direcao": "LONG", "percentual": 80.40, "alvo": "5"},
{"data": "06/01/2025", "ativo": "HIVE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "06/01/2025", "ativo": "ZEREBRO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "07/01/2025", "ativo": "ZEN/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "07/01/2025", "ativo": "VANA/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "07/01/2025", "ativo": "APT/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "07/01/2025", "ativo": "ENA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "07/01/2025", "ativo": "VIRTUAL/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "07/01/2025", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 180.80, "alvo": "10"},
{"data": "07/01/2025", "ativo": "ACT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "08/01/2025", "ativo": "FARTCOIN/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "08/01/2025", "ativo": "AI/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "08/01/2025", "ativo": "ALCH/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "08/01/2025", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "08/01/2025", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "08/01/2025", "ativo": "DOGS/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
{"data": "09/01/2025", "ativo": "GAS/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
{"data": "09/01/2025", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 100.20, "alvo": "6"},
{"data": "09/01/2025", "ativo": "GTC/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "09/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "09/01/2025", "ativo": "WAXP/USDT", "direcao": "LONG", "percentual": 40.40, "alvo": "3"},
{"data": "09/01/2025", "ativo": "POWR/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
{"data": "09/01/2025", "ativo": "IOST/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
{"data": "09/01/2025", "ativo": "FARTCOIN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "10/01/2025", "ativo": "RENDER/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "10/01/2025", "ativo": "ONDO/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "10/01/2025", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "10/01/2025", "ativo": "COOKIE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "10/01/2025", "ativo": "10000MOG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "11/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 100.20, "alvo": "6"},
{"data": "11/01/2025", "ativo": "VET/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "11/01/2025", "ativo": "T/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "11/01/2025", "ativo": "AVA/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "11/01/2025", "ativo": "XRP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "12/01/2025", "ativo": "BAN/USDT", "direcao": "SHORT", "percentual": 163.00, "alvo": "9"},
{"data": "12/01/2025", "ativo": "POPCAT/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "12/01/2025", "ativo": "COW/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "12/01/2025", "ativo": "WOO/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "12/01/2025", "ativo": "ADA/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "13/01/2025", "ativo": "BNX/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
{"data": "13/01/2025", "ativo": "SOL/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "13/01/2025", "ativo": "COMP/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
{"data": "13/01/2025", "ativo": "HOT/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
{"data": "13/01/2025", "ativo": "LQTY/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
{"data": "14/01/2025", "ativo": "CGPT/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
{"data": "15/01/2025", "ativo": "VIRTUAL/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "15/01/2025", "ativo": "NEAR/USDT", "direcao": "LONG", "percentual": 179.80, "alvo": "10"},
{"data": "15/01/2025", "ativo": "AI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "15/01/2025", "ativo": "SFP/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
{"data": "16/01/2025", "ativo": "ZEREBRO/USDT", "direcao": "LONG", "percentual": 79.80, "alvo": "5"},
{"data": "16/01/2025", "ativo": "VIDT/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "16/01/2025", "ativo": "AIXBT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "16/01/2025", "ativo": "IOST/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
{"data": "16/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "16/01/2025", "ativo": "MORPHO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "16/01/2025", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "17/01/2025", "ativo": "SPX/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "17/01/2025", "ativo": "MINA/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "17/01/2025", "ativo": "1000BONK/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
{"data": "17/01/2025", "ativo": "SPELL/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "18/01/2025", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "18/01/2025", "ativo": "UXLINK/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "18/01/2025", "ativo": "BEL/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "18/01/2025", "ativo": "LTC/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "18/01/2025", "ativo": "WLD/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "19/01/2025", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "19/01/2025", "ativo": "ONDO/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "19/01/2025", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "19/01/2025", "ativo": "1000PEPE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "19/01/2025", "ativo": "1000CAT/USDT", "direcao": "LONG", "percentual": 20.60, "alvo": "2"},
{"data": "19/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "19/01/2025", "ativo": "KAVA/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
{"data": "19/01/2025", "ativo": "SOLV/USDT", "direcao": "LONG", "percentual": 81.00, "alvo": "5"},
{"data": "19/01/2025", "ativo": "DOG/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "20/01/2025", "ativo": "AIXBT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "20/01/2025", "ativo": "ARC/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "20/01/2025", "ativo": "1000FLOKI/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "20/01/2025", "ativo": "OMNI/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "20/01/2025", "ativo": "SYN/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "20/01/2025", "ativo": "BEL/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "20/01/2025", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 21.20, "alvo": "2"},
{"data": "21/01/2025", "ativo": "SPX/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "21/01/2025", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "21/01/2025", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "21/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
{"data": "22/01/2025", "ativo": "ARC/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "22/01/2025", "ativo": "LIT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "22/01/2025", "ativo": "TRUMP/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "22/01/2025", "ativo": "DENT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "22/01/2025", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "23/01/2025", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 61.40, "alvo": "4"},
{"data": "23/01/2025", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 102.20, "alvo": "6"},
{"data": "23/01/2025", "ativo": "HBAR/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
{"data": "23/01/2025", "ativo": "D/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "23/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "23/01/2025", "ativo": "KSM/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
{"data": "23/01/2025", "ativo": "ONDO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "23/01/2025", "ativo": "SWARMS/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "24/01/2025", "ativo": "STEEM/USDT", "direcao": "SHORT", "percentual": 20.00, "alvo": "2"},
{"data": "24/01/2025", "ativo": "EIGEN/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "24/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
{"data": "25/01/2025", "ativo": "BB/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
{"data": "25/01/2025", "ativo": "ACT/USDT", "direcao": "SHORT", "percentual": 80.00, "alvo": "5"},
{"data": "25/01/2025", "ativo": "CHR/USDT", "direcao": "LONG", "percentual": 20.60, "alvo": "2"},
{"data": "25/01/2025", "ativo": "ALICE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "25/01/2025", "ativo": "COOKIE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "25/01/2025", "ativo": "VINE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "26/01/2025", "ativo": "MELANIA/USDT", "direcao": "LONG", "percentual": 40.40, "alvo": "3"},
{"data": "26/01/2025", "ativo": "SWARMS/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
{"data": "26/01/2025", "ativo": "D/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "26/01/2025", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "26/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "26/01/2025", "ativo": "GRUFFAIN/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
{"data": "27/01/2025", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
{"data": "27/01/2025", "ativo": "HOT/USDT", "direcao": "LONG", "percentual": 100.60, "alvo": "6"},
{"data": "27/01/2025", "ativo": "TRUMP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "27/01/2025", "ativo": "JUP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "28/01/2025", "ativo": "WIF/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "28/01/2025", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "28/01/2025", "ativo": "ACH/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "28/01/2025", "ativo": "RPL/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "28/01/2025", "ativo": "DUSK/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
{"data": "28/01/2025", "ativo": "ORDI/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
{"data": "29/01/2025", "ativo": "JUP/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "29/01/2025", "ativo": "AXL/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
{"data": "29/01/2025", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 160.20, "alvo": "9"},
{"data": "29/01/2025", "ativo": "TON/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
{"data": "29/01/2025", "ativo": "CELO/USDT", "direcao": "LONG", "percentual": 102.80, "alvo": "6"},
{"data": "29/01/2025", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 182.00, "alvo": "10"},
{"data": "30/01/2025", "ativo": "ARC/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
{"data": "30/01/2025", "ativo": "VINE/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "30/01/2025", "ativo": "1000CHEEMS/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "30/01/2025", "ativo": "W/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
{"data": "30/01/2025", "ativo": "RUNE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
{"data": "31/01/2025", "ativo": "ANIME/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "31/01/2025", "ativo": "TNSR/USDT", "direcao": "LONG", "percentual": 200.20, "alvo": "11"},
{"data": "31/01/2025", "ativo": "LDO/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
{"data": "31/01/2025", "ativo": "DEXE/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
{"data": "31/01/2025", "ativo": "PEOPLE/USDT", "direcao": "SHORT", "percentual": -90.00, "alvo": "-"},
{"data": "31/01/2025", "ativo": "DYDX/USDT", "direcao": "LONG", "percentual": 61.20, "alvo": "4"},
{"data": "31/01/2025", "ativo": "SKL/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
{"data": "31/01/2025", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"}
    ].filter(trade => 
        trade.ativo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDirection === 'ALL' || trade.direcao === selectedDirection)
    ) : []
  );

  const totalOperacoes = filteredData.length;
  const operacoesLucrativas = filteredData.filter(t => t.percentual > 0).length;
  const taxaAcerto = totalOperacoes > 0 ? ((operacoesLucrativas / totalOperacoes) * 100) : 0;
  const valorizacaoTotal = Number(filteredData.reduce((acc, curr) => acc + Number(curr.percentual), 0));

  useEffect(() => {
    console.log('Selected Month:', selectedMonth);
    console.log('Initial Trades:', initialTrades.map(trade => ({
      data: trade.data,
      month: getMonthFromDateString(trade.data)
    })));
  }, [selectedMonth, initialTrades]);

  const openCompleteResults = () => {
    Linking.openURL('https://futurostech.com/entradas');
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
        <TouchableOpacity 
          style={styles.completeResultsButton}
          onPress={openCompleteResults}
        >
          <Ionicons name="arrow-forward-circle-outline" size={20} color="#4ade80" />
          <Text style={styles.completeResultsButtonText}>Ver Mais</Text>
        </TouchableOpacity>

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
  completeResultsButton: {
    backgroundColor: 'transparent',
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  completeResultsButtonText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '500',
  },
}); 