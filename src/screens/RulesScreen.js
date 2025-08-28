import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const RulesScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;

  const rulesQuizzes = [
    {
      id: '1',
      title: 'Rules Quiz 1',
      titleUrdu: 'قوانین کا کوئز 1',
      icon: 'document-text-outline',
      description: 'Basic traffic rules and regulations',
      color: '#3498db',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'rules1',
        categoryName: 'Rules Quiz 1'
      })
    },
    {
      id: '2',
      title: 'Rules Quiz 2',
      titleUrdu: 'قوانین کا کوئز 2',
      icon: 'document-text-outline',
      description: 'Advanced traffic rules and safety',
      color: '#2980b9',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'rules2',
        categoryName: 'Rules Quiz 2'
      })
    }
  ];

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={28} color="white" />
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.welcomeText}>Welcome, {user?.displayName || 'Guest'}!</Text>
      <Text style={styles.sectionTitle}>Rules Tests</Text>
      <Text style={styles.sectionSubtitle}>{authority?.name}</Text>
      <Text style={styles.description}>
        Choose a quiz to practice traffic rules and regulations
      </Text>
    </View>
  );

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizCard}
      onPress={item.onPress}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={32} color={item.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.quizTitle}>{item.title}</Text>
          <Text style={styles.quizTitleUrdu}>{item.titleUrdu}</Text>
          <Text style={styles.quizDescription}>{item.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={24} color="#115740" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Rules Tests"
      >
        {renderHeaderRight()}
      </Header>
      <FlatList
        data={rulesQuizzes}
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#888',
    lineHeight: 22,
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  quizTitleUrdu: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    color: '#888',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RulesScreen;
