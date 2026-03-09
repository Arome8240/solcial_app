import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const { signin, isSigningIn } = useAuth();

  const handleSignIn = () => {
    signin({ email, password });
  };

  const handleSignUp = () => {
    router.push('/auth/email');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-5 pt-16">
        <Text className="mb-2 text-3xl font-bold text-foreground">Welcome Back!</Text>
        <Text className="mb-12 text-base text-foreground">Sign In into your account</Text>

        <View className="gap-6">
          <Input 
            label="Email" 
            placeholder="john@example.com" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View>
            <Input
              label="Password"
              placeholder="**********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable className="mt-3">
              <Text className="text-sm font-medium text-purple-600">Forgot Password?</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="px-5 pb-12">
        <Button
          onPress={handleSignIn}
          disabled={isSigningIn}
          className="mb-6 h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
        >
          {isSigningIn ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-medium text-white">Sign In</Text>
          )}
        </Button>

        <View className="flex-row justify-center">
          <Text className="text-sm text-muted-foreground">Don't have an account? </Text>
          <Pressable onPress={handleSignUp}>
            <Text className="text-sm font-medium text-purple-600">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
