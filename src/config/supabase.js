// Import API configuration
import { getAuth } from 'firebase/auth';
import {
  API_BASE_URL,
  API_SETUP_INSTRUCTIONS,
  API_TYPES,
  getAuthHeaders,
  PUBLIC_API_BASE_URL,
  testApiConnection
} from './api-config.js';

// Image mapping for traffic signs
// Since React Native doesn't support dynamic require(), we need to map each image
// We need to handle both URL-encoded and regular paths
const createImageMap = () => {
  const images = {
    // Mandatory Road Signs
    'mandatory road signs/Slow.png': require('../../assets/images/signs/mandatory road signs/Slow.png'),
    'mandatory road signs/Stop.png': require('../../assets/images/signs/mandatory road signs/Stop.png'),
    'mandatory road signs/No Entry.png': require('../../assets/images/signs/mandatory road signs/No Entry.png'),
    'mandatory road signs/No Entry 02.png': require('../../assets/images/signs/mandatory road signs/No Entry 02.png'),
    'mandatory road signs/No Parking.png': require('../../assets/images/signs/mandatory road signs/No Parking.png'),
    'mandatory road signs/No Left Turn.png': require('../../assets/images/signs/mandatory road signs/No Left Turn.png'),
    'mandatory road signs/No Right Turn.png': require('../../assets/images/signs/mandatory road signs/No Right Turn.png'),
    'mandatory road signs/No Uturn.png': require('../../assets/images/signs/mandatory road signs/No Uturn.png'),
    'mandatory road signs/Go Straight Ahead.png': require('../../assets/images/signs/mandatory road signs/Go Straight Ahead.png'),
    'mandatory road signs/Go Straigh or Right.png': require('../../assets/images/signs/mandatory road signs/Go Straigh or Right.png'),
    'mandatory road signs/Go Straigh or Left.png': require('../../assets/images/signs/mandatory road signs/Go Straigh or Left.png'),
    'mandatory road signs/Keep to the Left.png': require('../../assets/images/signs/mandatory road signs/Keep to the Left.png'),
    'mandatory road signs/Keep to the Right.png': require('../../assets/images/signs/mandatory road signs/Keep to the Right.png'),
    'mandatory road signs/Turn to the Left.png': require('../../assets/images/signs/mandatory road signs/Turn to the Left.png'),
    'mandatory road signs/Turn to the Left 02.png': require('../../assets/images/signs/mandatory road signs/Turn to the Left 02.png'),
    'mandatory road signs/Turn to the Right.png': require('../../assets/images/signs/mandatory road signs/Turn to the Right.png'),
    'mandatory road signs/Turn to the Right 02.png': require('../../assets/images/signs/mandatory road signs/Turn to the Right 02.png'),
    'mandatory road signs/Stop For Police Post.png': require('../../assets/images/signs/mandatory road signs/Stop For Police Post.png'),
    'mandatory road signs/Road Close.png': require('../../assets/images/signs/mandatory road signs/Road Close.png'),
    'mandatory road signs/Passing Police Custom Post without Stopping.png': require('../../assets/images/signs/mandatory road signs/Passing Police Custom Post without Stopping.png'),
    'mandatory road signs/Overtaking Prohibited.png': require('../../assets/images/signs/mandatory road signs/Overtaking Prohibited.png'),
    'mandatory road signs/Overtaking by  Good Vehicles Prohibited.png': require('../../assets/images/signs/mandatory road signs/Overtaking by  Good Vehicles Prohibited.png'),
    'mandatory road signs/No Stopping - Clearway.png': require('../../assets/images/signs/mandatory road signs/No Stopping - Clearway.png'),
    'mandatory road signs/No Entry for Animal Drawn Vehicle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Animal Drawn Vehicle.png'),
    'mandatory road signs/No Entry for Goods Vehicles.png': require('../../assets/images/signs/mandatory road signs/No Entry for Goods Vehicles.png'),
    'mandatory road signs/No Entry for Cycle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Cycle.png'),
    'mandatory road signs/No Entry for Motor Cycle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Motor Cycle.png'),
    'mandatory road signs/No Entry for Hand Carts.png': require('../../assets/images/signs/mandatory road signs/No Entry for Hand Carts.png'),
    'mandatory road signs/No Entry for Pedestrains.png': require('../../assets/images/signs/mandatory road signs/No Entry for Pedestrains.png'),
    'mandatory road signs/No Entry for Motor Vehical.png': require('../../assets/images/signs/mandatory road signs/No Entry for Motor Vehical.png'),
    'mandatory road signs/No Entry for Vehicles Exceeding 7 Ton Laden Weight.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 7 Ton Laden Weight.png'),
    'mandatory road signs/No Entry for Vehicles Exceeding 7 Ton Laden Weight (2).png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 7 Ton Laden Weight (2).png'),
    'mandatory road signs/No Entry for Vehicles Exceeding 6 Ton One Axle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 6 Ton One Axle.png'),
    'mandatory road signs/No Entry for Vehicles Exceeding 10 Meter in Length.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding 10 Meter in Length.png'),
    'mandatory road signs/No Entry for Vehicles Exceeding Width more than 86.png': require('../../assets/images/signs/mandatory road signs/No Entry for Vehicles Exceeding Width more than 86.png'),
    'mandatory road signs/No Entry for Agricultural Vehicle.png': require('../../assets/images/signs/mandatory road signs/No Entry for Agricultural Vehicle.png'),
    'mandatory road signs/Audible Warning Devices Prohibited.png': require('../../assets/images/signs/mandatory road signs/Audible Warning Devices Prohibited.png'),
    'mandatory road signs/Compulsory Round About.png': require('../../assets/images/signs/mandatory road signs/Compulsory Round About.png'),
    'mandatory road signs/Dual Carriageway Ahead.png': require('../../assets/images/signs/mandatory road signs/Dual Carriageway Ahead.png'),
    'mandatory road signs/Dual Carriageway End.png': require('../../assets/images/signs/mandatory road signs/Dual Carriageway End.png'),
    'mandatory road signs/End of 30KMH Zone.png': require('../../assets/images/signs/mandatory road signs/End of 30KMH Zone.png'),
    'mandatory road signs/Entry to 30KMH Zone.png': require('../../assets/images/signs/mandatory road signs/Entry to 30KMH Zone.png'),
    'mandatory road signs/End of Prohibitation of Overtaking.png': require('../../assets/images/signs/mandatory road signs/End of Prohibitation of Overtaking.png'),
    'mandatory road signs/End of Speed Limit Imposed.png': require('../../assets/images/signs/mandatory road signs/End of Speed Limit Imposed.png'),
    'mandatory road signs/Give Way or Stop Completely.png': require('../../assets/images/signs/mandatory road signs/Give Way or Stop Completely.png'),
    'mandatory road signs/Lane Control Sign.png': require('../../assets/images/signs/mandatory road signs/Lane Control Sign.png'),
    'mandatory road signs/National Speed Limit Applies.png': require('../../assets/images/signs/mandatory road signs/National Speed Limit Applies.png'),
    'mandatory road signs/Max Speed Limit 80KMH.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'),
    
    // Warning Road Signs
    'warning road signs/Danger Ahead.png': require('../../assets/images/signs/warning road signs/Danger Ahead.png'),
    'warning road signs/Road Works.png': require('../../assets/images/signs/warning road signs/Road Works.png'),
    'warning road signs/Slippery Roads.png': require('../../assets/images/signs/warning road signs/Slippery Roads.png'),
    'warning road signs/Pedestrain Crossing.png': require('../../assets/images/signs/warning road signs/Pedestrain Crossing.png'),
    'warning road signs/Left Bend.png': require('../../assets/images/signs/warning road signs/Left Bend.png'),
    'warning road signs/Right Bend.png': require('../../assets/images/signs/warning road signs/Right Bend.png'),
    'warning road signs/Give Way.png': require('../../assets/images/signs/warning road signs/Give Way.png'),
    'warning road signs/Minor Crossing Joining from Right.png': require('../../assets/images/signs/warning road signs/Minor Crossing Joining from Right.png'),
    'warning road signs/Minor Crossing Joining from Left.png': require('../../assets/images/signs/warning road signs/Minor Crossing Joining from Left.png'),
    'warning road signs/Lose Gravel.png': require('../../assets/images/signs/warning road signs/Lose Gravel.png'),
    'warning road signs/Light signals.png': require('../../assets/images/signs/warning road signs/Light signals.png'),
    'warning road signs/Level Crossing without Gate.png': require('../../assets/images/signs/warning road signs/Level Crossing without Gate.png'),
    'warning road signs/Level Crossing with Gate.png': require('../../assets/images/signs/warning road signs/Level Crossing with Gate.png'),
    'warning road signs/Falling Rock.png': require('../../assets/images/signs/warning road signs/Falling Rock.png'),
    'warning road signs/Double Bend to Right.png': require('../../assets/images/signs/warning road signs/Double Bend to Right.png'),
    'warning road signs/Double Bend to Left.png': require('../../assets/images/signs/warning road signs/Double Bend to Left.png'),
    'warning road signs/Dangerous Descent.png': require('../../assets/images/signs/warning road signs/Dangerous Descent.png'),
    'warning road signs/Cyclists.png': require('../../assets/images/signs/warning road signs/Cyclists.png'),
    'warning road signs/Children Crossing.png': require('../../assets/images/signs/warning road signs/Children Crossing.png'),
    'warning road signs/Cattle Crossing.png': require('../../assets/images/signs/warning road signs/Cattle Crossing.png'),
    'warning road signs/Cariageway Narrows.png': require('../../assets/images/signs/warning road signs/Cariageway Narrows.png'),
    'warning road signs/Air Field.png': require('../../assets/images/signs/warning road signs/Air Field.png'),
    'warning road signs/Strong Cross Wind.png': require('../../assets/images/signs/warning road signs/Strong Cross Wind.png'),
    'warning road signs/Steep Ascent.png': require('../../assets/images/signs/warning road signs/Steep Ascent.png'),
    'warning road signs/Road Leads on to River Bank.png': require('../../assets/images/signs/warning road signs/Road Leads on to River Bank.png'),
    'warning road signs/Road Dips.png': require('../../assets/images/signs/warning road signs/Road Dips.png'),
    'warning road signs/Other Dangers.png': require('../../assets/images/signs/warning road signs/Other Dangers.png'),
    'warning road signs/Minor Crossing Road.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road.png'),
    'warning road signs/Yield ti the Traffic approaching from the right on the cross road.png': require('../../assets/images/signs/warning road signs/Yield ti the Traffic approaching from the right on the cross road.png'),
    'warning road signs/Yield ti the Traffic approaching from the right on the any leg of the intersection.png': require('../../assets/images/signs/warning road signs/Yield ti the Traffic approaching from the right on the any leg of the intersection.png'),
    'warning road signs/Wild Animal Crossing.png': require('../../assets/images/signs/warning road signs/Wild Animal Crossing.png'),
    'warning road signs/Uturn.png': require('../../assets/images/signs/warning road signs/Uturn.png'),
    'warning road signs/Uneven Road.png': require('../../assets/images/signs/warning road signs/Uneven Road.png'),
    'warning road signs/Two way traffic.png': require('../../assets/images/signs/warning road signs/Two way traffic.png'),
    'warning road signs/Swing Bridge.png': require('../../assets/images/signs/warning road signs/Swing Bridge.png'),
    
    // Informatory Road Signs
    'informatory road signs/Slow Down to Stop Signal.png': require('../../assets/images/signs/informatory road signs/Slow Down to Stop Signal.png'),
    'informatory road signs/Hospital Sign.png': require('../../assets/images/signs/informatory road signs/Hospital Sign.png'),
    'informatory road signs/Hospital Sign PK.png': require('../../assets/images/signs/informatory road signs/Hospital Sign PK.png'),
    'informatory road signs/Petrol Pump.png': require('../../assets/images/signs/informatory road signs/Petrol Pump.png'),
    'informatory road signs/Restaurant.png': require('../../assets/images/signs/informatory road signs/Restaurant.png'),
    'informatory road signs/Toilet Facility Sign.png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign.png'),
    'informatory road signs/Toilet Facility Sign (2).png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign (2).png'),
    'informatory road signs/Bus Stop.png': require('../../assets/images/signs/informatory road signs/Bus Stop.png'),
    'informatory road signs/Dangerous Turn.png': require('../../assets/images/signs/informatory road signs/Dangerous Turn.png'),
    'informatory road signs/Go Signal.png': require('../../assets/images/signs/informatory road signs/Go Signal.png'),
    'informatory road signs/Stop Signal.png': require('../../assets/images/signs/informatory road signs/Stop Signal.png'),
    'informatory road signs/Parking Sign.png': require('../../assets/images/signs/informatory road signs/Parking Sign.png'),
    'informatory road signs/Parking Place Direction.png': require('../../assets/images/signs/informatory road signs/Parking Place Direction.png'),
    'informatory road signs/Telephone.png': require('../../assets/images/signs/informatory road signs/Telephone.png'),
    'informatory road signs/Start Of Motorway.png': require('../../assets/images/signs/informatory road signs/Start Of Motorway.png'),
    'informatory road signs/Breakdown Service.png': require('../../assets/images/signs/informatory road signs/Breakdown Service.png'),
    'informatory road signs/A Deadend Road.png': require('../../assets/images/signs/informatory road signs/A Deadend Road.png'),
    'informatory road signs/Deadend on Left.png': require('../../assets/images/signs/informatory road signs/Deadend on Left.png'),
  };
  
  // Create map with both URL-encoded and regular paths
  const map = {};
  Object.keys(images).forEach(key => {
    const image = images[key];
    // Add with /signs/ prefix
    map[`/signs/${key}`] = image;
    // Add URL-encoded version
    map[`/signs/${encodeURIComponent(key)}`] = image;
    // Add double URL-encoded version (in case it's encoded twice)
    map[`/signs/${encodeURIComponent(encodeURIComponent(key))}`] = image;
  });
  
  return map;
};

