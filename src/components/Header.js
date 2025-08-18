import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = ({ username, navigation, children }) => {
  const displayName = username || 'Guest';
  
  return (
    <LinearGradient
      colors={['#2E7D32', '#81C784']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi {displayName},</Text>
          <Text style={styles.subtitle}>Ready for today's quiz?</Text>
        </View>
        {children && (
          <View style={styles.rightContainer}>
            {children}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  rightContainer: {
    marginLeft: 16,
  },
});

export default Header; 