import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, Coins, ArrowDownUp, Info, ChevronDown, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner-native';
import { api } from '@/lib/api';

const tokens = [
  { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'bg-purple-600' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', color: 'bg-blue-600' },
  { symbol: 'BONK', name: 'Bonk', icon: '🐕', color: 'bg-orange-600' },
  { symbol: 'WIF', name: 'Dogwifhat', icon: '🐶', color: 'bg-pink-600' },
];

export default function SwapScreen() {
  const { balance } = useWallet();
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [toAmount, setToAmount] = useState('0');
  const [rate, setRate] = useState(0);
  const [priceImpact, setPriceImpact] = useState('0');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadTokenPrices();
  }, []);

  useEffect(() => {
    // Debounce the calculation
    const timer = setTimeout(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        calculateSwapQuote();
      } else {
        setToAmount('0');
        setRate(0);
        setPriceImpact('0');
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken]);

  const loadTokenPrices = async () => {
    try {
      const response = await api.getTokenPrices();
      if (response.data) {
        setTokenPrices(response.data as any);
      }
    } catch (error) {
      console.error('Failed to load token prices:', error);
      toast.error('Failed to load token prices');
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const calculateSwapQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setIsCalculating(true);
    try {
      const response = await api.swapTokens(
        fromToken.symbol,
        toToken.symbol,
        parseFloat(fromAmount)
      );

      if (response.data) {
        const data = response.data as any;
        setToAmount(data.toAmount.toFixed(6));
        setRate(data.rate);
        setPriceImpact(data.priceImpact || '0');
      }
    } catch (error) {
      console.error('Failed to get quote:', error);
      setToAmount('0');
      setRate(0);
      setPriceImpact('0');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    if (fromToken.symbol === toToken.symbol) {
      toast.error('Cannot swap same token');
      return;
    }

    if (fromToken.symbol === 'SOL' && parseFloat(fromAmount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSwapping(true);
    
    try {
      const response = await api.swapTokens(
        fromToken.symbol,
        toToken.symbol,
        parseFloat(fromAmount)
      );

      if (response.error) {
        toast.error(response.error);
        setIsSwapping(false);
        return;
      }

      const { toAmount: receivedAmount } = response.data as any;
      toast.success(`Swapped ${fromAmount} ${fromToken.symbol} for ${receivedAmount.toFixed(6)} ${toToken.symbol}`);
      setFromAmount('');
      setIsSwapping(false);
    } catch (error) {
      toast.error('Swap failed. Please try again.');
      setIsSwapping(false);
    }
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
  };

  const selectFromToken = (token: typeof tokens[0]) => {
    if (token.symbol === toToken.symbol) {
      // If selecting the same as toToken, swap them
      setToToken(fromToken);
    }
    setFromToken(token);
    setShowFromModal(false);
    setFromAmount('');
  };

  const selectToToken = (token: typeof tokens[0]) => {
    if (token.symbol === fromToken.symbol) {
      // If selecting the same as fromToken, swap them
      setFromToken(toToken);
    }
    setToToken(token);
    setShowToModal(false);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-blue-600 px-4 pb-8 pt-12">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={ArrowLeft} size={24} className="text-white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">Token Swap</Text>
          </View>

          <View className="mt-6 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Icon as={Coins} size={40} className="text-white" />
            </View>
            <Text className="mt-3 text-center text-sm text-white/90">
              Swap tokens instantly on Solana
            </Text>
          </View>
        </View>

        {/* Swap Card */}
        <View className="mx-4 mt-6">
          {/* From Token */}
          <View className="rounded-2xl bg-card p-4">
            <Text className="text-sm text-muted-foreground">From</Text>
            <View className="mt-2 flex-row items-center justify-between">
              <TextInput
                value={fromAmount}
                onChangeText={setFromAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className="flex-1 text-3xl font-bold text-foreground"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => setShowFromModal(true)}
                className={`ml-3 flex-row items-center gap-2 rounded-xl ${fromToken.color} px-4 py-2`}
              >
                <Text className="text-2xl">{fromToken.icon}</Text>
                <Text className="font-semibold text-white">{fromToken.symbol}</Text>
                <Icon as={ChevronDown} size={16} className="text-white" />
              </TouchableOpacity>
            </View>
            {fromToken.symbol === 'SOL' && (
              <Text className="mt-2 text-sm text-muted-foreground">
                Balance: {balance.toFixed(4)} SOL
              </Text>
            )}
          </View>

          {/* Switch Button */}
          <View className="my-4 items-center">
            <TouchableOpacity
              onPress={switchTokens}
              className="h-12 w-12 items-center justify-center rounded-full bg-purple-600"
            >
              <Icon as={ArrowDownUp} size={24} className="text-white" />
            </TouchableOpacity>
          </View>

          {/* To Token */}
          <View className="rounded-2xl bg-card p-4">
            <Text className="text-sm text-muted-foreground">To (estimated)</Text>
            <View className="mt-2 flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-2">
                {isCalculating ? (
                  <ActivityIndicator size="small" color="#9333ea" />
                ) : (
                  <Text className="text-3xl font-bold">{toAmount}</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setShowToModal(true)}
                className={`ml-3 flex-row items-center gap-2 rounded-xl ${toToken.color} px-4 py-2`}
              >
                <Text className="text-2xl">{toToken.icon}</Text>
                <Text className="font-semibold text-white">{toToken.symbol}</Text>
                <Icon as={ChevronDown} size={16} className="text-white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Exchange Rate */}
          <View className="mt-4 rounded-xl bg-purple-50 dark:bg-purple-950 p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Icon as={Info} size={16} className="text-purple-600" />
                <Text className="text-sm text-purple-700 dark:text-purple-300">
                  Rate: 1 {fromToken.symbol} ≈ {rate.toFixed(6)} {toToken.symbol}
                </Text>
              </View>
              <TouchableOpacity onPress={loadTokenPrices}>
                <Icon as={RefreshCw} size={16} className="text-purple-600" />
              </TouchableOpacity>
            </View>
            {parseFloat(priceImpact) > 0 && (
              <Text className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                Price Impact: {parseFloat(priceImpact).toFixed(2)}%
              </Text>
            )}
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            onPress={handleSwap}
            disabled={isSwapping || !fromAmount}
            className={`mt-6 items-center rounded-xl py-4 ${
              isSwapping || !fromAmount ? 'bg-gray-300' : 'bg-purple-600'
            }`}
          >
            {isSwapping ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-semibold text-white">
                {fromAmount ? 'Swap Tokens' : 'Enter Amount'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Token List */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">Available Tokens</Text>
            {isLoadingPrices && <ActivityIndicator size="small" color="#9333ea" />}
          </View>
          <View className="mt-3 gap-2">
            {tokens.map((token) => (
              <View key={token.symbol} className="flex-row items-center justify-between rounded-xl bg-card p-4">
                <View className="flex-row items-center gap-3">
                  <View className={`h-10 w-10 items-center justify-center rounded-full ${token.color}`}>
                    <Text className="text-2xl">{token.icon}</Text>
                  </View>
                  <View>
                    <Text className="font-semibold">{token.symbol}</Text>
                    <Text className="text-sm text-muted-foreground">{token.name}</Text>
                  </View>
                </View>
                <View className="items-end">
                  {tokenPrices[token.symbol] ? (
                    <>
                      <Text className="font-semibold">${tokenPrices[token.symbol].toFixed(4)}</Text>
                      <Text className="text-xs text-muted-foreground">per token</Text>
                    </>
                  ) : (
                    <Text className="text-sm text-muted-foreground">Loading...</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>

      {/* From Token Modal */}
      <Modal
        visible={showFromModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFromModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowFromModal(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="rounded-t-3xl bg-background pb-8">
            <View className="items-center py-4">
              <View className="h-1 w-12 rounded-full bg-gray-300" />
            </View>
            <Text className="px-6 text-xl font-bold">Select Token</Text>
            <View className="mt-4 gap-2 px-6">
              {tokens.map((token) => (
                <TouchableOpacity
                  key={token.symbol}
                  onPress={() => selectFromToken(token)}
                  className={`flex-row items-center gap-3 rounded-xl p-4 ${
                    token.symbol === fromToken.symbol ? 'bg-purple-100 dark:bg-purple-900' : 'bg-card'
                  }`}
                >
                  <View className={`h-12 w-12 items-center justify-center rounded-full ${token.color}`}>
                    <Text className="text-3xl">{token.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold">{token.symbol}</Text>
                    <Text className="text-sm text-muted-foreground">{token.name}</Text>
                  </View>
                  {token.symbol === fromToken.symbol && (
                    <Icon as={Coins} size={20} className="text-purple-600" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* To Token Modal */}
      <Modal
        visible={showToModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowToModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowToModal(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="rounded-t-3xl bg-background pb-8">
            <View className="items-center py-4">
              <View className="h-1 w-12 rounded-full bg-gray-300" />
            </View>
            <Text className="px-6 text-xl font-bold">Select Token</Text>
            <View className="mt-4 gap-2 px-6">
              {tokens.map((token) => (
                <TouchableOpacity
                  key={token.symbol}
                  onPress={() => selectToToken(token)}
                  className={`flex-row items-center gap-3 rounded-xl p-4 ${
                    token.symbol === toToken.symbol ? 'bg-purple-100 dark:bg-purple-900' : 'bg-card'
                  }`}
                >
                  <View className={`h-12 w-12 items-center justify-center rounded-full ${token.color}`}>
                    <Text className="text-3xl">{token.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold">{token.symbol}</Text>
                    <Text className="text-sm text-muted-foreground">{token.name}</Text>
                  </View>
                  {token.symbol === toToken.symbol && (
                    <Icon as={Coins} size={20} className="text-purple-600" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
