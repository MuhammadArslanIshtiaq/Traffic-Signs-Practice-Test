import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to prepare randomized questions with randomized options
const prepareRandomizedQuestions = (questions) => {
  return shuffleArray(questions).map(question => ({
    ...question,
    options: shuffleArray(question.options)
  }));
};

const Quiz = ({ route, navigation }) => {
  const { quiz } = route.params;
  const { saveQuizResult } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Initialize randomized questions when component mounts
    setRandomizedQuestions(prepareRandomizedQuestions(quiz.questions));
  }, [quiz.questions]);

  const currentQuestion = randomizedQuestions[currentQuestionIndex] || {};
  const progress = ((currentQuestionIndex + 1) / randomizedQuestions.length) * 100;

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // Convert to seconds
      const percentage = Math.round((score / randomizedQuestions.length) * 100);
      
      // Save quiz result
      saveQuizResult({
        quizId: quiz.id,
        title: quiz.title,
        score: percentage,
        totalQuestions: randomizedQuestions.length,
        correctAnswers: score,
        timeSpent: timeSpent
      });
      
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    // Re-randomize questions for the new attempt
    setRandomizedQuestions(prepareRandomizedQuestions(quiz.questions));
  };

  const getAnswerStyle = (option) => {
    if (!selectedAnswer) return styles.option;
    if (option === currentQuestion.correctAnswer) {
      return [styles.option, styles.correctAnswer];
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.option, styles.wrongAnswer];
    }
    return styles.option;
  };

  if (randomizedQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / randomizedQuestions.length) * 100);
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons
            name={percentage >= 70 ? 'happy' : 'sad'}
            size={80}
            color={percentage >= 70 ? '#4CAF50' : '#F44336'}
          />
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>
            {score}/{randomizedQuestions.length} Correct
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={handleRetry}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={() => {
                // Implement share functionality
              }}
            >
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close-circle" size={32} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1}/{randomizedQuestions.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Question Box */}
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.questionBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </LinearGradient>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getAnswerStyle(option)}
            onPress={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
            {selectedAnswer && option === currentQuestion.correctAnswer && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
            {selectedAnswer === option && option !== currentQuestion.correctAnswer && (
              <Ionicons name="close-circle" size={24} color="#F44336" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedAnswer && styles.nextButtonDisabled,
        ]}
        onPress={handleNext}
        disabled={!selectedAnswer}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex === randomizedQuestions.length - 1 ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9F43',
    borderRadius: 4,
  },
  progressText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 45,
    textAlign: 'right',
  },
  questionBox: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
  },
  optionsContainer: {
    padding: 16,
  },
  option: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  wrongAnswer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    borderWidth: 1,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  scoreText: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  homeButton: {
    backgroundColor: '#FF9F43',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default Quiz; 