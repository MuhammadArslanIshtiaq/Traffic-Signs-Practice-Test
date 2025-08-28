import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const RequirementDetailScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { requirement } = route.params;
  const [webViewHeight, setWebViewHeight] = useState(300);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="#115740" />
    </TouchableOpacity>
  );

  // HTML template for WebView to display rich content
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 16px;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        * {
          max-width: 100%;
          box-sizing: border-box;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #115740;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        p {
          margin-bottom: 16px;
          font-size: 16px;
        }
        strong {
          color: #115740;
          font-weight: 600;
        }
        ul, ol {
          padding-left: 20px;
          margin-bottom: 16px;
        }
        li {
          margin-bottom: 8px;
          font-size: 16px;
        }
        blockquote {
          border-left: 4px solid #115740;
          margin: 16px 0;
          padding-left: 16px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        .highlight {
          background-color: #fff3cd;
          padding: 2px 4px;
          border-radius: 3px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
      </style>
      <script>
        window.addEventListener('load', function() {
          // Send the content height to React Native
          const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(height.toString());
          }
        });
      </script>
    </head>
    <body>
      ${requirement.rich_content || requirement.description || 'No detailed content available.'}
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Requirement Details"
      >
        {renderHeaderRight()}
      </Header>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{requirement.title}</Text>
          <Text style={styles.description}>{requirement.description}</Text>
        </View>

        {/* Rich Content Section */}
        {requirement.rich_content && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Detailed Information</Text>
            <View style={[styles.webViewContainer, { height: webViewHeight }]}>
              <WebView
                source={{ html: htmlTemplate }}
                style={[styles.webView, { height: webViewHeight }]}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                onMessage={(event) => {
                  // Auto-resize WebView based on content height
                  const height = parseInt(event.nativeEvent.data);
                  if (height > 0 && height !== webViewHeight) {
                    setWebViewHeight(Math.max(height + 50, 300)); // Add some padding
                  }
                }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={false}
              />
            </View>
          </View>
        )}

        {/* Action Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.backButtonText}>Back to Requirements</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  headerSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  contentSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  webViewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  webView: {
    backgroundColor: 'transparent',
  },

  actionSection: {
    marginTop: 8,
  },
  backButton: {
    backgroundColor: '#115740',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default RequirementDetailScreen;
