import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const RequirementsScreen = ({ navigation }) => {
  const { user } = useUser();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

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
        setRequirements(data.requirements);
        
        // Extract all unique tags
        const tags = new Set();
        data.requirements.forEach(req => {
          if (req.tags && Array.isArray(req.tags)) {
            req.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
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
      
      setRequirements(mockData);
      
      const tags = new Set();
      mockData.forEach(req => {
        if (req.tags) {
          req.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const filteredRequirements = selectedTags.length > 0 
    ? requirements.filter(req => 
        req.tags && req.tags.some(tag => selectedTags.includes(tag))
      )
    : requirements;

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="#115740" />
    </TouchableOpacity>
  );

  const renderTagFilter = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filter by Tags</Text>
        {selectedTags.length > 0 && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tagsScrollView}
        contentContainerStyle={styles.tagsContainer}
      >
        {allTags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tagChip,
              selectedTags.includes(tag) && styles.selectedTagChip
            ]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[
              styles.tagText,
              selectedTags.includes(tag) && styles.selectedTagText
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRequirementCard = ({ item }) => (
    <TouchableOpacity
      style={styles.requirementCard}
      onPress={() => navigation.navigate('RequirementDetail', { requirement: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.requirementTitle}>{item.title}</Text>
        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>
      
      <Text style={styles.requirementDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

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
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>Failed to load requirements</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchRequirements}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          {allTags.length > 0 && renderTagFilter()}
          
          <FlatList
            data={filteredRequirements}
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
    padding: 8,
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
  filterContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#115740',
    fontWeight: '600',
  },
  tagsScrollView: {
    marginHorizontal: -4,
  },
  tagsContainer: {
    paddingHorizontal: 4,
  },
  tagChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedTagChip: {
    backgroundColor: '#115740',
    borderColor: '#115740',
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedTagText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  requirementCard: {
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
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardArrow: {
    marginLeft: 12,
  },
  requirementDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagBadgeText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
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
