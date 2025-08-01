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
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
            alignItems: 'flex-start',
            gap: '8px'
        }}>
            <div 
                style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    background: 'linear-gradient(135deg, #10b981, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                S
            </div>
            <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
            </div>
        </div>
    );

    const TimeButton = ({ time, text, onClick }) => (
        <button
            onClick={onClick}
            style={{
                background: 'linear-gradient(135deg, #10b981, #f97316)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '20px',
                margin: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '120px'
            }}
            onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #059669, #ea580c)';
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #10b981, #f97316)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
        >
            {text}
        </button>
    );

    const handleSend = async (messageToSend = null) => {
        const messageText = messageToSend || inputValue.trim();
        if (!messageText || isTyping) return;

        setInputValue('');
        setShowTimeButtons(false); // Hide time buttons when sending new message

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

            // Handle animation trigger from backend
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
        // Send the time selection as a message
        handleSend(timeOption.text);
    };

    const MessageFormatter = ({ message }) => {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>;
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : '400px',
            height: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : 'auto',
            maxHeight: isMinimized ? 'auto' : 'calc(100vh - 40px)',
            backgroundColor: isMinimized ? 'transparent' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: isMinimized ? 'none' : 'blur(12px)',
            borderRadius: isMinimized ? '50%' : '20px',
            boxShadow: isMinimized ? '0 8px 32px rgba(16, 185, 129, 0.2)' : '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(16, 185, 129, 0.1)',
            border: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            overflow: 'hidden',
            transformOrigin: 'bottom right',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 9999,
            maxWidth: isMinimized ? 'auto' : '90vw'
        }}>
            {/* Header */}
            <div 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                    padding: isMinimized ? '0' : '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMinimized ? 'center' : 'center',
                    cursor: 'pointer',
                    gap: '12px',
                    background: isMinimized ? 
                        'linear-gradient(135deg, #10b981, #f97316)' : 
                        'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: isMinimized ? 'none' : 'blur(8px)',
                    width: '100%',
                    height: isMinimized ? '100%' : 'auto',
                    boxSizing: 'border-box',
                    flexDirection: 'column',
                    boxShadow: isMinimized ? 
                        '0 8px 32px rgba(16, 185, 129, 0.3)' : 
                        '0 2px 8px rgba(0, 0, 0, 0.05)',
                    borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    borderRadius: isMinimized ? '50%' : '20px 20px 0 0',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    if (isMinimized) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
                    }
                }}
                onMouseOut={(e) => {
                    if (isMinimized) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
                    }
                }}
            >
                <div 
                    style={{
                        height: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        width: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        borderRadius: '50%',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                        background: 'linear-gradient(135deg, #10b981, #f97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: isMinimized ? '20px' : '24px',
                        fontWeight: '700',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    S
                </div>
                {!isMinimized && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                    }}>
                        <span style={{ 
                            color: '#1f2937',
                            fontSize: '18px',
                            fontWeight: '600',
                            letterSpacing: '-0.02em'
                        }}>
                            Sóley
                        </span>
                        <span style={{ 
                            background: 'linear-gradient(135deg, #10b981, #f97316)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.05em'
                        }}>
                            AI ASSISTANT
                        </span>
                    </div>
                )}
                {!isMinimized && (
                    <span style={{ 
                        color: '#9ca3af',
                        fontSize: '12px',
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        transition: 'all 0.2s ease'
                    }}>
                        ▽
                    </span>
                )}
            </div>

            {/* Chat area */}
            {!isMinimized && (
                <div style={{
                    height: '400px',
                    backgroundColor: 'transparent',
                    backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    overflowY: 'auto',
                    padding: '16px'
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: msg.type === 'bot' ? '16px' : '12px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-start',
                                width: '100%',
                                gap: '8px'
                            }}>
                                {msg.type === 'bot' && (
                                    <div 
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            marginTop: '4px',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                            background: 'linear-gradient(135deg, #10b981, #f97316)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            border: '2px solid rgba(255, 255, 255, 0.3)'
                                        }}
                                    >
                                        S
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '75%',
                                    padding: '12px 16px',
                                    borderRadius: '18px',
                                    background: msg.type === 'user' ? 
                                        'linear-gradient(135deg, #10b981, #f97316)' : 
                                        'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(8px)',
                                    color: msg.type === 'user' ? 'white' : '#374151',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: msg.type === 'user' ? 
                                        '0 4px 16px rgba(16, 185, 129, 0.3)' : 
                                        '0 4px 16px rgba(0, 0, 0, 0.08)',
                                    border: msg.type === 'user' ? 
                                        '1px solid rgba(255, 255, 255, 0.2)' : 
                                        '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {msg.type === 'bot' ? (
                                        <MessageFormatter message={msg.content} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Show time selection buttons */}
                    {showTimeButtons && timeOptions.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '16px',
                            padding: '16px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(249, 115, 22, 0.1))',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                        }}>
                            <p style={{
                                margin: '0 0 8px 0',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Choose a time:
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
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

            {/* Input area */}
            {!isMinimized && (
                <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0 0 20px 20px',
                    display: 'flex',
                    gap: '8px'
                }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '25px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(4px)',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#374151',
                            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                        className="chat-input"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isTyping}
                        style={{
                            background: isTyping ? 
                                'linear-gradient(135deg, #9ca3af, #6b7280)' : 
                                'linear-gradient(135deg, #10b981, #f97316)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            cursor: isTyping ? 'default' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: isTyping ? 
                                'none' : 
                                '0 4px 16px rgba(16, 185, 129, 0.3)',
                            opacity: isTyping ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            minWidth: '70px'
                        }}
                        className="send-button"
                        onMouseOver={(e) => {
                            if (!isTyping) {
                                e.target.style.background = 'linear-gradient(135deg, #059669, #ea580c)';
                                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                                e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isTyping) {
                                e.target.style.background = 'linear-gradient(135deg, #10b981, #f97316)';
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
                            }
                        }}
                    >
                        Send
                    </button>
                </div>
            )}

            {/* Add keyframes for animations */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                @keyframes typingAnimation {
                    0% {
                        opacity: 0.4;
                        transform: scale(0.8);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0.4;
                        transform: scale(0.8);
                    }
                }
                
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: linear-gradient(135deg, #10b981, #f97316);
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 1px;
                    animation: typingAnimation 1.4s infinite;
                }
                
                .typing-dot:nth-child(1) {
                    animation-delay: 0s;
                }
                
                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                .chat-input:focus {
                    border-color: rgba(16, 185, 129, 0.5);
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(16, 185, 129, 0.1);
                    background-color: rgba(255, 255, 255, 0.8);
                }
                
                @media (max-width: 768px) {
                    input, 
                    button {
                        font-size: 16px !important; /* Prevent zoom on mobile */
                    }
                }
                
                /* Custom scrollbar */
                div::-webkit-scrollbar {
                    width: 6px;
                }
                
                div::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                
                div::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #10b981, #f97316);
                    border-radius: 3px;
                }
                
                div::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #059669, #ea580c);
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;