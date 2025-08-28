import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const RulesContentScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;
  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUrdu, setIsUrdu] = useState(false);

  useEffect(() => {
    loadRulesData();
  }, [isUrdu]);

  const loadRulesData = async () => {
    try {
      setLoading(true);
      // Load the appropriate JSON file based on language
      const data = isUrdu 
        ? require('../data/rules-ur.json')
        : require('../data/rules-en.json');
      setRulesData(data.document);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rules data:', error);
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setIsUrdu(!isUrdu);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        style={styles.languageToggle}
        onPress={toggleLanguage}
      >
        <Text style={styles.languageText}>{isUrdu ? 'EN' : 'اردو'}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderTextWithStyles = (content) => {
    if (typeof content === 'string') {
      return (
        <Text style={isUrdu ? styles.urduText : null}>
          {content}
        </Text>
      );
    }

    if (content && content.text) {
      const { text, styles = [] } = content;
      
      if (styles.length === 0) {
        return (
          <Text style={isUrdu ? styles.urduText : null}>
            {text}
          </Text>
        );
      }

      // For now, we'll render with basic styling
      // You can enhance this to handle multiple styles
      const hasBold = styles.some(style => style.type === 'bold');
      
      return (
        <Text style={[
          hasBold ? styles.boldText : null,
          isUrdu ? styles.urduText : null
        ]}>
          {text}
        </Text>
      );
    }

    return content;
  };

  const renderListItem = (item, index, nested = false) => {
    const marginLeft = nested ? 32 : 16;
    
    if (item.type === 'list_item') {
      return (
        <View key={index} style={[styles.listItem, { marginLeft }]}>
          <Text style={styles.bullet}>•</Text>
          <View style={styles.listItemContent}>
            {renderTextWithStyles(item.content)}
          </View>
        </View>
      );
    } else if (item.type === 'list') {
      return (
        <View key={index} style={{ marginLeft }}>
          {item.items.map((nestedItem, nestedIndex) => 
            renderListItem(nestedItem, `${index}-${nestedIndex}`, true)
          )}
        </View>
      );
    }
    
    return null;
  };

  const renderRuleItem = ({ item, index }) => {
    switch (item.type) {
      case 'heading':
        const HeadingStyle = item.level === 2 ? styles.mainHeading : styles.subHeading;
        return (
          <View key={index} style={styles.headingContainer}>
            <Text style={[
              HeadingStyle,
              isUrdu ? styles.urduText : null
            ]}>
              {item.content}
            </Text>
          </View>
        );
      
      case 'paragraph':
        return (
          <View key={index} style={styles.paragraphContainer}>
            <Text style={[
              styles.paragraph,
              isUrdu ? styles.urduText : null
            ]}>
              {item.content}
            </Text>
          </View>
        );
      
      case 'list':
        return (
          <View key={index} style={[
            styles.listContainer,
            isUrdu ? styles.urduContainer : null
          ]}>
            {item.items.map((listItem, listIndex) => 
              renderListItem(listItem, `${index}-${listIndex}`)
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  const ListHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={[
        styles.sectionTitle,
        isUrdu ? styles.urduText : null
      ]}>
        {isUrdu ? 'ٹریفک کے قواعد و ضوابط' : 'Traffic Rules & Regulations'}
      </Text>
      <Text style={[
        styles.sectionSubtitle,
        isUrdu ? styles.urduText : null
      ]}>
        {authority?.name}
      </Text>
      <Text style={[
        styles.description,
        isUrdu ? styles.urduText : null
      ]}>
        {isUrdu 
          ? 'ہر ڈرائیور کو جاننے چاہیے بنیادی ٹریفک قوانین'
          : 'Essential traffic rules every driver should know'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header 
          username={user?.displayName} 
          navigation={navigation}
          pageTitle="Traffic Rules"
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={[
            styles.loadingText,
            isUrdu ? styles.urduText : null
          ]}>
            {isUrdu ? 'قوانین لوڈ ہو رہے ہیں...' : 'Loading rules...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Traffic Rules"
      >
        {renderHeaderRight()}
      </Header>
      <FlatList
        data={rulesData || []}
        renderItem={renderRuleItem}
        keyExtractor={(item, index) => `rule-${index}`}
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
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
  headingContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#115740',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  paragraphContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  listContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#115740',
    marginRight: 8,
    marginTop: 2,
    fontWeight: 'bold',
  },
  listItemContent: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  languageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urduText: {
    writingDirection: 'rtl',
    textAlign: 'right',
    fontFamily: 'System', // Uses system font which supports Urdu
  },
  urduContainer: {
    alignItems: 'flex-end',
  },
});

export default RulesContentScreen;
