import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';

const FinesScreen = ({ navigation }) => {
  const [finesData, setFinesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [showAuthorities, setShowAuthorities] = useState(true);

  const handleBackPress = () => {
    if (selectedAuthority) {
      setSelectedAuthority(null);
      setShowAuthorities(true);
    } else {
      navigation.goBack();
    }
  };

  const authorities = [
    {
      id: 'ITP',
      name: 'Islamabad Traffic Police',
      shortName: 'ITP',
      description: 'Islamabad Traffic Police traffic fines',
      logo: require('../../assets/images/gov-logos/GOGB.png'),
      color: ['#FF6B6B', '#FF8E53'],
    },
    {
      id: 'PUN',
      name: 'Punjab',
      shortName: 'PUNJAB',
      description: 'Punjab province traffic fines',
      logo: require('../../assets/images/gov-logos/GOPUN.png'),
      color: ['#4ECDC4', '#44A08D'],
    },
    {
      id: 'KPK',
      name: 'KPK',
      shortName: 'KPK',
      description: 'Khyber Pakhtunkhwa province traffic fines',
      logo: require('../../assets/images/gov-logos/GOPKPK.png'),
      color: ['#45B7D1', '#96C93D'],
    },
    {
      id: 'BAL',
      name: 'Balochistan',
      shortName: 'BALOCHISTAN',
      description: 'Balochistan province traffic fines',
      logo: require('../../assets/images/gov-logos/GOBALOCH.png'),
      color: ['#F093FB', '#F5576C'],
    },
    {
      id: 'SND',
      name: 'Sindh',
      shortName: 'SINDH',
      description: 'Sindh province traffic fines',
      logo: require('../../assets/images/gov-logos/GOSINDH.png'),
      color: ['#4facfe', '#00f2fe'],
    },
    {
      id: 'NHA',
      name: 'NHA',
      shortName: 'NHA',
      description: 'National Highway Authority traffic fines',
      logo: require('../../assets/images/gov-logos/NHA.png'),
      color: ['#77ede8', '#fa98b8'],
    },
  ];

  const loadLocalFinesData = () => {
    try {
      const localData = {};
      
      // Load all local JSON files
      const itpData = require('../data/fines/ITP.json');
      const punjabData = require('../data/fines/PUNJAB.json');
      const kpkData = require('../data/fines/KPK.json');
      const balochistanData = require('../data/fines/BALOCHISTAN.json');
      const sindhData = require('../data/fines/SINDH.json');
      const nhaData = require('../data/fines/NHA.json');

      // Process each authority's data
      const processAuthorityData = (data, authorityCode) => {
        return data.map((fine, index) => ({
          id: `${authorityCode}_${index}`,
          category: fine.category || 'general',
          violation: fine.violation || 'Traffic Violation',
          penaltyAmount: fine.penalty_rs || 0,
          vehicleType: fine['Vehical type'] || fine['Vehicle type'] || 'All Vehicles',
          description: fine.Description || fine.description || '',
          authorityCode,
        }));
      };

      localData['ITP'] = processAuthorityData(itpData, 'ITP');
      localData['PUNJAB'] = processAuthorityData(punjabData, 'PUNJAB');
      localData['KPK'] = processAuthorityData(kpkData, 'KPK');
      localData['BALOCHISTAN'] = processAuthorityData(balochistanData, 'BALOCHISTAN');
      localData['SINDH'] = processAuthorityData(sindhData, 'SINDH');
      localData['NHA'] = processAuthorityData(nhaData, 'NHA');

      return localData;
    } catch (error) {
      console.error('Error loading local fines data:', error);
      return {};
    }
  };

  const fetchFinesFromAPI = async () => {
    try {
      const response = await fetch('https://sup-admin-quizly.vercel.app/api/public/fines');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Process API data similar to local data
      const processedData = {};
      if (data && Array.isArray(data)) {
        data.forEach(fine => {
          const authority = fine.authority || 'GENERAL';
          if (!processedData[authority]) {
            processedData[authority] = [];
          }
          processedData[authority].push({
            id: fine.id || `api_${fine.violation}_${fine.penalty_rs}`,
            category: fine.category || 'general',
            violation: fine.violation || 'Traffic Violation',
            penaltyAmount: fine.penalty_rs || fine.amount || 0,
            vehicleType: fine.vehicle_type || fine['Vehical type'] || 'All Vehicles',
            description: fine.description || fine.Description || '',
            authorityCode: authority,
          });
        });
      }
      
      return processedData;
    } catch (error) {
      console.error('Error fetching fines from API:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadFinesData = async () => {
      setLoading(true);
      try {
        // Try to load local data first
        const localData = loadLocalFinesData();
        
        if (Object.keys(localData).length > 0) {
          console.log('Using local fines data');
          setFinesData(localData);
        } else {
          console.log('Local data not available, trying API...');
          const apiData = await fetchFinesFromAPI();
          setFinesData(apiData);
        }
      } catch (error) {
        console.error('Error loading fines data:', error);
        setError(error.message);
        Alert.alert('Error', 'Failed to load fines data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFinesData();
  }, []);

  const handleAuthoritySelect = (authority) => {
    setSelectedAuthority(authority);
    setShowAuthorities(false);
  };

  const getColorForCategory = (category) => {
    const colors = {
      'moving_violation': '#FF6B6B',
      'licensing': '#4ECDC4',
      'parking': '#45B7D1',
      'equipment': '#F093FB',
      'documentation': '#96C93D',
      'general': '#115740',
    };
    return colors[category] || colors.general;
  };

  const getColorForVehicleType = (vehicleType) => {
    const colors = {
      'Two-Wheelers': '#FF8A65',
      'Four-Wheelers': '#64B5F6',
      'Heavy Transport Vehicles': '#FFB74D',
      'Public Service Vehicles': '#81C784',
      'Light Transport Vehicles': '#F48FB1',
      'All Vehicles': '#115740',
    };
    
    // Handle variations in naming
    const type = vehicleType.toLowerCase();
    if (type.includes('two') || type.includes('motorcycle')) return colors['Two-Wheelers'];
    if (type.includes('four') || type.includes('car') || type.includes('jeep')) return colors['Four-Wheelers'];
    if (type.includes('heavy') || type.includes('htv')) return colors['Heavy Transport Vehicles'];
    if (type.includes('public') || type.includes('psv')) return colors['Public Service Vehicles'];
    if (type.includes('light') || type.includes('ltv')) return colors['Light Transport Vehicles'];
    if (type.includes('all')) return colors['All Vehicles'];
    
    return colors['All Vehicles'];
  };

  const formatPenalty = (amount) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const renderFineCard = ({ item }) => {
    const categoryColor = getColorForCategory(item.category);
    const vehicleColor = getColorForVehicleType(item.vehicleType);

    return (
      <View style={styles.fineCard}>
        <View style={styles.cardContent}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.violationType} numberOfLines={2}>
              {item.violation}
            </Text>
            <View style={[styles.penaltyContainer, { backgroundColor: categoryColor }]}>
              <Text style={styles.penaltyAmount}>
                {formatPenalty(item.penaltyAmount)}
              </Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            {/* Category */}
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>Category</Text>
              <Text style={styles.categoryValue}>
                {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>

            {/* Vehicle Type */}
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Vehicle</Text>
              <View style={[styles.vehicleTypeContainer, { backgroundColor: vehicleColor }]}>
                <Text style={styles.vehicleTypeValue}>{item.vehicleType}</Text>
              </View>
            </View>

            {/* Description */}
            {item.description ? (
              <View style={styles.descriptionRow}>
                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.descriptionValue}>{item.description}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const renderAuthorityCard = ({ item }) => (
    <TouchableOpacity
      style={styles.authorityCard}
      onPress={() => handleAuthoritySelect(item)}
    >
      <LinearGradient
        colors={item.color}
        style={styles.authorityGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.authorityContent}>
          <View style={styles.authorityIcon}>
            <Image source={item.logo} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.authorityInfo}>
            <Text style={styles.authorityName}>{item.name}</Text>
            <Text style={styles.authorityDescription}>{item.description}</Text>
            <View style={styles.fineCountContainer}>
              <Text style={styles.fineCount}>
                {finesData[item.shortName]?.length || 0} fines available
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Traffic Fines Found</Text>
      <Text style={styles.emptyText}>
        No traffic fines are available for this authority at the moment.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#115740" />
      <Header
        customGreeting="Traffic Fines"
        customSubtitle={
          showAuthorities 
            ? "Select authority to view fines" 
            : `${selectedAuthority?.name} Traffic Fines`
        }
        pageTitle={showAuthorities ? "Traffic Fines" : selectedAuthority?.name}
      >
        {renderHeaderRight()}
      </Header>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={styles.loadingText}>Loading traffic fines...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : showAuthorities ? (
        <View style={styles.authoritiesContainer}>
          <FlatList
            data={authorities}
            renderItem={renderAuthorityCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.authoritiesList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.finesContainer}>
          <FlatList
            data={finesData[selectedAuthority?.shortName] || []}
            renderItem={renderFineCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.finesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#115740',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Authority Selection Styles
  authoritiesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  authoritiesList: {
    paddingVertical: 16,
  },
  authorityCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  authorityGradient: {
    borderRadius: 16,
    padding: 20,
  },
  authorityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorityIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  authorityInfo: {
    flex: 1,
  },
  authorityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  authorityDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    marginBottom: 8,
  },
  fineCountContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  fineCount: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },

  // Fines List Styles
  finesContainer: {
    flex: 1,
  },
  finesList: {
    paddingVertical: 8,
  },
  fineCard: {
    backgroundColor: 'white',
    marginHorizontal: 0,
    marginVertical: 4,
    borderRadius: 0,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  violationType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  penaltyContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  penaltyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  infoSection: {
    flex: 1,
    width: '100%',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 80,
    marginRight: 8,
  },
  categoryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 80,
    marginRight: 8,
  },
  vehicleTypeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
  },
  vehicleTypeValue: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 80,
    marginRight: 8,
  },
  descriptionValue: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
});

export default FinesScreen;