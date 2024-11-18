import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { WebView } from 'react-native-webview';

interface Episode {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  number: number;
  videoId: string;
}

export default function Courses() {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);

  const episodes: Episode[] = [
    {
      id: 1,
      title: "Como pegar as entradas dos sinais da forma correta",
      duration: "2:30",
      thumbnail: "/teaser-thumb.jpg",
      number: 1,
      videoId: "35186692-adde-4280-819f-e35af9ece710"
    },
    {
      id: 2,
      title: "Como ativar as notificações do Grupo de Sinais",
      duration: "2:30",
      thumbnail: "/teaser-thumb2.jpg",
      number: 2,
      videoId: "357a2661-4c22-4244-b57e-a9be0244af50"
    }
  ];

  const currentEpisode = episodes.find(ep => ep.id === activeEpisode);

  return (
    <View style={styles.container}>
      {currentEpisode ? (
        // Video Player View
        <View style={styles.videoContainer}>
          <WebView
            source={{ 
              uri: `https://player.pandavideo.com.br/embed/?v=${currentEpisode.videoId}&autoplay=true` 
            }}
            style={styles.video}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setActiveEpisode(null)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.videoTitle}>{currentEpisode.title}</Text>
        </View>
      ) : (
        // Course Content View
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Curso Futuros Tech</Text>
            <Text style={styles.headerSubtitle}>
              Passo a passo para ter um aproveitamento máximo com as entradas da tecnologia
            </Text>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.episodesSection}>
              <Text style={styles.sectionTitle}>Episódios</Text>
              {episodes.map((episode) => (
                <TouchableOpacity
                  key={episode.id}
                  style={[
                    styles.episodeCard,
                    activeEpisode === episode.id && styles.episodeCardActive
                  ]}
                  onPress={() => setActiveEpisode(episode.id)}
                >
                  <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.episodeThumbnail}
                  />
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeNumber}>Aula {episode.number}</Text>
                    <Text style={styles.episodeTitle}>{episode.title}</Text>
                    <Text style={styles.episodeDuration}>{episode.duration}</Text>
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

              <View style={styles.materialsCard}>
                <Text style={styles.materialsTitle}>Materiais Complementares</Text>
                <TouchableOpacity 
                  style={styles.materialLink}
                  onPress={() => {/* Implement link handling */}}
                >
                  <Text style={styles.materialLinkText}>Black Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}
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
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 14,
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
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  episodeCardActive: {
    backgroundColor: '#333',
    borderLeftWidth: 4,
    borderLeftColor: '#4ade80',
  },
  episodeThumbnail: {
    width: 100,
    height: 60,
    borderRadius: 4,
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 12,
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
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
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
    backgroundColor: 'rgba(4, 120, 87, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(4, 120, 87, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    color: '#4ade80',
    fontSize: 12,
  },
  materialsCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 8,
    padding: 16,
  },
  materialsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  materialLink: {
    padding: 8,
    borderRadius: 8,
  },
  materialLinkText: {
    color: '#fff',
    fontSize: 14,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9/16),
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#111',
  },
}); 