const signImageMap = createImageMap();

const getSignImage = (imagePath) => {
  try {
    console.log('🔍 Looking for image:', imagePath);
    
    // Try different variations of the path
    const pathsToTry = [
      imagePath, // Original path
      decodeURIComponent(imagePath), // URL decoded
      encodeURIComponent(imagePath), // URL encoded
    ];
    
    console.log('🔍 Trying these path variations:', pathsToTry);
    
    for (const path of pathsToTry) {
      const image = signImageMap[path];
      if (image) {
        console.log('✅ Found image in map for path:', path);
        return image;
      } else {
        console.log('❌ No match for path:', path);
      }
    }
    
    console.log('⚠️ Image not found in map for any variation of:', imagePath);
    console.log('📋 Available paths (first 15):', Object.keys(signImageMap).slice(0, 15));
    
    // Try to extract just the filename and look for it
    const filename = imagePath.split('/').pop();
    console.log('🔍 Trying to find by filename:', filename);
    
    const matchingPath = Object.keys(signImageMap).find(path => path.includes(filename));
    if (matchingPath) {
      console.log('✅ Found matching path by filename:', matchingPath);
      return signImageMap[matchingPath];
    }
    
    // Try to find a similar image based on the category
    const normalizedPath = imagePath.toLowerCase();
    if (normalizedPath.includes('mandatory')) {
      console.log('🔄 Using mandatory fallback for:', imagePath);
      return require('../../assets/images/signs/mandatory road signs/Slow.png');
    } else if (normalizedPath.includes('warning')) {
      console.log('🔄 Using warning fallback for:', imagePath);
      return require('../../assets/images/signs/warning road signs/Danger Ahead.png');
    } else if (normalizedPath.includes('informatory')) {
      console.log('🔄 Using informatory fallback for:', imagePath);
      return require('../../assets/images/signs/informatory road signs/Slow Down to Stop Signal.png');
    } else {
      console.log('🔄 Using default fallback for:', imagePath);
      return require('../../assets/images/signs/mandatory road signs/Slow.png');
    }
  } catch (error) {
    console.log('⚠️ Error getting image:', error.message);
    return require('../../assets/images/signs/mandatory road signs/Slow.png'); // Safe fallback
  }
};

