import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface Episode {
  id: number;
  title: string;
  duration: string;
  number: number;
  videoId: string;
  blocked?: boolean;
}

export default function Courses() {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);

  const episodes: Episode[] = [
    {
      id: 1,
      title: "Criando Conta",
      duration: "5:00",
      number: 1,
      videoId: "5395e307-c953-4f5f-b488-05c7663e936e"
    },
    {
      id: 2,
      title: "Como abrir operações",
      duration: "8:00",
      number: 2,
      videoId: "77a18ba6-0b61-4404-84e1-439ac21939b6"
    },
    {
      id: 3,
      title: "Ordens Automáticas",
      duration: "7:00",
      number: 3,
      videoId: "2346652c-0339-4e70-9b79-d38cce3a3e66"
    },
    {
      id: 4,
      title: "Indicador RSI",
      duration: "6:30",
      number: 4,
      videoId: "d529afa3-5e48-4f0e-8d7b-4bd1340d8c11"
    },
    {
      id: 5,
      title: "Análise gráfica",
      duration: "7:30",
      number: 5,
      videoId: "32763169-e418-4aee-a0df-b07db05f1843"
    },
    {
      id: 6,
      title: "Gerenciamento",
      duration: "6:00",
      number: 6,
      videoId: "c3853fe1-2f07-4215-9778-a20ed81d1b23"
    },
    {
      id: 7,
      title: "Informação Importante!",
      duration: "6:00",
      number: 7,
      videoId: "c689c709-5643-4fb6-be32-6f080a5f5066"
    },
    {
      id: 8,
      title: "Estratégia Exclusiva 1",
      duration: "8:00",
      number: 8,
      videoId: "blocked",
      blocked: true
    },
    {
      id: 9,
      title: "Estratégia Exclusiva 2",
      duration: "10:00",
      number: 9,
      videoId: "blocked",
      blocked: true
    },
    {
      id: 10,
      title: "Estratégia Exclusiva 3",
      duration: "7:00",
      number: 10,
      videoId: "blocked",
      blocked: true
    }
  ];

  const currentEpisode = episodes.find(ep => ep.id === activeEpisode);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {currentEpisode ? (
        <View style={styles.videoContainer}>
          <WebView
            source={{
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                        background-color: black;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                      }
                      .video-container {
                        position: relative;
                        width: 100%;
                        padding-top: 56.25%;
                      }
                      iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border: none;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="video-container">
                      <iframe
                        src="https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=${currentEpisode.videoId}"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                        allowfullscreen="true"
                      ></iframe>
                    </div>
                  </body>
                </html>
              `
            }}
            style={styles.video}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setActiveEpisode(null)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.videoTitle}>{currentEpisode.title}</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.content}>
            <View style={styles.episodesSection}>
              <Text style={styles.sectionTitle}>Curso Gratuito</Text>
              {episodes.map((episode) => (
                <TouchableOpacity
                  key={episode.id}
                  style={[
                    styles.episodeCard,
                    activeEpisode === episode.id && styles.episodeCardActive,
                    episode.blocked && styles.episodeCardBlocked
                  ]}
                  onPress={() => !episode.blocked && setActiveEpisode(episode.id)}
                  disabled={episode.blocked}
                >
                  <View style={styles.episodeContent}>
                    <View style={styles.episodeInfo}>
                      <Text style={styles.episodeNumber}>Aula {episode.number}</Text>
                      <Text style={styles.episodeTitle}>{episode.title}</Text>
                      <Text style={styles.episodeDuration}>{episode.duration}</Text>
                    </View>
                    
                    {!episode.blocked ? (
                      <Ionicons name="play-circle-outline" size={24} color="#4ade80" />
                    ) : (
                      <View style={styles.blockedBadge}>
                        <Text style={styles.blockedText}>Em breve...</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Assista o curso:</Text>
                <Text style={styles.infoText}>
                  A tecnologia é a melhor ferramenta hoje para operar, mas sem saber como usar você não terá o aproveitamento máximo.
                </Text>
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    Este conteúdo tem caráter informativo e educacional.
                  </Text>
                </View>
              </View>

              <View style={styles.premiumCard}>
                <Text style={styles.premiumTitle}>Acesso Premium</Text>
                <Text style={styles.premiumText}>
                  Desbloqueie acesso completo aos entradas, treinamento completo e materiais exclusivos.
                </Text>
                <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeButtonText}>Fazer Upgrade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
  },
  episodesSection: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  episodeCard: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  episodeCardActive: {
    backgroundColor: '#333',
    borderLeftWidth: 4,
    borderLeftColor: '#4ade80',
  },
  episodeCardBlocked: {
    opacity: 0.5,
  },
  episodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  episodeInfo: {
    flex: 1,
    marginRight: 16,
  },
  episodeNumber: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  episodeDuration: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  blockedBadge: {
    backgroundColor: 'rgba(31,41,55,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  blockedText: {
    color: '#fff',
    fontSize: 12,
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(17,24,39,0.5)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: 'rgba(4,120,87,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(4,120,87,0.5)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    color: '#4ade80',
    fontSize: 12,
  },
  premiumCard: {
    backgroundColor: 'rgba(17,24,39,0.5)',
    borderRadius: 8,
    padding: 16,
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  premiumText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  upgradeButton: {
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '500',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#111',
  },
}); 