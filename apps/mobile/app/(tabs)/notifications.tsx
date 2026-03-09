import { View, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, UserPlus, DollarSign, Coins, ArrowLeft, CheckCheck } from 'lucide-react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types';

export default function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Icon as={Heart} size={20} className="text-red-600" />;
      case 'comment':
        return <Icon as={MessageCircle} size={20} className="text-blue-600" />;
      case 'follow':
        return <Icon as={UserPlus} size={20} className="text-green-600" />;
      case 'tip':
      case 'payment_received':
        return <Icon as={DollarSign} size={20} className="text-green-600" />;
      case 'token_purchase':
        return <Icon as={Coins} size={20} className="text-purple-600" />;
      default:
        return <Icon as={MessageCircle} size={20} className="text-gray-600" />;
    }
  };

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'payment_received' && notification.signature) {
      // Navigate to transaction details page
      router.push(`/transaction/${notification.signature}`);
    } else if (notification.post) {
      router.push(`/post/${notification.post._id}`);
    } else if (notification.type === 'follow') {
      router.push(`/(tabs)/profile?username=${notification.sender.username}`);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border bg-card px-4 pb-4 pt-12">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={ArrowLeft} size={24} className="text-foreground" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold">Notifications</Text>
              {unreadCount > 0 && (
                <Text className="text-sm text-muted-foreground">
                  {unreadCount} unread
                </Text>
              )}
            </View>
          </View>
          
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={() => markAllAsRead()}
              className="flex-row items-center gap-1 rounded-lg bg-purple-100 px-3 py-2"
            >
              <Icon as={CheckCheck} size={16} className="text-purple-600" />
              <Text className="text-sm font-medium text-purple-600">Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
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
        {isLoading && notifications.length === 0 ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#9333ea" />
          </View>
        ) : notifications.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No notifications yet</Text>
            <Text className="mt-2 text-sm text-muted-foreground">
              We'll notify you when something happens
            </Text>
          </View>
        ) : (
          notifications.map((notification: Notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              className={`border-b border-border p-4 ${
                !notification.isRead ? 'bg-purple-50' : 'bg-card'
              }`}
            >
              <View className="flex-row gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {getNotificationIcon(notification.type)}
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="font-medium">{notification.message}</Text>
                      {notification.amount && (
                        <Text className="mt-1 text-sm font-semibold text-green-600">
                          {notification.amount} SOL
                        </Text>
                      )}
                      {notification.post && (
                        <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={2}>
                          "{notification.post.content}"
                        </Text>
                      )}
                    </View>
                    {!notification.isRead && (
                      <View className="ml-2 h-2 w-2 rounded-full bg-purple-600" />
                    )}
                  </View>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    {formatTime(notification.createdAt)}
                  </Text>
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
      </ScrollView>
    </View>
  );
}
