import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    try {
      await signout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
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

  return (
    <LinearGradient
              colors={['#115740', '#1a7a5a']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {isUpdating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
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
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.name}>{user?.displayName}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit('name')}
              >
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.email}>{user?.email}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit('email')}
              >
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.passwordButton}
              onPress={() => handleEdit('password')}
            >
              <Ionicons name="lock-closed" size={20} color="white" />
              <Text style={styles.passwordButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.quizzesTaken}</Text>
            <Text style={styles.statLabel}>Quizzes Taken</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.averageScore}%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('QuizHistory')}
        >
          <Ionicons name="time-outline" size={24} color="white" />
          <Text style={styles.historyButtonText}>View Quiz History</Text>
        </TouchableOpacity>
      </ScrollView>
      {renderEditModal()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  signOutButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },
  loadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1B5E20',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 10,
  },
  editButton: {
    padding: 8,
  },
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  passwordButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B5E20',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 