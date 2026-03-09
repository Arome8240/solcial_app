import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function EmailScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  
  const { signup, isSigningUp } = useAuth();

  const handleContinue = () => {
    signup({ email, password, username });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 px-5 pt-16">
        <Text className="mb-3 text-3xl font-bold text-gray-900">Enter Your Email</Text>
        <Text className="mb-8 text-base leading-relaxed text-gray-500">
          This email will be used to recover your social account if you lose access.
        </Text>

        <View className="gap-4">
          <Input
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            label="Email"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <View className="px-5 pb-12">
        <Button
          onPress={handleContinue}
          disabled={isSigningUp}
          className="h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
        >
          {isSigningUp ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-medium text-white">Create Account</Text>
          )}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
