import React, { createContext, useContext, useEffect, useState } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Starting to fetch all quizzes...');
      
      // Fetch all quizzes using the quizzes endpoint
      const quizzesResponse = await fetch('https://sup-admin-quizly.vercel.app/api/public/quizzes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!quizzesResponse.ok) {
        throw new Error(`HTTP ${quizzesResponse.status}: ${quizzesResponse.statusText}`);
      }
      
      const quizzesData = await quizzesResponse.json();
      console.log('📋 Received quizzes data:', quizzesData);
      
      if (!quizzesData.success || !quizzesData.data || !quizzesData.data.quizzes || !Array.isArray(quizzesData.data.quizzes)) {
        throw new Error('Invalid quizzes data structure');
      }
      
      const quizzesArray = quizzesData.data.quizzes;
      console.log(`🎯 Found ${quizzesArray.length} total quizzes`);
      
      // Look for the 3 mock test quizzes
      const mockTestQuizzes = {
        nha: null,
        sindh: null,
        multiple: null
      };
      
      // Find mock test quizzes by title and ID
      console.log('🔍 All available quizzes:');
      quizzesArray.forEach(q => {
        console.log(`  📋 ID: ${q.id}, Title: "${q.title}"`);
      });
      
      // Known mock test IDs from Supabase
      const knownMockTestIds = {
        nha: 'd2fdf665-6851-4c18-86ba-374c3cc4e575',
        multiple: 'a5566baa-b070-4663-ab44-c50c7f851d5b', 
        sindh: '4d6fa8c6-0c42-40ac-ad01-132d43d5159f'
      };
      
      for (const quiz of quizzesArray) {
        const title = quiz.title?.toLowerCase() || '';
        console.log(`🔍 Checking quiz: ID="${quiz.id}", Title="${quiz.title}"`);
        
        // Check by known IDs first (most reliable)
        if (quiz.id === knownMockTestIds.nha) {
          console.log('🎯 Found NHA mock test by ID:', quiz.title);
          mockTestQuizzes.nha = await fetchQuizQuestions(quiz.id, quiz.title);
        } else if (quiz.id === knownMockTestIds.sindh) {
          console.log('🎯 Found Sindh mock test by ID:', quiz.title);
          mockTestQuizzes.sindh = await fetchQuizQuestions(quiz.id, quiz.title);
        } else if (quiz.id === knownMockTestIds.multiple) {
          console.log('🎯 Found Multiple mock test by ID:', quiz.title);
          mockTestQuizzes.multiple = await fetchQuizQuestions(quiz.id, quiz.title);
        }
        // Fallback to title-based detection for flexibility
        else if (title.includes('mock')) {
          console.log(`📋 Found mock quiz by title: "${quiz.title}"`);
          
          if (title.includes('nha') || title.includes('national highway') || title.includes('motorway')) {
            console.log('🎯 Found NHA mock test by title:', quiz.title);
            mockTestQuizzes.nha = await fetchQuizQuestions(quiz.id, quiz.title);
          } else if (title.includes('sindh')) {
            console.log('🎯 Found Sindh mock test by title:', quiz.title);
            mockTestQuizzes.sindh = await fetchQuizQuestions(quiz.id, quiz.title);
          } else if (title.includes('multiple')) {
            console.log('🎯 Found Multiple mock test by title:', quiz.title);
            mockTestQuizzes.multiple = await fetchQuizQuestions(quiz.id, quiz.title);
          } else {
            console.log('⚠️ Found unrecognized mock test:', quiz.title);
          }
        }
      }
      
      // Also cache individual quiz categories for regular quizzes
      const categoryQuizzes = {};
      const categoryMap = {
        'mandatory road signs': 'mandatory',
        'warning road signs': 'warning',
        'informatory road signs': 'informatory',
        'rules quiz 1': 'rules1',
        'rules quiz 2': 'rules2'
      };
      
      for (const quiz of quizzesArray) {
        const title = quiz.title?.toLowerCase() || '';
        
        for (const [searchTitle, categoryKey] of Object.entries(categoryMap)) {
          if (title.includes(searchTitle)) {
            console.log(`🎯 Found ${categoryKey} quiz:`, quiz.title);
            categoryQuizzes[categoryKey] = await fetchQuizQuestions(quiz.id, quiz.title);
            break;
          }
        }
      }
      
      // Verify all mock tests were found
      console.log('📊 Mock test detection results:');
      Object.keys(knownMockTestIds).forEach(type => {
        const found = mockTestQuizzes[type] ? '✅' : '❌';
        console.log(`  ${found} ${type.toUpperCase()}: ${mockTestQuizzes[type]?.length || 0} questions`);
      });
      
      const allQuizzes = {
        mockTests: mockTestQuizzes,
        categories: categoryQuizzes
      };
      
      console.log('✅ All quizzes cached successfully:', {
        mockTests: Object.keys(mockTestQuizzes).filter(key => mockTestQuizzes[key] && mockTestQuizzes[key].length > 0),
        categories: Object.keys(categoryQuizzes)
      });
      
      console.log('📊 Mock test question counts:', {
        nha: mockTestQuizzes.nha?.length || 0,
        sindh: mockTestQuizzes.sindh?.length || 0,
        multiple: mockTestQuizzes.multiple?.length || 0
      });
      
      setQuizzes(allQuizzes);
      
    } catch (error) {
      console.error('❌ Error fetching quizzes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchQuizQuestions = async (quizId, quizTitle) => {
    try {
      console.log(`📥 Fetching questions for quiz: ${quizTitle} (ID: ${quizId})`);
      
      const response = await fetch(`https://sup-admin-quizly.vercel.app/api/public/quizzes/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const quizData = await response.json();
      
      if (!quizData.success || !quizData.data || !quizData.data.questions || !Array.isArray(quizData.data.questions)) {
        throw new Error(`Invalid quiz data structure for ${quizTitle}`);
      }
      
      const questions = quizData.data.questions;
      console.log(`📝 Fetched ${questions.length} questions for ${quizTitle}`);
      
      // Process questions to ensure consistent structure
      const processedQuestions = questions.map((question, index) => {
        // Extract question text - API uses question_text
        const questionText = question.question_text || question.question || question.title || question.text || 'Question text not available';
        
        // Extract Urdu text from secondary_languages array
        let questionTextUrdu = '';
        if (question.secondary_languages && Array.isArray(question.secondary_languages)) {
          const urduLanguage = question.secondary_languages.find(lang => lang.language_code === 'ur');
          questionTextUrdu = urduLanguage?.question_text || '';
        } else if (question.secondary_languages?.urdu) {
          // Fallback for old format
          questionTextUrdu = question.secondary_languages.urdu;
        }
        // Additional fallbacks
        questionTextUrdu = questionTextUrdu || question.question_urdu || question.question_urdu_text || question.title_urdu || '';
        
        // Debug: Log question structure for first question
        if (index === 0) {
          console.log('🔍 QuizContext - Raw question structure:', {
            id: question.id,
            question_text: question.question_text,
            secondary_languages: question.secondary_languages,
            questionTextUrdu: questionTextUrdu,
            optionsCount: question.options?.length || 0,
            firstOptionStructure: question.options?.[0]
          });
        }
        
        // Extract image URL from sign object
        const imageUrl = question.sign?.image_url || question.image_url || question.imageUrl || null;
        
        // Extract options from API structure
        let options = [];
        if (question.options && Array.isArray(question.options)) {
          options = question.options.map((option, optIndex) => {
            // Extract Urdu text from secondary_languages array
            let urduText = '';
            if (option.secondary_languages && Array.isArray(option.secondary_languages)) {
              const urduLanguage = option.secondary_languages.find(lang => lang.language_code === 'ur');
              urduText = urduLanguage?.option_text || '';
            } else if (option.secondary_languages?.urdu) {
              // Fallback for old format
              urduText = option.secondary_languages.urdu;
            }
            // Additional fallbacks
            urduText = urduText || option.text_urdu || '';
            
            // Debug: Log option structure for first question's first option
            if (index === 0 && optIndex === 0) {
              console.log('🔍 QuizContext - Raw option structure:', {
                option_text: option.option_text,
                secondary_languages: option.secondary_languages,
                extracted_urdu: urduText,
                option_letter: option.option_letter,
                is_correct: option.is_correct
              });
            }
            
            return {
              id: option.option_letter?.toLowerCase() || option.id || String.fromCharCode(97 + optIndex),
              text: option.option_text || option.text || 'Option text not available',
              text_urdu: urduText,
              is_correct: option.is_correct || false
            };
          });
        }
        
        // Find correct answer from options
        const correctOption = options.find(option => option.is_correct);
        const correctAnswer = correctOption?.id || 'a';
        
        const processedQuestion = {
          id: question.id || `question-${index}`,
          question: questionText,
          question_urdu: questionTextUrdu,
          image_url: imageUrl,
          options: options,
          correct_answer: correctAnswer,
          correctAnswer: correctAnswer,
          category: question.sign?.sign_type || question.category || 'unknown',
          order: question.order || index + 1
        };
        
        // Debug: Log final processed question for first question
        if (index === 0) {
          console.log('🔍 QuizContext - Final processed question:', {
            question: processedQuestion.question,
            question_urdu: processedQuestion.question_urdu,
            options_count: processedQuestion.options.length,
            first_option_urdu: processedQuestion.options[0]?.text_urdu
          });
        }
        
        return processedQuestion;
      });
      
      return processedQuestions;
      
    } catch (error) {
      console.error(`❌ Error fetching questions for ${quizTitle}:`, error);
      return [];
    }
  };
  
  const getMockTestQuiz = (authority) => {
    const authorityCode = authority?.code?.toLowerCase() || authority?.name?.toLowerCase() || '';
    console.log(`🔍 getMockTestQuiz - Authority: ${authority?.name}, Code: ${authority?.code}`);
    console.log(`🔍 Available mock tests:`, Object.keys(quizzes.mockTests || {}).filter(key => quizzes.mockTests[key] && quizzes.mockTests[key].length > 0));
    
    let selectedQuiz = [];
    
    if (authorityCode.includes('nha') || authorityCode.includes('motorway') || authorityCode.includes('national highway')) {
      console.log('🎯 Requesting NHA mock test');
      selectedQuiz = quizzes.mockTests?.nha || [];
    } else if (authorityCode.includes('sindh')) {
      console.log('🎯 Requesting Sindh mock test');
      selectedQuiz = quizzes.mockTests?.sindh || [];
    } else {
      console.log('🎯 Requesting Multiple mock test (default)');
      selectedQuiz = quizzes.mockTests?.multiple || [];
    }
    
    console.log(`📊 Selected quiz has ${selectedQuiz.length} questions`);
    return selectedQuiz;
  };
  
  const getCategoryQuiz = (category) => {
    return quizzes.categories?.[category] || [];
  };
  
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Initialize quizzes on mount
  useEffect(() => {
    fetchAllQuizzes();
  }, []);
  
  const value = {
    quizzes,
    loading,
    error,
    getMockTestQuiz,
    getCategoryQuiz,
    shuffleArray,
    refetchQuizzes: fetchAllQuizzes
  };
  
  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
