// Import API configuration
import { getAuth } from 'firebase/auth';
import {
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
    
    // Additional speed limit variations (common in traffic signs)
    'mandatory road signs/Speed Limit 30.png': require('../../assets/images/signs/mandatory road signs/End of 30KMH Zone.png'), // Use existing as base
    'mandatory road signs/Speed Limit 40.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    'mandatory road signs/Speed Limit 50.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    'mandatory road signs/Speed Limit 60.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    'mandatory road signs/Speed Limit 70.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    'mandatory road signs/Speed Limit 90.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    'mandatory road signs/Speed Limit 100.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    'mandatory road signs/Speed Limit 120.png': require('../../assets/images/signs/mandatory road signs/Max Speed Limit 80KMH.png'), // Use existing as base
    
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
    
    // Additional Warning Road Signs that the API might request
    'warning road signs/Road Work.png': require('../../assets/images/signs/warning road signs/Road Works.png'), // Alias for Road Works
    'warning road signs/Sharp Turn.png': require('../../assets/images/signs/warning road signs/Left Bend.png'), // Use Left Bend as base
    'warning road signs/Steep Descent.png': require('../../assets/images/signs/warning road signs/Dangerous Descent.png'), // Use Dangerous Descent as base
    'warning road signs/Crossroads.png': require('../../assets/images/signs/warning road signs/Minor Crossing Road.png'), // Use Minor Crossing as base
    'warning road signs/Roundabout.png': require('../../assets/images/signs/warning road signs/Right Bend.png'), // Use Right Bend as base
    'warning road signs/Traffic Signals.png': require('../../assets/images/signs/warning road signs/Light signals.png'), // Use Light signals as base
    'warning road signs/Accident.png': require('../../assets/images/signs/warning road signs/Danger Ahead.png'), // Use Danger Ahead as base
    'warning road signs/Construction.png': require('../../assets/images/signs/warning road signs/Road Works.png'), // Use Road Works as base
    'warning road signs/School Zone.png': require('../../assets/images/signs/warning road signs/Children Crossing.png'), // Use Children Crossing as base
    'warning road signs/Hospital Zone.png': require('../../assets/images/signs/warning road signs/Danger Ahead.png'), // Use Danger Ahead as base
    
    // Informatory Road Signs - Complete mapping with aliases
    'informatory road signs/Slow Down to Stop Signal.png': require('../../assets/images/signs/informatory road signs/Slow Down to Stop Signal.png'),
    
    // Hospital signs with multiple variations
    'informatory road signs/Hospital Sign.png': require('../../assets/images/signs/informatory road signs/Hospital Sign.png'),
    'informatory road signs/Hospital Sign PK.png': require('../../assets/images/signs/informatory road signs/Hospital Sign PK.png'),
    'informatory road signs/Hospital.png': require('../../assets/images/signs/informatory road signs/Hospital Sign.png'), // Alias
    
    // Fuel/Petrol signs
    'informatory road signs/Petrol Pump.png': require('../../assets/images/signs/informatory road signs/Petrol Pump.png'),
    'informatory road signs/Fuel Station.png': require('../../assets/images/signs/informatory road signs/Petrol Pump.png'), // Alias
    'informatory road signs/Gas Station.png': require('../../assets/images/signs/informatory road signs/Petrol Pump.png'), // Alias
    
    // Restaurant signs
    'informatory road signs/Restaurant.png': require('../../assets/images/signs/informatory road signs/Restaurant.png'),
    'informatory road signs/Food.png': require('../../assets/images/signs/informatory road signs/Restaurant.png'), // Alias
    
    // Toilet signs
    'informatory road signs/Toilet Facility Sign.png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign.png'),
    'informatory road signs/Toilet Facility Sign (2).png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign (2).png'),
    'informatory road signs/Toilet.png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign.png'), // Alias
    'informatory road signs/Bathroom.png': require('../../assets/images/signs/informatory road signs/Toilet Facility Sign.png'), // Alias
    
    // Bus and transport signs
    'informatory road signs/Bus Stop.png': require('../../assets/images/signs/informatory road signs/Bus Stop.png'),
    'informatory road signs/Bus.png': require('../../assets/images/signs/informatory road signs/Bus Stop.png'), // Alias
    
    // Parking signs
    'informatory road signs/Parking Sign.png': require('../../assets/images/signs/informatory road signs/Parking Sign.png'),
    'informatory road signs/Parking Place Direction.png': require('../../assets/images/signs/informatory road signs/Parking Place Direction.png'),
    'informatory road signs/Parking.png': require('../../assets/images/signs/informatory road signs/Parking Sign.png'), // Alias
    
    // Traffic signals
    'informatory road signs/Go Signal.png': require('../../assets/images/signs/informatory road signs/Go Signal.png'),
    'informatory road signs/Stop Signal.png': require('../../assets/images/signs/informatory road signs/Stop Signal.png'),
    'informatory road signs/Traffic Light.png': require('../../assets/images/signs/informatory road signs/Go Signal.png'), // Alias
    'informatory road signs/Signal.png': require('../../assets/images/signs/informatory road signs/Go Signal.png'), // Alias
    
    // Other informatory signs
    'informatory road signs/Dangerous Turn.png': require('../../assets/images/signs/informatory road signs/Dangerous Turn.png'),
    'informatory road signs/Telephone.png': require('../../assets/images/signs/informatory road signs/Telephone.png'),
    'informatory road signs/Start Of Motorway.png': require('../../assets/images/signs/informatory road signs/Start Of Motorway.png'),
    'informatory road signs/Breakdown Service.png': require('../../assets/images/signs/informatory road signs/Breakdown Service.png'),
    'informatory road signs/A Deadend Road.png': require('../../assets/images/signs/informatory road signs/A Deadend Road.png'),
    'informatory road signs/Deadend on Left.png': require('../../assets/images/signs/informatory road signs/Deadend on Left.png'),
    'informatory road signs/Overtaking is Prohibited.png': require('../../assets/images/signs/informatory road signs/Overtaking is Prohibited.png'),
    'informatory road signs/Overtaking Allowed if no Vehicle Approaching  from the opposite direction.png': require('../../assets/images/signs/informatory road signs/Overtaking Allowed if no Vehicle Approaching  from the opposite direction.png'),
    'informatory road signs/Cannot Cross without stopping on these lines first.png': require('../../assets/images/signs/informatory road signs/Cannot Cross without stopping on these lines first.png'),
    'informatory road signs/Prohibited For Vehicles from Crossing the Lines.png': require('../../assets/images/signs/informatory road signs/Prohibited For Vehicles from Crossing the Lines.png'),
    'informatory road signs/Prohibition of Stopping the Vehicle on Yellow Section.png': require('../../assets/images/signs/informatory road signs/Prohibition of Stopping the Vehicle on Yellow Section.png'),
    'informatory road signs/Stoping on Road Prohibited.png': require('../../assets/images/signs/informatory road signs/Stoping on Road Prohibited.png'),
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
  
  // Debug: Log all warning road sign images we have mapped
  const warningSigns = Object.keys(images).filter(key => key.includes('warning road signs'));
  console.log('📊 Warning Road Signs mapped:', warningSigns.length);
  console.log('📋 Warning Road Signs list:', warningSigns);
  
  return map;
};