// Mock quiz data for development (since API requires authentication)
const mockQuizData = {
  'mandatory': [
    {
      id: 1,
      question: "What does this mandatory road sign mean?",
      question_urdu: "اس لازمی روڈ سائن کا کیا مطلب ہے؟",
      image_url: "/signs/mandatory road signs/Slow.png",
      options: [
        { id: 'a', text: 'Stop', text_urdu: 'روکیں' },
        { id: 'b', text: 'Yield', text_urdu: 'راستہ دیں' },
        { id: 'c', text: 'No Entry', text_urdu: 'داخلہ ممنوع' },
        { id: 'd', text: 'Speed Limit', text_urdu: 'رفتار کی حد' }
      ],
      correct_answer: 'a'
    },
    {
      id: 2,
      question: "What does this sign indicate?",
      question_urdu: "یہ سائن کیا ظاہر کرتا ہے؟",
      image_url: "/signs/mandatory road signs/No Entry.png",
      options: [
        { id: 'a', text: 'No Parking', text_urdu: 'پارکنگ ممنوع' },
        { id: 'b', text: 'No Entry', text_urdu: 'داخلہ ممنوع' },
        { id: 'c', text: 'No Overtaking', text_urdu: 'آگے نکلنا ممنوع' },
        { id: 'd', text: 'No Horn', text_urdu: 'ہارن ممنوع' }
      ],
      correct_answer: 'b'
    },
    {
      id: 3,
      question: "What does this mandatory sign tell you?",
      question_urdu: "یہ لازمی سائن آپ کو کیا بتاتا ہے؟",
      image_url: "/signs/mandatory road signs/Stop.png",
      options: [
        { id: 'a', text: 'Stop here', text_urdu: 'یہاں رکیں' },
        { id: 'b', text: 'Wait here', text_urdu: 'یہاں انتظار کریں' },
        { id: 'c', text: 'Park here', text_urdu: 'یہاں پارک کریں' },
        { id: 'd', text: 'Turn here', text_urdu: 'یہاں مڑیں' }
      ],
      correct_answer: 'a'
    }
  ],
  'warning': [
    {
      id: 1,
      question: "What does this warning sign indicate?",
      question_urdu: "یہ انتباہی سائن کیا ظاہر کرتا ہے؟",
      image_url: "/signs/warning road signs/Danger Ahead.png",
      options: [
        { id: 'a', text: 'School ahead', text_urdu: 'آگے اسکول' },
        { id: 'b', text: 'Hospital ahead', text_urdu: 'آگے ہسپتال' },
        { id: 'c', text: 'Danger ahead', text_urdu: 'آگے خطرہ' },
        { id: 'd', text: 'Construction ahead', text_urdu: 'آگے تعمیر' }
      ],
      correct_answer: 'c'
    },
    {
      id: 2,
      question: "What does this warning sign mean?",
      question_urdu: "یہ انتباہی سائن کا کیا مطلب ہے؟",
      image_url: "/signs/warning road signs/Sharp Turn.png",
      options: [
        { id: 'a', text: 'Sharp turn', text_urdu: 'تیز موڑ' },
        { id: 'b', text: 'Roundabout', text_urdu: 'گول چکر' },
        { id: 'c', text: 'U-turn', text_urdu: 'یو ٹرن' },
        { id: 'd', text: 'Intersection', text_urdu: 'چوراہا' }
      ],
      correct_answer: 'a'
    },
    {
      id: 3,
      question: "What does this sign warn about?",
      question_urdu: "یہ سائن کس چیز کے بارے میں انتباہ دیتا ہے؟",
      image_url: "/signs/warning road signs/Road Work.png",
      options: [
        { id: 'a', text: 'Road work', text_urdu: 'سڑک کی مرمت' },
        { id: 'b', text: 'Accident', text_urdu: 'حادثہ' },
        { id: 'c', text: 'Traffic jam', text_urdu: 'ٹریفک جام' },
        { id: 'd', text: 'Police check', text_urdu: 'پولیس چیک' }
      ],
      correct_answer: 'a'
    }
  ],
  'informatory': [
    {
      id: 1,
      question: "What does this informatory sign tell you?",
      question_urdu: "یہ معلوماتی سائن آپ کو کیا بتاتا ہے؟",
      image_url: "/signs/informatory road signs/Information Center.png",
      options: [
        { id: 'a', text: 'Information center', text_urdu: 'معلوماتی مرکز' },
        { id: 'b', text: 'Rest area', text_urdu: 'آرام کی جگہ' },
        { id: 'c', text: 'Fuel station', text_urdu: 'پٹرول پمپ' },
        { id: 'd', text: 'Hospital', text_urdu: 'ہسپتال' }
      ],
      correct_answer: 'a'
    },
    {
      id: 2,
      question: "What does this sign indicate?",
      question_urdu: "یہ سائن کیا ظاہر کرتا ہے؟",
      image_url: "/signs/informatory road signs/Hospital.png",
      options: [
        { id: 'a', text: 'Hospital', text_urdu: 'ہسپتال' },
        { id: 'b', text: 'Clinic', text_urdu: 'کلینک' },
        { id: 'c', text: 'Pharmacy', text_urdu: 'دواخانہ' },
        { id: 'd', text: 'Emergency', text_urdu: 'ایمرجنسی' }
      ],
      correct_answer: 'a'
    },
    {
      id: 3,
      question: "What does this informatory sign show?",
      question_urdu: "یہ معلوماتی سائن کیا دکھاتا ہے؟",
      image_url: "/signs/informatory road signs/Fuel Station.png",
      options: [
        { id: 'a', text: 'Fuel station', text_urdu: 'پٹرول پمپ' },
        { id: 'b', text: 'Restaurant', text_urdu: 'ریستوران' },
        { id: 'c', text: 'Hotel', text_urdu: 'ہوٹل' },
        { id: 'd', text: 'Shop', text_urdu: 'دکان' }
      ],
      correct_answer: 'a'
    }
  ]
};

