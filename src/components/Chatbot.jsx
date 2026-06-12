import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m the Biovance assistant. How can I help you learn about our AI-powered conservation work?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Predefined Q&A database
  const qaDatabase = {
    // Company basics
    'what is biovance': 'Biovance is a conservation-driven organization pioneering data-based environmental restoration. We combine AI, secure data infrastructure, and global collaboration to protect ecosystems and restore biodiversity.',
    'what do you do': 'We use AI-powered research and data-driven approaches to restore ecosystems, protect biodiversity, and enable smarter conservation decisions worldwide.',
    'what is your mission': 'Our mission is to protect and restore ecosystems through AI-powered conservation research, starting in Arizona and expanding globally.',

    // AI and technology
    'how does ai help conservation': 'AI helps us analyze vast amounts of ecological data, predict environmental changes, identify restoration opportunities, and make data-driven conservation decisions faster and more accurately.',
    'what technology do you use': 'We use advanced AI algorithms, secure data infrastructure, and collaborative platforms to enable researchers and conservationists to share insights while protecting sensitive ecological information.',

    // Projects and work
    'what projects are you working on': 'We focus on ecological restoration projects, biodiversity conservation, AI-powered environmental monitoring, and collaborative research initiatives across Arizona and beyond.',
    'where do you work': 'We\'re headquartered in Arizona and work on conservation projects globally, with a focus on data-driven environmental restoration and biodiversity protection.',

    // Getting involved
    'how can i get involved': 'You can join our research community, participate in conservation projects, or collaborate on AI-powered environmental initiatives. Visit our contact page to learn more.',
    'do you offer partnerships': 'Yes! We welcome partnerships with researchers, organizations, and conservationists. We collaborate on shared data and open scientific frameworks.',
    'how can i partner with you': 'We partner with research institutions, conservation organizations, and technology companies. Contact us at boivance0@gmail.com to discuss partnership opportunities.',

    // Contact information
    'how can i contact you': 'You can reach us through our contact form, email us at boivance0@gmail.com, or join our research community through the waitlist.',
    'what is your email': 'Our main contact email is boivance0@gmail.com. You can also use the contact form on our website.',
    'where are you located': 'We\'re based in Arizona with a global reach, working on conservation projects worldwide.',

    // Research and data
    'do you share research': 'Yes, we share research findings, conservation insights, and collaborate on open scientific frameworks while maintaining data security and privacy.',
    'what kind of data do you work with': 'We work with ecological data, biodiversity information, environmental monitoring data, and conservation research datasets, always prioritizing data security and privacy.',

    // General conservation
    'why is conservation important': 'Conservation is crucial for maintaining biodiversity, ecosystem services, and the health of our planet. Every species and ecosystem plays a vital role in the web of life.',
    'what is biodiversity': 'Biodiversity refers to the variety of life on Earth, including different species, ecosystems, and genetic diversity. We work to protect and restore this biodiversity through AI-powered approaches.'
  }

  // Function to find best matching answer
  const findAnswer = (question) => {
    const lowerQuestion = question.toLowerCase().trim()

    // Direct matches
    if (qaDatabase[lowerQuestion]) {
      return qaDatabase[lowerQuestion]
    }

    // Keyword matching
    for (const [key, answer] of Object.entries(qaDatabase)) {
      const keywords = key.split(' ')
      const questionWords = lowerQuestion.split(' ')

      // Check if question contains key keywords
      const matches = keywords.filter(keyword =>
        questionWords.some(qWord => qWord.includes(keyword) || keyword.includes(qWord))
      )

      if (matches.length >= Math.min(2, keywords.length)) {
        return answer
      }
    }

    // Fallback response
    return null
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(inputValue)

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: answer || "I don't have specific information about that topic yet. Please contact us at boivance0@gmail.com or use our contact form for detailed inquiries about our conservation work.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isOpen])

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-2xl z-50 hover:shadow-green-500/25 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Biovance Assistant</h3>
                <p className="text-green-100 text-sm">AI-powered conservation expert</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-green-600" />
                    </div>
                  )}

                  <div className={`max-w-[280px] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-1 block ${
                      message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="px-4 pb-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600 font-medium">Try asking:</p>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title={showSuggestions ? "Hide suggestions" : "Show suggestions"}
                >
                  {showSuggestions ? "↑" : "↓"}
                </button>
              </div>
              {showSuggestions && (
                <div className="flex flex-wrap gap-1">
                  {[
                    "What is Biovance?",
                    "How does AI help conservation?",
                    "What projects do you work on?",
                    "How can I get involved?",
                    "Do you offer partnerships?"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded-full transition-colors border border-green-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about our conservation work..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ask about our AI conservation work, partnerships, or contact us for detailed inquiries.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot