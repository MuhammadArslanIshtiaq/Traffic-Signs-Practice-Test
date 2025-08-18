import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';
import { quizzes } from '../data/quizzes';

const HomeScreen = ({ navigation }) => {
  const { user, favorites, toggleFavorite } = useUser();

  const handleFavoritePress = (quizId) => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to save quizzes to your favorites.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => navigation.navigate('SignIn') }
        ]
      );
      return;
    }
    toggleFavorite(quizId);
  };

  const handleProfilePress = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    navigation.navigate('Profile');
  };

  const getGradientColors = (index) => {
    const gradients = [
      ['#FF9966', '#FF5E62'],
      ['#4E65FF', '#92EFFD'],
      ['#6F86D6', '#48C6EF'],
      ['#FA8BFF', '#2BD2FF'],
    ];
    return gradients[index % gradients.length];
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleProfilePress}
    >
      <Ionicons name="person-circle-outline" size={28} color="white" />
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.welcomeText}>Welcome, {user?.displayName || 'Guest'}!</Text>
      <Text style={styles.sectionTitle}>Let's Play</Text>
    </View>
  );

  const renderQuizItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.quizCard}
      onPress={() => navigation.navigate('QuizPreStart', { quiz: item })}
    >
      <LinearGradient
        colors={getGradientColors(index)}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => handleFavoritePress(item.id)}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.quizDescription}>{item.description}</Text>
          <View style={styles.quizInfo}>
            <Text style={styles.quizInfoText}>
              <Ionicons name="help-circle-outline" size={16} color="white" /> {item.questions.length} Questions
            </Text>
            <Text style={styles.quizInfoText}>
              <Ionicons name="time-outline" size={16} color="white" /> {item.timeLimit} mins
            </Text>
          </View>
        </View>
      </LinearGradient>
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
      <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  quizCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  quizDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizInfoText: {
    color: 'white',
    fontSize: 14,
  },
  headerButton: {
    padding: 8,
  },
});

export default HomeScreen; 