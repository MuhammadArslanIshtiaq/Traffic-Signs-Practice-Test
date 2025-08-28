import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import app from './src/config/firebase';
import { AuthorityProvider } from './src/contexts/AuthorityContext';
import { UserProvider } from './src/contexts/UserContext';
import TabNavigator from './src/navigation/TabNavigator';

import FinesScreen from './src/screens/FinesScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import GeneralInfoScreen from './src/screens/GeneralInfoScreen';
import LearningMaterialScreen from './src/screens/LearningMaterialScreen';
import LicenseFeeDetailScreen from './src/screens/LicenseFeeDetailScreen';
import LicenseFeesScreen from './src/screens/LicenseFeesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Quiz from './src/screens/Quiz';
import QuizHistoryScreen from './src/screens/QuizHistoryScreen';
import QuizPreStart from './src/screens/QuizPreStart';
import RequirementDetailScreen from './src/screens/RequirementDetailScreen';
import RequirementsScreen from './src/screens/RequirementsScreen';
import RoadSignsScreen from './src/screens/RoadSignsScreen';
import RulesContentScreen from './src/screens/RulesContentScreen';
import RulesScreen from './src/screens/RulesScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignQuizScreen from './src/screens/SignQuizScreen';
import SignTestsScreen from './src/screens/SignTestsScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import VideosScreen from './src/screens/VideosScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    if (app) {
      setIsFirebaseInitialized(true);
    }
  }, []);

  if (!isFirebaseInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <AuthorityProvider>
          <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />

            <Stack.Screen name="QuizPreStart" component={QuizPreStart} />
            <Stack.Screen name="Quiz" component={Quiz} />
            <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SignTests" component={SignTestsScreen} />
            <Stack.Screen name="SignQuiz" component={SignQuizScreen} />
            <Stack.Screen name="LearningMaterial" component={LearningMaterialScreen} />
            <Stack.Screen name="RoadSigns" component={RoadSignsScreen} />
            <Stack.Screen name="Rules" component={RulesScreen} />
            <Stack.Screen name="RulesContent" component={RulesContentScreen} />
            <Stack.Screen name="Videos" component={VideosScreen} />
            <Stack.Screen name="GeneralInfo" component={GeneralInfoScreen} />
            <Stack.Screen name="Requirements" component={RequirementsScreen} />
            <Stack.Screen name="RequirementDetail" component={RequirementDetailScreen} />
            <Stack.Screen name="LicenseFees" component={LicenseFeesScreen} />
            <Stack.Screen name="LicenseFeeDetail" component={LicenseFeeDetailScreen} />
            <Stack.Screen name="Fines" component={FinesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        </AuthorityProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
} 