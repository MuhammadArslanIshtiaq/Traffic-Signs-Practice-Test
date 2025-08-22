import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const SettingsScreen = ({ navigation }) => {
  const { user } = useUser();

  const handleProfilePress = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    navigation.navigate('Profile');
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleProfilePress}
    >
      <Ionicons name="person-circle-outline" size={28} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
      >
        {renderHeaderRight()}
      </Header>
      <View style={styles.content}>
        <Ionicons name="settings-outline" size={64} color="#ccc" />
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Text style={styles.description}>
          Customize your app preferences, notifications, and account settings.
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  headerButton: {
    padding: 8,
  },
});

export default SettingsScreen;
