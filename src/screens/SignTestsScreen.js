import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const SignTestsScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;

  const signCategories = [
    {
      id: '1',
      title: 'Mandatory Road Signs',
      titleUrdu: 'لازمی روڈ سائنز',
      icon: 'checkmark-circle-outline',
      description: 'Signs that must be obeyed',
      color: '#e74c3c',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'mandatory',
        categoryName: 'Mandatory Road Signs'
      })
    },
    {
      id: '2',
      title: 'Warning Road Signs',
      titleUrdu: 'انتباہی روڈ سائنز',
      icon: 'warning-outline',
      description: 'Signs that warn of hazards',
      color: '#f39c12',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'warning',
        categoryName: 'Warning Road Signs'
      })
    },
    {
      id: '3',
      title: 'Informatory Road Signs',
      titleUrdu: 'معلوماتی روڈ سائنز',
      icon: 'information-circle-outline',
      description: 'Signs that provide information',
      color: '#3498db',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority, 
        category: 'informatory',
        categoryName: 'Informatory Road Signs'
      })
    }
  ];

  const handleProfilePress = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    navigation.navigate('Profile');
  };

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
      <Text style={styles.sectionTitle}>Sign Tests</Text>
      <Text style={styles.sectionSubtitle}>{authority?.name}</Text>
      <Text style={styles.description}>
        Choose a category to practice traffic sign recognition
      </Text>
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={item.onPress}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={32} color={item.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
          <Text style={styles.categoryTitleUrdu}>{item.titleUrdu}</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
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
        pageTitle="Sign Tests"
      >
        {renderHeaderRight()}
      </Header>
      <FlatList
        data={signCategories}
        renderItem={renderCategoryItem}
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
  categoryCard: {
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
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryTitleUrdu: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  categoryDescription: {
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

export default SignTestsScreen;
