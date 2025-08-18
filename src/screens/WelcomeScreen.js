import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#2E7D32', '#81C784']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={80} color="white" />
          </View>
          
          <Text style={styles.title}>Welcome to Quizly</Text>
          <Text style={styles.subtitle}>Test your knowledge and challenge yourself!</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.signUpButton]}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.signInButton]}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={[styles.buttonText, styles.signInText]}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.guestButton]}
              onPress={() => navigation.replace('Main')}
            >
              <Text style={[styles.buttonText, styles.guestButtonText]}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButton: {
    backgroundColor: '#1B5E20',
  },
  signInButton: {
    backgroundColor: 'white',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  signInText: {
    color: '#2E7D32',
  },
  guestButtonText: {
    color: 'white',
  },
});

export default WelcomeScreen; 