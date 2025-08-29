import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    updateProfile
} from 'firebase/auth';
import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytes
} from 'firebase/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, storage } from '../config/firebase';

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    quizzesTaken: 0,
    averageScore: 0
  });
  const [leaderboardData, setLeaderboardData] = useState([]);

  const loadUserData = async (userId) => {
    try {
      // First, try to get user document
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        console.error('User document not found. Creating new document...');
        // Create user document if it doesn't exist
        await setDoc(doc(db, 'users', userId), {
          email: user.email,
          name: user.displayName,
          createdAt: serverTimestamp(),
          points: 0,
          quizzesTaken: 0,
          averageScore: 0,
          favorites: []
        });
        setFavorites([]);
        setUserStats({
          totalPoints: 0,
          quizzesTaken: 0,
          averageScore: 0
        });
      } else {
        const userData = userDoc.data();
        setFavorites(userData.favorites || []);
        setUserStats({
          totalPoints: userData.points || 0,
          quizzesTaken: userData.quizzesTaken || 0,
          averageScore: userData.averageScore || 0
        });
      }

      // Then, try to get quiz history with proper query constraints
      try {
        const historyQuery = query(
          collection(db, 'quizHistory'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        
        const historySnapshot = await getDocs(historyQuery);
        
        if (historySnapshot.empty) {
          setQuizHistory([]);
        } else {
          const history = historySnapshot.docs.map(doc => {
            const data = doc.data();
            // Safely handle the timestamp
            const timestamp = data.timestamp instanceof Timestamp ? 
              data.timestamp.toDate() : 
              new Date(data.timestamp);
            
            return {
              id: doc.id,
              ...data,
              timestamp
            };
          });
          
          setQuizHistory(history);
        }
      } catch (historyError) {
        console.error('Error loading quiz history:', historyError);
        if (historyError.code === 'permission-denied') {
          console.error('Permission denied accessing quiz history. Please check authentication.');
        }
        setQuizHistory([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Unable to access user data. Please check your connection and try again.');
      }
      setFavorites([]);
      setQuizHistory([]);
      setUserStats({
        totalPoints: 0,
        quizzesTaken: 0,
        averageScore: 0
      });
    }
  };

  const loadLeaderboard = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(usersQuery);
      const leaders = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        points: doc.data().points || 0,
        quizzes: doc.data().quizzesTaken || 0,
        avatar: doc.data().photoURL || null
      }));
      
      setLeaderboardData(leaders);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        setUser(userData);
        await Promise.all([
          loadUserData(user.uid),
          loadLeaderboard()
        ]);
      } else {
        setUser(null);
        setFavorites([]);
        setQuizHistory([]);
        setUserStats({
          totalPoints: 0,
          quizzesTaken: 0,
          averageScore: 0
        });
        await loadLeaderboard(); // Still load leaderboard for guests
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(newUser, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        points: 0,
        quizzesTaken: 0,
        averageScore: 0,
        favorites: []
      });

      // Update local state
      const userData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: name,
        photoURL: newUser.photoURL,
      };
      setUser(userData);
      setUserStats({
        totalPoints: 0,
        quizzesTaken: 0,
        averageScore: 0
      });
      setFavorites([]);

      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signout = () => {
    return signOut(auth);
  };

  const saveQuizResult = async (quizData) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();
      const batch = writeBatch(db);

      // Update user stats
      const newQuizzesTaken = (userData.quizzesTaken || 0) + 1;
      const totalPoints = (userData.points || 0) + quizData.score;
      const newAverageScore = Math.round((totalPoints / newQuizzesTaken) * 100) / 100;

      // Prepare user document update
      batch.update(userRef, {
        quizzesTaken: newQuizzesTaken,
        points: totalPoints,
        averageScore: newAverageScore
      });

      // Prepare quiz history document
      const historyRef = doc(collection(db, 'quizHistory'));
      batch.set(historyRef, {
        userId: user.uid,
        quizId: quizData.quizId,
        title: quizData.title,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        correctAnswers: quizData.correctAnswers,
        timeSpent: quizData.timeSpent,
        timestamp: Timestamp.now()
      });

      // Commit both operations
      await batch.commit();

      // Update local state
      setUserStats({
        totalPoints,
        quizzesTaken: newQuizzesTaken,
        averageScore: newAverageScore
      });

      // Reload quiz history and leaderboard
      await Promise.all([
        loadUserData(user.uid),
        loadLeaderboard()
      ]);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw new Error('Failed to save quiz result. Please check your connection and try again.');
    }
  };

  const toggleFavorite = async (quizId) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const isFavorite = favorites.includes(quizId);
      
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(quizId)
        });
        setFavorites(prev => prev.filter(id => id !== quizId));
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(quizId)
        });
        setFavorites(prev => [...prev, quizId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const reauthenticate = async (currentPassword) => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const updateUserProfile = async (data) => {
    try {
      const updates = {};
      
      if (data.name) {
        await updateProfile(auth.currentUser, { displayName: data.name });
        updates.name = data.name;
      }

      if (data.photoFile) {
        const photoRef = ref(storage, `profile-photos/${auth.currentUser.uid}`);
        const metadata = {
          contentType: 'image/jpeg',
          customMetadata: {
            'resized': 'true',
            'dimensions': '256x256'
          }
        };
        await uploadBytes(photoRef, data.photoFile, metadata);
        const photoURL = await getDownloadURL(photoRef);
        await updateProfile(auth.currentUser, { photoURL });
        updates.photoURL = photoURL;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), updates);
        setUser(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      await reauthenticate(currentPassword);
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const updateUserEmail = async (currentPassword, newEmail) => {
    try {
      await reauthenticate(currentPassword);
      await updateEmail(auth.currentUser, newEmail);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        email: newEmail
      });
      setUser(prev => ({ ...prev, email: newEmail }));
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    favorites,
    quizHistory,
    userStats,
    leaderboardData,
    signup,
    signin,
    signout,
    toggleFavorite,
    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    saveQuizResult,
    loadUserData,
    loadLeaderboard,
    resetPassword
  };

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 