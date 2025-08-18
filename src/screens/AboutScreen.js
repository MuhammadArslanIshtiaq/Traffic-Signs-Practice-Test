import { Ionicons } from '@expo/vector-icons';
import Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import React from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

const AboutScreen = ({ navigation }) => {
  const { user } = useUser();
  const appVersion = Constants.manifest.version || '1.0.0';
  const currentYear = new Date().getFullYear();

  const handleContactPress = async () => {
    const subject = 'Quiz App Support Request';
    const userInfo = user ? `\n\nUser Info:\nEmail: ${user.email}\nName: ${user.displayName}` : '';
    const deviceInfo = `\n\nDevice Info:\nPlatform: ${Platform.OS}\nVersion: ${Platform.Version}`;
    const appInfo = `\nApp Version: ${appVersion}`;
    
    const body = `${userInfo}${deviceInfo}${appInfo}\n\nPlease describe your issue:`;
    const email = 'support@quizapp.com';

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        throw new Error('No email app found');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open email app. Please send an email manually to support@quizapp.com',
        [
          { text: 'Copy Email', onPress: () => copyToClipboard('support@quizapp.com') },
          { text: 'OK' }
        ]
      );
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Success', 'Email address copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#2E7D32', '#81C784']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{appVersion}</Text>
            <Text style={styles.statLabel}>Version</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentYear}</Text>
            <Text style={styles.statLabel}>Release Year</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            Quiz App is your go-to platform for testing and expanding your knowledge across various subjects. 
            With multiple categories including Science, Mathematics, Physics, Chemistry, Biology, and Cosmology, 
            there's always something new to learn!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="book-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Multiple Quiz Categories</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="heart-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Save Favorite Quizzes</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="trophy-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Compete on Leaderboard</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Track Your Progress</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.description}>
            Having issues or questions? Our support team is here to help! Click the button below to contact us.
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
            <Ionicons name="mail-outline" size={24} color="white" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© {currentYear} Quiz App. All rights reserved.</Text>
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
  header: {
    paddingTop: 48,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 24,
  },
  scrollContentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});

export default AboutScreen; 