// Quiz data fetching functions using your Vercel API
export const fetchQuizQuestions = async (category) => {
  try {
    console.log('🎯 Attempting to fetch quiz questions for category:', category);
    
    // Try to fetch from API first, fallback to mock data if it fails
    try {
      const categoryMap = {
        'mandatory': 'Mandatory Road Signs',
        'warning': 'Warning Road Signs', 
        'informatory': 'Informatory Road Signs'
      };
      
      const title = categoryMap[category];
      console.log('🔍 Looking for quiz with title:', title);
      
      const firebaseAuth = getAuth();
      
      // Step 1: Get all quizzes with their questions
      console.log('📋 Step 1: Fetching all quizzes...');
      const publicHeaders = await getAuthHeaders(firebaseAuth, API_TYPES.PUBLIC);
      const quizzesResponse = await fetch(`${PUBLIC_API_BASE_URL}/quizzes`, {
        method: 'GET',
        headers: publicHeaders
      });
      
      if (quizzesResponse.ok) {
        const responseData = await quizzesResponse.json();
        console.log('✅ Quizzes fetched successfully!');
        console.log('📊 Response structure:', responseData);
        
        // Handle the proper API response structure
        let quizzesArray = [];
        if (responseData.success && Array.isArray(responseData.quizzes)) {
          quizzesArray = responseData.quizzes;
        } else if (Array.isArray(responseData)) {
          quizzesArray = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
          quizzesArray = responseData.data;
        }
        
        console.log('📋 Available quizzes:', quizzesArray.map(q => ({ id: q.id, title: q.title })));
        
        // Find the target quiz
        const targetQuiz = quizzesArray.find(quiz => quiz.title === title);
        
        if (targetQuiz) {
          console.log('🎯 Found target quiz:', targetQuiz);
          
          // Step 2: Extract questions from the quiz object
          console.log('📝 Step 2: Extracting questions from quiz object...');
          
          let questionsArray = [];
          if (targetQuiz.questions && Array.isArray(targetQuiz.questions)) {
            console.log('✅ Found questions in quiz object!');
            console.log(`📝 Found ${targetQuiz.questions.length} questions for: ${title}`);
            
            // Process the questions according to the proper structure
            questionsArray = targetQuiz.questions.map((quizQuestion, index) => {
              console.log(`🔍 Raw quiz question ${index + 1}:`, quizQuestion);
              
              const question = quizQuestion.question;
              const sign = question.sign;
              
              console.log(`🔍 Processing question ${index + 1}:`, question);
              console.log(`🔍 Sign data for question ${index + 1}:`, sign);
              
              // Extract question text
              let questionText = question.question_text || 'What does this traffic sign mean?';
              let questionTextUrdu = '';
              
              // Extract Urdu question text from secondary_languages
              if (question.secondary_languages && Array.isArray(question.secondary_languages)) {
                const urduQuestion = question.secondary_languages.find(lang => 
                  lang.language_code === 'ur' || lang.language_code === 'urdu'
                );
                if (urduQuestion && urduQuestion.question_text) {
                  questionTextUrdu = urduQuestion.question_text;
                }
              }
              
              // Extract sign information
              let imageUrl = '🛑'; // Fallback emoji
              let signTitle = '';
              let signDescription = '';
              
              if (sign) {
                // Use local images from the assets directory
                if (sign.image_url) {
                  console.log('🔍 Original API image URL:', sign.image_url);
                  
                  // Try to get the image using our mapping function
                  const localImage = getSignImage(sign.image_url);
                  if (localImage) {
                    imageUrl = localImage;
                    console.log('✅ Successfully loaded local image for:', sign.image_url);
                    console.log('📄 Mapped to local asset:', imageUrl);
                  } else {
                    console.log('⚠️ Could not load local image for:', sign.image_url);
                    // Keep the fallback emoji
                  }
                }
                
                signTitle = sign.title_en || '';
                signDescription = sign.english_description || '';
              }
              
              // Process options
              let options = [];
              let correctAnswer = 'a';
              
              if (question.options && Array.isArray(question.options)) {
                options = question.options.map((option, optIndex) => {
                  let optionText = option.option_text || `Option ${String.fromCharCode(65 + optIndex)}`;
                  let optionTextUrdu = '';
                  
                  // Extract Urdu option text
                  if (option.secondary_languages && Array.isArray(option.secondary_languages)) {
                    const urduOption = option.secondary_languages.find(lang => 
                      lang.language_code === 'ur' || lang.language_code === 'urdu'
                    );
                    if (urduOption && urduOption.option_text) {
                      optionTextUrdu = urduOption.option_text;
                    }
                  }
                  
                  // Set correct answer
                  if (option.is_correct) {
                    correctAnswer = option.option_letter?.toLowerCase() || String.fromCharCode(97 + optIndex);
                  }
                  
                  return {
                    id: option.id || String.fromCharCode(97 + optIndex),
                    text: optionText,
                    text_urdu: optionTextUrdu || `آپشن ${String.fromCharCode(65 + optIndex)}`
                  };
                });
              }
              
              // Ensure we have at least 4 options
              while (options.length < 4) {
                const optIndex = options.length;
                options.push({
                  id: String.fromCharCode(97 + optIndex),
                  text: `Option ${String.fromCharCode(65 + optIndex)}`,
                  text_urdu: `آپشن ${String.fromCharCode(65 + optIndex)}`
                });
              }
              
              console.log(`📋 Processed question ${index + 1}:`, {
                questionText,
                questionTextUrdu,
                imageUrl,
                signTitle,
                signDescription,
                optionsCount: options.length,
                correctAnswer
              });
              
              // Debug image URL construction
              if (sign && sign.image_url) {
                console.log(`🖼️ Image URL for question ${index + 1}:`, {
                  original: sign.image_url,
                  constructed: imageUrl,
                  fileName: sign.image_url.split('/').pop()
                });
              }
              
              return {
                id: question.id || `question-${index}`,
                question: questionText,
                question_urdu: questionTextUrdu,
                image_url: imageUrl,
                sign_title: signTitle,
                sign_description: signDescription,
                options: options,
                correct_answer: correctAnswer
              };
            });
            
            console.log('✅ Successfully processed all questions!');
            return questionsArray;
            
          } else {
            console.log('⚠️ No questions found in quiz object');
          }
          
        } else {
          console.log('❌ Target quiz not found:', title);
          console.log('Available quiz titles:', quizzesArray.map(q => q.title));
        }
      } else {
        console.log('❌ Failed to fetch quizzes:', quizzesResponse.status);
      }
      
      // Try authenticated API as fallback
      console.log('🔐 Trying authenticated API as fallback...');
      const authHeaders = await getAuthHeaders(firebaseAuth, API_TYPES.AUTHENTICATED);
      
      const authQuizzesResponse = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'GET',
        headers: authHeaders
      });
      
      if (authQuizzesResponse.ok) {
        console.log('✅ Authenticated API successful, but using public API data');
      }
      
    } catch (apiError) {
      console.log('❌ API fetch failed, using mock data:', apiError.message);
    }
    
    // Fallback to mock data
    console.log('🔄 Falling back to mock data for category:', category);
    const mockQuestions = mockQuizData[category];
    if (mockQuestions) {
      console.log('📋 Processing mock data through image mapping...');
      
      // Process mock data through the same image mapping logic as API data
      const processedMockQuestions = mockQuestions.map((question, index) => {
        console.log(`🔍 Processing mock question ${index + 1}:`, question);
        
        // Process the image URL through getSignImage
        let processedImageUrl = question.image_url;
        if (question.image_url && typeof question.image_url === 'string') {
          console.log('🔍 Original mock image URL:', question.image_url);
          const localImage = getSignImage(question.image_url);
          if (localImage) {
            processedImageUrl = localImage;
            console.log('✅ Successfully mapped mock image:', question.image_url, '->', localImage);
          } else {
            console.log('⚠️ Could not map mock image:', question.image_url);
          }
        }
        
        return {
          ...question,
          image_url: processedImageUrl
        };
      });
      
      console.log('✅ Mock data processed successfully!');
      return processedMockQuestions;
    }
    
    console.log('❌ No data found for category:', category);
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching quiz questions:', error);
    return [];
  }
};

