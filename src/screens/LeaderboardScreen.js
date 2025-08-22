import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

const defaultAvatar = require('../../assets/images/avatar.png');
const crownImage = require('../../assets/images/crown.png');

const LeaderboardScreen = ({ navigation }) => {
  const { leaderboardData, loadLeaderboard } = useUser();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const renderPodium = () => {
    const topThree = leaderboardData.slice(0, 3);
    const [first, second, third] = topThree;

    if (!first) return null;

    return (
      <View style={styles.podiumContainer}>
        {/* Second Place - Left */}
        {second && (
          <View style={styles.podiumSecond}>
            <View style={styles.avatarContainer}>
              <Image 
                source={second.avatar ? { uri: second.avatar } : defaultAvatar} 
                style={styles.avatarSecond} 
              />
              <View style={styles.rankBadgeContainer}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>2</Text>
                </View>
              </View>
            </View>
            <Text style={styles.nameSecond} numberOfLines={1}>{second.name}</Text>
            <Text style={styles.pointsSecond}>{second.points}</Text>
          </View>
        )}

        {/* First Place - Center */}
        <View style={styles.podiumFirst}>
          <View style={styles.crownContainer}>
            <Image source={crownImage} style={styles.crownImage} />
          </View>
          <View style={styles.avatarContainer}>
            <Image 
              source={first.avatar ? { uri: first.avatar } : defaultAvatar} 
              style={styles.avatarFirst} 
            />
            <View style={styles.rankBadgeContainer}>
              <View style={[styles.rankBadge, styles.rankBadgeFirst]}>
                <Text style={styles.rankText}>1</Text>
              </View>
            </View>
          </View>
          <Text style={styles.nameFirst} numberOfLines={1}>{first.name}</Text>
          <Text style={styles.pointsFirst}>{first.points}</Text>
        </View>

        {/* Third Place - Right */}
        {third && (
          <View style={styles.podiumThird}>
            <View style={styles.avatarContainer}>
              <Image 
                source={third.avatar ? { uri: third.avatar } : defaultAvatar} 
                style={styles.avatarThird} 
              />
              <View style={styles.rankBadgeContainer}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>3</Text>
                </View>
              </View>
            </View>
            <Text style={styles.nameThird} numberOfLines={1}>{third.name}</Text>
            <Text style={styles.pointsThird}>{third.points}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderListItem = ({ item, index }) => {
    if (index < 3) return null; // Skip top 3 as they're in the podium
    
    return (
      <View style={styles.listItem}>
        <Text style={styles.listRank}>#{index + 1}</Text>
        <Image 
          source={item.avatar ? { uri: item.avatar } : defaultAvatar} 
          style={styles.listAvatar} 
        />
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.listSubtext}>{item.quizzes} quizzes</Text>
        </View>
        <Text style={styles.listPoints}>{item.points}</Text>
      </View>
    );
  };

  const EmptyLeaderboard = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="trophy-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No Leaders Yet</Text>
      <Text style={styles.emptySubText}>
        Complete quizzes to appear on the leaderboard
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#115740', '#1a7a5a']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={loadLeaderboard}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={leaderboardData}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderPodium}
        ListEmptyComponent={EmptyLeaderboard}
        contentContainerStyle={[
          styles.listContainer,
          leaderboardData.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  podiumFirst: {
    alignItems: 'center',
    marginHorizontal: 10,
    zIndex: 3,
  },
  podiumSecond: {
    alignItems: 'center',
    marginTop: 30,
    zIndex: 2,
  },
  podiumThird: {
    alignItems: 'center',
    marginTop: 50,
    zIndex: 1,
  },
  crownContainer: {
    position: 'absolute',
    top: -35,
    zIndex: 4,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  rankBadgeContainer: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    backgroundColor: '#115740',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  rankBadgeFirst: {
    backgroundColor: '#FFD700',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  rankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarFirst: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  avatarSecond: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#C0C0C0',
  },
  avatarThird: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#CD7F32',
  },
  nameFirst: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    maxWidth: 120,
  },
  nameSecond: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    maxWidth: 100,
  },
  nameThird: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    maxWidth: 100,
  },
  pointsFirst: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  pointsSecond: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  pointsThird: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    width: 40,
  },
  listAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listSubtext: {
    fontSize: 12,
    color: '#666',
  },
  listPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LeaderboardScreen; 