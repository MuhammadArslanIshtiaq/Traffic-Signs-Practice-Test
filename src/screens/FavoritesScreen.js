import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { quizzes } from '../data/quizzes';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useUser();
  
  const favoriteQuizzes = quizzes.filter(quiz => favorites.includes(quiz.id));

  const getGradientColors = (index) => {
    const gradients = [
      ['#FF9966', '#FF5E62'],
      ['#4E65FF', '#92EFFD'],
      ['#6F86D6', '#48C6EF'],
      ['#FA8BFF', '#2BD2FF'],
    ];
    return gradients[index % gradients.length];
  };

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
              onPress={() => toggleFavorite(item.id)}
              style={styles.favoriteButton}
            >
              <Ionicons
                name="heart"
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

  if (favoriteQuizzes.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <LinearGradient
          colors={['#115740', '#1a7a5a']}
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
            <Text style={styles.headerTitle}>Favorites</Text>
            <View style={styles.backButton} />
          </View>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No favorite quizzes yet</Text>
          <Text style={styles.emptySubText}>
            Tap the heart icon on quizzes to add them to your favorites
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#115740', '#1a7a5a']}
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
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favoriteQuizzes.length}</Text>
            <Text style={styles.statLabel}>Favorite Quizzes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favoriteQuizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}</Text>
            <Text style={styles.statLabel}>Total Questions</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={favoriteQuizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    padding: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritesScreen; 