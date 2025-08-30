import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const TestScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;

  // Function to determine mock test type based on authority
  const getMockTestInfo = () => {
    const authorityCode = authority?.code?.toLowerCase() || authority?.name?.toLowerCase() || '';
    
    if (authorityCode.includes('nha') || authorityCode.includes('motorway')) {
      return {
        title: 'Mock Test - NHA',
        titleUrdu: 'نمونہ ٹیسٹ - این ایچ اے',
        description: 'Combined signs and rules test for NHA',
        quizType: 'nha'
      };
    } else if (authorityCode.includes('sindh')) {
      return {
        title: 'Mock Test - Sindh',
        titleUrdu: 'نمونہ ٹیسٹ - سندھ',
        description: 'Combined signs and rules test for Sindh',
        quizType: 'sindh'
      };
    } else {
      // For ITP, Punjab, KPK, Balochistan
      return {
        title: 'Mock Test',
        titleUrdu: 'نمونہ ٹیسٹ',
        description: 'Combined signs and rules test for multiple authorities',
        quizType: 'multiple'
      };
    }
  };

  const mockTestInfo = getMockTestInfo();

  const quizzes = [
    {
      id: '1',
      title: mockTestInfo.title,
      titleUrdu: mockTestInfo.titleUrdu,
      icon:'desktop-outline',
      description: mockTestInfo.description,
      color: '#16a085',
      onPress: () => navigation.navigate('MockQuiz', { 
        authority, 
        quizType: mockTestInfo.quizType,
        title: mockTestInfo.title
      })
    },
    {
      id: '2',
      title: 'Mandatory Road Signs',
      titleUrdu: 'لازمی روڈ سائنز',
      icon: 'checkmark-circle',
      description: 'Signs that must be obeyed',
      color: '#e74c3c',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'mandatory',
        categoryName: 'Mandatory Road Signs'
      })
    },
    {
      id: '3',
      title: 'Warning Road Signs',
      titleUrdu: 'انتباہی روڈ سائنز',
      icon: 'warning',
      description: 'Signs that warn of hazards',
      color: '#f39c12',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'warning',
        categoryName: 'Warning Road Signs'
      })
    },
    {
      id: '4',
      title: 'Informatory Road Signs',
      titleUrdu: 'معلوماتی روڈ سائنز',
      icon: 'information-circle',
      description: 'Signs that provide information',
      color: '#3498db',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'informatory',
        categoryName: 'Informatory Road Signs'
      })
    },
    {
      id: '5',
      title: 'Rules Quiz 1',
      titleUrdu: 'قوانین کا کوئز 1',
      icon: 'document-text',
      description: 'Basic traffic rules and regulations',
      color: '#8e44ad',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'rules1',
        categoryName: 'Rules Quiz 1'
      })
    },
    {
      id: '6',
      title: 'Rules Quiz 2',
      titleUrdu: 'قوانین کا کوئز 2',
      icon: 'document-text',
      description: 'Advanced traffic rules and safety',
      color: '#34495e',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'rules2',
        categoryName: 'Rules Quiz 2'
      })
    }
  ];

  const renderHeaderRight = () => null;

  const ListHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Test Center</Text>
      <Text style={styles.sectionSubtitle}>{authority?.name}</Text>
      <Text style={styles.description}>
        Choose a quiz to test your knowledge
      </Text>
    </View>
  );

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizCard}
      onPress={item.onPress}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          {typeof item.icon === 'string' ? (
            <Ionicons name={item.icon} size={32} color="white" />
          ) : (
            <Image 
              source={item.icon} 
              style={styles.iconImage} 
              resizeMode="contain"
            />
          )}
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
        pageTitle="Test Center"
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
  iconImage: {
    width: 32,
    height: 32,
    tintColor: 'white',
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

export default TestScreen;
