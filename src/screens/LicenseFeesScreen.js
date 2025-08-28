import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const LicenseFeesScreen = ({ navigation }) => {
  const { user } = useUser();
  const [licenseFees, setLicenseFees] = useState([]);
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
      description: 'Islamabad Capital Territory driving license fees',
      icon: 'business',
      color: '#007AFF',
      tag: 'ITP'
    },
    {
      id: 'PUN',
      name: 'Punjab',
      shortName: 'PUNJAB',
      description: 'Punjab province driving license fees',
      icon: 'location',
      color: '#28a745',
      tag: 'PUN'
    },
    {
      id: 'KPK',
      name: 'Khyber Pakhtunkhwa',
      shortName: 'KPK',
      description: 'KPK province driving license fees',
      icon: 'mountain',
      color: '#17a2b8',
      tag: 'KPK'
    },
    {
      id: 'BAL',
      name: 'Balochistan',
      shortName: 'BALOCHISTAN',
      description: 'Balochistan province driving license fees',
      icon: 'globe',
      color: '#ffc107',
      tag: 'BAL'
    },
    {
      id: 'SND',
      name: 'Sindh',
      shortName: 'SINDH',
      description: 'Sindh province driving license fees',
      icon: 'water',
      color: '#6f42c1',
      tag: 'SND'
    },
    {
      id: 'NHA',
      name: 'National Highway Authority',
      shortName: 'NHA',
      description: 'National Highway Authority license fees',
      icon: 'car-sport',
      color: '#dc3545',
      tag: 'NHA'
    }
  ];

  const handleAuthoritySelect = (authority) => {
    setSelectedAuthority(authority);
    setShowAuthorities(false);
  };

  // Filter fees by selected authority
  const filteredFees = selectedAuthority 
    ? licenseFees.filter(fee => {
        // Check if authority tag matches the fee's tags
        const tagMatch = fee.tags && fee.tags.some(tag => tag === selectedAuthority.tag);
        // Check if authority tag matches the authority_code in data
        const authorityMatch = fee.data?.authority_code && fee.data.authority_code === selectedAuthority.tag;
        // Check if the authorityCode property matches
        const authorityCodeMatch = fee.authorityCode && fee.authorityCode === selectedAuthority.tag;
        
        return tagMatch || authorityMatch || authorityCodeMatch;
      })
    : licenseFees;

  // Load JSON files from local data directory
  const loadLocalFeeData = () => {
    try {
      // Import all available JSON files
      const punjabData = require('../data/fee/Driving License Fee - PUNJAB.json');
      const sindhData = require('../data/fee/Driving License Fee - SINDH.json');
      const kpkData = require('../data/fee/Driving License Fee - KPK.json');
      const balData = require('../data/fee/Driving License Fee - BALOCHISTAN.json');
      const nhaData = require('../data/fee/Driving License Fee - NHA.json');
      const itpRenewalData = require('../data/fee/Driving License Renewal Fee - ITP.json');
      
      return {
        ITP: { main: itpRenewalData }, // Using renewal data as main for ITP
        PUN: { main: punjabData },
        SND: { main: sindhData },
        KPK: { main: kpkData },
        BAL: { main: balData },
        NHA: { main: nhaData }
      };
    } catch (error) {
      console.error('Error loading local fee data:', error);
      return null;
    }
  };

  const fetchLicenseFees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to load local data
      const localData = loadLocalFeeData();
      
      if (localData) {
        // Process local JSON data into standardized format
        const processedFees = [];
        
        Object.entries(localData).forEach(([authorityCode, authorityData]) => {
          const authorityNames = {
            ITP: 'Islamabad Traffic Police',
            PUN: 'Punjab Traffic Police', 
            SND: 'Sindh Traffic Police',
            KPK: 'Khyber Pakhtunkhwa Traffic Police',
            BAL: 'Balochistan Traffic Police',
            NHA: 'National Highway Authority'
          };
          
          Object.entries(authorityData).forEach(([dataType, fees]) => {
            fees.forEach((fee, index) => {
                        // Use the new structure directly
          let category = fee.category || null; // Don't default to 'License', use null to hide
          let type = fee.type || 'License Fee';
          let description = fee.description || '';
          let feeAmount = fee.fee_rs || 0;
          
          // Keep original category text as-is, no processing needed
              
              // Create standardized fee object
              const standardizedFee = {
                id: `${authorityCode}_${dataType}_${index}`,
                title: type,
                description: description,
                data: {
                  ...fee,
                  authority_code: authorityCode,
                  authority_name: authorityNames[authorityCode],
                  type: type,
                  category: category,
                  description: description,
                  fee_rs: feeAmount,
                  currency: 'PKR'
                },
                tags: [authorityCode, 'license'],
                authorityCode: authorityCode,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              processedFees.push(standardizedFee);
            });
          });
        });
        
        setLicenseFees(processedFees);
        
        return; // Successfully loaded local data
      }
      
      // Fallback to API if local data fails
      const response = await fetch('https://sup-admin-quizly.vercel.app/api/public/license-fees');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.licenseFees) {
        // Process API data (existing logic)
        const processedFees = data.licenseFees.map(fee => {
          let parsedData = fee.data;
          if (typeof fee.data === 'string') {
            try {
              parsedData = JSON.parse(fee.data);
            } catch (error) {
              console.error('Error parsing license fee data:', error);
              parsedData = {};
            }
          }
          
          return {
            ...fee,
            data: parsedData,
            authorityCode: parsedData?.authority_code || 
                          (fee.tags && fee.tags.find(tag => 
                            ['ITP', 'PUN', 'KPK', 'BAL', 'SND', 'NHA'].includes(tag)
                          )) || 'UNKNOWN'
          };
        });
        
        setLicenseFees(processedFees);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching license fees:', error);
      setError(error.message);
      
      // Last resort fallback
      const mockData = [
        // ITP (Islamabad Traffic Police)
        {
          id: '1',
          title: 'Motorcycle License Fee',
          description: 'Motorcycle driving license fee',
          rich_content: '<p>Standard fee for motorcycle license application.</p>',
          data: {
            amount: 1800,
            currency: 'PKR',
            license_type: 'motorcycle',
            validity_years: 5,
            authority_code: 'ITP',
            authority_name: 'Islamabad Traffic Police',
            processing_time_days: 7,
            requirements: ['CNIC', 'Medical Certificate', 'Eye Test'],
            additional_charges: {
              urgent_processing: 500,
              duplicate_fee: 300
            }
          },
          tags: ['motorcycle', 'license', 'ITP'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        {
          id: '2',
          title: 'Car License Fee',
          description: 'Car driving license fee',
          rich_content: '<p>Standard fee for car license application including road test.</p>',
          data: {
            amount: 2800,
            currency: 'PKR',
            license_type: 'car',
            validity_years: 5,
            authority_code: 'ITP',
            authority_name: 'Islamabad Traffic Police',
            processing_time_days: 10,
            requirements: ['CNIC', 'Medical Certificate', 'Driving Test', 'Theory Test'],
            additional_charges: {
              urgent_processing: 700,
              duplicate_fee: 400,
              retest_fee: 200
            }
          },
          tags: ['car', 'license', 'ITP'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        // Punjab
        {
          id: '3',
          title: 'Motorcycle License Fee',
          description: 'Motorcycle driving license fee',
          rich_content: '<p>Standard fee for motorcycle license application in Punjab.</p>',
          data: {
            amount: 1500,
            currency: 'PKR',
            license_type: 'motorcycle',
            validity_years: 5,
            authority_code: 'PUN',
            authority_name: 'Punjab Traffic Police',
            processing_time_days: 5,
            requirements: ['CNIC', 'Medical Certificate', 'Domicile'],
            additional_charges: {
              urgent_processing: 400,
              duplicate_fee: 250
            }
          },
          tags: ['motorcycle', 'license', 'PUN'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        {
          id: '4',
          title: 'Punjab Car License Fee',
          description: 'Punjab car driving license fee',
          rich_content: '<p>Standard fee for car license application in Punjab including road test.</p>',
          data: {
            amount: 2500,
            currency: 'PKR',
            license_type: 'car',
            validity_years: 5
          },
          tags: ['car', 'license', 'PUN'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        // KPK
        {
          id: '5',
          title: 'KPK Motorcycle License Fee',
          description: 'KPK motorcycle driving license fee',
          rich_content: '<p>Standard fee for motorcycle license application in Khyber Pakhtunkhwa.</p>',
          data: {
            amount: 1400,
            currency: 'PKR',
            license_type: 'motorcycle',
            validity_years: 5
          },
          tags: ['motorcycle', 'license', 'KPK'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        {
          id: '6',
          title: 'KPK Car License Fee',
          description: 'KPK car driving license fee',
          rich_content: '<p>Standard fee for car license application in KPK including road test.</p>',
          data: {
            amount: 2300,
            currency: 'PKR',
            license_type: 'car',
            validity_years: 5
          },
          tags: ['car', 'license', 'KPK'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        // Balochistan
        {
          id: '7',
          title: 'Balochistan Motorcycle License Fee',
          description: 'Balochistan motorcycle driving license fee',
          rich_content: '<p>Standard fee for motorcycle license application in Balochistan.</p>',
          data: {
            amount: 1300,
            currency: 'PKR',
            license_type: 'motorcycle',
            validity_years: 5
          },
          tags: ['motorcycle', 'license', 'BAL'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        {
          id: '8',
          title: 'Balochistan Car License Fee',
          description: 'Balochistan car driving license fee',
          rich_content: '<p>Standard fee for car license application in Balochistan including road test.</p>',
          data: {
            amount: 2200,
            currency: 'PKR',
            license_type: 'car',
            validity_years: 5
          },
          tags: ['car', 'license', 'BAL'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        // Sindh
        {
          id: '9',
          title: 'Sindh Motorcycle License Fee',
          description: 'Sindh motorcycle driving license fee',
          rich_content: '<p>Standard fee for motorcycle license application in Sindh.</p>',
          data: {
            amount: 1600,
            currency: 'PKR',
            license_type: 'motorcycle',
            validity_years: 5
          },
          tags: ['motorcycle', 'license', 'SND'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        {
          id: '10',
          title: 'Sindh Car License Fee',
          description: 'Sindh car driving license fee',
          rich_content: '<p>Standard fee for car license application in Sindh including road test.</p>',
          data: {
            amount: 2600,
            currency: 'PKR',
            license_type: 'car',
            validity_years: 5
          },
          tags: ['car', 'license', 'SND'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        // NHA
        {
          id: '11',
          title: 'NHA Heavy Vehicle License Fee',
          description: 'National Highway Authority heavy vehicle license fee',
          rich_content: '<p>Fee for heavy vehicle license including medical examination for national highways.</p>',
          data: {
            amount: 4500,
            currency: 'PKR',
            license_type: 'heavy_vehicle',
            validity_years: 3
          },
          tags: ['heavy_vehicle', 'license', 'NHA'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        },
        {
          id: '12',
          title: 'NHA International License Fee',
          description: 'National Highway Authority international driving permit fee',
          rich_content: '<p>International driving permit for cross-border travel.</p>',
          data: {
            amount: 5000,
            currency: 'PKR',
            license_type: 'international',
            validity_years: 1
          },
          tags: ['international', 'license', 'NHA'],
          created_at: '2024-01-13T14:20:00Z',
          updated_at: '2024-01-13T14:20:00Z'
        }
      ];
      
      setLicenseFees(mockData);
      
      const tags = new Set();
      mockData.forEach(fee => {
        if (fee.tags) {
          fee.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenseFees();
  }, []);



  const getColorForLicenseType = (licenseType) => {
    const colors = {
      'motorcycle': '#007AFF',
      'car': '#28a745', 
      'heavy_vehicle': '#dc3545',
      'renewal': '#ffc107',
      'international': '#6f42c1',
      'learner': '#17a2b8'
    };
    return colors[licenseType] || '#6c757d';
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="#115740" />
    </TouchableOpacity>
  );

  const renderAuthorityCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.authorityCard, { borderLeftColor: item.color }]}
      onPress={() => handleAuthoritySelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.authorityCardContent}>
        <View style={[styles.authorityIconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={28} color="white" />
        </View>
        <View style={styles.authorityInfo}>
          <Text style={styles.authorityName}>{item.name}</Text>
          <Text style={styles.authorityShortName}>({item.shortName})</Text>
          <Text style={styles.authorityDescription}>{item.description}</Text>
        </View>
        <View style={styles.authorityArrow}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAuthoritiesScreen = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerSection}>
        <Text style={styles.title}>Select Authority</Text>
        <Text style={styles.subtitle}>Choose your province or authority to view license fees</Text>
      </View>

      <View style={styles.authoritiesContainer}>
        <FlatList
          data={authorities}
          renderItem={renderAuthorityCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoTitle}>About License Fees</Text>
        </View>
        <Text style={styles.infoText}>
          License fees vary by province and authority. Each region has its own fee structure based on local regulations and administrative costs.
        </Text>
      </View>
    </ScrollView>
  );



  const renderFeeCard = ({ item }) => {
    // Get appropriate color based on category
    const getColorForCategory = (category) => {
      if (!category) return '#115740'; // Default color when no category
      
      const cat = category.toLowerCase();
      
      if (cat.includes('motorcycle') || cat.includes('m/cycle')) return '#007AFF';
      if (cat.includes('car') || cat.includes('jeep')) return '#28a745';
      if (cat.includes('ltv')) return '#ffc107';
      if (cat.includes('htv')) return '#dc3545';
      if (cat.includes('rickshaw')) return '#17a2b8';
      if (cat.includes('tractor')) return '#6f42c1';
      return '#115740';
    };

    const type = item.data?.type || 'License Fee';
    const fee = item.data?.fee_rs || 0;
    const category = item.data?.category || null; // Use null instead of default
    const description = item.data?.description || '';
    const currency = item.data?.currency || 'PKR';
    const color = getColorForCategory(category);
    
    return (
      <View style={[styles.feeCard, { borderLeftColor: color }]}>
        <View style={styles.cardContent}>
          {/* Header with Type and Fee Amount */}
          <View style={styles.headerRow}>
            <Text style={styles.feeType}>{type}</Text>
            <View style={[styles.feeAmountContainer, { backgroundColor: color }]}>
              <Text style={styles.feeAmount}>
                {currency} {typeof fee === 'number' ? fee.toLocaleString() : fee}
              </Text>
            </View>
          </View>
          
          {/* Category and Description in full width layout */}
          <View style={styles.infoSection}>
            {category && (
              <View style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>Category</Text>
                <Text style={styles.categoryValue}>{category}</Text>
              </View>
            )}
            
            {description ? (
              <View style={styles.descriptionRow}>
                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.descriptionValue}>{description}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="card-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No License Fees Found</Text>
      <Text style={styles.emptyText}>
        No license fees are available at the moment.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle={selectedAuthority ? `${selectedAuthority.shortName} License Fees` : "License Fees"}
      >
        {renderHeaderRight()}
      </Header>
      
      {showAuthorities ? (
        renderAuthoritiesScreen()
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={styles.loadingText}>Loading license fees...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>Failed to load license fees</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchLicenseFees}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.headerSection}>
              <Text style={styles.title}>{selectedAuthority?.name} License Fees</Text>
              <Text style={styles.subtitle}>License fees for {selectedAuthority?.shortName}</Text>
            </View>



            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>
                {filteredFees.length} fee{filteredFees.length !== 1 ? 's' : ''} found
              </Text>
            </View>

            <FlatList
              data={filteredFees}
              renderItem={renderFeeCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.feesList}
              ListEmptyComponent={renderEmptyState}
              scrollEnabled={false}
            />



            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
                <Text style={styles.backButtonText}>
                  {selectedAuthority ? `Back to Authorities` : `Back to General Info`}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  feesContainer: {
    marginBottom: 16,
  },
  feeCard: {
    backgroundColor: 'white',
    marginHorizontal: 0,
    marginVertical: 8,
    borderRadius: 0,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  feeAmountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  feeAmount: {
    fontSize: 18,
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
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
    fontWeight: 'bold',
  },

  // Results and List
  resultHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  feesList: {
    paddingHorizontal: 16,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
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

  // Authority Selection Styles
  authoritiesContainer: {
    marginBottom: 16,
  },
  authorityCard: {
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
  authorityCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  authorityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  authorityInfo: {
    flex: 1,
  },
  authorityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  authorityShortName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  authorityDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  authorityArrow: {
    marginLeft: 12,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default LicenseFeesScreen;
