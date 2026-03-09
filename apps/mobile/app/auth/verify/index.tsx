import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';
import { toast } from 'sonner-native';

export default function VerifyScreen() {
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const inputRefs = React.useRef<(TextInput | null)[]>([]);
  
  const { verifyEmail, isVerifying, resendCode, isResending } = useAuth();

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete code');
      return;
    }

    const user = await storage.getUser();
    if (!user?.tempEmail) {
      toast.error('Email not found. Please sign up again');
      router.replace('/auth/email');
      return;
    }

    verifyEmail({ email: user.tempEmail, code: verificationCode });
  };

  const handleResend = async () => {
    const user = await storage.getUser();
    if (!user?.tempEmail) {
      toast.error('Email not found');
      return;
    }

    resendCode(user.tempEmail);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background px-5 pt-16">
      <Text className="mb-3 text-3xl font-bold text-foreground">Verify Your Account</Text>
      <Text className="mb-12 text-base leading-relaxed text-muted-foreground">
        A six-digit code was sent to your email, enter it below to confirm your account.
      </Text>

      <View className="mb-auto flex-row justify-center gap-2">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={1}
            className={`h-14 w-12 rounded-xl bg-card text-center text-lg font-semibold text-foreground border-2 ${
              focusedIndex === index ? 'border-purple-600' : 'border-transparent'
            }`}
            placeholder="0"
            placeholderTextColor="#d1d5db"
            autoFocus={index === 0}
          />
        ))}
      </View>

      <View className="pb-12">
        <Button
          onPress={handleVerify}
          disabled={isVerifying}
          className="mb-4 h-14 rounded-2xl bg-purple-600 active:bg-purple-700"
        >
          {isVerifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-medium text-white">Verify</Text>
          )}
        </Button>

        <Pressable onPress={handleResend} disabled={isResending}>
          <Text className="mb-4 text-center text-base font-medium text-purple-600">
            {isResending ? 'Sending...' : 'Resend Code'}
          </Text>
        </Pressable>

        <Pressable onPress={handleBack}>
          <Text className="text-center text-base font-medium text-muted-foreground">Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
