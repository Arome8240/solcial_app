import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Image, RefreshControl } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Settings, MoreVertical, Copy, Share, Edit, CloudOff, TrendingUp, TrendingDown, Coins, ArrowLeft, UserPlus, UserMinus, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserPosts, useUserComments, useUserLikes } from '@/hooks/usePosts';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useUserProfile } from '@/hooks/useProfile';
import { useFollows, useCheckFollowing } from '@/hooks/useFollows';
import { useChats } from '@/hooks/useChats';
import { useQueryClient } from '@tanstack/react-query';
import type { User, Post } from '@/types';

const tabs = ['Posts', 'Portfolio', 'Replies', 'Likes'];

export default function ProfileScreen() {
  const { username: queryUsername } = useLocalSearchParams<{ username?: string }>();
  const { user: currentUser, isLoadingUser } = useAuth();
  const typedCurrentUser = currentUser as User | undefined;
  const queryClient = useQueryClient();
  
  // If username is provided, fetch that user's profile, otherwise show current user
  // Also check if the queried username matches current user's username
  const isOwnProfile = !queryUsername || queryUsername === typedCurrentUser?.username;
  const targetUsername = isOwnProfile ? (typedCurrentUser?.username || '') : (queryUsername || '');
  
  console.log('[ProfileScreen] queryUsername:', queryUsername);
  console.log('[ProfileScreen] currentUser:', typedCurrentUser?.username);
  console.log('[ProfileScreen] isOwnProfile:', isOwnProfile);
  console.log('[ProfileScreen] targetUsername:', targetUsername);
  
  // Clear cache for user posts when component mounts
  React.useEffect(() => {
    if (targetUsername) {
      console.log('[ProfileScreen] Invalidating cache for:', targetUsername);
      queryClient.invalidateQueries({ queryKey: ['posts', 'user', targetUsername] });
    }
  }, [targetUsername, queryClient]);
  
  // Only fetch other user's profile if it's not own profile
  const { data: profileUser, isLoading: isLoadingProfile } = useUserProfile(
    targetUsername,
    !isOwnProfile && !!targetUsername // Only fetch if viewing another user's profile and have username
  );
  
  const { posts, isLoading: isLoadingPosts } = useUserPosts(targetUsername, !!targetUsername);
  const { comments, isLoading: isLoadingComments } = useUserComments(targetUsername, !!targetUsername);
  const { posts: likedPosts, isLoading: isLoadingLikes } = useUserLikes(targetUsername, !!targetUsername);
  
  // Determine which user to display and get their ID
  const displayUser = (isOwnProfile ? typedCurrentUser : profileUser) as User | undefined;
  const displayUserId = displayUser?.id || '';
  
  // Fetch portfolio and follow status using the display user's ID
  const { data: portfolio, isLoading: isLoadingPortfolio } = usePortfolio(displayUserId);
  const { followUser, unfollowUser } = useFollows();
  const { data: followingData } = useCheckFollowing(isOwnProfile ? '' : displayUserId);
  const { createChat, isCreatingChat } = useChats();
  
  const [activeTab, setActiveTab] = useState('Posts');
  const [showMenu, setShowMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isFollowingUser = (followingData as { isFollowing?: boolean })?.isFollowing || false;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Invalidate all relevant queries to refetch data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts', 'user', targetUsername] }),
        queryClient.invalidateQueries({ queryKey: ['user-comments', targetUsername] }),
        queryClient.invalidateQueries({ queryKey: ['user-likes', targetUsername] }),
        queryClient.invalidateQueries({ queryKey: ['portfolio', displayUserId] }),
        queryClient.invalidateQueries({ queryKey: ['user-profile', targetUsername] }),
        queryClient.invalidateQueries({ queryKey: ['check-following', displayUserId] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToProfile = (username: string) => {
    if (username === typedCurrentUser?.username) {
      // Navigate to own profile (remove query param)
      router.push('/(tabs)/profile');
    } else {
      router.push(`/(tabs)/profile?username=${username}`);
    }
  };

  const handleFollowToggle = () => {
    if (!displayUserId) return;
    
    if (isFollowingUser) {
      unfollowUser(displayUserId);
    } else {
      followUser(displayUserId);
    }
  };

  const handleMessageUser = async () => {
    if (!displayUserId) return;
    
    try {
      const chat = await createChat(displayUserId) as any;
      // Navigate to the chat
      if (chat?.id) {
        router.push(`/(tabs)/chats/${chat.id}`);
      }
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Failed to create chat:', error);
    }
  };

  const copyAddress = async () => {
    if (displayUser?.walletAddress) {
      await Clipboard.setStringAsync(displayUser.walletAddress);
      toast.success('Address copied to clipboard');
    }
  };

  if (isLoadingUser || isLoadingProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-purple-600">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-600">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
            colors={['#9333ea']}
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-12">
          {!isOwnProfile ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={ArrowLeft} size={24} className="text-white" />
            </TouchableOpacity>
          ) : (
            <Text className="text-2xl font-bold text-white">Profile</Text>
          )}
          {isOwnProfile && (
            <TouchableOpacity onPress={() => router.push('/profile/settings')}>
              <Icon as={Settings} size={24} className="text-white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Card */}
        <View className="mx-4 mt-6 rounded-3xl bg-card p-6">
          <View className="flex-row items-start justify-between">
            {displayUser?.avatar ? (
              <Image 
                source={{ uri: displayUser.avatar }} 
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <View className="h-24 w-24 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
                <Text className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                  {displayUser?.name?.charAt(0)?.toUpperCase() || displayUser?.username?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            {isOwnProfile ? (
              <TouchableOpacity onPress={() => setShowMenu(true)}>
                <Icon as={MoreVertical} size={24} className="text-foreground" />
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={handleMessageUser}
                  disabled={isCreatingChat}
                  className="items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 p-3"
                >
                  <Icon as={MessageCircle} size={20} className="text-purple-600 dark:text-purple-300" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleFollowToggle}
                  className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${isFollowingUser ? 'bg-gray-200 dark:bg-gray-700' : 'bg-purple-600'}`}
                >
                  <Icon as={isFollowingUser ? UserMinus : UserPlus} size={18} className={isFollowingUser ? "text-foreground" : "text-white"} />
                  <Text className={`font-semibold ${isFollowingUser ? 'text-foreground' : 'text-white'}`}>
                    {isFollowingUser ? 'Unfollow' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View className="mt-4">
            <Text className="text-2xl font-bold">{displayUser?.name || displayUser?.username}</Text>
            <Text className="text-muted-foreground">@{displayUser?.username}</Text>
            <Text className="mt-2">{displayUser?.bio || 'No bio yet'}</Text>
          </View>

          <View className="mt-4 flex-row gap-6">
            <View>
              <Text className="text-xl font-bold">{displayUser?.followingCount || 0}</Text>
              <Text className="text-sm text-muted-foreground">Following</Text>
            </View>
            <View>
              <Text className="text-xl font-bold">{displayUser?.followersCount || 0}</Text>
              <Text className="text-sm text-muted-foreground">Followers</Text>
            </View>
            <View>
              <Text className="text-xl font-bold">{displayUser?.postsCount || 0}</Text>
              <Text className="text-sm text-muted-foreground">Posts</Text>
            </View>
          </View>

          {/* Wallet Address */}
          <View className="mt-4 rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
            <Text className="text-sm text-muted-foreground">Wallet Address</Text>
            <View className="mt-1 flex-row items-center justify-between">
              <Text className="text-lg font-bold">
                {displayUser?.walletAddress?.slice(0, 8)}...{displayUser?.walletAddress?.slice(-4)}
              </Text>
              <TouchableOpacity onPress={copyAddress}>
                <Icon as={Copy} size={20} className="text-purple-600" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="mt-6 bg-background">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`mr-2 rounded-full px-6 py-3 ${
                  activeTab === tab ? 'bg-purple-600' : 'bg-card'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === tab ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Posts Content */}
          {activeTab === 'Posts' && (
            <View className="px-4 py-4">
              {isLoadingPosts ? (
                <View className="items-center py-20">
                  <ActivityIndicator size="large" color="#9333ea" />
                </View>
              ) : !posts || posts.length === 0 ? (
                <View className="items-center py-20">
                  <Icon as={CloudOff} size={64} className="text-muted-foreground" />
                  <Text className="mt-4 text-muted-foreground">No posts yet</Text>
                </View>
              ) : (
                posts.map((post: Post) => (
                  <TouchableOpacity 
                    key={post.id} 
                    onPress={() => router.push(`/post/${post.id}`)}
                    className="mb-4 rounded-2xl bg-card p-4"
                  >
                    <View className="flex-row items-center gap-3 mb-3">
                      {post.author?.avatar ? (
                        <Image 
                          source={{ uri: post.author.avatar }} 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
                          <Text className="text-sm font-bold text-purple-600 dark:text-purple-300">
                            {post.author?.name?.charAt(0)?.toUpperCase() || post.author?.username?.charAt(0)?.toUpperCase() || '?'}
                          </Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="font-semibold">{post.author?.name || post.author?.username}</Text>
                        <Text className="text-xs text-muted-foreground">
                          @{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text className="mb-3">{post.content}</Text>
                    {post.images && post.images.length > 0 && (
                      <View className="mb-3 flex-row flex-wrap gap-2">
                        {post.images.slice(0, 4).map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: img }}
                            className={`rounded-xl ${
                              post.images.length === 1
                                ? 'h-64 w-full'
                                : post.images.length === 2
                                ? 'h-48 w-[48%]'
                                : 'h-32 w-[48%]'
                            }`}
                            resizeMode="cover"
                          />
                        ))}
                      </View>
                    )}
                    <View className="flex-row gap-4">
                      <Text className="text-sm text-muted-foreground">{post.likesCount || 0} likes</Text>
                      <Text className="text-sm text-muted-foreground">{post.commentsCount || 0} comments</Text>
                      {post.isTokenized && (
                        <Text className="text-sm text-purple-600 font-semibold">🪙 Tokenized</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Portfolio Content */}
          {activeTab === 'Portfolio' && (
            <View className="px-4 py-4">
              {isLoadingPortfolio ? (
                <View className="items-center py-20">
                  <ActivityIndicator size="large" color="#9333ea" />
                </View>
              ) : !portfolio || !portfolio.holdings || portfolio.holdings.length === 0 ? (
                <View className="items-center py-20">
                  <Icon as={Coins} size={64} className="text-muted-foreground" />
                  <Text className="mt-4 text-muted-foreground">No token holdings yet</Text>
                  {isOwnProfile && (
                    <Text className="mt-2 text-center text-sm text-muted-foreground">
                      Buy post tokens to start building your portfolio
                    </Text>
                  )}
                </View>
              ) : (
                <>
                  {/* Portfolio Summary */}
                  <View className="mb-4 rounded-2xl bg-purple-600 dark:bg-purple-700 p-6">
                    <Text className="text-sm text-white/80">Total Portfolio Value</Text>
                    <Text className="mt-1 text-3xl font-bold text-white">
                      {portfolio.totalValue.toFixed(4)} SOL
                    </Text>
                    <View className="mt-3 flex-row items-center gap-2">
                      <Icon 
                        as={portfolio.totalProfitLoss >= 0 ? TrendingUp : TrendingDown} 
                        size={16} 
                        className={portfolio.totalProfitLoss >= 0 ? "text-green-300" : "text-red-300"}
                      />
                      <Text className={`font-semibold ${portfolio.totalProfitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {portfolio.totalProfitLoss >= 0 ? '+' : ''}{portfolio.totalProfitLoss.toFixed(4)} SOL
                      </Text>
                      <Text className={`text-sm ${portfolio.totalProfitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        ({portfolio.totalProfitLossPercentage >= 0 ? '+' : ''}{portfolio.totalProfitLossPercentage.toFixed(2)}%)
                      </Text>
                    </View>
                    <View className="mt-2 flex-row gap-4">
                      <View>
                        <Text className="text-xs text-white/60">Invested</Text>
                        <Text className="text-sm font-semibold text-white">
                          {portfolio.totalInvested.toFixed(4)} SOL
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs text-white/60">Holdings</Text>
                        <Text className="text-sm font-semibold text-white">
                          {portfolio.holdings.length} posts
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Holdings List */}
                  {portfolio.holdings.map((holding) => (
                    <TouchableOpacity 
                      key={holding.id} 
                      onPress={() => router.push(`/post/${holding.post.id}`)}
                      className="mb-3 rounded-2xl bg-card p-4"
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text className="font-semibold" numberOfLines={2}>
                            {holding.post.content}
                          </Text>
                          <TouchableOpacity onPress={() => navigateToProfile(holding.post.author.username)}>
                            <Text className="mt-1 text-sm text-muted-foreground">
                              by @{holding.post.author.username}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="ml-2 items-end">
                          <View className="flex-row items-center gap-1">
                            <Icon 
                              as={holding.profitLoss >= 0 ? TrendingUp : TrendingDown} 
                              size={14} 
                              className={holding.profitLoss >= 0 ? "text-green-600" : "text-red-600"}
                            />
                            <Text className={`text-sm font-semibold ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.profitLossPercentage >= 0 ? '+' : ''}{holding.profitLossPercentage.toFixed(1)}%
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className="mt-3 flex-row gap-4">
                        <View>
                          <Text className="text-xs text-muted-foreground">Tokens</Text>
                          <Text className="font-semibold">{holding.amount}</Text>
                        </View>
                        <View>
                          <Text className="text-xs text-muted-foreground">Avg Price</Text>
                          <Text className="font-semibold">{holding.purchasePrice.toFixed(4)}</Text>
                        </View>
                        <View>
                          <Text className="text-xs text-muted-foreground">Current</Text>
                          <Text className="font-semibold">{holding.currentPrice.toFixed(4)}</Text>
                        </View>
                        <View>
                          <Text className="text-xs text-muted-foreground">Value</Text>
                          <Text className="font-semibold">{holding.currentValue.toFixed(4)} SOL</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          )}

          {/* Replies Content */}
          {activeTab === 'Replies' && (
            <View className="px-4 py-4">
              {isLoadingComments ? (
                <View className="items-center py-20">
                  <ActivityIndicator size="large" color="#9333ea" />
                </View>
              ) : !comments || comments.length === 0 ? (
                <View className="items-center py-20">
                  <Icon as={CloudOff} size={64} className="text-muted-foreground" />
                  <Text className="mt-4 text-muted-foreground">No comments yet</Text>
                </View>
              ) : (
                comments.map((comment: any) => (
                  <TouchableOpacity 
                    key={comment.id} 
                    onPress={() => router.push(`/post/${comment.post.id}`)}
                    className="mb-4 rounded-2xl bg-card p-4"
                  >
                    <View className="flex-row items-center gap-3 mb-3">
                      {comment.author?.avatar ? (
                        <Image 
                          source={{ uri: comment.author.avatar }} 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
                          <Text className="text-sm font-bold text-purple-600 dark:text-purple-300">
                            {comment.author?.name?.charAt(0)?.toUpperCase() || comment.author?.username?.charAt(0)?.toUpperCase() || '?'}
                          </Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="font-semibold">{comment.author?.name || comment.author?.username}</Text>
                        <Text className="text-xs text-muted-foreground">
                          Replied to @{comment.post?.author?.username}
                        </Text>
                      </View>
                    </View>
                    <Text className="mb-2">{comment.content}</Text>
                    <View className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                        {comment.post?.content}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Likes Content */}
          {activeTab === 'Likes' && (
            <View className="px-4 py-4">
              {isLoadingLikes ? (
                <View className="items-center py-20">
                  <ActivityIndicator size="large" color="#9333ea" />
                </View>
              ) : !likedPosts || likedPosts.length === 0 ? (
                <View className="items-center py-20">
                  <Icon as={CloudOff} size={64} className="text-muted-foreground" />
                  <Text className="mt-4 text-muted-foreground">No liked posts yet</Text>
                </View>
              ) : (
                likedPosts.map((post: Post) => (
                  <TouchableOpacity 
                    key={post.id} 
                    onPress={() => router.push(`/post/${post.id}`)}
                    className="mb-4 rounded-2xl bg-card p-4"
                  >
                    <View className="flex-row items-center gap-3 mb-3">
                      {post.author?.avatar ? (
                        <Image 
                          source={{ uri: post.author.avatar }} 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
                          <Text className="text-sm font-bold text-purple-600 dark:text-purple-300">
                            {post.author?.name?.charAt(0)?.toUpperCase() || post.author?.username?.charAt(0)?.toUpperCase() || '?'}
                          </Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="font-semibold">{post.author?.name || post.author?.username}</Text>
                        <Text className="text-xs text-muted-foreground">
                          @{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text className="mb-3">{post.content}</Text>
                    {post.images && post.images.length > 0 && (
                      <View className="mb-3 flex-row flex-wrap gap-2">
                        {post.images.slice(0, 4).map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: img }}
                            className={`rounded-xl ${
                              post.images.length === 1
                                ? 'h-64 w-full'
                                : post.images.length === 2
                                ? 'h-48 w-[48%]'
                                : 'h-32 w-[48%]'
                            }`}
                            resizeMode="cover"
                          />
                        ))}
                      </View>
                    )}
                    <View className="flex-row gap-4">
                      <Text className="text-sm text-muted-foreground">{post.likesCount || 0} likes</Text>
                      <Text className="text-sm text-muted-foreground">{post.commentsCount || 0} comments</Text>
                      {post.isTokenized && (
                        <Text className="text-sm text-purple-600 font-semibold">🪙 Tokenized</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Profile Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="rounded-t-3xl bg-background pb-8">
            {/* Handle */}
            <View className="items-center py-4">
              <View className="h-1 w-12 rounded-full bg-gray-300" />
            </View>

            {/* Menu Items */}
            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                // Handle share
              }}
              className="flex-row items-center gap-4 border-b border-border px-6 py-5"
            >
              <Icon as={Share} size={24} className="text-foreground" />
              <Text className="text-lg font-semibold">Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                router.push('/profile/edit');
              }}
              className="flex-row items-center gap-4 px-6 py-5"
            >
              <Icon as={Edit} size={24} className="text-foreground" />
              <Text className="text-lg font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
