
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const RoadSignsScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority } = route.params;
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSigns();
  }, []);

  const fetchSigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://sup-admin-quizly.vercel.app/api/public/signs');
      const data = await response.json();
      
      if (data.success) {
        setSigns(data.signs);
      } else {
        setError('Failed to fetch signs');
      }
    } catch (error) {
      console.error('Error fetching signs:', error);
      // Fallback to mock data if API is not accessible
             const mockSigns = [
         {
           id: "mock-1",
           image_url: "/api/assets/images/signs/warning%20road%20signs/Wild%20Animal%20Crossing.png",
           title_en: "Wild Animal Crossing",
           english_description: "This sign warns of the potential for wild animals crossing the road. Drive with caution, especially at night.",
           sign_type: "Warning Road Signs",
           secondary_languages: [
             {
               title: "جنگلی جانوروں کا کراسنگ",
               description: "یہ نشان جنگلی جانوروں کے سڑک پار کرنے کی ممکنہ صورت میں خبردار کرتا ہے۔ احتیاط سے گاڑی چلائیں، خاص طور پر رات کو۔",
               language_code: "ur"
             }
           ]
         },
         {
           id: "mock-2",
           image_url: "/api/assets/images/signs/mandatory%20road%20signs/Stop.png",
           title_en: "Stop Sign",
           english_description: "Drivers must come to a complete stop before proceeding.",
           sign_type: "Mandatory Road Signs",
           secondary_languages: [
             {
               title: "روکنا کا نشان",
               description: "ڈرائیوروں کو آگے بڑھنے سے پہلے مکمل طور پر رکنا چاہیے۔",
               language_code: "ur"
             }
           ]
         }
       ];
      setSigns(mockSigns);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleExitPress = () => {
    navigation.navigate('LearningMaterial', { authority });
  };

  const handleNextSign = () => {
    if (currentIndex < signs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousSign = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleExitPress}
    >
      <Ionicons name="close" size={28} color="white" />
    </TouchableOpacity>
  );

  const renderImage = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);
    
    // Create a comprehensive local image map based on actual files
    const localImageMap = {
      // Mandatory Road Signs
      'Stop.png': require('../../assets/images/signs/mandatory road signs/Stop.png'),
      'Slow.png': require('../../assets/images/signs/mandatory road signs/Slow.png'),
      'No Entry.png': require('../../assets/images/signs/mandatory road signs/No Entry.png'),
      'No Entry 02.png': require('../../assets/images/signs/mandatory road signs/No Entry 02.png'),
      'No Parking.png': require('../../assets/images/signs/mandatory road signs/No Parking.png'),
      'No Left Turn.png': require('../../assets/images/signs/mandatory road signs/No Left Turn.png'),
      'No Right Turn.png': require('../../assets/images/signs/mandatory road signs/No Right Turn.png'),
      'No Uturn.png': require('../../assets/images/signs/mandatory road signs/No Uturn.png'),
      'No Stopping - Clearway.png': require('../../assets/images/signs/mandatory road signs/No Stopping - Clearway.png'),
      'Audible Warning Devices Prohibited.png': require('../../assets/images/signs/mandatory road signs/Audible Warning Devices Prohibited.png'),
      'Overtaking Prohibited.png': require('../../assets/images/signs/mandatory road signs/Overtaking Prohibited.png'),
      'Overtaking by  Good Vehicles Prohibited.png': require('../../assets/images/signs/mandatory road signs/Overtaking by  Good Vehicles Prohibited.png'),
      'Keep to the Left.png': require('../../assets/images/signs/mandatory road signs/Keep to the Left.png'),
      'Keep to the Right.png': require('../../assets/images/signs/mandatory road signs/Keep to the Right.png'),
      'Compulsory Round About.png': require('../../assets/images/signs/mandatory road signs/Compulsory Round About.png'),
      'Go Straight Ahead.png': require('../../assets/images/signs/mandatory road signs/Go Straight Ahead.png'),
      'Go Straigh or Left.png': require('../../assets/images/signs/mandatory road signs/Go Straigh or Left.png'),
      'Go Straigh or Right.png': require('../../assets/images/signs/mandatory road signs/Go Straigh or Right.png'),
      'Turn to the Left.png': require('../../assets/images/signs/mandatory road signs/Turn to the Left.png'),
      'Turn to the Left 02.png': require('../../assets/images/signs/mandatory road signs/Turn to the Left 02.png'),
      'Turn to the Right.png': require('../../assets/images/signs/mandatory road signs/Turn to the Right.png'),
      'Turn to the Right 02.png': require('../../assets/images/signs/mandatory road signs/Turn to the Right 02.png'),
      'Give Way or Stop Completely.png': require('../../assets/images/signs/mandatory road signs/Give Way or Stop Completely.png'),
      'Max Speed Limit 80KMH.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'),
      'National Speed Limit Applies.png': require('../../assets/images/signs/mandatory road signs/National Speed Limit Applies.png'),
      'Entry to 30KMH Zone.png': require('../../assets/images/signs/mandatory road signs/Entry to 30KMH Zone.png'),
      'End of 30KMH Zone.png': require('../../assets/images/signs/mandatory road signs/End of 30KMH Zone.png'),
      'End of Speed Limit Imposed.png': require('../../assets/images/signs/mandatory road signs/End of Speed Limit Imposed.png'),
      'End of Prohibitation of Overtaking.png': require('../../assets/images/signs/mandatory road signs/End of Prohibitation of Overtaking.png'),
      'Dual Carriageway Ahead.png': require('../../assets/images/signs/mandatory road signs/Dual Carriageway Ahead.png'),
      'Dual Carriageway End.png': require('../../assets/images/signs/mandatory road signs/Dual Carriageway End.png'),
      'Lane Control Sign.png': require('../../assets/images/signs/mandatory road signs/Lane Control Sign.png'),
      'Road Close.png': require('../../assets/images/signs/mandatory road signs/Road Close.png'),
      'Stop For Police Post.png': require('../../assets/images/signs/mandatory road signs/Stop For Police Post.png'),
      'Passing Police Custom Post without Stopping.png': require('../../assets/images/signs/mandatory road signs/Passing Police Custom Post without Stopping.png'),
      
      // Warning Road Signs
      'Wild Animal Crossing.png': require('../../assets/images/signs/warning road signs/Wild Animal Crossing.png'),
      'Give Way.png': require('../../assets/images/signs/warning road signs/Give Way.png'),
      'Yield ti the Traffic approaching from the right on the any leg of the intersection.png': require('../../assets/images/signs/warning road signs/Yield ti the Traffic approaching from the right on the any leg of the intersection.png'),
      'Yield ti the Traffic approaching from the right on the cross road.png': require('../../assets/images/signs/warning road signs/Yield ti the Traffic approaching from the right on the cross road.png'),
      'Road Works.png': require('../../assets/images/signs/warning road signs/Road Works.png'),
      'Pedestrain Crossing.png': require('../../assets/images/signs/warning road signs/Pedestrain Crossing.png'),
      'Children Crossing.png': require('../../assets/images/signs/warning road signs/Children Crossing.png'),
      'Cattle Crossing.png': require('../../assets/images/signs/warning road signs/Cattle Crossing.png'),
      'Cyclists.png': require('../../assets/images/signs/warning road signs/Cyclists.png'),
      'Level Crossing with Gate.png': require('../../assets/images/signs/warning road signs/Level Crossing with Gate.png'),
      'Level Crossing without Gate.png': require('../../assets/images/signs/warning road signs/Level Crossing without Gate.png'),
      'Steep Ascent.png': require('../../assets/images/signs/warning road signs/Steep Ascent.png'),
      'Dangerous Descent.png': require('../../assets/images/signs/warning road signs/Dangerous Descent.png'),
      'Slippery Roads.png': require('../../assets/images/signs/warning road signs/Slippery Roads.png'),
      'Uneven Road.png': require('../../assets/images/signs/warning road signs/Uneven Road.png'),
      'Lose Gravel.png': require('../../assets/images/signs/warning road signs/Lose Gravel.png'),
      'Falling Rock.png': require('../../assets/images/signs/warning road signs/Falling Rock.png'),
      'Strong Cross Wind.png': require('../../assets/images/signs/warning road signs/Strong Cross Wind.png'),
      'Two way traffic.png': require('../../assets/images/signs/warning road signs/Two way traffic.png'),
      'Cariageway Narrows.png': require('../../assets/images/signs/warning road signs/Cariageway Narrows.png'),
      'Road Dips.png': require('../../assets/images/signs/warning road signs/Road Dips.png'),
      'Road Leads on to River Bank.png': require('../../assets/images/signs/warning road signs/Road Leads on to River Bank.png'),
      'Swing Bridge.png': require('../../assets/images/signs/warning road signs/Swing Bridge.png'),
      'Left Bend.png': require('../../assets/images/signs/warning road signs/Left Bend.png'),
      'Right Bend.png': require('../../assets/images/signs/warning road signs/Right Bend.png'),
      'Double Bend to Left.png': require('../../assets/images/signs/warning road signs/Double Bend to Left.png'),
      'Double Bend to Right.png': require('../../assets/images/signs/warning road signs/Double Bend to Right.png'),
      'Uturn.png': require('../../assets/images/signs/warning road signs/Uturn.png'),
      'Other Dangers.png': require('../../assets/images/signs/warning road signs/Other Dangers.png'),
      'Danger Ahead.png': require('../../assets/images/signs/warning road signs/Danger Ahead.png'),
      'Light signals.png': require('../../assets/images/signs/warning road signs/Light signals.png'),
      'Air Field.png': require('../../assets/images/signs/warning road signs/Air Field.png'),
      'Minor Crossing Road.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road.png'),
      'Minor Crossing Road from Left.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road from Left.png'),
      'Minor Crossing Road from Right.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road from Right.png'),
      'Minor Crossing Road from Left to Right Respectively.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road from Left to Right Respectively.png'),
      'Minor Crossing Road from Right to Left Respectively.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road from Right to Left Respectively.png'),
      'Minor Crossing On The Left.png': require('../../assets/images/signs/warning road signs/Minor Crossing On The Left.png'),
      'Minor Crossing On The Right.png': require('../../assets/images/signs/warning road signs/Minor Crossing On The Right.png'),
      'Minor Crossing Joining from Left.png': require('../../assets/images/signs/warning road signs/Minor Crossing Joining from Left.png'),
      'Minor Crossing Joining from Right.png': require('../../assets/images/signs/warning road signs/Minor Crossing Joining from Right.png'),
      
      // Informatory Road Signs
      'Bus Stop.png': require('../../assets/images/signs/informatory road signs/Bus Stop.png'),
      'Hospital Sign.png': require('../../assets/images/signs/informatory road signs/Hospital Sign.png'),
      'Hospital Sign PK.png': require('../../assets/images/signs/informatory road signs/Hospital Sign PK.png'),
      'Petrol Pump.png': require('../../assets/images/signs/informatory road signs/Petrol Pump.png'),
      'Restaurant.png': require('../../assets/images/signs/informatory road signs/Restaurant.png'),
      'Telephone.png': require('../../assets/images/signs/informatory road signs/Telephone.png'),
      'Parking Sign.png': require('../../assets/images/signs/informatory road signs/Parking Sign.png'),
      'Parking Place Direction.png': require('../../assets/images/signs/informatory road signs/Parking Place Direction.png'),
      'Toilet Facility Sign.png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign.png'),
      'Toilet Facility Sign (2).png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign (2).png'),
      'Breakdown Service.png': require('../../assets/images/signs/informatory road signs/Breakdown Service.png'),
      'Start Of Motorway.png': require('../../assets/images/signs/informatory road signs/Start Of Motorway.png'),
      'Go Signal.png': require('../../assets/images/signs/informatory road signs/Go Signal.png'),
      'Stop Signal.png': require('../../assets/images/signs/informatory road signs/Stop Signal.png'),
      'Slow Down to Stop Signal.png': require('../../assets/images/signs/informatory road signs/Slow Down to Stop Signal.png'),
      'A Deadend Road.png': require('../../assets/images/signs/informatory road signs/A Deadend Road.png'),
      'Deadend on Left.png': require('../../assets/images/signs/informatory road signs/Deadend on Left.png'),
      'Dangerous Turn.png': require('../../assets/images/signs/informatory road signs/Dangerous Turn.png'),
      'Overtaking is Prohibited.png': require('../../assets/images/signs/informatory road signs/Overtaking is Prohibited.png'),
      'Overtaking Allowed if no Vehicle Approaching  from the opposite direction.png': require('../../assets/images/signs/informatory road signs/Overtaking Allowed if no Vehicle Approaching  from the opposite direction.png'),
      'Stoping on Road Prohibited.png': require('../../assets/images/signs/informatory road signs/Stoping on Road Prohibited.png'),
      'Prohibition of Stopping the Vehicle on Yellow Section.png': require('../../assets/images/signs/informatory road signs/Prohibition of Stopping the Vehicle on Yellow Section.png'),
      'Prohibited For Vehicles from Crossing the Lines.png': require('../../assets/images/signs/informatory road signs/Prohibited For Vehicles from Crossing the Lines.png'),
      'Cannot Cross without stopping on these lines first.png': require('../../assets/images/signs/informatory road signs/Cannot Cross without stopping on these lines first.png'),
    };

    const localImage = localImageMap[fileName];
    
    if (localImage) {
      return (
        <Image 
          source={localImage} 
          style={styles.signImage} 
          resizeMode="contain"
        />
      );
    }

    // Fallback to remote URL
    return (
      <Image 
        source={{ uri: `https://sup-admin-quizly.vercel.app${imageUrl}` }} 
        style={styles.signImage} 
        resizeMode="contain"
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header 
          username={user?.displayName} 
          navigation={navigation}
          pageTitle="Road Signs"
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={styles.loadingText}>Loading signs...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header 
          username={user?.displayName} 
          navigation={navigation}
          pageTitle="Road Signs"
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSigns}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (signs.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header 
          username={user?.displayName} 
          navigation={navigation}
          pageTitle="Road Signs"
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.emptyContainer}>
          <Ionicons name="traffic-light-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No signs available</Text>
        </View>
      </View>
    );
  }

  const currentSign = signs[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Road Signs"
      >
        {renderHeaderRight()}
      </Header>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Sign {currentIndex + 1} of {signs.length}
            </Text>
          </View>

          {/* Sign image */}
          <View style={styles.imageContainer}>
            {renderImage(currentSign.image_url)}
          </View>

          {/* Sign type tag */}
          <View style={styles.tagContainer}>
            {(() => {
              // Decode the sign_type if it's encoded
              let decodedSignType = currentSign.sign_type;
              if (decodedSignType && decodedSignType.startsWith('\\X')) {
                try {
                  // Remove the \X prefix and decode hex
                  const hexString = decodedSignType.substring(2);
                  // Convert hex to string manually
                  decodedSignType = hexString.match(/.{1,2}/g)
                    ?.map(byte => String.fromCharCode(parseInt(byte, 16)))
                    .join('') || decodedSignType;
                } catch (error) {
                  console.log('Failed to decode sign_type:', decodedSignType);
                }
              }
              
              // Debug: Log the decoded sign_type
              console.log('🔍 Sign type debug:', {
                original: currentSign.sign_type,
                decoded: decodedSignType
              });
              
              // Determine sign type
              let signType = 'Road Sign';
              let tagStyle = styles.signTypeTag;
              
              if (decodedSignType) {
                const lowerSignType = decodedSignType.toLowerCase();
                if (lowerSignType.includes('warning')) {
                  signType = 'Warning';
                  tagStyle = [styles.signTypeTag, styles.warningTag];
                } else if (lowerSignType.includes('mandatory')) {
                  signType = 'Mandatory';
                  tagStyle = [styles.signTypeTag, styles.mandatoryTag];
                } else if (lowerSignType.includes('informatory')) {
                  signType = 'Informatory';
                  tagStyle = [styles.signTypeTag, styles.informatoryTag];
                }
              }
              
              return (
                <View style={tagStyle}>
                  <Text style={styles.signTypeText}>{signType}</Text>
                </View>
              );
            })()}
          </View>

          {/* Sign title */}
          <View style={styles.titleContainer}>
            <Text style={styles.signTitle}>{currentSign.title_en}</Text>
            {currentSign.secondary_languages?.find(lang => lang.language_code === 'ur')?.title && (
              <Text style={styles.signTitleUrdu}>
                {currentSign.secondary_languages.find(lang => lang.language_code === 'ur').title}
              </Text>
            )}
            {!currentSign.secondary_languages?.find(lang => lang.language_code === 'ur')?.title && (
              <Text style={styles.signTitleUrdu}>
                No Urdu title available
              </Text>
            )}
          </View>

          {/* Sign description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description:</Text>
            <Text style={styles.signDescription}>{currentSign.english_description}</Text>
            {currentSign.secondary_languages?.find(lang => lang.language_code === 'ur')?.description && (
              <Text style={styles.signDescriptionUrdu}>
                {currentSign.secondary_languages.find(lang => lang.language_code === 'ur').description}
              </Text>
            )}
            {!currentSign.secondary_languages?.find(lang => lang.language_code === 'ur')?.description && (
              <Text style={styles.signDescriptionUrdu}>
                No Urdu description available
              </Text>
            )}
          </View>

          {/* Navigation buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
              onPress={handlePreviousSign}
              disabled={currentIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#115740"} />
              <Text style={[styles.navButtonText, currentIndex === 0 && styles.disabledText]}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navButton, currentIndex === signs.length - 1 && styles.disabledButton]}
              onPress={handleNextSign}
              disabled={currentIndex === signs.length - 1}
            >
              <Text style={[styles.navButtonText, currentIndex === signs.length - 1 && styles.disabledText]}>
                Next
              </Text>
              <Ionicons name="chevron-forward" size={24} color={currentIndex === signs.length - 1 ? "#ccc" : "#115740"} />
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 200,
  },
  signImage: {
    width: 200,
    height: 200,
  },
  tagContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  signTypeTag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  warningTag: {
    backgroundColor: '#ff9800',
  },
  mandatoryTag: {
    backgroundColor: '#f44336',
  },
  informatoryTag: {
    backgroundColor: '#2196f3',
  },
  signTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  titleContainer: {
    marginBottom: 20,
  },
  signTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  signTitleUrdu: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
    writingDirection: 'rtl',
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  signDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  signDescriptionUrdu: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'System',
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#115740',
    minWidth: 120,
    justifyContent: 'center',
  },
  disabledButton: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#115740',
    marginHorizontal: 8,
  },
  disabledText: {
    color: '#ccc',
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

export default RoadSignsScreen;
