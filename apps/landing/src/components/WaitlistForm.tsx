'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [count, setCount] = useState(1247)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await axios.post('YOUR_API_URL/waitlist', { email })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSuccess(true)
      setEmail('')
      setCount(prev => prev + 1)

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading || isSuccess}
            className="flex-1 px-6 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || isSuccess}
            className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-2xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Joined!</span>
              </>
            ) : (
              'Join Waitlist'
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-300 font-semibold text-center"
            >
              🎉 You're on the list! We'll notify you at launch.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-300 font-semibold text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-200 text-sm text-center"
        >
          🚀 Join <motion.span
            key={count}
            initial={{ scale: 1.5, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#e9d5ff' }}
            transition={{ duration: 0.3 }}
            className="font-bold"
          >
            {count.toLocaleString()}
          </motion.span> early adopters
        </motion.p>
      </form>
    </div>
  )
}