export const fetchSignCategories = async () => {
  try {
    const firebaseAuth = getAuth();
    
    // Try public API first
    const publicHeaders = await getAuthHeaders(firebaseAuth, API_TYPES.PUBLIC);
    const publicResponse = await fetch(`${PUBLIC_API_BASE_URL}/signs`, {
      method: 'GET',
      headers: publicHeaders
    });
    
         if (publicResponse.ok) {
       const publicData = await publicResponse.json();
       console.log('✅ Public signs loaded!');
       console.log('📊 Public signs structure:', publicData);
       
       // Handle different response formats
       if (Array.isArray(publicData)) {
         return publicData;
       } else if (publicData && Array.isArray(publicData.data)) {
         return publicData.data;
       } else if (publicData && Array.isArray(publicData.signs)) {
         return publicData.signs;
       } else if (publicData && typeof publicData === 'object') {
         // Try to extract array from common properties
         const possibleArrays = Object.values(publicData).filter(val => Array.isArray(val));
         if (possibleArrays.length > 0) {
           return possibleArrays[0];
         }
       }
       
       console.log('⚠️ Could not extract signs array from public API response');
       return [];
     }
    
    // If public API fails, try authenticated API
    const authHeaders = await getAuthHeaders(firebaseAuth, API_TYPES.AUTHENTICATED);
    const response = await fetch(`${API_BASE_URL}/signs`, {
      method: 'GET',
      headers: authHeaders
    });
    
         if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     
     const data = await response.json();
     console.log('📊 Authenticated signs structure:', data);
     
     // Handle different response formats for authenticated API
     if (Array.isArray(data)) {
       return data;
     } else if (data && Array.isArray(data.data)) {
       return data.data;
     } else if (data && Array.isArray(data.signs)) {
       return data.signs;
     } else if (data && typeof data === 'object') {
       // Try to extract array from common properties
       const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
       if (possibleArrays.length > 0) {
         return possibleArrays[0];
       }
     }
     
     console.log('⚠️ Could not extract signs array from authenticated API response');
     return [];
  } catch (error) {
    console.error('Error fetching sign categories:', error);
    return null;
  }
};

// Function to inspect the structure of the quizzes
export const inspectQuizzesTable = async () => {
  try {
    console.log('Available mock quiz categories:', Object.keys(mockQuizData));
    console.log('Mock quiz data structure:', mockQuizData);
    return Object.keys(mockQuizData);
  } catch (error) {
    console.error('Error inspecting quizzes:', error);
    return null;
  }
};

// Function to test API connection and show setup instructions
export const testApiAndShowInstructions = async () => {
  console.log('🧪 Testing API Connection with Firebase auth...');
  const firebaseAuth = getAuth();
  const result = await testApiConnection(firebaseAuth);
  
  if (!result.success) {
    console.log('❌ API Connection Failed!');
    console.log('📋 Setup Instructions:');
    console.log(API_SETUP_INSTRUCTIONS);
  }
  
  return result;
};

export const saveQuizResult = async (userId, authority, category, score, totalQuestions) => {
  try {
    // For now, we'll just log the result since there's no save endpoint
    console.log('Quiz result to save:', {
      user_id: userId,
      authority: authority,
      category: category,
      score: score,
      total_questions: totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      completed_at: new Date().toISOString()
    });
    
    // TODO: Add API endpoint for saving quiz results
    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return false;
  }
};
