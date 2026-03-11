import { View, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Modal, TextInput, Pressable, Image, Switch, ImageBackground } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, Search, Bell, X, Eye, EyeOff, Copy, ArrowUpRight, ArrowDownLeft, RefreshCw, Sparkles, ArrowRight, Circle, ImagePlus, Coins, DollarSign, User } from 'lucide-react-native';
import { usePosts } from '@/hooks/usePosts';
import { useWallet } from '@/hooks/useWallet';
import { useNotifications } from '@/hooks/useNotifications';
import { router } from 'expo-router';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadMultipleImages } from '@/lib/upload';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const { posts, isLoadingFeed, fetchNextPage, hasNextPage, isFetchingNextPage, refetchFeed, createPost, isCreatingPost, likePost, unlikePost, tipPost, isTippingPost, buyToken, isBuyingToken } = usePosts();
  const { balance, walletAddress, isLoadingBalance, refetchBalance } = useWallet();
  const { unreadCount } = useNotifications();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [isTokenized, setIsTokenized] = useState(false);
  const [tokenSupply, setTokenSupply] = useState('1000');
  const [tokenPrice, setTokenPrice] = useState('0.01');
  const [showBalance, setShowBalance] = useState(true);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showBuyTokenModal, setShowBuyTokenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [tipAmount, setTipAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    let imageUrls: string[] = [];
    
    // Upload images to Cloudinary if any
    if (postImages.length > 0) {
      setIsUploadingImages(true);
      try {
        imageUrls = await uploadMultipleImages(postImages);
        toast.success('Images uploaded!');
      } catch (error) {
        toast.error('Failed to upload images');
        setIsUploadingImages(false);
        return;
      }
      setIsUploadingImages(false);
    }
    
    createPost({ 
      content: postContent,
      images: imageUrls,
      isTokenized,
      tokenSupply: isTokenized ? parseInt(tokenSupply) : undefined,
      tokenPrice: isTokenized ? parseFloat(tokenPrice) : undefined,
    });
    setPostContent('');
    setPostImages([]);
    setIsTokenized(false);
    setTokenSupply('1000');
    setTokenPrice('0.01');
    setShowCreatePost(false);
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setPostImages([...postImages, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setPostImages(postImages.filter((_, i) => i !== index));
  };

  const handleTipPost = (post: Post) => {
    setSelectedPost(post);
    setShowTipModal(true);
  };

  const handleBuyToken = (post: Post) => {
    setSelectedPost(post);
    setShowBuyTokenModal(true);
  };

  const submitTip = () => {
    if (!selectedPost || !tipAmount) return;
    const amount = parseFloat(tipAmount);
    if (amount <= 0) {
      toast.error('Invalid amount');
      return;
    }
    tipPost({ postId: selectedPost.id, amount });
    setShowTipModal(false);
    setTipAmount('');
    setSelectedPost(null);
  };

  const submitBuyToken = () => {
    if (!selectedPost || !buyAmount) return;
    const amount = parseInt(buyAmount);
    if (amount <= 0) {
      toast.error('Invalid amount');
      return;
    }
    buyToken({ postId: selectedPost.id, amount });
    setShowBuyTokenModal(false);
    setBuyAmount('');
    setSelectedPost(null);
  };

  const handleLike = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false }).replace('about ', '');
    } catch {
      return '';
    }
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
      toast.success('Address copied!');
    }
  };

  const handleRefreshBalance = async () => {
    await refetchBalance();
    toast.success('Balance refreshed!');
  };

  const navigateToProfile = (username: string) => {
    router.push(`/(tabs)/profile?username=${username}`);
  };

  return (
    <SafeAreaView
     className="flex-1 bg-background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"

        refreshControl={
          <RefreshControl refreshing={isLoadingFeed} onRefresh={refetchFeed} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Balance Card */}
        <View className="overflow-hidden rounded-b-3xl bg-purple-600 shadow-lg">
          <ImageBackground
            source={require('@/assets/images/wrapper.png')}
            resizeMode="cover"
            imageStyle={{ opacity: 0.1 }}
          >
            <View className="p-6">
              <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-purple-200">Total Balance</Text>
                  <TouchableOpacity 
                    onPress={() => setShowBalance(!showBalance)}
                    className="rounded-full p-1"
                  >
                    <Icon as={showBalance ? Eye : EyeOff} size={16} className="text-purple-200" />
                  </TouchableOpacity>
                </View>
                
                {isLoadingBalance ? (
                  <ActivityIndicator size="large" color="#ffffff" className="mt-2" />
                ) : (
                  <Text className="mt-1 text-3xl font-bold text-white">
                    {showBalance ? `${balance.toFixed(2)} SOL` : '••••••'}
                  </Text>
                )}
                
                <Pressable onPress={copyAddress} className="mt-2 flex-row items-center gap-2 rounded-lg p-1">
                  <Text className="text-sm text-purple-200">
                    {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                  </Text>
                  <Icon as={Copy} size={14} className="text-purple-200" />
                </Pressable>
              </View>
              
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={handleRefreshBalance}
                  disabled={isLoadingBalance}
                  className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
                >
                  <Icon as={RefreshCw} size={18} className="text-white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/notifications')}
                  className="relative h-10 w-10 items-center justify-center rounded-full bg-white/20"
                >
                  <Icon as={Bell} size={18} className="text-white" />
                  {unreadCount > 0 && (
                    <View className="absolute right-0 top-0 h-5 w-5 items-center justify-center rounded-full bg-red-500">
                      <Text className="text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions */}
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.push('/wallet/send')}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-white py-3.5 shadow-sm"
              >
                <Icon as={ArrowUpRight} size={18} className="text-purple-600" />
                <Text className="font-semibold text-purple-600">Send</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push('/wallet/receive')}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-purple-700 py-3.5 shadow-sm"
              >
                <Icon as={ArrowDownLeft} size={18} className="text-white" />
                <Text className="font-semibold text-white">Receive</Text>
              </TouchableOpacity>
              
            </View>

            {/* Network Badge */}
            <View className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5">
              <Icon as={Circle} size={8} className="text-green-400" fill="#4ade80" />
              <Text className="text-xs font-medium text-white">Solana Devnet</Text>
            </View>
            </View>
          </ImageBackground>
        </View>

        {/* Mini Apps Section */}
        <TouchableOpacity 
          onPress={() => router.push('/mini-apps')}
          className="mx-4 mt-4 relative overflow-hidden rounded-2xl bg-purple-600 dark:bg-purple-700"
        >
          <Image source={require('@/assets/images/ec1.png')} className='absolute w-[57px] h-[57px] bottom-0 left-0'/>
          <Image source={require('@/assets/images/ec3.png')} className='absolute w-[57px] h-[57px] -bottom-8 right-[120px] rounded-full'/>
          <Image source={require('@/assets/images/ec3.png')} className='absolute w-[19px] h-[19px] bottom-2 right-[160px] rounded-full'/>
          <Image source={require('@/assets/images/ec3.png')} className='absolute w-[19px] h-[19px] top-2 right-[160px] rounded-full'/>
          <Image source={require('@/assets/images/ec2.png')} className='absolute w-[95px] rounded-full h-[95px] -top-16 left-10'/>
          <View className="p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Icon as={Sparkles} size={20} className="text-white" />
                  <Text className="text-lg font-bold text-white">Explore Mini Apps</Text>
                </View>
                <Text className="mt-2 text-xs text-white/90">
                  Swap, mint, games & more
                </Text>
              </View>

              <Image source={require('@/assets/images/mini.png')} className='w-[96px] h-[101px]'/>
              
              
            </View>
          </View>
        </TouchableOpacity>

        {/* Feed Header */}
        <View className="mt-6 flex-row items-center justify-between px-4">
          <Text className="text-xl font-bold">Feed</Text>
          <TouchableOpacity 
            onPress={() => router.push('/explore')}
            className="flex-row items-center gap-1"
          >
            <Icon as={Search} size={20} className="text-purple-600" />
            <Text className="font-semibold text-purple-600">Explore</Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View className="mt-4">
          {isLoadingFeed && posts.length === 0 ? (
            <View className="items-center py-20">
              <ActivityIndicator size="large" color="#9333ea" />
            </View>
          ) : posts.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-muted-foreground">No posts yet</Text>
              <Text className="mt-2 text-sm text-muted-foreground">Be the first to post!</Text>
            </View>
          ) : (
            posts.map((post: Post) => (
              <TouchableOpacity 
                key={post.id} 
                onPress={() => router.push(`/post/${post.id}`)}
                className="border-b border-border bg-card p-4"
              >
                <View className="flex-row gap-3">
                  <TouchableOpacity onPress={() => navigateToProfile(post.author.username)}>
                    {post.author.avatar ? (
                      <Image source={{ uri: post.author.avatar }} className="h-10 w-10 rounded-full" />
                    ) : (
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-200">
                        <Icon as={User} size={20} className="text-purple-600" />
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity onPress={() => navigateToProfile(post.author.username)}>
                        <Text className="font-semibold">{post.author.name || post.author.username}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigateToProfile(post.author.username)}>
                        <Text className="text-sm text-muted-foreground">@{post.author.username}</Text>
                      </TouchableOpacity>
                      <Text className="text-sm text-muted-foreground">· {formatTime(post.createdAt)}</Text>
                    </View>
                    
                    <Text className="mt-2">{post.content}</Text>
                    
                    {/* Token Badge */}
                    {post.isTokenized && (
                      <View className="mt-2 flex-row items-center gap-2 self-start rounded-full bg-purple-100 px-3 py-1">
                        <Icon as={Coins} size={14} className="text-purple-600" />
                        <Text className="text-xs font-medium text-purple-600">
                          {post.tokenSupply} tokens @ {post.tokenPrice} SOL
                        </Text>
                      </View>
                    )}
                    
                    {/* Images Grid */}
                    {post.images && post.images.length > 0 && (
                      <View className={`mt-3 gap-2 ${post.images.length === 1 ? '' : 'flex-row flex-wrap'}`}>
                        {post.images.slice(0, 4).map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: img }}
                            className={`rounded-xl ${
                              post.images.length === 1 
                                ? 'h-64 w-full' 
                                : 'h-32 w-[48%]'
                            }`}
                            resizeMode="cover"
                          />
                        ))}
                      </View>
                    )}
                    
                    {/* Action Buttons */}
                    <View className="mt-3 flex-row flex-wrap gap-4">
                      <TouchableOpacity 
                        onPress={() => handleLike(post.id, post.isLiked)}
                        className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
                          post.isLiked ? 'bg-purple-50 dark:bg-purple-950' : ''
                        }`}
                      >
                        <Icon 
                          as={Heart} 
                          size={18} 
                          className={post.isLiked ? "text-purple-600" : "text-muted-foreground"}
                          fill={post.isLiked ? "#9333ea" : "none"}
                        />
                        <Text className={`text-sm ${post.isLiked ? 'text-purple-600 font-semibold' : 'text-muted-foreground'}`}>
                          {post.likesCount}
                        </Text>
                      </TouchableOpacity>
                      
                      <View className="flex-row items-center gap-1">
                        <Icon as={MessageCircle} size={18} className="text-muted-foreground" />
                        <Text className="text-sm text-muted-foreground">{post.commentsCount}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        onPress={() => handleTipPost(post)}
                        className="flex-row items-center gap-1"
                      >
                        <Icon as={DollarSign} size={18} className="text-green-600" />
                        <Text className="text-sm text-green-600">
                          Tip ({post.tipsCount || 0})
                        </Text>
                      </TouchableOpacity>
                      
                      {post.isTokenized && (
                        <TouchableOpacity 
                          onPress={() => handleBuyToken(post)}
                          className="flex-row items-center gap-1 rounded-full bg-purple-100 px-3 py-1"
                        >
                          <Icon as={Coins} size={16} className="text-purple-600" />
                          <Text className="text-xs font-medium text-purple-600">Buy</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {/* Tips Display */}
                    {post.totalTipsAmount > 0 && (
                      <View className="mt-2 rounded-lg bg-green-50 p-2">
                        <Text className="text-xs text-green-700">
                          💰 Received {post.totalTipsAmount.toFixed(4)} SOL in tips
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          {isFetchingNextPage && (
            <View className="py-4">
              <ActivityIndicator size="small" color="#9333ea" />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Post Button */}
      <TouchableOpacity 
        onPress={() => setShowCreatePost(true)}
        className="absolute bottom-10 right-4 h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg"
      >
        <Text className="text-2xl text-white">+</Text>
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="mt-20 flex-1 rounded-t-3xl bg-background">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border p-4">
              <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                <Icon as={X} size={24} className="text-foreground" />
              </TouchableOpacity>
              <Text className="text-lg font-bold">Create Post</Text>
              <TouchableOpacity 
                onPress={handleCreatePost}
                disabled={!postContent.trim() || isCreatingPost || isUploadingImages}
                className={`rounded-full px-4 py-2 ${postContent.trim() && !isUploadingImages ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <Text className={`font-semibold ${postContent.trim() && !isUploadingImages ? 'text-white' : 'text-gray-500'}`}>
                  {isUploadingImages ? 'Uploading...' : isCreatingPost ? 'Posting...' : 'Post'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
              {/* Content Input */}
              <TextInput
                value={postContent}
                onChangeText={setPostContent}
                placeholder="What's happening?"
                placeholderTextColor="#9ca3af"
                multiline
                autoFocus
                className="min-h-[100px] text-base text-foreground"
                style={{ textAlignVertical: 'top' }}
              />

              {/* Image Preview Grid */}
              {postImages.length > 0 && (
                <View className="mt-4 flex-row flex-wrap gap-2">
                  {postImages.map((uri, index) => (
                    <View key={index} className="relative">
                      <Image source={{ uri }} className="h-24 w-24 rounded-lg" />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-black/60"
                      >
                        <Icon as={X} size={14} className="text-white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Tokenization Section */}
              <View className="mt-6 rounded-xl border border-border p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Icon as={Coins} size={20} className="text-purple-600" />
                    <Text className="font-semibold">Tokenize Post</Text>
                  </View>
                  <Switch
                    value={isTokenized}
                    onValueChange={setIsTokenized}
                    trackColor={{ false: '#d1d5db', true: '#9333ea' }}
                    thumbColor="#ffffff"
                  />
                </View>
                
                {isTokenized && (
                  <View className="mt-4 gap-3">
                    <View>
                      <Text className="mb-1 text-sm text-muted-foreground">Token Supply</Text>
                      <TextInput
                        value={tokenSupply}
                        onChangeText={setTokenSupply}
                        placeholder="1000"
                        keyboardType="numeric"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </View>
                    <View>
                      <Text className="mb-1 text-sm text-muted-foreground">Price per Token (SOL)</Text>
                      <TextInput
                        value={tokenPrice}
                        onChangeText={setTokenPrice}
                        placeholder="0.01"
                        keyboardType="decimal-pad"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      />
                    </View>
                    <View className="rounded-lg bg-purple-50 p-3">
                      <Text className="text-xs text-purple-700">
                        💡 Users can buy tokens of your post. Token value may increase based on demand!
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Add Images Button */}
              <TouchableOpacity
                onPress={pickImages}
                disabled={postImages.length >= 4}
                className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4"
              >
                <Icon as={ImagePlus} size={24} className="text-muted-foreground" />
                <Text className="text-muted-foreground">
                  {postImages.length >= 4 ? 'Max 4 images' : 'Add Images'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Tip Modal */}
      <Modal
        visible={showTipModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTipModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm rounded-2xl bg-background p-6">
            <Text className="text-xl font-bold">Tip Post</Text>
            <Text className="mt-2 text-sm text-muted-foreground">
              Send SOL to @{selectedPost?.author.username}
            </Text>
            
            <View className="mt-4">
              <Text className="mb-2 text-sm font-medium">Amount (SOL)</Text>
              <TextInput
                value={tipAmount}
                onChangeText={setTipAmount}
                placeholder="0.1"
                keyboardType="decimal-pad"
                className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
              />
            </View>

            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowTipModal(false)}
                className="flex-1 rounded-xl border border-border py-3"
              >
                <Text className="text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitTip}
                disabled={isTippingPost}
                className="flex-1 rounded-xl bg-green-600 py-3"
              >
                <Text className="text-center font-semibold text-white">
                  {isTippingPost ? 'Sending...' : 'Send Tip'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Buy Token Modal */}
      <Modal
        visible={showBuyTokenModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBuyTokenModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View className="w-full max-w-sm rounded-2xl bg-background p-6">
            <Text className="text-xl font-bold">Buy Post Tokens</Text>
            <Text className="mt-2 text-sm text-muted-foreground">
              Price: {selectedPost?.tokenPrice} SOL per token
            </Text>
            
            <View className="mt-4">
              <Text className="mb-2 text-sm font-medium">Number of Tokens</Text>
              <TextInput
                value={buyAmount}
                onChangeText={setBuyAmount}
                placeholder="10"
                keyboardType="numeric"
                className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
              />
              {buyAmount && selectedPost && (
                <Text className="mt-2 text-sm text-muted-foreground">
                  Total: {(parseInt(buyAmount) * selectedPost.tokenPrice).toFixed(4)} SOL
                </Text>
              )}
            </View>

            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowBuyTokenModal(false)}
                className="flex-1 rounded-xl border border-border py-3"
              >
                <Text className="text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitBuyToken}
                disabled={isBuyingToken}
                className="flex-1 rounded-xl bg-purple-600 py-3"
              >
                <Text className="text-center font-semibold text-white">
                  {isBuyingToken ? 'Buying...' : 'Buy Tokens'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
