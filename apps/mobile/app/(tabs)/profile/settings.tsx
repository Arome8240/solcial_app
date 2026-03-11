import { View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Grid, Users, Bell, Moon, Globe, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/useThemeStore';
import * as ExpoNotifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuth();

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const { status } = await ExpoNotifications.getPermissionsAsync();
    setNotifications(status === 'granted');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleThemeToggle = async () => {
    await toggleTheme();
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      // Request permission and register token
      const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await ExpoNotifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        toast.error('Failed to get push notification permissions');
        setNotifications(false);
        return;
      }

      // Set up notification channel for Android
      if (Platform.OS === 'android') {
        await ExpoNotifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: ExpoNotifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#9333ea',
        });
      }

      // Get push token
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const token = (await ExpoNotifications.getExpoPushTokenAsync({ projectId })).data;
        
        // Register token with backend
        const response = await api.registerPushToken(token);
        if (response.error) {
          toast.error('Failed to register push token');
          setNotifications(false);
          return;
        }
        
        setNotifications(true);
        toast.success('Notifications enabled!');
      } catch (error) {
        console.error('Error getting push token:', error);
        toast.error('Failed to enable notifications');
        setNotifications(false);
      }
    } else {
      // Disable notifications
      setNotifications(false);
      toast.success('Notifications disabled');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 pt-12">
          <Text className="text-3xl font-bold">Settings</Text>
        </View>

        {/* Account Section */}
        <View className="mt-6 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            ACCOUNT
          </Text>

          <TouchableOpacity 
            onPress={() => router.push('/profile/edit')}
            className="mb-3 flex-row items-center gap-4 rounded-2xl bg-card p-4"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Grid} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Edit Profile</Text>
              <Text className="text-sm text-muted-foreground">
                Update your name, bio, and avatar
              </Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/profile/security')}
            className="flex-row items-center gap-4 rounded-2xl bg-card p-4"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Users} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Security & Privacy</Text>
              <Text className="text-sm text-muted-foreground">
                Password, 2FA, and wallet security
              </Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View className="mt-6 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            PREFERENCES
          </Text>

          <View className="mb-3 flex-row items-center gap-4 rounded-2xl bg-card p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Bell} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Notifications</Text>
              <Text className="text-sm text-muted-foreground">
                {notifications ? 'Push notifications enabled' : 'Push notifications disabled'}
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#d1d5db', true: '#9333ea' }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="mb-3 flex-row items-center gap-4 rounded-2xl bg-card p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Moon} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Dark Mode</Text>
              <Text className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#d1d5db', true: '#9333ea' }}
              thumbColor="#ffffff"
            />
          </View>

          <TouchableOpacity className="flex-row items-center gap-4 rounded-2xl bg-card p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Globe} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Language</Text>
              <Text className="text-sm text-muted-foreground">English US</Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View className="mt-6 px-4 pb-6">
          <Text className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            SUPPORT
          </Text>

          <TouchableOpacity 
            onPress={() => router.push('/profile/help')}
            className="mb-3 flex-row items-center gap-4 rounded-2xl bg-card p-4"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={HelpCircle} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Help & Support</Text>
              <Text className="text-sm text-muted-foreground">
                FAQs, contact us, tutorials
              </Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/profile/terms')}
            className="flex-row items-center gap-4 rounded-2xl bg-card p-4"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={FileText} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Terms & Privacy</Text>
              <Text className="text-sm text-muted-foreground">
                Legal information and policies
              </Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-purple-600 py-4"
          >
            <Icon as={LogOut} size={20} className="text-white" />
            <Text className="text-lg font-semibold text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
