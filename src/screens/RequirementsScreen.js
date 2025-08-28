import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const RequirementsScreen = ({ navigation }) => {
  const { user } = useUser();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleBackPress = () => {
    navigation.goBack();
  };

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://sup-admin-quizly.vercel.app/api/public/requirements');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.requirements) {
        // Sort requirements by authority order first, then by date
        const sortedRequirements = data.requirements.sort((a, b) => {
          // Authority order matching Fines/Fees screens
          const authorityOrder = ['ITP', 'PUN', 'PUNJAB', 'KPK', 'BAL', 'BALOCHISTAN', 'SND', 'SINDH', 'NHA'];
          
          const getAuthorityIndex = (tags) => {
            if (tags && Array.isArray(tags)) {
              for (let i = 0; i < authorityOrder.length; i++) {
                const authority = authorityOrder[i];
                for (const tag of tags) {
                  const tagUpper = tag.toUpperCase();
                  const authorityUpper = authority.toUpperCase();
                  
                  // Exact match first
                  if (tagUpper === authorityUpper) {
                    return i;
                  }
                  
                  // Specific matching patterns to avoid conflicts
                  if (authorityUpper === 'ITP' && tagUpper.includes('ITP')) {
                    return i;
                  }
                  if ((authorityUpper === 'PUN' || authorityUpper === 'PUNJAB') && 
                      (tagUpper.includes('PUNJAB') || tagUpper === 'PUN')) {
                    return i;
                  }
                  if (authorityUpper === 'KPK' && tagUpper.includes('KPK')) {
                    return i;
                  }
                  if ((authorityUpper === 'BAL' || authorityUpper === 'BALOCHISTAN') && 
                      (tagUpper.includes('BALOCHISTAN') || tagUpper === 'BAL')) {
                    return i;
                  }
                  if ((authorityUpper === 'SND' || authorityUpper === 'SINDH') && 
                      (tagUpper.includes('SINDH') || tagUpper === 'SND')) {
                    return i;
                  }
                  if (authorityUpper === 'NHA' && tagUpper.includes('NHA')) {
                    return i;
                  }
                }
              }
            }
            return 999; // Put non-authority items at the end
          };
          
          const aIndex = getAuthorityIndex(a.tags);
          const bIndex = getAuthorityIndex(b.tags);
          
          // Sort by authority order first
          if (aIndex !== bIndex) {
            return aIndex - bIndex;
          }
          
          // Within same authority, sort by date (newest first)
          const aDate = new Date(a.updated_at || a.created_at || 0);
          const bDate = new Date(b.updated_at || b.created_at || 0);
          
          if (aDate.getTime() !== bDate.getTime()) {
            return bDate.getTime() - aDate.getTime(); // Descending by date
          }
          
          // If dates are equal, sort by title descending
          if (a.title && b.title) {
            return b.title.localeCompare(a.title);
          }
          
          // Final fallback: sort by ID descending
          return (b.id || '').toString().localeCompare((a.id || '').toString());
        });
        
        setRequirements(sortedRequirements);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
      setError(error.message);
      
      // Fallback mock data
      const mockData = [
        {
          id: "1",
          title: "Age Requirement",
          description: "Minimum age required for driving license",
          rich_content: "<p>You must be at least <strong>18 years old</strong> to apply.</p>",
          tags: ["age", "eligibility", "PK"],
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          title: "Medical Certificate",
          description: "Health requirements for driving license",
          rich_content: "<p>A valid <strong>medical certificate</strong> from an authorized doctor is required.</p>",
          tags: ["medical", "health", "certificate", "PK"],
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        },
        {
          id: "3",
          title: "Identity Documents",
          description: "Required identity proof documents",
          rich_content: "<p>Valid <strong>CNIC</strong> and proof of residence required.</p>",
          tags: ["documents", "identity", "CNIC", "PK"],
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        }
      ];
      
      // Sort mock data by authority order first, then by date
      const sortedMockData = mockData.sort((a, b) => {
        // Authority order matching Fines/Fees screens
        const authorityOrder = ['ITP', 'PUN', 'PUNJAB', 'KPK', 'BAL', 'BALOCHISTAN', 'SND', 'SINDH', 'NHA'];
        
        const getAuthorityIndex = (tags) => {
          if (tags && Array.isArray(tags)) {
            for (let i = 0; i < authorityOrder.length; i++) {
              const authority = authorityOrder[i];
              for (const tag of tags) {
                const tagUpper = tag.toUpperCase();
                const authorityUpper = authority.toUpperCase();
                
                // Exact match first
                if (tagUpper === authorityUpper) {
                  return i;
                }
                
                // Specific matching patterns to avoid conflicts
                if (authorityUpper === 'ITP' && tagUpper.includes('ITP')) {
                  return i;
                }
                if ((authorityUpper === 'PUN' || authorityUpper === 'PUNJAB') && 
                    (tagUpper.includes('PUNJAB') || tagUpper === 'PUN')) {
                  return i;
                }
                if (authorityUpper === 'KPK' && tagUpper.includes('KPK')) {
                  return i;
                }
                if ((authorityUpper === 'BAL' || authorityUpper === 'BALOCHISTAN') && 
                    (tagUpper.includes('BALOCHISTAN') || tagUpper === 'BAL')) {
                  return i;
                }
                if ((authorityUpper === 'SND' || authorityUpper === 'SINDH') && 
                    (tagUpper.includes('SINDH') || tagUpper === 'SND')) {
                  return i;
                }
                if (authorityUpper === 'NHA' && tagUpper.includes('NHA')) {
                  return i;
                }
              }
            }
          }
          return 999; // Put non-authority items at the end
        };
        
        const aIndex = getAuthorityIndex(a.tags);
        const bIndex = getAuthorityIndex(b.tags);
        
        // Sort by authority order first
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        
        // Within same authority, sort by date (newest first)
        const aDate = new Date(a.updated_at || a.created_at || 0);
        const bDate = new Date(b.updated_at || b.created_at || 0);
        
        if (aDate.getTime() !== bDate.getTime()) {
          return bDate.getTime() - aDate.getTime(); // Descending by date
        }
        
        // If dates are equal, sort by title descending
        if (a.title && b.title) {
          return b.title.localeCompare(a.title);
        }
        
        // Final fallback: sort by ID descending
        return (b.id || '').toString().localeCompare((a.id || '').toString());
      });
      
      setRequirements(sortedMockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);



  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );



  const getLogoByTag = (tags) => {
    // Authority order matching Fines/Fees screens: ITP, PUN, KPK, BAL, SND, NHA
    // TAG = LOGONAME mapping as specified by user:
    const logoMap = {
      'ITP': require('../../assets/images/gov-logos/GOGB.png'),    // ITP = GOPAK -> using GOGB
      'PUN': require('../../assets/images/gov-logos/GOPUN.png'),   // PUN = GOPUN
      'PUNJAB': require('../../assets/images/gov-logos/GOPUN.png'),
      'KPK': require('../../assets/images/gov-logos/GOPKPK.png'),  // KPK = GOPKPK
      'BAL': require('../../assets/images/gov-logos/GOBALOCH.png'), // BAL = GOBALOCH
      'BALOCHISTAN': require('../../assets/images/gov-logos/GOBALOCH.png'),
      'SND': require('../../assets/images/gov-logos/GOSINDH.png'), // SND = GOSINDH
      'SINDH': require('../../assets/images/gov-logos/GOSINDH.png'),
      'NHA': require('../../assets/images/gov-logos/NHA.png'),     // NHA = NHA
    };

    // Find the first matching tag in authority order
    const authorityOrder = ['ITP', 'PUN', 'PUNJAB', 'KPK', 'BAL', 'BALOCHISTAN', 'SND', 'SINDH', 'NHA'];
    
    if (tags && Array.isArray(tags)) {
      for (const authority of authorityOrder) {
        for (const tag of tags) {
          const tagUpper = tag.toUpperCase();
          const authorityUpper = authority.toUpperCase();
          
          // Exact match first
          if (tagUpper === authorityUpper) {
            return logoMap[authority];
          }
          
          // Specific matching patterns to avoid conflicts
          if (authorityUpper === 'ITP' && tagUpper.includes('ITP')) {
            return logoMap[authority];
          }
          if ((authorityUpper === 'PUN' || authorityUpper === 'PUNJAB') && 
              (tagUpper.includes('PUNJAB') || tagUpper === 'PUN')) {
            return logoMap[authority];
          }
          if (authorityUpper === 'KPK' && tagUpper.includes('KPK')) {
            return logoMap[authority];
          }
          if ((authorityUpper === 'BAL' || authorityUpper === 'BALOCHISTAN') && 
              (tagUpper.includes('BALOCHISTAN') || tagUpper === 'BAL')) {
            return logoMap[authority];
          }
          if ((authorityUpper === 'SND' || authorityUpper === 'SINDH') && 
              (tagUpper.includes('SINDH') || tagUpper === 'SND')) {
            return logoMap[authority];
          }
          if (authorityUpper === 'NHA' && tagUpper.includes('NHA')) {
            return logoMap[authority];
          }
        }
      }
    }
    
    // Default to GOP logo if no authority match found
    return require('../../assets/images/gov-logos/GOP.png');
  };

  const getRequirementGradient = (tags) => {
    // Authority order matching Fines/Fees screens
    const authorityOrder = ['ITP', 'PUN', 'PUNJAB', 'KPK', 'BAL', 'BALOCHISTAN', 'SND', 'SINDH', 'NHA'];
    const gradients = [
      ['#FF6B6B', '#FF8E53'],    // ITP - Red to Orange
      ['#4ECDC4', '#44A08D'],    // PUN/PUNJAB - Teal to Green
      ['#4ECDC4', '#44A08D'],    // PUNJAB - Teal to Green (same as PUN)
      ['#45B7D1', '#96C93D'],    // KPK - Blue to Lime
      ['#F093FB', '#F5576C'],    // BAL - Pink to Red
      ['#F093FB', '#F5576C'],    // BALOCHISTAN - Pink to Red (same as BAL)
      ['#4facfe', '#00f2fe'],    // SND - Blue to Cyan
      ['#4facfe', '#00f2fe'],    // SINDH - Blue to Cyan (same as SND)
      ['#77ede8', '#fa98b8'],    // NHA - Teal to Pink
    ];

    if (tags && Array.isArray(tags)) {
      for (let i = 0; i < authorityOrder.length; i++) {
        const authority = authorityOrder[i];
        for (const tag of tags) {
          const tagUpper = tag.toUpperCase();
          const authorityUpper = authority.toUpperCase();
          
          // Exact match first
          if (tagUpper === authorityUpper) {
            return gradients[i];
          }
          
          // Specific matching patterns to avoid conflicts
          if (authorityUpper === 'ITP' && tagUpper.includes('ITP')) {
            return gradients[i];
          }
          if ((authorityUpper === 'PUN' || authorityUpper === 'PUNJAB') && 
              (tagUpper.includes('PUNJAB') || tagUpper === 'PUN')) {
            return gradients[i];
          }
          if (authorityUpper === 'KPK' && tagUpper.includes('KPK')) {
            return gradients[i];
          }
          if ((authorityUpper === 'BAL' || authorityUpper === 'BALOCHISTAN') && 
              (tagUpper.includes('BALOCHISTAN') || tagUpper === 'BAL')) {
            return gradients[i];
          }
          if ((authorityUpper === 'SND' || authorityUpper === 'SINDH') && 
              (tagUpper.includes('SINDH') || tagUpper === 'SND')) {
            return gradients[i];
          }
          if (authorityUpper === 'NHA' && tagUpper.includes('NHA')) {
            return gradients[i];
          }
        }
      }
    }
    
    // Default gradient for general requirements
    return ['#a18cd1', '#fbc2eb']; // Purple to Pink
  };

  const renderRequirementCard = ({ item, index }) => {
    const gradientColors = getRequirementGradient(item.tags);
    const logoSource = getLogoByTag(item.tags);
    
    return (
      <TouchableOpacity
        style={styles.requirementCard}
        onPress={() => navigation.navigate('RequirementDetail', { requirement: item })}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.requirementGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.requirementContent}>
            <View style={styles.requirementIcon}>
              <Image 
                source={logoSource} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>
            <View style={styles.requirementInfo}>
              <Text style={styles.requirementTitle}>{item.title}</Text>
              <Text style={styles.requirementDescription} numberOfLines={3}>
                {item.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Requirements Found</Text>
      <Text style={styles.emptyText}>
        {selectedTags.length > 0 
          ? 'No requirements match the selected filters. Try adjusting your filter criteria.'
          : 'No requirements are available at the moment.'
        }
      </Text>
      {selectedTags.length > 0 && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Requirements"
      >
        {renderHeaderRight()}
      </Header>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={styles.loadingText}>Loading requirements...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchRequirements}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={requirements}
            renderItem={renderRequirementCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
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
  content: {
    flex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    fontWeight: 'bold',
  },

  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  requirementCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requirementGradient: {
    borderRadius: 16,
    padding: 20,
  },
  requirementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoImage: {
    width: 35,
    height: 35,
  },
  requirementInfo: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  requirementDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },

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
  clearFiltersButton: {
    backgroundColor: '#115740',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RequirementsScreen;
