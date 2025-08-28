import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const AuthorityScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;

  const authorityOptions = [
    {
      id: '1',
      title: 'Sign Tests',
      titleUrdu: 'سائن ٹیسٹ',
      icon: require('../assets/images/SignTest.png'),
      description: 'Practice traffic sign recognition',
      onPress: () => navigation.navigate('SignTests', { authority })
    },
    {
      id: '2',
      title: 'Rules Test',
      titleUrdu: 'قواعد ٹیسٹ',
      icon: require('../assets/images/TheoryTest.png'),
      description: 'Take driving theory exam',
      onPress: () => navigation.navigate('Rules', { authority })
    },
    {
      id: '3',
      title: 'Learning Material',
      titleUrdu: 'سیکھنے کا مواد',
      icon: require('../assets/images/LearningMaterials.png'),
      description: 'Study signs and rules',
      onPress: () => navigation.navigate('LearningMaterial', { authority })
    },
    {
      id: '4',
      title: 'General Info',
      titleUrdu: 'عام معلومات',
      icon: require('../assets/images/GeneralInfo.png'),
      description: 'Fees, requirements & procedures',
      onPress: () => navigation.navigate('GeneralInfo', { authority })
    }
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={28} color="white" />
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.sectionHeader}>
      {/* Authority name removed from body - now only shown in header */}
    </View>
  );

  const renderOptionItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.optionCard}
        onPress={item.onPress}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            {typeof item.icon === 'string' ? (
              <Ionicons name={item.icon} size={32} color="#115740" />
            ) : (
                             <Image 
                 source={item.icon} 
                 style={styles.iconImage} 
                 resizeMode="contain"
               />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>{item.title}</Text>
            <Text style={styles.optionTitleUrdu}>{item.titleUrdu}</Text>
            <Text style={styles.optionDescription}>{item.description}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={24} color="#115740" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Select Driving Authority"
      >
        {renderHeaderRight()}
      </Header>
      <FlatList
        data={authorityOptions}
        renderItem={renderOptionItem}
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
    textAlign: 'left',
  },
  optionCard: {
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
    backgroundColor: '#f8f9fa',
    borderRadius: 30,
  },
  iconImage: {
    width: 32,
    height: 32,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionTitleUrdu: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  optionDescription: {
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

export default AuthorityScreen;
