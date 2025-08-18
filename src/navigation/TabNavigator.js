import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useUser } from '../contexts/UserContext';
import AboutScreen from '../screens/AboutScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useUser();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1B5E20',
        tabBarInactiveTintColor: 'gray',
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
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'trophy' : 'trophy-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
      {user ? (
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'heart' : 'heart-outline'} 
                size={size} 
                color={color} 
              />
            )
          }}
        />
      ) : null}
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'information-circle' : 'information-circle-outline'} 
              size={size} 
              color={color} 
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 