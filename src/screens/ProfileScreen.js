import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const defaultAvatar = require('../../assets/images/avatar.png');
const IMAGE_SIZE = 256;

const ProfileScreen = ({ navigation }) => {
  const { user, userStats, signout, updateUserProfile, updateUserPassword, updateUserEmail } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(null); // 'name', 'email', or 'password'
  const [currentPassword, setCurrentPassword] = useState('');
  const [newValue, setNewValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setIsUpdating(true);
        try {
          // Resize image
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );

          // Convert image to blob
          const response = await fetch(manipulatedImage.uri);
          const blob = await response.blob();

          await updateUserProfile({ photoFile: blob });
          Alert.alert('Success', 'Profile photo updated successfully!');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile photo. Please try again.');
        } finally {
          setIsUpdating(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleEdit = (type) => {
    setEditType(type);
    setCurrentPassword('');
    setNewValue('');
    setConfirmValue('');
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }

    if (editType === 'password' && newValue !== confirmValue) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (editType === 'email' && !newValue.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsUpdating(true);
    try {
      switch (editType) {
        case 'name':
          await updateUserProfile({ name: newValue });
          Alert.alert('Success', 'Username updated successfully!');
          break;
        case 'email':
          await updateUserEmail(currentPassword, newValue);
          Alert.alert('Success', 'Email updated successfully!');
          break;
        case 'password':
          await updateUserPassword(currentPassword, newValue);
          Alert.alert('Success', 'Password updated successfully!');
          break;
      }
      setShowEditModal(false);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editType === 'name' ? 'Update Username' :
             editType === 'email' ? 'Update Email' :
             'Update Password'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <TextInput
            style={styles.input}
            placeholder={
              editType === 'name' ? 'New Username' :
              editType === 'email' ? 'New Email' :
              'New Password'
            }
            secureTextEntry={editType === 'password'}
            value={newValue}
            onChangeText={setNewValue}
          />

          {editType === 'password' && (
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmValue}
              onChangeText={setConfirmValue}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.modalButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleSignOut}
    >
      <Ionicons name="log-out-outline" size={28} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="Profile"
      >
        {renderHeaderRight()}
      </Header>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {isUpdating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#115740" />
                </View>
              ) : (
                <>
                  <Image
                    source={user?.photoURL ? { uri: user.photoURL } : defaultAvatar}
                    style={styles.avatar}
                  />
                  <TouchableOpacity
                    style={styles.cameraIconContainer}
                    onPress={handleImagePick}
                  >
                    <Ionicons name="camera" size={20} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.name}>{user?.displayName}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('name')}
                >
                  <Ionicons name="pencil" size={18} color="#115740" />
                </TouchableOpacity>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.email}>{user?.email}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('email')}
                >
                  <Ionicons name="pencil" size={18} color="#115740" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Your Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.quizzesTaken}</Text>
                <Text style={styles.statLabel}>Quizzes Taken</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.averageScore.toFixed(1)}%</Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsCard}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit('password')}
            >
              <Ionicons name="lock-closed-outline" size={24} color="#115740" />
              <Text style={styles.actionButtonText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#115740" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('QuizHistory')}
            >
              <Ionicons name="time-outline" size={24} color="#115740" />
              <Text style={styles.actionButtonText}>Quiz History</Text>
              <Ionicons name="chevron-forward" size={20} color="#115740" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {renderEditModal()}
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Profile Card
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#115740',
  },
  loadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#115740',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#115740',
    borderRadius: 18,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    alignItems: 'center',
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  editButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },

  // Stats Card
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#115740',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Actions Card
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  
  // Modal Styles
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
    width: '90%',
    maxWidth: 400,
    elevation: 8,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#115740',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 