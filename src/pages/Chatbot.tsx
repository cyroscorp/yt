import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [responseIndex, setResponseIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Array of predefined bot responses with a clickable link
  const botResponses: string[] = [
    "Hmm, but let me tell you it's not AI powered. We need a Python developer; if you know, tell me.",
    "Please share the contact details on WhatsApp: 8076008591.",
    "By the way, my name is Arjun and I am single 😥.",
    'To know more about me, visit <a href="https://portfolioakd.vercel.app" target="_blank" style="color: green; text-decoration: underline;">Portfolio</a>',
  ];

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user's message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Determine the bot response based on the current index
    const botMessage: Message = {
      id: Date.now() + 1,
      text: botResponses[responseIndex % botResponses.length],
      isUser: false,
    };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Increment the response index to provide the next response in order
    setResponseIndex((prevIndex) => prevIndex + 1);

    // Clear input field
    setInput('');
  };

  // Scroll to the bottom of the message list whenever new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 left-4">
      {/* Chat Icon/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 text-black p-3 rounded-full shadow-lg hover:bg-green-600 focus:outline-none"
      >
        {isOpen ? 'Close 🤖' : '🤖'}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="max-w-md w-80 p-4 mt-2 bg-black rounded-lg shadow-md">
          <div className="h-64 overflow-y-auto mb-4 bg-black p-3 rounded-md shadow-inner">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg ${
                  message.isUser
                    ? 'bg-green-500 text-black text-right'
                    : 'bg-gray-300 text-black text-left'
                }`}
              >
                {/* Render bot messages with HTML */}
                {message.isUser ? (
                  message.text
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: message.text }} />
                )}
              </div>
            ))}
            {/* Reference element to scroll into view */}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring focus:border-green-300"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="p-2 bg-green-500 text-black rounded-r-lg hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
