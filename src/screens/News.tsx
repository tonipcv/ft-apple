'use client';

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string;
  video?: string;
  publishedAt: string;
  isPro: boolean;
}

export default function NewsScreen() {
  const { user } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://adm-news.vercel.app/api/v1/news');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setNews(result.data);
      } else {
        console.error('Formato de dados inválido:', result);
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReadMore = async (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://adm-news.vercel.app/api/v1/news/${newsItem.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      
      if (result.success && result.data) {
        setSelectedNews({
          ...newsItem,
          title: result.data.title || newsItem.title,
          summary: result.data.summary || newsItem.summary,
          content: result.data.content || newsItem.content,
          image: result.data.image || newsItem.image,
          video: result.data.video || newsItem.video,
          publishedAt: result.data.publishedAt || newsItem.publishedAt,
          isPro: result.data.isPro || newsItem.isPro
        });
      }
    } catch (error) {
      console.error('Error fetching full news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNews().then(() => setRefreshing(false));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Relatórios</Text>
            <View style={styles.betaBadge}>
              <Text style={styles.betaText}>BETA</Text>
            </View>
          </View>
          <TouchableOpacity onPress={fetchNews} disabled={isLoading}>
            <Ionicons 
              name="refresh" 
              size={24} 
              color={isLoading ? "#666" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ade80" />
          </View>
        ) : currentItems.length > 0 ? (
          <>
            {currentItems.map((item) => (
              <View key={item.id} style={styles.newsCard}>
                <View style={styles.newsHeader}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  {item.isPro && (
                    <View style={styles.proBadge}>
                      <Text style={styles.proText}>PRO</Text>
                    </View>
                  )}
                </View>

                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.newsImage}
                    resizeMode="cover"
                  />
                )}

                <Text style={styles.newsSummary} numberOfLines={3}>
                  {item.summary}
                </Text>

                <View style={styles.newsFooter}>
                  <Text style={styles.newsDate}>
                    {formatDate(item.publishedAt)}
                  </Text>
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => handleReadMore(item)}
                  >
                    <Text style={styles.readMoreText}>Ler mais</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <TouchableOpacity
                  key={pageNumber}
                  style={[
                    styles.pageButton,
                    currentPage === pageNumber && styles.activePageButton
                  ]}
                  onPress={() => setCurrentPage(pageNumber)}
                >
                  <Text style={[
                    styles.pageButtonText,
                    currentPage === pageNumber && styles.activePageButtonText
                  ]}>
                    {pageNumber}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma notícia encontrada</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchNews}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedNews !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedNews(null)}
            >
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>

            {selectedNews && (
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                {selectedNews.image && (
                  <Image
                    source={{ uri: selectedNews.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.modalSummary}>{selectedNews.summary}</Text>
                {selectedNews.content && (
                  <Text style={styles.modalContent}>{selectedNews.content}</Text>
                )}
                <Text style={styles.modalDate}>
                  {formatDate(selectedNews.publishedAt)}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  betaBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  betaText: {
    color: '#4ade80',
    fontSize: 10,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  newsCard: {
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ade80',
    marginRight: 8,
  },
  proBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  proText: {
    color: '#4ade80',
    fontSize: 12,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  newsSummary: {
    color: '#999',
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  newsDate: {
    color: '#666',
    fontSize: 12,
  },
  readMoreButton: {
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readMoreText: {
    color: '#4ade80',
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePageButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  pageButtonText: {
    color: '#999',
    fontSize: 12,
  },
  activePageButtonText: {
    color: '#4ade80',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  retryText: {
    color: '#4ade80',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    maxHeight: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalSummary: {
    color: '#999',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  modalDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 16,
  },
}); 