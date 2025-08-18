import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizPreStartScreen from '../screens/QuizPreStartScreen';
import QuizScreen from '../screens/QuizScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import QuizHistoryScreen from '../screens/QuizHistoryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QuizPreStart" component={QuizPreStartScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 