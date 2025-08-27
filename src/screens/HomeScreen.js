import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useAuthority } from '../contexts/AuthorityContext';
import { useUser } from '../contexts/UserContext';

const HomeScreen = ({ navigation }) => {
  const { user, signout } = useUser();
  const { selectedAuthority, setSelectedAuthority } = useAuthority();

  const drivingAuthorities = [
    {
      id: '1',
      name: 'Islamabad Driving License Authority',
      nameUrdu: 'اسلام آباد ڈرائیونگ لائسنس',
      image: require('../../assets/images/gov-logos/GOP.png'),
      code: 'GOP'
    },
    {
      id: '2',
      name: 'Punjab Driving License Authority',
      nameUrdu: 'پنجاب ڈرائیونگ لائسنس ',
      image: require('../../assets/images/gov-logos/GOPUN.png'),
      code: 'GOPUN'
    },
    {
      id: '3',
      name: 'Khyber Pakhtunkhwa Driving License Authority',
      nameUrdu: 'خیبر پختونخواڈرائیونگ لائسنس',
      image: require('../../assets/images/gov-logos/GOPKPK.png'),
      code: 'GOKPK'
    },
    {
      id: '4',
      name: 'Sindh Driving License Authority',
      nameUrdu: 'سندھ ڈرائیونگ لائسنس',
      image: require('../../assets/images/gov-logos/GOSINDH.png'),
      code: 'GOSINDH'
    },
    {
      id: '5',
      name: 'Balochistan Driving License Authority',
      nameUrdu: 'بلوچستان ڈرائیونگ لائسنس',
      image: require('../../assets/images/gov-logos/GOBALOCH.png'),
      code: 'GOBALOCH'
    },
    {
      id: '6',
      name: 'National Highways Driving License Authority',
      nameUrdu: 'نیشنل ہائی ویز ڈرائیونگ لائسنس',
      image: require('../../assets/images/gov-logos/NHA.png'),
      code: 'NHA'
    }
  ];

  const handleBackPress = () => {
    if (selectedOption === 'signTests') {
      setSelectedOption(null);
    } else if (selectedAuthority) {
      setSelectedAuthority(null);
    } else {
      // On "Select Driving Authority" screen
      if (user) {
        // User is logged in, show confirmation dialog
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                try {
                  // Sign out the user
                  await signout();
                  // Navigate to login screen
                  navigation.navigate('SignIn');
                } catch (error) {
                  console.error('Error signing out:', error);
                  // Still navigate to login screen even if signout fails
                  navigation.navigate('SignIn');
                }
              },
            },
          ]
        );
      } else {
        // User is not logged in, go to login screen
        navigation.navigate('SignIn');
      }
    }
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
      {selectedOption === 'signTests' ? (
        <>
          <Text style={styles.sectionTitle}>Sign Tests</Text>
          <Text style={styles.sectionSubtitle}>{selectedAuthority.name}</Text>
         
        </>
      ) : selectedAuthority ? (
        <>
          <Text style={styles.sectionTitle}>{selectedAuthority.name}</Text>
          <Text style={styles.sectionSubtitle}>{selectedAuthority.nameUrdu}</Text>
        </>
      ) : (
        <Text style={styles.sectionTitle}>Select Driving Authority</Text>
      )}
    </View>
  );

  const [selectedOption, setSelectedOption] = React.useState(null);

  const authorityOptions = [
    {
      id: '1',
      title: 'Sign Tests',
      titleUrdu: 'سائن ٹیسٹ',
      icon: require('../../assets/images/SignTest.png'),
      description: 'Practice traffic sign recognition',
      onPress: () => setSelectedOption('signTests')
    },
    {
      id: '2',
      title: 'Rules Test',
      titleUrdu: 'قواعد ٹیسٹ',
      icon: require('../../assets/images/TheoryTest.png'),
      description: 'Take driving theory exam',
      onPress: () => navigation.navigate('Rules', { authority: selectedAuthority })
    },
    {
      id: '3',
      title: 'Learning Material',
      titleUrdu: 'سیکھنے کا مواد',
      icon: require('../../assets/images/LearningMaterials.png'),
      description: 'Study signs and rules',
      onPress: () => navigation.navigate('LearningMaterial', { authority: selectedAuthority })
    },
    {
      id: '4',
      title: 'General Info',
      titleUrdu: 'عام معلومات',
      icon: require('../../assets/images/GeneralInfo.png'),
      description: 'Fees, requirements & procedures',
      onPress: () => navigation.navigate('GeneralInfo', { authority: selectedAuthority })
    }
  ];

  const signCategories = [
    {
      id: '1',
      title: 'Mandatory Road Signs',
      titleUrdu: 'لازمی روڈ سائنز',
      icon: 'checkmark-circle-outline',
      description: 'Signs that must be obeyed',
      color: '#e74c3c',
      onPress: () => navigation.navigate('SignQuiz', { 
        authority: selectedAuthority, 
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
        authority: selectedAuthority, 
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
        authority: selectedAuthority, 
        category: 'informatory',
        categoryName: 'Informatory Road Signs'
      })
    }
  ];

  const renderAuthorityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.authorityCard}
      onPress={() => setSelectedAuthority(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.logoContainer}>
          <Image
            source={item.image}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.authorityName}>{item.name}</Text>
          <Text style={styles.authorityNameUrdu}>{item.nameUrdu}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderOptionItem = ({ item }) => (
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

  const renderSignCategoryItem = ({ item }) => (
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
        pageTitle="Pakistan Traffic Signs"
      >
        {renderHeaderRight()}
      </Header>
      <FlatList
        data={
          selectedOption === 'signTests' 
            ? signCategories 
            : selectedAuthority 
              ? authorityOptions 
              : drivingAuthorities
        }
        renderItem={
          selectedOption === 'signTests'
            ? renderSignCategoryItem
            : selectedAuthority 
              ? renderOptionItem 
              : renderAuthorityItem
        }
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
  },
  authorityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#115740',
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
  logoContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  textContainer: {
    flex: 1,
  },
  authorityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  authorityNameUrdu: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    marginBottom: 16,
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
  description: {
    fontSize: 16,
    color: '#888',
    lineHeight: 22,
    marginBottom: 16,
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
  headerButton: {
    padding: 8,
  },
});

export default HomeScreen; 