import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useAuthority } from '../contexts/AuthorityContext';
import { useUser } from '../contexts/UserContext';
import HomeScreen from '../screens/HomeScreen';
import LearningMaterialScreen from '../screens/LearningMaterialScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TestScreen from '../screens/TestScreen';

const Tab = createBottomTabNavigator();

// Guest restriction wrapper component
const GuestRestrictedScreen = ({ children, navigation, screenName }) => {
  const { user } = useUser();

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header 
          username={null} 
          navigation={navigation}
          pageTitle={screenName}
        />
        <View style={styles.guestContent}>
          <Ionicons name="lock-closed-outline" size={64} color="#ccc" />
          <Text style={styles.guestTitle}>Sign In Required</Text>
          <Text style={styles.guestMessage}>
            You need to sign in to access {screenName.toLowerCase()}. Create an account or sign in to track your progress and customize your settings.
          </Text>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return children;
};

// Wrapped Progress Screen
const WrappedProgressScreen = (props) => (
  <GuestRestrictedScreen {...props} screenName="Progress">
    <ProgressScreen {...props} />
  </GuestRestrictedScreen>
);

// Wrapped Settings Screen
const WrappedSettingsScreen = (props) => (
  <GuestRestrictedScreen {...props} screenName="Settings">
    <SettingsScreen {...props} />
  </GuestRestrictedScreen>
);

const TabNavigator = () => {
  const { selectedAuthority } = useAuthority();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#115740',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: selectedAuthority ? 'flex' : 'none',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearningMaterialScreen}
        initialParams={{ authority: selectedAuthority }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'school' : 'school-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Test" 
        component={TestScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'document-text' : 'document-text-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
            <Tab.Screen 
        name="Progress"
        component={WrappedProgressScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'stats-chart' : 'stats-chart-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={WrappedSettingsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  guestContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  guestMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: '#115740',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TabNavigator; 