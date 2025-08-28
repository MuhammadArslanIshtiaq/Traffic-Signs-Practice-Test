import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const GeneralInfoScreen = ({ navigation }) => {
  const { user } = useUser();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const infoOptions = [
    {
      id: 'requirements',
      title: 'Requirements',
      description: 'View driving license requirements and eligibility criteria',
      icon: 'document-text',
      color: '#007AFF',
      screen: 'Requirements'
    },
    {
      id: 'fees',
      title: 'License Fees',
      description: 'Check current driving license fees and charges',
      icon: 'cash',
      color: '#28a745',
      screen: 'LicenseFees'
    },
    {
      id: 'fines',
      title: 'Fines',
      description: 'Traffic violation fines and penalties information',
      icon: 'warning',
      color: '#dc3545',
      screen: 'Fines'
    }
  ];

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="#115740" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="General Information"
      >
        {renderHeaderRight()}
      </Header>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.optionsContainer}>
          {infoOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, { borderLeftColor: option.color }]}
              onPress={() => navigation.navigate(option.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={28} color="white" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About General Information</Text>
          <Text style={styles.infoText}>
            This section provides essential information about driving license requirements, 
            fees, and traffic fines in Pakistan. Stay informed about the latest regulations 
            and requirements to ensure a smooth driving license application process.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  headerButton: {
    padding: 8,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 12,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default GeneralInfoScreen;
