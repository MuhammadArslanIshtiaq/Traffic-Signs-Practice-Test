import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const VideosScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={28} color="white" />
    </TouchableOpacity>
  );

  // Extract video ID from YouTube URL
  const videoId = 'jYeRHcsuMsk';
  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16; // 16:9 aspect ratio

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Educational Videos"
      >
        {renderHeaderRight()}
      </Header>
      <View style={styles.content}>
        <Text style={styles.title}>Traffic Rules Video</Text>
        <Text style={styles.subtitle}>Learn important traffic rules</Text>
        
        {/* YouTube Video */}
        <View style={[styles.videoContainer, { height: videoHeight }]}>
          <WebView
            source={{
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body { margin: 0; padding: 0; background: #000; }
                      .video-container { 
                        position: relative; 
                        width: 100%; 
                        height: 100%; 
                        overflow: hidden; 
                      }
                      iframe { 
                        width: 100%; 
                        height: 100%; 
                        border: none; 
                      }
                    </style>
                  </head>
                  <body>
                    <div class="video-container">
                      <iframe 
                        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                      </iframe>
                    </div>
                  </body>
                </html>
              `
            }}
            style={styles.webview}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
        
        <Text style={styles.description}>
          Watch this educational video to learn important traffic rules and regulations.
        </Text>
        <Text style={styles.authorityText}>
          {authority?.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoContainer: {
    width: '100%',
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  webview: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    marginTop: 16,
  },
  authorityText: {
    fontSize: 14,
    color: '#115740',
    fontWeight: '600',
    textAlign: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideosScreen;