const signImageMap = createImageMap();

// Debug: Check what's actually in the image map
console.log('🔍 Image map created with', Object.keys(signImageMap).length, 'entries');
console.log('🔍 Sample image map entry:', Object.keys(signImageMap)[0], '->', signImageMap[Object.keys(signImageMap)[0]]);
console.log('🔍 Sample image type:', typeof signImageMap[Object.keys(signImageMap)[0]]);

// Count images by category
const countImagesByCategory = () => {
  const mandatoryCount = Object.keys(signImageMap).filter(path => path.includes('mandatory')).length;
  const warningCount = Object.keys(signImageMap).filter(path => path.includes('warning')).length;
  const informatoryCount = Object.keys(signImageMap).filter(path => path.includes('informatory')).length;
  
  console.log('📊 Image Counts by Category:');
  console.log('   🚫 Mandatory Road Signs:', mandatoryCount, '/ 46');
  console.log('   ⚠️ Warning Road Signs:', warningCount, '/ 42');
  console.log('   ℹ️ Informatory Road Signs:', informatoryCount, '/ 24');
  
  return { mandatoryCount, warningCount, informatoryCount };
};

// Display counts
countImagesByCategory();

const getSignImage = (imagePath) => {
  try {
    console.log('🔍 Looking for image:', imagePath);
    
    // Check if this is one of the problematic images (questions showing text instead of images)
    const filename = imagePath?.split('/').pop();
    if (filename && ['Hospital.png', 'Petrol Pump.png', 'Restaurant.png', 'Toilet Facility Sign.png', 'Bus Stop.png', 'Parking Sign.png'].includes(filename)) {
      console.log('🚨 PROCESSING PROBLEMATIC IMAGE (text showing):', imagePath);
    }
    
    // Check if this is one of the Warning Road Signs problematic questions
    if (imagePath && imagePath.includes('warning') && imagePath.includes('road') && imagePath.includes('signs')) {
      const questionNumber = imagePath.match(/question_(\d+)/) || imagePath.match(/(\d+)/);
      if (questionNumber && [10, 17, 18, 19, 26, 32].includes(parseInt(questionNumber[1]))) {
        console.log(`⚠️ WARNING Q${questionNumber[1]} IMAGE MAPPING:`, {
          originalPath: imagePath,
          filename: filename,
          willUseLocal: __DEV__ && !forceApiMode,
          localMapMatch: signImageMap[imagePath] || signImageMap[imagePath.replace(/%20/g, ' ')] || signImageMap[imagePath.replace(/%2F/g, '/')]
        });
      }
    }
    
    // Also log if imagePath is undefined or null
    if (!imagePath) {
      console.log('🚨 IMAGE PATH IS NULL/UNDEFINED!');
      return '🚦'; // Return emoji fallback
    }
    
    // In development, try local assets first (can be overridden for testing)
    const forceApiMode = false; // Set to true to test API mode in development
    
    if (__DEV__ && !forceApiMode) {
      console.log('🔧 Development mode: trying local assets first');
      
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
          console.log('✅ Found image in local map for path:', path);
          console.log('🔍 Retrieved image value:', image);
          console.log('🔍 Retrieved image type:', typeof image);
          return image;
        } else {
          console.log('❌ No match for path:', path);
        }
      }
      
      console.log('⚠️ Image not found in local map for any variation of:', imagePath);
      console.log('📋 Available local paths (first 15):', Object.keys(signImageMap).slice(0, 15));
      
      // Try to extract just the filename and look for it
      const filename = imagePath.split('/').pop();
      console.log('🔍 Trying to find by filename:', filename);
      
      // First try exact filename match
      const matchingPath = Object.keys(signImageMap).find(path => path.includes(filename));
      if (matchingPath) {
        console.log('✅ Found matching local path by filename:', matchingPath);
        return signImageMap[matchingPath];
      }
      
      // If no exact match, try to find similar images in the same category
      const category = imagePath.toLowerCase().includes('mandatory') ? 'mandatory' : 
                      imagePath.toLowerCase().includes('warning') ? 'warning' : 
                      imagePath.toLowerCase().includes('informatory') ? 'informatory' : 'unknown';
      
      console.log('🔍 Looking for similar images in category:', category);
      
      // Get all available images in this category
      const categoryImages = Object.keys(signImageMap).filter(path => 
        path.toLowerCase().includes(category)
      );
      
      console.log('🔍 Available category images:', categoryImages.length);
      
      // Try to find a more appropriate fallback based on the filename
      if (categoryImages.length > 0) {
        // Look for images that might be semantically similar
        const filenameLower = filename.toLowerCase();
        
        // Try to find images with similar names or purposes
        let bestMatch = null;
        
        if (filenameLower.includes('hospital') || filenameLower.includes('medical')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('hospital'));
        } else if (filenameLower.includes('fuel') || filenameLower.includes('petrol') || filenameLower.includes('gas')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('petrol') || path.toLowerCase().includes('fuel'));
        } else if (filenameLower.includes('restaurant') || filenameLower.includes('food')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('restaurant'));
        } else if (filenameLower.includes('toilet') || filenameLower.includes('bathroom')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('toilet'));
        } else if (filenameLower.includes('bus') || filenameLower.includes('transport')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('bus'));
        } else if (filenameLower.includes('parking')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('parking'));
        } else if (filenameLower.includes('signal') || filenameLower.includes('light')) {
          bestMatch = categoryImages.find(path => path.toLowerCase().includes('signal') || path.toLowerCase().includes('light'));
        }
        
        if (bestMatch) {
          console.log('✅ Found semantic match:', bestMatch);
          return signImageMap[bestMatch];
        }
        
        // If no semantic match, use a random image from the category (but not the same one every time)
        const randomIndex = Math.floor(Math.random() * categoryImages.length);
        const randomImage = categoryImages[randomIndex];
        console.log('🎲 Using random category image as fallback:', randomImage);
        return signImageMap[randomImage];
      }
    }
    
    // If not found locally or in production, use API URL
    console.log('🌐 Using API URL for image:', imagePath);
    const apiUrl = `${PUBLIC_API_BASE_URL}${imagePath}`;
    console.log('🔗 Full API URL:', apiUrl);
    
    // If we get here, use API URL (or fallback in development)
    if (__DEV__) {
      console.log('🔧 Development mode: using category fallback since no local match found');
      // Use the improved fallback logic from above
      const normalizedPath = imagePath.toLowerCase();
      if (normalizedPath.includes('mandatory')) {
        return require('../../assets/images/signs/mandatory road signs/Slow.png');
      } else if (normalizedPath.includes('warning')) {
        return require('../../assets/images/signs/warning road signs/Danger Ahead.png');
      } else if (normalizedPath.includes('informatory')) {
        return require('../../assets/images/signs/informatory road signs/Slow Down to Stop Signal.png');
      }
    }
    
    return { uri: apiUrl };
    
  } catch (error) {
    console.log('⚠️ Error getting image:', error.message);
    
    // Fallback based on category
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
      
      // Step 1: Get all quizzes using the new simplified API
      console.log('📋 Step 1: Fetching all quizzes...');
      const quizzesResponse = await fetch(`${PUBLIC_API_BASE_URL}/quizzes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (quizzesResponse.ok) {
        const responseData = await quizzesResponse.json();
        console.log('✅ Quizzes fetched successfully!');
        console.log('📊 Response structure:', responseData);
        
        // Handle the new simplified API response structure
        let quizzesArray = [];
        if (responseData.success && responseData.data && responseData.data.quizzes && Array.isArray(responseData.data.quizzes)) {
          quizzesArray = responseData.data.quizzes;
        } else {
          console.log('❌ Unexpected quizzes data structure:', responseData);
          throw new Error('Invalid quizzes data structure');
        }
        
        console.log('📋 Available quizzes:', quizzesArray.map(q => ({ id: q.id, title: q.title, total_questions: q.total_questions })));
        
        // Find the target quiz
        const targetQuiz = quizzesArray.find(quiz => quiz.title === title);
        
        if (targetQuiz) {

          
          // Step 2: Fetch the specific quiz with all questions

          const quizResponse = await fetch(`${PUBLIC_API_BASE_URL}/quizzes/${targetQuiz.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!quizResponse.ok) {
            throw new Error(`Quiz HTTP ${quizResponse.status}: ${quizResponse.statusText}`);
          }
          
          const quizData = await quizResponse.json();

          
          // Extract questions array from response
          let questionsArray = [];
          if (quizData.success && quizData.data && quizData.data.questions && Array.isArray(quizData.data.questions)) {
            questionsArray = quizData.data.questions;
          } else {
            console.log('❌ Unexpected quiz data structure:', quizData);
            throw new Error('Invalid quiz data structure');
          }
          
          console.log(`📝 Found ${questionsArray.length} questions for quiz: ${title}`);
          
          // Step 3: Process questions with image URLs
          const processedQuestions = questionsArray.map((question, index) => {
            
            // Get image URL using the improved getSignImage function
            const imageUrl = getSignImage(question.sign?.image_url || question.image_url || '/signs/default.png');
            

            
            // Extract question text
            let questionText = question.question_text || 'What does this traffic sign mean?';
            
            // Try different possible structures for Urdu text
            let questionTextUrdu = '';
            if (Array.isArray(question.secondary_languages)) {
              // API returns array of objects with language_code and question_text
              const urduItem = question.secondary_languages.find(item => item.language_code === 'ur');
              if (urduItem) {
                questionTextUrdu = urduItem.question_text || '';
              }
            } else if (question.secondary_languages?.ur) {
              questionTextUrdu = question.secondary_languages.ur;
            } else if (question.question_urdu) {
              questionTextUrdu = question.question_urdu;
            } else if (question.question_text_urdu) {
              questionTextUrdu = question.question_text_urdu;
            } else if (typeof question.secondary_languages === 'string') {
              // If secondary_languages is a JSON string, try to parse it
              try {
                const parsed = JSON.parse(question.secondary_languages);
                questionTextUrdu = parsed.ur || '';
              } catch (e) {
                console.log('Failed to parse secondary_languages as JSON:', e);
              }
            }
            

            
            // Extract options
            let options = [];
            if (Array.isArray(question.options)) {
              options = question.options.map(option => {
                return option.option_text || option.text || '';
              });
            }
            
            // Find correct answer
            const correctOption = question.options?.find(opt => opt.is_correct);
            const correctAnswer = correctOption?.option_letter?.toLowerCase() || 'a';
            
            // Process options
            if (question.options && Array.isArray(question.options)) {
              options = question.options.map((option, optIndex) => {
                let optionText = option.option_text || `Option ${String.fromCharCode(65 + optIndex)}`;
                
                // Try different possible structures for option Urdu text
                let optionTextUrdu = '';
                if (Array.isArray(option.secondary_languages)) {
                  // API returns array of objects with language_code and option_text
                  const urduItem = option.secondary_languages.find(item => item.language_code === 'ur');
                  if (urduItem) {
                    optionTextUrdu = urduItem.option_text || urduItem.question_text || '';
                  }
                } else if (option.secondary_languages?.ur) {
                  optionTextUrdu = option.secondary_languages.ur;
                } else if (option.option_urdu) {
                  optionTextUrdu = option.option_urdu;
                } else if (option.text_urdu) {
                  optionTextUrdu = option.text_urdu;
                } else if (typeof option.secondary_languages === 'string') {
                  // If secondary_languages is a JSON string, try to parse it
                  try {
                    const parsed = JSON.parse(option.secondary_languages);
                    optionTextUrdu = parsed.ur || '';
                  } catch (e) {
                    console.log('Failed to parse option secondary_languages as JSON:', e);
                  }
                }
                
                return {
                  id: option.id || String.fromCharCode(97 + optIndex),
                  text: optionText,
                  text_urdu: optionTextUrdu,
                  is_correct: option.is_correct || false
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
            

            
            const processedQuestion = {
              id: question.id || `question-${index}`,
              question: questionText,
              question_urdu: questionTextUrdu,
              image_url: imageUrl,
              options: options,
              correct_answer: correctAnswer
            };
            

            
            return processedQuestion;
          });
          

          return processedQuestions;
          
        } else {
          throw new Error(`Quiz not found: ${title}`);
        }
        
      } else {
        throw new Error(`HTTP ${quizzesResponse.status}: ${quizzesResponse.statusText}`);
      }
      
    } catch (apiError) {
      throw apiError;
    }
    
  } catch (error) {
    // Return mock data for development
    if (__DEV__) {
      return mockQuizData[category] || mockQuizData.mandatory;
    }
    
    throw error;
  }
};

export const fetchSignCategories = async () => {
  try {
    
    // Use the new simplified API
    const response = await fetch(`${PUBLIC_API_BASE_URL}/signs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract signs array from response
    let signsArray = [];
    if (data.success && data.data && data.data.signs && Array.isArray(data.data.signs)) {
      signsArray = data.data.signs;
    } else {
      throw new Error('Invalid signs data structure');
    }
    
    // Group signs by category
    const categories = {
      mandatory: signsArray.filter(sign => sign.sign_type === 'mandatory'),
      warning: signsArray.filter(sign => sign.sign_type === 'warning'),
      informatory: signsArray.filter(sign => sign.sign_type === 'informatory')
    };
    
    return categories;
    
  } catch (error) {
    return {
      mandatory: [],
      warning: [],
      informatory: []
    };
  }
};

// Function to inspect the structure of the quizzes
export const inspectQuizzesTable = async () => {
  try {
    return Object.keys(mockQuizData);
  } catch (error) {
    return null;
  }
};

// Function to test API connection and show setup instructions
export const testApiAndShowInstructions = async () => {
  const firebaseAuth = getAuth();
  const result = await testApiConnection(firebaseAuth);
  return result;
};

export const saveQuizResult = async (userId, authority, category, score, totalQuestions) => {
  try {
    // TODO: Add API endpoint for saving quiz results
    return true;
  } catch (error) {
    return false;
  }
};
