import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const FinesScreen = ({ navigation }) => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const fineCategories = [
    { id: 'all', title: 'All Violations', icon: 'list' },
    { id: 'speeding', title: 'Speeding', icon: 'speedometer' },
    { id: 'parking', title: 'Parking', icon: 'car' },
    { id: 'signal', title: 'Traffic Signals', icon: 'traffic-cone' },
    { id: 'license', title: 'License/Documents', icon: 'document-text' }
  ];

  const violations = [
    {
      id: '1',
      violation: 'Over Speeding (Light Vehicle)',
      violationUrdu: 'تیز رفتاری (ہلکی گاڑی)',
      fine: 'Rs. 2,000',
      category: 'speeding',
      severity: 'medium',
      description: 'Exceeding speed limit by 10-20 km/h'
    },
    {
      id: '2',
      violation: 'Over Speeding (Heavy Vehicle)',
      violationUrdu: 'تیز رفتاری (بھاری گاڑی)',
      fine: 'Rs. 3,000',
      category: 'speeding',
      severity: 'high',
      description: 'Exceeding speed limit by 10-20 km/h'
    },
    {
      id: '3',
      violation: 'Wrong Parking',
      violationUrdu: 'غلط پارکنگ',
      fine: 'Rs. 500',
      category: 'parking',
      severity: 'low',
      description: 'Parking in prohibited areas'
    },
    {
      id: '4',
      violation: 'Signal Jumping',
      violationUrdu: 'سگنل توڑنا',
      fine: 'Rs. 1,500',
      category: 'signal',
      severity: 'high',
      description: 'Violating traffic light signals'
    },
    {
      id: '5',
      violation: 'Driving without License',
      violationUrdu: 'بغیر لائسنس گاڑی چلانا',
      fine: 'Rs. 2,500',
      category: 'license',
      severity: 'high',
      description: 'Operating vehicle without valid license'
    },
    {
      id: '6',
      violation: 'Mobile Phone Usage',
      violationUrdu: 'موبائل فون کا استعمال',
      fine: 'Rs. 1,000',
      category: 'all',
      severity: 'medium',
      description: 'Using mobile phone while driving'
    },
    {
      id: '7',
      violation: 'No Seat Belt',
      violationUrdu: 'سیٹ بیلٹ نہیں',
      fine: 'Rs. 500',
      category: 'all',
      severity: 'low',
      description: 'Not wearing seat belt while driving'
    },
    {
      id: '8',
      violation: 'Triple Riding (Motorcycle)',
      violationUrdu: 'تین سواری (موٹرسائیکل)',
      fine: 'Rs. 1,000',
      category: 'all',
      severity: 'medium',
      description: 'More than two persons on motorcycle'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'low': return 'Minor';
      case 'medium': return 'Moderate';
      case 'high': return 'Serious';
      default: return 'Unknown';
    }
  };

  const filteredViolations = selectedCategory === 'all' 
    ? violations 
    : violations.filter(violation => violation.category === selectedCategory);

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="#115740" />
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter by Category</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScrollView}
        contentContainerStyle={styles.categoriesContainer}
      >
        {fineCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? 'white' : '#666'} 
              style={styles.categoryIcon}
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderViolationCard = (item) => (
    <View key={item.id} style={styles.violationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.violationInfo}>
          <Text style={styles.violationTitle}>{item.violation}</Text>
          <Text style={styles.violationTitleUrdu}>{item.violationUrdu}</Text>
        </View>
        <View style={styles.violationMeta}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Text style={styles.severityText}>{getSeverityText(item.severity)}</Text>
          </View>
          <View style={styles.fineContainer}>
            <Text style={styles.fineText}>{item.fine}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Traffic Fines"
      >
        {renderHeaderRight()}
      </Header>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Traffic Violation Fines</Text>
          <Text style={styles.subtitle}>Current penalty structure for traffic violations in Pakistan</Text>
        </View>

        {renderCategoryFilter()}

        <View style={styles.violationsContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultCount}>
              {filteredViolations.length} violation{filteredViolations.length !== 1 ? 's' : ''} found
            </Text>
          </View>
          
          {filteredViolations.map(renderViolationCard)}
        </View>

        <View style={styles.warningSection}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color="#dc3545" />
            <Text style={styles.warningTitle}>Important Information</Text>
          </View>
          <Text style={styles.warningText}>
            • Fines may vary by province and traffic authority{'\n'}
            • Repeat offenders may face higher penalties{'\n'}
            • Some violations may result in license suspension{'\n'}
            • Court appearance may be required for serious violations{'\n'}
            • Pay fines promptly to avoid additional charges
          </Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.backButtonText}>Back to General Info</Text>
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  headerSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  categoriesScrollView: {
    marginHorizontal: -4,
  },
  categoriesContainer: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryChip: {
    backgroundColor: '#115740',
    borderColor: '#115740',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  violationsContainer: {
    marginBottom: 16,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  violationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  violationInfo: {
    flex: 1,
    marginRight: 12,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  violationTitleUrdu: {
    fontSize: 13,
    color: '#666',
  },
  violationMeta: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  severityText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fineContainer: {
    backgroundColor: '#115740',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fineText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  warningSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  actionSection: {
    marginTop: 8,
  },
  backButton: {
    backgroundColor: '#115740',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FinesScreen;
