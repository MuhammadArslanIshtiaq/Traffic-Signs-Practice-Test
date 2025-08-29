import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const VideosScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthority, setSelectedAuthority] = useState('All');

  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16; // 16:9 aspect ratio

  const handleBackPress = () => {
    navigation.goBack();
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch videos from the dedicated videos endpoint
      const response = await fetch('https://sup-admin-quizly.vercel.app/api/public/videos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('=== VIDEOS API RESPONSE DEBUG ===');
      console.log('Full API Response:', data);
      console.log('Response type:', typeof data);
      console.log('Is Array:', Array.isArray(data));
      if (data && typeof data === 'object') {
        console.log('Response keys:', Object.keys(data));
      }
      console.log('================================');
      
      // Handle the videos API structure (much simpler!)
      let videoData = [];
      
      // Get the videos array from the response
      let videosArray = [];
      
      if (data && typeof data === 'object') {
        // Check common response patterns
        if (data.success && data.videos) {
          videosArray = data.videos;
          console.log('Found videos in data.videos');
        } else if (data.success && data.data) {
          videosArray = data.data;
          console.log('Found videos in data.data');
        } else if (data.videos) {
          videosArray = data.videos;
          console.log('Found videos in data.videos (no success flag)');
        } else if (data.data) {
          videosArray = data.data;
          console.log('Found videos in data.data (no success flag)');
        } else if (Array.isArray(data)) {
          videosArray = data;
          console.log('Response is direct videos array');
        } else {
          // Look for any array property
          const arrayProps = Object.keys(data).filter(key => Array.isArray(data[key]));
          if (arrayProps.length > 0) {
            videosArray = data[arrayProps[0]];
            console.log(`Found videos array in property: ${arrayProps[0]}`);
          }
        }
      } else if (Array.isArray(data)) {
        videosArray = data;
        console.log('Response is direct videos array');
      }
      
      console.log('Videos array found:', videosArray);
      console.log('Videos array length:', videosArray.length);
      
      if (Array.isArray(videosArray) && videosArray.length > 0) {
        console.log('=== PROCESSING VIDEOS ===');
        console.log(`Processing ${videosArray.length} videos...`);
        
        // Debug each video
        videosArray.forEach((video, index) => {
          console.log(`Video ${index}:`, {
            id: video.id,
            title: video.title,
            description: video.description,
            link: video.link,
            authority: video.authority,
            created_at: video.created_at,
            updated_at: video.updated_at
          });
        });
        
        // Process each item in the videos array
        // Some items might be video containers with data arrays, others might be direct videos
        videosArray.forEach((item, index) => {
          console.log(`Processing item ${index}:`, item);
          
          // Check if this item has a data array (nested videos)
          if (item.data && Array.isArray(item.data)) {
            console.log(`Item ${index} contains ${item.data.length} nested videos`);
            
            // Extract videos from the data array
            const nestedVideos = item.data.map((video, videoIndex) => ({
              ...video,
              id: `${item.id}_${videoIndex}`,
              container_title: item.title,
              container_description: item.description,
              created_at: item.created_at,
              updated_at: item.updated_at
            }));
            
            videoData.push(...nestedVideos);
            console.log(`Added ${nestedVideos.length} videos from container "${item.title}"`);
            
          } else if (item.title && (item.link || item.url)) {
            // This is a direct video item
            console.log(`Item ${index} is a direct video: "${item.title}"`);
            videoData.push(item);
            
          } else {
            // Invalid item
            console.warn('Invalid video item:', item);
          }
        });
        
        console.log(`Found ${videoData.length} total videos`);
      } else {
        console.warn('No videos array found or array is empty');
      }
      
      console.log('Final video data:', videoData); // Debug log
      
      // Sort by date (newest first)
      const sortedVideos = videoData.sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at || 0);
        const bDate = new Date(b.updated_at || b.created_at || 0);
        return bDate.getTime() - aDate.getTime();
      });
      
      setVideos(sortedVideos);
      setFilteredVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(`Failed to load videos: ${error.message}`);
      
      // Fallback mock data for the videos endpoint
      const mockVideos = [
        {
          id: "1",
          title: "How to pass L Shape Test",
          link: "https://www.youtube.com/watch?v=C_L0RbOUq1Y",
          authority: "All Pakistan",
          description: "A comprehensive guide on how to successfully navigate and pass the L-shape driving test, applicable across Pakistan.",
          created_at: "2025-01-15T10:30:00Z",
          updated_at: "2025-01-15T10:30:00Z"
        },
        {
          id: "2",
          title: "Guide to obtain Driving License In Punjab",
          link: "https://www.youtube.com/watch?v=5Xs-awoSmhw",
          authority: "Punjab",
          description: "Step-by-step instructions for obtaining a driving license specifically in the Punjab province.",
          created_at: "2025-01-14T10:30:00Z",
          updated_at: "2025-01-14T10:30:00Z"
        },
        {
          id: "3",
          title: "Guide to obtain Driving License In Islamabad",
          link: "https://www.youtube.com/watch?v=96yHwjotAF8",
          authority: "ITP",
          description: "Detailed information and procedures for acquiring a driving license from the Islamabad Traffic Police (ITP).",
          created_at: "2025-01-13T10:30:00Z",
          updated_at: "2025-01-13T10:30:00Z"
        }
      ];
      
      setVideos(mockVideos);
      setFilteredVideos(mockVideos);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorityFilter = (authority) => {
    setSelectedAuthority(authority);
    if (authority === 'All') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.authority?.toUpperCase() === authority.toUpperCase() ||
        video.authority?.toUpperCase().includes(authority.toUpperCase())
      );
      setFilteredVideos(filtered);
    }
  };

  const getUniqueAuthorities = () => {
    const authorities = videos.map(video => video.authority).filter(Boolean);
    const uniqueAuthorities = [...new Set(authorities)];
    return ['All', ...uniqueAuthorities.sort()];
  };

  const extractVideoId = (videoLink) => {
    if (!videoLink) return null;
    
    // Extract YouTube video ID from various formats
    const patterns = [
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = videoLink.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    handleAuthorityFilter(selectedAuthority);
  }, [videos]);

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={28} color="white" />
    </TouchableOpacity>
  );

  const renderVideoCard = ({ item, index }) => {
    const videoId = extractVideoId(item.link || item.url);
    
    // Set gradient colors based on authority
    const getGradientByAuthority = (authority) => {
      if (!authority) return ['#667eea', '#764ba2'];
      
      const auth = authority.toUpperCase();
      if (auth.includes('PUNJAB')) return ['#4ECDC4', '#44A08D'];
      if (auth.includes('ITP') || auth.includes('ISLAMABAD')) return ['#FF6B6B', '#FF8E53'];
      if (auth.includes('SINDH')) return ['#4facfe', '#00f2fe'];
      if (auth.includes('BALOCHISTAN')) return ['#F093FB', '#F5576C'];
      if (auth.includes('NHA') || auth.includes('MOTORWAY')) return ['#77ede8', '#fa98b8'];
      if (auth.includes('ALL PAKISTAN')) return ['#45B7D1', '#96C93D'];
      
      return ['#667eea', '#764ba2']; // Default gradient
    };
    
    const gradientColors = getGradientByAuthority(item.authority);
    
    return (
      <View style={styles.videoCard}>
        <LinearGradient
          colors={gradientColors}
          style={styles.videoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.videoHeader}>
            <View style={styles.videoIcon}>
              <Ionicons name="play-circle" size={40} color="white" />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoAuthority} numberOfLines={1}>
                {item.authority}
              </Text>
              <Text style={styles.videoDescription}>
                {item.description}
              </Text>
            </View>
          </View>
        </LinearGradient>
        
        {videoId && (
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
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="videocam-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Videos Found</Text>
      <Text style={styles.emptyText}>
        {selectedAuthority !== 'All' 
          ? `No videos found for ${selectedAuthority}. Try selecting a different authority.`
          : 'No educational videos are available at the moment.'
        }
      </Text>
      {selectedAuthority !== 'All' && (
        <TouchableOpacity style={styles.clearFilterButton} onPress={() => handleAuthorityFilter('All')}>
          <Text style={styles.clearFilterButtonText}>Show All Videos</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAuthorityFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter by Authority:</Text>
      <View style={styles.authorityChipsContainer}>
        {getUniqueAuthorities().map((authority) => (
          <TouchableOpacity
            key={authority}
            style={[
              styles.authorityChip,
              selectedAuthority === authority && styles.selectedAuthorityChip
            ]}
            onPress={() => handleAuthorityFilter(authority)}
          >
            <Text style={[
              styles.authorityChipText,
              selectedAuthority === authority && styles.selectedAuthorityChipText
            ]}>
              {authority}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Error Loading Videos</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchVideos}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={filteredVideos}
            renderItem={renderVideoCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderAuthorityFilter}
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      )}
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
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#115740',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  authorityChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  authorityChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedAuthorityChip: {
    backgroundColor: '#115740',
    borderColor: '#115740',
  },
  authorityChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedAuthorityChipText: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  videoCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  videoGradient: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  videoAuthority: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  videoDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#000',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFilterButton: {
    backgroundColor: '#115740',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFilterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VideosScreen;
