import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { fetchQuizQuestions, inspectQuizzesTable, saveQuizResult } from '../config/supabase';
import { useUser } from '../contexts/UserContext';

const SignQuizScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority, category, categoryName } = route.params;
  
  console.log('🎯 SignQuizScreen params:', { authority, category, categoryName });
  console.log('🎯 Authority object:', authority);
  
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

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to reset quiz state
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIncorrectAnswers([]);
    setShowReviewModal(false);
  };

  // Fetch questions from Supabase on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        
        // First, let's inspect the table structure
        await inspectQuizzesTable();
        
        const quizData = await fetchQuizQuestions(category);
        console.log('Fetched quiz data:', quizData);
        
        if (quizData && quizData.length > 0) {
          console.log('📋 Quiz data loaded:', quizData.length, 'questions');
          console.log('🔍 Sample question structure:', quizData[0]);
          
          // Shuffle options for each question to randomize order
          const shuffledQuizData = quizData.map(question => ({
            ...question,
            options: shuffleArray(question.options || [])
          }));
          setQuestions(shuffledQuizData);
        } else {
          // Fallback to sample questions if no data from Supabase
          const fallbackQuestions = [
    {
      id: 1,
      question: "What does this sign mean?",
              question_urdu: "اس سائن کا کیا مطلب ہے؟",
              image_url: "🚦",
      options: [
                { id: 'a', text: 'Stop', text_urdu: 'روکیں' },
                { id: 'b', text: 'Go', text_urdu: 'جائیں' },
                { id: 'c', text: 'Wait', text_urdu: 'انتظار کریں' },
                { id: 'd', text: 'Turn', text_urdu: 'مڑیں' }
              ],
              correct_answer: 'a'
    },
    {
      id: 2,
      question: "What does this sign indicate?",
              question_urdu: "یہ سائن کیا ظاہر کرتا ہے؟",
              image_url: "⚠️",
      options: [
                { id: 'a', text: 'School ahead', text_urdu: 'آگے اسکول' },
                { id: 'b', text: 'Hospital ahead', text_urdu: 'آگے ہسپتال' },
                { id: 'c', text: 'Danger ahead', text_urdu: 'آگے خطرہ' },
                { id: 'd', text: 'Parking ahead', text_urdu: 'آگے پارکنگ' }
              ],
              correct_answer: 'c'
            }
          ];
          
          // Shuffle options for fallback questions too
          const shuffledFallbackQuestions = fallbackQuestions.map(question => ({
            ...question,
            options: shuffleArray(question.options || [])
          }));
          setQuestions(shuffledFallbackQuestions);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load quiz questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [category]);

  const currentQuestion = questions[currentQuestionIndex];

  // Debug effect to track question changes
  useEffect(() => {
    if (currentQuestion) {
      console.log('Current question changed:', {
        index: currentQuestionIndex,
        id: currentQuestion.id,
        imageUrl: currentQuestion.image_url,
        imageType: typeof currentQuestion.image_url,
        question: currentQuestion.question || currentQuestion.question_text
      });
      
      // Debug image source details
      if (currentQuestion.image_url) {
        console.log('🖼️ Image Debug:', {
          questionIndex: currentQuestionIndex + 1,
          imageUrl: currentQuestion.image_url,
          isNumber: typeof currentQuestion.image_url === 'number',
          isObject: typeof currentQuestion.image_url === 'object',
          isString: typeof currentQuestion.image_url === 'string',
          hasUri: currentQuestion.image_url?.uri,
          isStaticMedia: typeof currentQuestion.image_url === 'string' && currentQuestion.image_url.includes('/static/media/'),
          isBase64: typeof currentQuestion.image_url === 'string' && currentQuestion.image_url.startsWith('data:'),
          isEmoji: typeof currentQuestion.image_url === 'string' && currentQuestion.image_url.length <= 4
        });
        
        // Special logging for problematic questions
        if ([6, 21, 23].includes(currentQuestionIndex + 1)) {
          console.log(`🚨 QUESTION ${currentQuestionIndex + 1} IMAGE DEBUG:`, {
            imageUrl: currentQuestion.image_url,
            type: typeof currentQuestion.image_url,
            isBase64: typeof currentQuestion.image_url === 'string' && currentQuestion.image_url.startsWith('data:'),
            willShowText: typeof currentQuestion.image_url === 'string' && 
              !currentQuestion.image_url.startsWith('http') && 
              !currentQuestion.image_url.includes('/static/media/') && 
              !currentQuestion.image_url.startsWith('data:') && 
              typeof currentQuestion.image_url !== 'number'
          });
        }
      } else {
        console.log('🚨 NO IMAGE URL for question:', currentQuestionIndex + 1);
      }
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleNextQuestion = () => {
    // Find the correct answer from the options array
    let correctAnswer = null;
    let selectedOption = null;
    
    // Find the selected option object
    if (currentQuestion.options && Array.isArray(currentQuestion.options)) {
      selectedOption = currentQuestion.options.find(opt => 
        opt.id === selectedAnswer || opt.id === String(selectedAnswer)
      );
      
      // Find the correct option
      correctAnswer = currentQuestion.options.find(opt => opt.is_correct === true);
    }
    
    // Fallback to old logic if options structure is different
    if (!correctAnswer) {
      correctAnswer = currentQuestion.correct_answer || 
                     currentQuestion.correct_answer_id || 
                     currentQuestion.answer || 
                     currentQuestion.right_answer;
    }
    
    const isCorrect = selectedOption?.is_correct === true || selectedAnswer === correctAnswer;
    
    console.log('🎯 Answer Check:', {
      selectedAnswer,
      selectedOption,
      correctAnswer,
      isCorrect,
      currentScore: score,
      newScore: isCorrect ? score + 1 : score,
      options: currentQuestion.options,
      optionsWithCorrect: currentQuestion.options?.map(opt => ({
        id: opt.id,
        text: opt.text,
        is_correct: opt.is_correct
      }))
    });
    
    if (isCorrect) {
      setScore(prevScore => {
        const newScore = prevScore + 1;
        return newScore;
      });
    } else {
      // Track incorrect answer for review
      setIncorrectAnswers(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        question: currentQuestion,
        selectedAnswer: selectedAnswer,
        correctAnswer: correctAnswer
      }]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;

      
      setCurrentQuestionIndex(newIndex);
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
    // Save quiz result to Supabase if user is logged in
    if (user?.uid) {
      try {
        await saveQuizResult(
          user.uid,
          authority?.code || authority?.name || 'unknown',
          category,
          score,
          questions.length
        );
      } catch (error) {
        console.log('❌ Error saving quiz result:', error);
      }
    }
    
    // Show results screen
    setShowResult(true);
  };

  const handleRetryQuiz = () => {
    resetQuiz();
  };

  const handleGoToQuizzes = () => {
    navigation.navigate('Home');
  };

  const handleProfilePress = () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    navigation.navigate('Profile');
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        style={styles.headerButton}
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
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={handleProfilePress}
      >
        <Ionicons name="person-circle-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Check if this is a rules quiz (no images needed)
  const isRulesQuiz = category === 'rules1' || category === 'rules2';

  // Function to get percentage color based on score
  const getPercentageColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#28a745'; // Green for excellent
    if (percentage >= 80) return '#17a2b8'; // Blue for good
    if (percentage >= 70) return '#ffc107'; // Yellow for pass
    if (percentage >= 60) return '#fd7e14'; // Orange for below average
    return '#dc3545'; // Red for poor
  };

  const renderImage = () => {
    // Don't render image for rules quizzes
    if (isRulesQuiz) {
      return null;
    }

    const imageSource = questions[currentQuestionIndex]?.image_url;
    
    if (typeof imageSource === 'number') {
      return (
        <Image 
          key={`image-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
          source={imageSource}
          style={styles.signImage}
          resizeMode="contain"
        />
      );
    } else if (imageSource && typeof imageSource === 'object' && imageSource.uri) {
      return (
        <Image 
          key={`image-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
          source={imageSource}
          style={styles.signImage}
          resizeMode="contain"
        />
      );
    } else if (typeof imageSource === 'string' && (imageSource.startsWith('http') || imageSource.includes('/static/media/'))) {
      return (
        <Image 
          key={`image-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
          source={{ uri: imageSource }}
          style={styles.signImage}
          resizeMode="contain"
        />
      );
    } else if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      return (
        <Image 
          key={`image-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
          source={{ uri: imageSource }}
          style={styles.signImage}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Text 
          key={`emoji-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
          style={styles.signImageEmoji}
        >
          🚦
            </Text>
      );
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return <Text>Loading question...</Text>;
    }
    

    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <View style={styles.questionInfo}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
            </View>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>
      <ScrollView 
        style={styles.questionContent}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.questionContentContainer}
      >
        <Text style={[styles.questionText, isRulesQuiz && styles.questionTextRules]}>
          {currentQuestion.question || currentQuestion.question_text || currentQuestion.title || currentQuestion.text}
            </Text>
        <Text style={[styles.questionTextUrdu, isRulesQuiz && styles.questionTextUrduRules]}>
          {currentQuestion.question_urdu || currentQuestion.question_urdu_text || currentQuestion.title_urdu || currentQuestion.text_urdu || 'No Urdu text available'}
            </Text>
        {!isRulesQuiz && (
          <View style={styles.imageContainer}>
            {renderImage()}
          </View>
        )}

        <View style={styles.optionsContainer}>
          {(currentQuestion.options || currentQuestion.choices || currentQuestion.answers || []).map((option, index) => {
            // Extract option text properly
            const optionText = option.text || option.option_text || option.choice || option.answer || option.answer_text || `Option ${String.fromCharCode(65 + index)}`;
            const optionTextUrdu = option.text_urdu || option.option_urdu || option.choice_urdu || option.answer_urdu || option.answer_text_urdu || '';
            
            // Debug: Log option details for rules quizzes
            if (isRulesQuiz && index === 0) {
              console.log('🔍 Rules Quiz Options Debug:', {
                totalOptions: (currentQuestion.options || currentQuestion.choices || currentQuestion.answers || []).length,
                category: category,
                questionIndex: currentQuestionIndex + 1
              });
            }
            
      return (
              <TouchableOpacity 
                key={option.id || option.answer_id || index}
                style={[
                  styles.optionButton,
                  selectedAnswer === (option.id || option.answer_id || String.fromCharCode(97 + index)) && styles.selectedOption
                ]}
                onPress={() => handleAnswerSelect(option.id || option.answer_id || String.fromCharCode(97 + index))}
              >
                <Text style={styles.optionText}>
                  {optionText}
                </Text>
                <Text style={styles.optionTextUrdu}>
                  {optionTextUrdu || 'No Urdu option text'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

              <TouchableOpacity 
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer}
              >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Text>
              </TouchableOpacity>
      </ScrollView>
        </View>
      );
    }

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
          <Text style={styles.modalTitle}>Finish Quiz Early?</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to finish the quiz now? You're on question {currentQuestionIndex + 1} of {questions.length}.
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
              <Text style={styles.confirmButtonText}>Finish Quiz</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
    </Modal>
  );

  const renderResult = () => (
        <View style={styles.resultContainer}>
      <View style={styles.resultContent}>
            <Ionicons 
          name={score >= questions.length * 0.7 ? "trophy" : "sad"} 
          size={80} 
          color={score >= questions.length * 0.7 ? "#f39c12" : "#e74c3c"} 
        />
        <Text style={styles.resultTitle}>Quiz Complete!</Text>
        <Text style={styles.resultScore}>
          You scored {score} out of {questions.length}
            </Text>
        <Text style={[styles.resultPercentage, { color: getPercentageColor(score, questions.length) }]}>
          {Math.round((score / questions.length) * 100)}%
            </Text>
            <Text style={styles.resultMessage}>
          {score === questions.length ? 'Perfect! Excellent work!' : 
           score >= questions.length * 0.8 ? 'Great job! Well done!' :
           score >= questions.length * 0.7 ? 'Good job! You passed!' :
           score >= questions.length * 0.6 ? 'Good effort! Keep practicing!' :
           'Keep studying! You\'ll improve with practice!'}
            </Text>
        
        <View style={styles.resultStats}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#28a745" />
            </View>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="close-circle" size={24} color="#dc3545" />
            </View>
            <Text style={styles.statLabel}>Incorrect</Text>
            <Text style={styles.statValue}>{questions.length - score}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trophy" size={24} color="#ffc107" />
            </View>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{Math.round((score / questions.length) * 100)}%</Text>
          </View>
        </View>

        {incorrectAnswers.length > 0 && (
              <TouchableOpacity 
            style={[styles.resultButton, styles.reviewButton]}
            onPress={() => setShowReviewModal(true)}
              >
            <Ionicons name="eye" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.resultButtonText}>Review Incorrect Answers ({incorrectAnswers.length})</Text>
              </TouchableOpacity>
        )}

        <View style={styles.resultButtons}>
              <TouchableOpacity 
            style={[styles.resultButton, styles.retryButton]}
            onPress={handleRetryQuiz}
              >
            <Ionicons name="refresh" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.resultButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );

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
              const correctOption = question.options?.find(opt => opt.is_correct) || 
                                   question.options?.find(opt => opt.id === item.correctAnswer) ||
                                   question.options?.[0];

    return (
                <View key={index} style={styles.reviewQuestionCard}>
                  <View style={styles.reviewQuestionHeader}>
                    <Text style={styles.reviewQuestionNumber}>Question {item.questionIndex + 1}</Text>
                    <View style={styles.reviewQuestionStatus}>
                      <Ionicons name="close-circle" size={20} color="#dc3545" />
                      <Text style={styles.reviewQuestionStatusText}>Incorrect</Text>
          </View>
        </View>

                  <Text style={styles.reviewQuestionText}>
                    {question.question || question.question_text || question.title || question.text}
                  </Text>
                  
                  {question.question_urdu && (
                    <Text style={styles.reviewQuestionTextUrdu}>
                      {question.question_urdu}
                    </Text>
                  )}
                  
                  {!isRulesQuiz && question.image_url && (
                    <View style={styles.reviewImageContainer}>
                      {renderImage()}
          </View>
                  )}
                  
                  <View style={styles.reviewOptionsContainer}>
                    {question.options?.map((option, optIndex) => {
                      const isCorrect = option.is_correct || option.id === item.correctAnswer;
                      const isSelected = option.id === item.selectedAnswer;
                      
                      return (
                        <View
                          key={option.id || optIndex}
                          style={[
                            styles.reviewOptionItem,
                            isCorrect && styles.reviewCorrectOption,
                            isSelected && !isCorrect && styles.reviewIncorrectOption
                          ]}
                        >
                          <View style={styles.reviewOptionContent}>
                            <Text style={[
                              styles.reviewOptionText,
                              isCorrect && styles.reviewCorrectOptionText,
                              isSelected && !isCorrect && styles.reviewIncorrectOptionText
                            ]}>
                              {option.text || option.option_text || option.choice || option.answer || `Option ${String.fromCharCode(65 + optIndex)}`}
                            </Text>
                            {option.text_urdu && (
                              <Text style={[
                                styles.reviewOptionTextUrdu,
                                isCorrect && styles.reviewCorrectOptionText,
                                isSelected && !isCorrect && styles.reviewIncorrectOptionText
                              ]}>
                                {option.text_urdu}
              </Text>
                            )}
                          </View>
                          {isCorrect && (
                            <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                          )}
                          {isSelected && !isCorrect && (
                            <Ionicons name="close-circle" size={20} color="#dc3545" />
                          )}
                        </View>
                      );
                    })}
        </View>
      </View>
    );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle={categoryName}
      >
        {renderHeaderRight()}
      </Header>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {!showResult && (
          <View style={styles.quizProgress}>
            <View style={styles.progressRow}>
              <Text style={styles.quizProgressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <TouchableOpacity
                style={styles.finishQuizButton}
                onPress={() => {
                  handleFinishQuiz();
                }}
              >
                <Text style={styles.finishQuizButtonText}>Finish Quiz</Text>
              </TouchableOpacity>
      </View>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#115740" />
            <Text style={styles.loadingText}>Loading quiz questions...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : questions.length === 0 ? (
          <View style={styles.errorContainer}>
            <Ionicons name="document-outline" size={64} color="#666" />
            <Text style={styles.errorText}>No questions available for this category</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : showResult ? renderResult() : renderQuestion()}
      </ScrollView>
      
      {/* Render the finish confirmation modal */}
      {renderFinishConfirmation()}
      
      {/* Render the review modal */}
      {renderReviewModal()}
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
  quizProgress: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 20,
    width: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizProgressText: {
    fontSize: 14,
    color: '#115740',
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionInfo: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#115740',
    borderRadius: 2,
  },

  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#115740',
  },
  questionContent: {
    flex: 1,
  },
  questionContentContainer: {
    paddingBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  questionTextUrdu: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  questionTextRules: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 28,
  },
  questionTextUrduRules: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 26,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  signImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  signImageEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    borderColor: '#115740',
    backgroundColor: '#f0f8f0',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionTextUrdu: {
    fontSize: 14,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#115740',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 16,
  },
  resultScore: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#115740',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultStats: {
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
    color: '#333',
  },
  finishButton: {
    backgroundColor: '#115740',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
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
    marginLeft: 16,
  },
  finishQuizButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultButtons: {
    width: '100%',
    marginTop: 30,
  },
  resultButton: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  retryButton: {
    backgroundColor: '#115740',
  },
  quizzesButton: {
    backgroundColor: '#28a745',
  },
  buttonIcon: {
    marginRight: 8,
  },
  resultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  // Review Modal Styles
  reviewButton: {
    backgroundColor: '#6f42c1',
    marginBottom: 16,
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
  },
  reviewCorrectOptionText: {
    color: '#28a745',
    fontWeight: '600',
  },
  reviewIncorrectOptionText: {
    color: '#dc3545',
    fontWeight: '600',
  },
});

export default SignQuizScreen;
