import React, { useState, useEffect, useRef } from 'react';

const ChatWidget = ({ 
    webhookUrl = 'https://lavashow-chat-2024.vercel.app/chat',
    apiKey, 
    language = 'en'
}) => {
    const messagesEndRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState([{
        type: 'bot',
        content: "Hello! I'm Sóley, your AI customer service assistant. I can handle inquiries, bookings, and support 24/7 in multiple languages. How can I assist you today?"
    }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [showTimeButtons, setShowTimeButtons] = useState(false);
    const [timeOptions, setTimeOptions] = useState([]);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    
    // Initialize session ID on component mount
    useEffect(() => {
        setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
    }, []);

    // Add window resize listener for responsive design
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const TypingIndicator = () => (
        <div className="flex justify-start mb-4 items-start gap-3">
            <div className="w-8 h-8 rounded-full mt-1 bg-gradient-to-r from-[#10B981] to-[#F97316] flex items-center justify-center text-white text-sm font-semibold shadow-md">
                S
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/20 flex gap-1 items-center">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
            </div>
        </div>
    );

    const TimeButton = ({ time, text, onClick }) => (
        <button
            onClick={onClick}
            className="bg-gradient-to-r from-[#10B981] to-[#F97316] text-white border-none px-5 py-3 rounded-full cursor-pointer text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg min-w-[120px]"
        >
            {text}
        </button>
    );

    const handleSend = async (messageToSend = null) => {
        const messageText = messageToSend || inputValue.trim();
        if (!messageText || isTyping) return;

        setInputValue('');
        setShowTimeButtons(false);

        setMessages(prev => [...prev, {
            type: 'user',
            content: messageText
        }]);
        
        setIsTyping(true);

        try {
            console.log('Sending to:', webhookUrl);
            console.log('Message:', messageText);
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || process.env.REACT_APP_API_KEY || 'your-api-key-here'
                },
                body: JSON.stringify({ 
                    message: messageText,
                    language: language,
                    sessionId: sessionId
                })
            });   

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            setIsTyping(false);
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.message
            }]);

            if (data.showTimeButtons && data.timeOptions) {
                setShowTimeButtons(true);
                setTimeOptions(data.timeOptions);
            }

        } catch (error) {
            console.error('Connection error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I apologize, but I'm experiencing technical difficulties right now. Please try again shortly."
            }]);
        }
    };

    const handleTimeSelection = (timeOption) => {
        handleSend(timeOption.text);
    };

    const MessageFormatter = ({ message }) => {
        return <div className="whitespace-pre-wrap">{message}</div>;
    };

    return (
        <>
            <style jsx>{`
                @keyframes typingAnimation {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #10B981;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 1px;
                    animation: typingAnimation 1.4s infinite;
                }
                
                .typing-dot:nth-child(1) { animation-delay: 0s; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
            `}</style>
            
            <div 
                className={`fixed bottom-5 right-5 transition-all duration-300 ease-out z-50 ${
                    isMinimized 
                        ? `w-${windowWidth <= 768 ? '16' : '18'} h-${windowWidth <= 768 ? '16' : '18'} rounded-full` 
                        : 'w-96 max-w-[90vw] bg-white/60 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl'
                }`}
                style={{
                    maxHeight: isMinimized ? 'auto' : 'calc(100vh - 40px)',
                    transformOrigin: 'bottom right'
                }}
            >
                {/* Header */}
                <div 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className={`cursor-pointer transition-all duration-300 ${
                        isMinimized 
                            ? 'w-full h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#F97316] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105' 
                            : 'p-5 bg-white/40 backdrop-blur-sm border-b border-white/20 rounded-t-2xl flex flex-col items-center gap-2'
                    }`}
                >
                    <div 
                        className={`rounded-full bg-gradient-to-r from-[#10B981] to-[#F97316] flex items-center justify-center text-white font-bold ${
                            isMinimized 
                                ? `w-${windowWidth <= 768 ? '10' : '12'} h-${windowWidth <= 768 ? '10' : '12'} text-${windowWidth <= 768 ? 'lg' : 'xl'}` 
                                : 'w-14 h-14 text-xl shadow-md'
                        }`}
                    >
                        S
                    </div>
                    {!isMinimized && (
                        <>
                            <div className="text-center">
                                <div className="text-gray-800 text-lg font-semibold">
                                    Sóley
                                </div>
                                <div className="text-sm font-medium text-gray-600">
                                    AI ASSISTANT
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 text-gray-400 text-sm">
                                ▽
                            </div>
                        </>
                    )}
                </div>

                {/* Chat Area */}
                {!isMinimized && (
                    <div className="h-96 overflow-y-auto p-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {msg.type === 'bot' && (
                                        <div className="w-8 h-8 rounded-full mt-1 bg-gradient-to-r from-[#10B981] to-[#F97316] flex items-center justify-center text-white text-sm font-semibold shadow-md">
                                            S
                                        </div>
                                    )}
                                    <div className={`rounded-xl px-4 py-2 shadow-sm text-sm leading-relaxed ${
                                        msg.type === 'user' 
                                            ? 'bg-gradient-to-r from-[#10B981] to-[#F97316] text-white' 
                                            : 'bg-white/70 backdrop-blur-sm text-gray-800 border border-white/20'
                                    }`}>
                                        {msg.type === 'bot' ? (
                                            <MessageFormatter message={msg.content} />
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Time Selection Buttons */}
                        {showTimeButtons && timeOptions.length > 0 && (
                            <div className="flex flex-col items-center gap-3 mt-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30">
                                <p className="text-gray-700 text-sm font-semibold mb-2">
                                    Choose a time:
                                </p>
                                <div className="flex gap-2 justify-center flex-wrap">
                                    {timeOptions.map((option, index) => (
                                        <TimeButton
                                            key={index}
                                            time={option.time}
                                            text={option.text}
                                            onClick={() => handleTimeSelection(option)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Input Area */}
                {!isMinimized && (
                    <div className="p-4 bg-white/40 backdrop-blur-sm border-t border-white/20 rounded-b-2xl">
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]/30 shadow-inner transition-all duration-200"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isTyping}
                                className={`px-6 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 shadow-md ${
                                    isTyping 
                                        ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                        : 'bg-gradient-to-r from-[#10B981] to-[#F97316] hover:scale-105 hover:shadow-lg cursor-pointer'
                                }`}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatWidget;