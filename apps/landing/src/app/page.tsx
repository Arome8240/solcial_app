'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, Coins, Shield, MessageCircle, Wallet, Gift, 
  Gamepad2, UtensilsCrossed, TrendingUp, Users, 
  ArrowRight, Sparkles, Check
} from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'
import Logo from '@/components/Logo'

const features = [
  {
    icon: Coins,
    title: 'Tokenize Your Posts',
    description: 'Every post becomes a tradeable token. Your followers invest in your content, you earn as it gains value.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Zap,
    title: 'Instant SOL Payments',
    description: 'Send and receive payments in seconds. Built-in wallet with lightning-fast Solana transactions.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Shield,
    title: 'True Ownership',
    description: 'Your data, your wallet, your rules. No platform can ban you, censor you, or take your earnings.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: MessageCircle,
    title: 'Real-time Messaging',
    description: 'Chat with friends and send crypto tips instantly. Secure, fast, and decentralized.',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: TrendingUp,
    title: 'Creator Economy',
    description: 'Trade creator tokens like stocks. Early supporters earn as creators grow.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Follow, like, comment, and engage. Familiar social features with crypto rewards.',
    color: 'bg-indigo-100 text-indigo-600'
  }
]

const miniApps = [
  { icon: '💱', name: 'Token Swap', desc: 'Swap SOL for tokens instantly' },
  { icon: '🍕', name: 'Food Delivery', desc: 'Order food, pay with crypto' },
  { icon: '🎲', name: 'Dice Game', desc: 'Roll and win SOL rewards' },
  { icon: '🪙', name: 'Coin Flip', desc: 'Double your bet instantly' },
  { icon: '🎰', name: 'Lucky Spin', desc: 'Spin the wheel for big wins' },
  { icon: '🎁', name: 'Daily Airdrop', desc: 'Claim free SOL every day' }
]

const stats = [
  { value: '$0', label: 'Platform Fees' },
  { value: '<1s', label: 'Transaction Speed' },
  { value: '100%', label: 'You Own Your Data' },
  { value: '24/7', label: 'Always Available' }
]

export default function Home() {
  const [email, setEmail] = useState('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <Logo size={96} />
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
          >
            Social Media That<br/>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Pays You
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto"
          >
            Own your content. Own your earnings. Every post becomes a tradeable token on Solana blockchain.
          </motion.p>

          {/* Waitlist Form */}
          <motion.div variants={itemVariants}>
            <WaitlistForm />
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 text-purple-200 mt-8"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Built on Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Secure & Decentralized</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Lightning Fast</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why <span className="gradient-text">Solcial</span>?
            </h2>
            <p className="text-xl text-gray-600">
              The first social platform where creators truly own their success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-gray-50 rounded-3xl p-8 hover:shadow-2xl transition-shadow"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Apps Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              More Than Just <span className="gradient-text">Social</span>
            </h2>
            <p className="text-xl text-gray-600">
              Explore mini-apps built right into the platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
              >
                <div className="text-5xl mb-4">{app.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-gray-600">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Create Content', desc: 'Post photos, videos, or thoughts just like any social platform' },
              { step: '2', title: 'Tokenize & Trade', desc: 'Your posts become tokens that followers can buy and trade' },
              { step: '3', title: 'Earn SOL', desc: 'Get paid directly as your content gains traction and value' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className="text-5xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-purple-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Features Showcase */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in <span className="gradient-text">One App</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                {[
                  'Create and share posts, photos, videos',
                  'Like, comment, and engage with community',
                  'Follow creators and build your network',
                  'Buy and sell creator tokens',
                  'Send instant crypto payments',
                  'Play games and win rewards',
                  'Order food with crypto',
                  'Track your portfolio and earnings'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white rounded-3xl shadow-2xl p-8"
              >
                <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Logo size={120} />
                    <p className="mt-4 text-gray-600 font-semibold">Mobile App Preview</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Own Your <span className="gradient-text">Social Future</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join the waitlist and be among the first to experience social media that actually rewards creators.
          </p>

          <WaitlistForm />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-gray-500"
          >
            <Shield className="w-5 h-5" />
            <span className="text-sm">We respect your privacy. No spam, ever.</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size={48} className="mb-4" />
              <p className="text-sm">
                Social media powered by Solana blockchain. Own your content, own your earnings.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#mini-apps" className="hover:text-white transition">Mini Apps</a></li>
                <li><a href="#" className="hover:text-white transition">Tokenomics</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
                <li><a href="#" className="hover:text-white transition">Telegram</a></li>
                <li><a href="mailto:team@solcial.app" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 Solcial. All rights reserved. Proprietary software.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">License</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
