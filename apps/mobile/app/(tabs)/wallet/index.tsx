import { View, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowUpRight, ArrowDownLeft, PieChart, Coins, TrendingUp, TrendingDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { useWallet } from '@/hooks/useWallet';
import { useTokenHoldings } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import type { Transaction, User } from '@/types';

export default function WalletScreen() {
  const { balance, walletAddress, isLoadingBalance, refetchBalance, transactions, isLoadingTransactions, fetchNextPage, hasNextPage, isFetchingNextPage } = useWallet();
  const { user } = useAuth();
  const userId = (user as User)?.id || '';
  const { holdings, totalValue, isLoading: isLoadingHoldings, refetch: refetchHoldings } = useTokenHoldings(userId);

  // Approximate SOL price in USD (you can fetch this from an API later)
  const SOL_PRICE_USD = 100;
  
  // Calculate total balance in USD
  const totalBalanceUSD = (balance + totalValue) * SOL_PRICE_USD;
  
  // Get only first 5 transactions for recent activity
  const recentTransactions = transactions.slice(0, 5);

  const handleRefresh = async () => {
    await Promise.all([refetchBalance(), refetchHoldings()]);
  };

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoadingBalance} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-purple-600 px-4 pb-8 pt-12">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-white">Wallet</Text>
            <TouchableOpacity>
              <Icon as={PieChart} size={24} className="text-white" />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View className="mt-6 items-center">
            <Text className="text-sm text-purple-200">Total Balance</Text>
            {isLoadingBalance ? (
              <ActivityIndicator size="large" color="#ffffff" className="mt-2" />
            ) : (
              <>
                <Text className="mt-2 text-5xl font-bold text-white">${totalBalanceUSD.toFixed(2)}</Text>
                <Text className="mt-1 text-lg text-purple-200">{(balance + totalValue).toFixed(4)} SOL</Text>
                <Text className="mt-1 text-sm text-purple-200">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</Text>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/wallet/send')}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-white py-4"
            >
              <Icon as={ArrowUpRight} size={20} className="text-purple-600" />
              <Text className="font-semibold text-purple-600">Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/wallet/receive')}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-purple-700 py-4"
            >
              <Icon as={ArrowDownLeft} size={20} className="text-white" />
              <Text className="font-semibold text-white">Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Assets */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold">Your Assets</Text>
          </View>

          <View className="mt-4 gap-3">
            <View className="flex-row items-center justify-between rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-600">
                  <Text className="text-xl font-bold text-white">S</Text>
                </View>
                <View>
                  <Text className="font-semibold">Solana</Text>
                  <Text className="text-sm text-muted-foreground">{balance.toFixed(4)} SOL</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="font-semibold">Devnet</Text>
              </View>
            </View>

            {/* Token Holdings */}
            {isLoadingHoldings ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color="#9333ea" />
              </View>
            ) : holdings.length > 0 ? (
              <>
                <View className="mt-2">
                  <Text className="text-sm font-semibold text-muted-foreground">Post Tokens</Text>
                </View>
                {holdings.map((holding) => (
                  <TouchableOpacity
                    key={holding.id}
                    onPress={() => router.push(`/post/${holding.post.id}`)}
                    className="flex-row items-center gap-3 rounded-2xl bg-card p-4"
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Icon as={Coins} size={20} className="text-purple-600" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="font-semibold" numberOfLines={1}>
                        {holding.post.content.slice(0, 30)}...
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {holding.amount} tokens
                      </Text>
                    </View>
                    <View className="items-end ml-2">
                      <Text className="font-semibold">
                        {holding.currentValue.toFixed(4)} SOL
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Icon 
                          as={holding.profitLoss >= 0 ? TrendingUp : TrendingDown} 
                          size={12} 
                          className={holding.profitLoss >= 0 ? "text-green-600" : "text-red-600"}
                        />
                        <Text className={`text-xs ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.profitLossPercentage >= 0 ? '+' : ''}{holding.profitLossPercentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                <View className="mt-2 rounded-2xl bg-purple-50 p-4">
                  <Text className="text-center text-sm text-purple-700">
                    Total Token Value: {totalValue.toFixed(4)} SOL
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mt-6 px-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold">Recent Activity</Text>
            {transactions.length > 5 && (
              <TouchableOpacity onPress={() => router.push('/wallet/transactions')}>
                <Text className="text-sm font-semibold text-purple-600">View All</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-4">
            {isLoadingTransactions && recentTransactions.length === 0 ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color="#9333ea" />
              </View>
            ) : recentTransactions.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-muted-foreground">No transactions yet</Text>
              </View>
            ) : (
              recentTransactions.map((tx: Transaction) => (
                <TouchableOpacity
                  key={tx.signature}
                  onPress={() => router.push(`/transaction/${tx.signature}`)}
                  className="mb-3 flex-row items-center justify-between rounded-2xl bg-card p-4"
                >
                  <View className="flex-row items-center gap-3">
                    <View className={`h-12 w-12 items-center justify-center rounded-full ${tx.type === 'receive' ? 'bg-green-100' : 'bg-purple-100'}`}>
                      <Icon 
                        as={tx.type === 'receive' ? ArrowDownLeft : ArrowUpRight} 
                        size={20} 
                        className={tx.type === 'receive' ? 'text-green-600' : 'text-purple-600'}
                      />
                    </View>
                    <View>
                      <Text className="font-semibold">
                        {tx.type === 'receive' ? 'Received' : tx.type === 'send' ? 'Sent' : 'Airdrop'}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {tx.blockTime ? formatTime(tx.blockTime) : 'Pending'}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className={`font-semibold ${tx.type === 'receive' ? 'text-green-600' : 'text-foreground'}`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(4)} SOL
                    </Text>
                    <Text className="text-sm text-muted-foreground capitalize">{tx.status}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
