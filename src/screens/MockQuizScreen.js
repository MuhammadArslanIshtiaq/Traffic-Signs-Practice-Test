import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useQuiz } from '../contexts/QuizContext';
import { useUser } from '../contexts/UserContext';

// Import the getSignImage function from supabase config
const getSignImage = async (imagePath) => {
  try {
    if (!imagePath) return null;
    
    // If it's a local path, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For local sign images, construct the full URL
    return `https://sup-admin-quizly.vercel.app${imagePath}`;
  } catch (error) {
    console.error('Error processing sign image:', error);
    return null;
  }
};

const MockQuizScreen = ({ navigation, route }) => {
  const { user, saveQuizResult } = useUser();
  const { getMockTestQuiz, shuffleArray } = useQuiz();
  const { authority, quizType, title } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchMockQuizData();
  }, []);

  const fetchMockQuizData = () => {
    try {
      setLoading(true);
      console.log(`🎯 Loading mock test for authority: ${authority?.name} (${authority?.code})`);
      
      // Get the appropriate mock test quiz from cached data
      const cachedQuestions = getMockTestQuiz(authority);
      
      if (cachedQuestions && cachedQuestions.length > 0) {
        // Shuffle questions for the mock test
        const shuffledQuestions = shuffleArray(cachedQuestions);
        console.log(`📊 Total questions loaded from cache: ${shuffledQuestions.length}`);
        setQuestions(shuffledQuestions);
      } else {
        console.error('❌ No cached questions found for mock test');
        setError('No questions available for this mock test. Please try again later.');
      }
    } catch (error) {
      console.error('Error loading mock quiz data:', error);
      setError('Failed to load mock test. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIncorrectAnswers([]);
    setShowReviewModal(false);
    fetchMockQuizData(); // Re-fetch for a new set of questions
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  
  // Check if this is a rules question (no images needed)
  const isRulesQuestion = currentQuestion.category === 'rules1' || currentQuestion.category === 'rules2' || 
                         currentQuestion.sign_type === 'rules1' || currentQuestion.sign_type === 'rules2';

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    } else {
      // Extract text from option objects for display
      const getUserAnswerText = (option) => {
        return option?.text || option?.option_text || option?.choice || option?.answer || option?.answer_text || option;
      };
      
      const getCorrectAnswerText = (option) => {
        return option?.text || option?.option_text || option?.choice || option?.answer || option?.answer_text || option;
      };
      
      setIncorrectAnswers(prev => [...prev, {
        question: currentQuestion.question || currentQuestion.question_text || currentQuestion.title || currentQuestion.text,
        questionUrdu: currentQuestion.question_urdu || currentQuestion.question_urdu_text || currentQuestion.title_urdu || currentQuestion.text_urdu,
        userAnswer: getUserAnswerText(answer),
        correctAnswer: getCorrectAnswerText(currentQuestion.correctAnswer),
        imageUrl: currentQuestion.image_url
      }]);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Select an Answer', 'Please select an answer before proceeding.');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleFinishQuiz = async () => {
    // Ask for confirmation if not at the last question
    if (currentQuestionIndex < questions.length - 1) {
      setShowFinishConfirmation(true);
    } else {
      finishQuizNow();
    }
  };

  const finishQuizNow = async () => {
    if (user?.uid) {
      try {
        const percentage = Math.round((score / questions.length) * 100);
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        await saveQuizResult({
          quizId: `mock-${quizType}-${authority?.code || authority?.name || 'unknown'}`,
          title: title,
          score: percentage,
          totalQuestions: questions.length,
          correctAnswers: score,
          timeSpent: timeSpent
        });
      } catch (error) {
        console.error('Error saving mock quiz result:', error);
      }
    }
    setShowResult(true);
  };

  const handleRetryQuiz = () => {
    resetQuiz();
  };

  const handleGoToQuizzes = () => {
    navigation.navigate('Home');
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      {/* Finish Quiz Button - only show during quiz, not on results */}
      {!showResult && !loading && questions.length > 0 && (
        <TouchableOpacity
          style={styles.finishQuizButton}
          onPress={handleFinishQuiz}
        >
          <Text style={styles.finishQuizButtonText}>Finish</Text>
        </TouchableOpacity>
      )}
      
      {/* Back Button */}
      <TouchableOpacity
        style={[styles.headerButton, !showResult && !loading && questions.length > 0 && { marginLeft: 8 }]}
        onPress={() => {
          if (!showResult && currentQuestionIndex > 0) {
            Alert.alert(
              'Leave Quiz?',
              'Are you sure you want to leave? Your progress will be lost.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Leave Quiz', style: 'destructive', onPress: () => navigation.goBack() }
              ]
            );
          } else {
            navigation.goBack();
          }
        }}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );

  const getPercentageColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#17a2b8';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  const getLocalImageMap = () => {
    // Complete image mapping identical to SignQuizScreen - all 112 images
    return {
      // Mandatory Road Signs (47 images)
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
      'No Entry for Agricultural Vehicle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Agricultural Vehicle.png'),
      'No Entry for Animal Drawn Vehicle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Animal Drawn Vehicle.png'),
      'No Entry for Cycle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Cycle.png'),
      'No Entry for Goods Vehicles.png': require('../../assets/images/signs/mandatory road signs/No Entry for Goods Vehicles.png'),
      'No Entry for Hand Carts.png': require('../../assets/images/signs/mandatory road signs/No Entry for Hand Carts.png'),
      'No Entry for Motor Cycle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Motor Cycle.png'),
      'No Entry for Motor Vehical.png': require('../../assets/images/signs/mandatory road signs/No Entry for Motor Vehical.png'),
      'No Entry for Pedestrains.png': require('../../assets/images/signs/mandatory road signs/No Entry for Pedestrains.png'),
      'No Entry for Vehicles Exceeding 10 Meter in Length.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 10 Meter in Length.png'),
      'No Entry for Vehicles Exceeding 6 Ton One Axle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 6 Ton One Axle.png'),
      'No Entry for Vehicles Exceeding 7 Ton Laden Weight (2).png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 7 Ton Laden Weight (2).png'),
      'No Entry for Vehicles Exceeding 7 Ton Laden Weight.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 7 Ton Laden Weight.png'),
      'No Entry for Vehicles Exceeding Width more than 86.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding Width more than 86.png'),
      
      // Warning Road Signs (41 images)
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
      
      // Informatory Road Signs (24 images)
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
  };

  const renderImage = (imageUrl) => {
    if (!imageUrl) return null;

    // If it's already a full URL, use it directly
    if (imageUrl.startsWith('http')) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={styles.questionImage}
          resizeMode="contain"
          onError={(error) => console.log('Image loading error:', error)}
        />
      );
    }

    const urlParts = imageUrl.split('/');
    const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);

    // Get local image mapping
    const localImageMap = getLocalImageMap();
    const localImage = localImageMap[fileName];

    if (localImage) {
      try {
        return (
          <Image
            source={localImage}
            style={styles.questionImage}
            resizeMode="contain"
          />
        );
      } catch (error) {
        console.warn(`Failed to load local image: ${fileName}`, error);
        // Fall through to remote loading
      }
    }
    
    // Fallback to remote image with full URL
    const fullUrl = imageUrl.startsWith('/') 
      ? `https://sup-admin-quizly.vercel.app${imageUrl}`
      : imageUrl;
      
    console.log(`🖼️ Loading remote image: ${fileName} from ${fullUrl}`);
      
    return (
      <Image
        source={{ uri: fullUrl }}
        style={styles.questionImage}
        resizeMode="contain"
        onError={(error) => console.log('Remote image loading error:', error)}
      />
    );
  };

  const renderReviewModal = () => (
    <Modal
      visible={showReviewModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowReviewModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.reviewModalContent}>
          <View style={styles.reviewModalHeader}>
            <Text style={styles.reviewModalTitle}>Incorrect Answers Review</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.reviewModalBody} showsVerticalScrollIndicator={false}>
            {incorrectAnswers.map((item, index) => {
              const question = item.question;
              const questionUrdu = item.questionUrdu || '';
              const userAnswer = item.userAnswer;
              const correctAnswer = item.correctAnswer;
              const imageUrl = item.imageUrl;
              
              // Get the original question to access all options
              const originalQuestion = questions.find(q => 
                (q.question || q.question_text || q.title || q.text) === question ||
                (q.question_urdu || q.question_urdu_text || q.title_urdu || q.text_urdu) === question
              );
              
              return (
                <View key={index} style={styles.reviewQuestionCard}>
                  <View style={styles.reviewQuestionHeader}>
                    <Text style={styles.reviewQuestionNumber}>Question {index + 1}</Text>
                    <View style={styles.reviewQuestionStatus}>
                      <Ionicons name="close-circle" size={16} color="#dc3545" />
                      <Text style={styles.reviewQuestionStatusText}>Incorrect</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.reviewQuestionText}>{question}</Text>
                  {questionUrdu && (
                    <Text style={styles.reviewQuestionTextUrdu}>{questionUrdu}</Text>
                  )}
                  
                  {imageUrl && (
                    <View style={styles.reviewImageContainer}>
                      {renderImage(imageUrl)}
                    </View>
                  )}
                  
                  <View style={styles.reviewOptionsContainer}>
                    {originalQuestion?.options?.map((option, optionIndex) => {
                      const optionText = option.text || option.option_text || option.choice || option.answer || option.answer_text || `Option ${String.fromCharCode(65 + optionIndex)}`;
                      const optionTextUrdu = option.text_urdu || option.option_urdu || option.choice_urdu || option.answer_urdu || option.answer_text_urdu || '';
                      
                      const isCorrect = option === correctAnswer;
                      const isUserChoice = option === userAnswer;
                      
                      return (
                        <View
                          key={optionIndex}
                          style={[
                            styles.reviewOptionItem,
                            isCorrect && styles.reviewCorrectOption,
                            isUserChoice && !isCorrect && styles.reviewIncorrectOption,
                          ]}
                        >
                          <View style={styles.reviewOptionContent}>
                            <Text style={[
                              styles.reviewOptionText,
                              isCorrect && styles.reviewCorrectOptionText,
                              isUserChoice && !isCorrect && styles.reviewIncorrectOptionText,
                            ]}>
                              {optionText}
                            </Text>
                            {optionTextUrdu && (
                              <Text style={styles.reviewOptionTextUrdu}>{optionTextUrdu}</Text>
                            )}
                          </View>
                          {isCorrect && <Ionicons name="checkmark-circle" size={20} color="#28a745" />}
                          {isUserChoice && !isCorrect && <Ionicons name="close-circle" size={20} color="#dc3545" />}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
            
            {incorrectAnswers.length === 0 && (
              <View style={styles.emptyReviewContainer}>
                <Ionicons name="checkmark-circle" size={64} color="#28a745" />
                <Text style={styles.emptyReviewText}>Perfect Score!</Text>
                <Text style={styles.emptyReviewSubText}>You answered all questions correctly.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderFinishConfirmation = () => (
    <Modal
      visible={showFinishConfirmation}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFinishConfirmation(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons name="warning-outline" size={60} color="#dc3545" />
          <Text style={styles.modalTitle}>Finish Mock Test Early?</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to finish the mock test now? You're on question {currentQuestionIndex + 1} of {questions.length}.
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowFinishConfirmation(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                setShowFinishConfirmation(false);
                finishQuizNow();
              }}
            >
              <Text style={styles.confirmButtonText}>Finish Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          username={user?.displayName}
          navigation={navigation}
          pageTitle={title}
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#115740" />
          <Text style={styles.loadingText}>Loading mock test questions...</Text>
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
          pageTitle={title}
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMockQuizData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          username={user?.displayName}
          navigation={navigation}
          pageTitle={title}
        >
          {renderHeaderRight()}
        </Header>
        <View style={styles.emptyContainer}>
          <Ionicons name="help-circle-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No questions available for this mock test.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMockQuizData}>
            <Text style={styles.retryButtonText}>Reload Questions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    const resultColor = getPercentageColor(score, questions.length);
    const incorrect = questions.length - score;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          username={user?.displayName}
          navigation={navigation}
          pageTitle={title}
        >
          {renderHeaderRight()}
        </Header>
        <ScrollView contentContainerStyle={styles.resultScrollContent}>
          <View style={styles.resultContainer}>
            {/* Success/Failure Icon */}
            <View style={styles.resultIconContainer}>
              <Ionicons
                name={passed ? 'checkmark-circle' : 'close-circle'}
                size={80}
                color={passed ? '#28a745' : '#dc3545'}
              />
            </View>
            
            {/* Title */}
            <Text style={styles.resultTitle}>
              {passed ? 'Congratulations!' : 'Better Luck Next Time!'}
            </Text>
            
            {/* Large Percentage Score */}
            <Text style={[styles.resultPercentage, { color: resultColor }]}>
              {percentage}%
            </Text>
            
            {/* Description */}
            <Text style={styles.resultMessage}>
              {passed ? 'You passed the mock test!' : 'You did not pass the mock test. Keep practicing!'}
            </Text>
            
            {/* Statistics Tiles */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="checkmark-circle" size={32} color="#28a745" />
                </View>
                <Text style={styles.statLabel}>Correct</Text>
                <Text style={[styles.statValue, { color: '#28a745' }]}>{score}</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="close-circle" size={32} color="#dc3545" />
                </View>
                <Text style={styles.statLabel}>Incorrect</Text>
                <Text style={[styles.statValue, { color: '#dc3545' }]}>{incorrect}</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="target" size={32} color="#17a2b8" />
                </View>
                <Text style={styles.statLabel}>Accuracy</Text>
                <Text style={[styles.statValue, { color: resultColor }]}>{percentage}%</Text>
              </View>
            </View>

            {/* Review Incorrect Answers Button */}
            {incorrectAnswers.length > 0 && (
              <TouchableOpacity 
                style={styles.reviewIncorrectButton} 
                onPress={() => setShowReviewModal(true)}
              >
                <Ionicons name="eye-outline" size={20} color="white" />
                <Text style={styles.reviewIncorrectButtonText}>Review Incorrect Answers</Text>
              </TouchableOpacity>
            )}

            {/* Action Buttons */}
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.tryAgainButton} onPress={handleRetryQuiz}>
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {renderReviewModal()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        username={user?.displayName}
        navigation={navigation}
        pageTitle={title}
      >
        {renderHeaderRight()}
      </Header>

      <ScrollView style={styles.quizContentScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.quizContent}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1}/{questions.length}
              </Text>
            </View>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              {currentQuestion.question || currentQuestion.question_text || currentQuestion.title || currentQuestion.text}
            </Text>
            {(currentQuestion.question_urdu || currentQuestion.question_urdu_text || currentQuestion.title_urdu || currentQuestion.text_urdu) && (
              <Text style={styles.questionTextUrdu}>
                {currentQuestion.question_urdu || currentQuestion.question_urdu_text || currentQuestion.title_urdu || currentQuestion.text_urdu}
              </Text>
            )}
            {!isRulesQuestion && currentQuestion.image_url && (
              <View style={styles.imageContainer}>
                {renderImage(currentQuestion.image_url)}
              </View>
            )}
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => {
              // Extract option text properly
              const optionText = option.text || option.option_text || option.choice || option.answer || option.answer_text || `Option ${String.fromCharCode(65 + index)}`;
              const optionTextUrdu = option.text_urdu || option.option_urdu || option.choice_urdu || option.answer_urdu || option.answer_text_urdu || '';
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedAnswer === option && (option === currentQuestion.correctAnswer ? styles.correctAnswer : styles.wrongAnswer),
                    selectedAnswer !== null && option === currentQuestion.correctAnswer && styles.correctAnswer,
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>{optionText}</Text>
                    {optionTextUrdu && (
                      <Text style={styles.optionTextUrdu}>
                        {optionTextUrdu}
                      </Text>
                    )}
                  </View>
                  {selectedAnswer !== null && (
                    option === currentQuestion.correctAnswer ? (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    ) : (
                      selectedAnswer === option && <Ionicons name="close-circle" size={24} color="#F44336" />
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedAnswer && styles.nextButtonDisabled,
        ]}
        onPress={handleNextQuestion}
        disabled={!selectedAnswer}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
      
      {/* Render the finish confirmation modal */}
      {renderFinishConfirmation()}
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishQuizButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishQuizButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizContentScroll: {
    flex: 1,
  },
  quizContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressBarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    padding: 8,
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#115740',
    borderRadius: 5,
  },
  progressText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'right',
  },
  questionBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  questionImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
  },
  questionTextUrdu: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    lineHeight: 24,
    marginTop: 8,
    writingDirection: 'rtl',
    fontFamily: 'System',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextUrdu: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: 'System',
  },
  optionTextContainer: {
    flex: 1,
  },
  correctAnswer: {
    borderColor: '#28a745',
    backgroundColor: '#e6ffe6',
  },
  wrongAnswer: {
    borderColor: '#dc3545',
    backgroundColor: '#ffe6e6',
  },
  nextButton: {
    backgroundColor: '#115740',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  nextButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    elevation: 5,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: 500,
  },
  resultIconContainer: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultPercentage: {
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    minHeight: 80,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewIncorrectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewIncorrectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultActions: {
    width: '100%',
    alignItems: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#115740',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reviewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reviewModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  reviewModalBody: {
    padding: 20,
  },
  reviewQuestionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  reviewQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewQuestionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewQuestionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewQuestionStatusText: {
    fontSize: 14,
    color: '#dc3545',
    marginLeft: 4,
    fontWeight: '600',
  },
  reviewQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  reviewQuestionTextUrdu: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
    writingDirection: 'rtl',
    textAlign: 'right',
    fontFamily: 'System',
  },
  reviewImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  reviewOptionsContainer: {
    marginTop: 8,
  },
  reviewOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  reviewCorrectOption: {
    borderColor: '#28a745',
    backgroundColor: '#f8fff9',
  },
  reviewIncorrectOption: {
    borderColor: '#dc3545',
    backgroundColor: '#fff8f8',
  },
  reviewOptionContent: {
    flex: 1,
  },
  reviewOptionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  reviewOptionTextUrdu: {
    fontSize: 12,
    color: '#666',
    writingDirection: 'rtl',
    textAlign: 'right',
    fontFamily: 'System',
  },
  reviewCorrectOptionText: {
    color: '#28a745',
    fontWeight: '600',
  },
  reviewIncorrectOptionText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  emptyReviewContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyReviewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyReviewSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MockQuizScreen;
