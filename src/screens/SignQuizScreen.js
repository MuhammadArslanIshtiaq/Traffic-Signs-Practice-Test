import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { fetchQuizQuestions, inspectQuizzesTable, saveQuizResult } from '../config/supabase';
import { useUser } from '../contexts/UserContext';

const SignQuizScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { authority, category, categoryName } = route.params;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setQuestions(quizData);
        } else {
          // Fallback to sample questions if no data from Supabase
          setQuestions([
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
          ]);
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
        question: currentQuestion.question || currentQuestion.question_text
      });
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleNextQuestion = () => {
    const correctAnswer = currentQuestion.correct_answer || 
                         currentQuestion.correct_answer_id || 
                         currentQuestion.answer || 
                         currentQuestion.right_answer;
    
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      console.log('Moving to next question:', {
        currentIndex: currentQuestionIndex,
        newIndex: newIndex,
        currentImageUrl: currentQuestion.image_url,
        nextImageUrl: questions[newIndex]?.image_url
      });
      
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleFinishQuiz = async () => {
    // Save quiz result to Supabase if user is logged in
    if (user?.uid) {
      await saveQuizResult(
        user.uid,
        authority.code,
        category,
        score,
        questions.length
      );
    }

    Alert.alert(
      'Quiz Complete!',
      `You scored ${score} out of ${questions.length}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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
        onPress={() => navigation.goBack()}
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

  const renderQuestion = () => (
    <View style={styles.questionContainer}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <View style={styles.questionContent}>
        <Text style={styles.questionText}>
          {currentQuestion.question || currentQuestion.question_text || currentQuestion.title || currentQuestion.text}
            </Text>
        <Text style={styles.questionTextUrdu}>
          {currentQuestion.question_urdu || currentQuestion.question_urdu_text || currentQuestion.title_urdu || currentQuestion.text_urdu}
            </Text>
        
        <View style={styles.imageContainer}>
          {typeof currentQuestion.image_url === 'string' && currentQuestion.image_url.startsWith('http') ? (
            // If it's a web URL, use Image component with uri
            <Image 
              key={`image-${currentQuestionIndex}-${currentQuestion.id}`}
              source={{ uri: currentQuestion.image_url }}
              style={styles.signImage}
              resizeMode="contain"
            />
          ) : typeof currentQuestion.image_url === 'string' && currentQuestion.image_url.includes('/static/media/') ? (
            // If it's a bundled asset URL (from require), use Image component with uri
            <Image 
              key={`image-${currentQuestionIndex}-${currentQuestion.id}`}
              source={{ uri: currentQuestion.image_url }}
              style={styles.signImage}
              resizeMode="contain"
            />
          ) : typeof currentQuestion.image_url === 'number' ? (
            // If it's a require() result (number), use Image component directly
            <Image 
              key={`image-${currentQuestionIndex}-${currentQuestion.id}`}
              source={currentQuestion.image_url}
              style={styles.signImage}
              resizeMode="contain"
            />
          ) : (
            // Fallback to emoji
            <Text 
              key={`emoji-${currentQuestionIndex}-${currentQuestion.id}`}
              style={styles.signImageEmoji}
            >
              {currentQuestion.image_url || currentQuestion.image || currentQuestion.sign_image || currentQuestion.imageUrl || '🚦'}
            </Text>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {(currentQuestion.options || currentQuestion.choices || currentQuestion.answers || []).map((option, index) => (
            <TouchableOpacity
              key={option.id || option.answer_id || index}
              style={[
                styles.optionButton,
                selectedAnswer === (option.id || option.answer_id || String.fromCharCode(97 + index)) && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(option.id || option.answer_id || String.fromCharCode(97 + index))}
            >
              <Text style={styles.optionText}>
                {option.text || option.option_text || option.choice || option.answer || option.answer_text}
              </Text>
              <Text style={styles.optionTextUrdu}>
                {option.text_urdu || option.option_urdu || option.choice_urdu || option.answer_urdu || option.answer_text_urdu}
              </Text>
            </TouchableOpacity>
          ))}
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
      </View>
    </View>
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
        <Text style={styles.resultPercentage}>
          {Math.round((score / questions.length) * 100)}%
        </Text>
        <Text style={styles.resultMessage}>
          {score >= questions.length * 0.7 
            ? "Great job! You passed the quiz!" 
            : "Keep practicing to improve your score!"
          }
        </Text>
        
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishQuiz}
        >
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
      >
        {renderHeaderRight()}
      </Header>
      
      <View style={styles.content}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizTitle}>{categoryName}</Text>
          <Text style={styles.quizSubtitle}>{authority?.name}</Text>
        </View>

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
        ) : (
          showResult ? renderResult() : renderQuestion()
        )}
      </View>
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
    padding: 16,
  },
  quizHeader: {
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  quizSubtitle: {
    fontSize: 16,
    color: '#666',
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
  questionNumber: {
    fontSize: 16,
    color: '#666',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#115740',
  },
  questionContent: {
    flex: 1,
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
    borderRadius: 16,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#115740',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
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
    padding: 8,
    marginLeft: 8,
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
});

export default SignQuizScreen;
