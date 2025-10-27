import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaUser, 
  FaRobot,
  FaEllipsisH,
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaRegClock,
  FaCheckDouble
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial bot message
  const initialBotMessage = {
    id: 1,
    text: "Hello! 👋 I'm your BlogHub assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
    quickReplies: [
      "How to write a blog?",
      "Account settings help",
      "Technical issues",
      "Other questions"
    ]
  };

  // Sample responses based on user queries
  const botResponses = {
    "hello": "Hi there! 😊 Welcome to BlogHub support. What can I help you with today?",
    "hi": "Hello! 👋 How can I assist you with your blogging journey?",
    "how to write a blog": "Great question! 📝 Here's how to write your first blog:\n\n1. Click 'Write Blog' in your dashboard\n2. Add a compelling title\n3. Write your content using our rich editor\n4. Add images and format text\n5. Choose relevant tags\n6. Preview and publish!\n\nNeed more specific help?",
    "account settings": "To manage your account settings:\n\n⚙️ Click your profile picture → Settings\n🔒 Change password in Security section\n📧 Update email in Account info\n🎨 Customize profile in Appearance\n\nWhich setting do you need help with?",
    "technical issues": "Sorry you're experiencing issues! 🔧\n\nPlease try:\n1. Refresh the page\n2. Clear browser cache\n3. Check your internet connection\n4. Try a different browser\n\nIf problems continue, describe the issue and we'll help!",
    "default": "I understand you're asking about that. Let me connect you with a human specialist who can provide more detailed assistance. In the meantime, is there anything else I can help with?",
    "help": "I'm here to help! 🤗 You can ask me about:\n\n• Writing and formatting blogs\n• Account and profile settings\n• Technical troubleshooting\n• Community features\n• Privacy and security\n\nWhat would you like to know?"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !chatStarted) {
      // Add welcome message when chat opens
      setTimeout(() => {
        setMessages([initialBotMessage]);
        setChatStarted(true);
      }, 500);
    }
  }, [isOpen, chatStarted]);

  const handleQuickReply = (reply) => {
    // Add user's quick reply as a message
    const userMessage = {
      id: messages.length + 1,
      text: reply,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Generate bot response based on quick reply
    setTimeout(() => {
      let responseText = botResponses.default;
      const lowerReply = reply.toLowerCase();
      
      if (lowerReply.includes("write") || lowerReply.includes("blog")) {
        responseText = botResponses["how to write a blog"];
      } else if (lowerReply.includes("account")) {
        responseText = botResponses["account settings"];
      } else if (lowerReply.includes("technical") || lowerReply.includes("issue")) {
        responseText = botResponses["technical issues"];
      } else if (lowerReply.includes("hello") || lowerReply.includes("hi")) {
        responseText = botResponses["hello"];
      } else if (lowerReply.includes("help")) {
        responseText = botResponses["help"];
      }
      
      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Generate bot response
    setTimeout(() => {
      let responseText = botResponses.default;
      const lowerMessage = newMessage.toLowerCase();
      
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        responseText = botResponses["hello"];
      } else if (lowerMessage.includes("write") || lowerMessage.includes("blog")) {
        responseText = botResponses["how to write a blog"];
      } else if (lowerMessage.includes("account")) {
        responseText = botResponses["account settings"];
      } else if (lowerMessage.includes("technical") || lowerMessage.includes("issue")) {
        responseText = botResponses["technical issues"];
      } else if (lowerMessage.includes("help")) {
        responseText = botResponses["help"];
      }
      
      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all duration-300 flex items-center justify-center group"
      >
        <FaComments className="text-xl text-white" />
        
        {/* Notification dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
        />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-gray-700">
          Live Chat Support
          <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <FaComments className="text-amber-500 text-lg" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">BlogHub Support</h3>
                  <p className="text-amber-100 text-xs">Online • Ready to help</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-amber-200 transition-colors duration-200"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>

            {/* Chat Messages */}
            <div className="h-[340px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" 
                        ? "bg-amber-500" 
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}>
                      {message.sender === "user" ? (
                        <FaUser className="text-white text-xs" />
                      ) : (
                        <FaRobot className="text-white text-xs" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="space-y-1">
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-amber-500 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-600"
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`flex items-center gap-1 text-xs ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      } text-gray-500 dark:text-gray-400`}>
                        <FaRegClock className="text-xs" />
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === "user" && (
                          <FaCheckDouble className="text-amber-500 text-xs" />
                        )}
                      </div>

                      {/* Quick Replies */}
                      {message.sender === "bot" && message.quickReplies && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.quickReplies.map((reply, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuickReply(reply)}
                              className="px-3 py-2 bg-white dark:bg-gray-600 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200"
                            >
                              {reply}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FaRobot className="text-white text-xs" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-all duration-300 pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-amber-500 transition-colors duration-200">
                      <FaSmile />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-amber-500 transition-colors duration-200">
                      <FaPaperclip />
                    </button>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    newMessage.trim()
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <IoMdSend className="text-lg" />
                </motion.button>
              </form>

              {/* Quick Actions */}
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 hover:text-amber-500 transition-colors duration-200">
                    <FaThumbsUp />
                    <span>Helpful</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-amber-500 transition-colors duration-200">
                    <FaThumbsDown />
                    <span>Not helpful</span>
                  </button>
                </div>
                
                <button className="flex items-center gap-1 hover:text-amber-500 transition-colors duration-200">
                  <FaStar />
                  <span>Rate chat</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;