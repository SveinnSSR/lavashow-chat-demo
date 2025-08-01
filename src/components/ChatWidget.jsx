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
            gap: '12px'
        }}>
            <div 
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    background: 'linear-gradient(135deg, #22c55e, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
            >
                S
            </div>
            <div style={{
                padding: '14px 18px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
                background: 'linear-gradient(135deg, #22c55e, #f97316)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                margin: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '120px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.4)';
            }}
            onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)';
            }}
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
        return <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>;
    };

    return (
        <>
            {/* Background gradient that extends beyond widget */}
            <div style={{
                position: 'fixed',
                bottom: '0px',
                right: '0px',
                width: isMinimized ? '100px' : '450px',
                height: isMinimized ? '100px' : '550px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #22c55e 25%, #f59e0b 50%, #f97316 75%, #ec4899 100%)',
                borderRadius: '25px',
                opacity: isMinimized ? '0.8' : '1',
                filter: 'blur(1px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 9998,
                pointerEvents: 'none'
            }} />

            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : '400px',
                height: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : 'auto',
                maxHeight: isMinimized ? 'auto' : 'calc(100vh - 40px)',
                background: isMinimized ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: isMinimized ? 'none' : 'blur(20px)',
                borderRadius: isMinimized ? '50%' : '25px',
                border: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: isMinimized ? 
                    '0 10px 40px rgba(0, 0, 0, 0.3)' : 
                    '0 25px 80px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
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
                        padding: isMinimized ? '0' : '24px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMinimized ? 'center' : 'center',
                        cursor: 'pointer',
                        gap: '12px',
                        background: isMinimized ? 
                            'linear-gradient(135deg, #22c55e, #f97316)' : 
                            'rgba(255, 255, 255, 0.1)',
                        backdropFilter: isMinimized ? 'none' : 'blur(10px)',
                        width: '100%',
                        height: isMinimized ? '100%' : 'auto',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        borderRadius: isMinimized ? '50%' : '25px 25px 0 0',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        if (isMinimized) {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.4)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (isMinimized) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    <div 
                        style={{
                            height: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '70px',
                            width: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '70px',
                            borderRadius: '50%',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            background: 'linear-gradient(135deg, #22c55e, #f97316)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: isMinimized ? '20px' : '28px',
                            fontWeight: '700',
                            border: '3px solid rgba(255, 255, 255, 0.4)',
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
                            gap: '6px',
                            marginTop: '8px'
                        }}>
                            <span style={{ 
                                color: 'white',
                                fontSize: '22px',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                            }}>
                                Sóley
                            </span>
                            <span style={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                fontWeight: '600',
                                letterSpacing: '0.1em',
                                textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)'
                            }}>
                                AI ASSISTANT
                            </span>
                        </div>
                    )}
                    {!isMinimized && (
                        <span style={{ 
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '14px',
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
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
                        overflowY: 'auto',
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: msg.type === 'bot' ? '20px' : '16px',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                    gap: '12px'
                                }}>
                                    {msg.type === 'bot' && (
                                        <div 
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                marginTop: '4px',
                                                background: 'linear-gradient(135deg, #22c55e, #f97316)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            S
                                        </div>
                                    )}
                                    <div style={{
                                        maxWidth: '75%',
                                        padding: '16px 20px',
                                        borderRadius: '20px',
                                        background: msg.type === 'user' ? 
                                            'linear-gradient(135deg, #22c55e, #f97316)' : 
                                            'rgba(255, 255, 255, 0.25)',
                                        backdropFilter: 'blur(20px)',
                                        color: msg.type === 'user' ? 'white' : 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        transition: 'all 0.2s ease',
                                        textShadow: msg.type === 'user' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
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
                                gap: '12px',
                                marginTop: '20px',
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '15px',
                                    fontWeight: '600'
                                }}>
                                    Choose a time:
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
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
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0 0 25px 25px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                borderRadius: '25px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                outline: 'none',
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            className="chat-input"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isTyping}
                            style={{
                                background: isTyping ? 
                                    'rgba(255, 255, 255, 0.3)' : 
                                    'linear-gradient(135deg, #22c55e, #f97316)',
                                color: 'white',
                                border: 'none',
                                padding: '14px 28px',
                                borderRadius: '25px',
                                cursor: isTyping ? 'default' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: isTyping ? 
                                    'none' : 
                                    '0 4px 20px rgba(34, 197, 94, 0.3)',
                                opacity: isTyping ? 0.7 : 1,
                                transition: 'all 0.3s ease',
                                minWidth: '80px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                            }}
                            className="send-button"
                            onMouseOver={(e) => {
                                if (!isTyping) {
                                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                                    e.target.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.4)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isTyping) {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)';
                                }
                            }}
                        >
                            Send
                        </button>
                    </div>
                )}

                {/* Styles */}
                <style jsx>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    @keyframes typingAnimation {
                        0%, 100% { 
                            opacity: 0.4;
                            transform: scale(0.8);
                        }
                        50% { 
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    
                    .typing-dot {
                        width: 8px;
                        height: 8px;
                        background: linear-gradient(135deg, #22c55e, #f97316);
                        border-radius: 50%;
                        display: inline-block;
                        margin: 0 2px;
                        animation: typingAnimation 1.4s infinite;
                    }
                    
                    .typing-dot:nth-child(1) { animation-delay: 0s; }
                    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                    
                    .chat-input::placeholder {
                        color: rgba(255, 255, 255, 0.6);
                    }
                    
                    .chat-input:focus {
                        border-color: rgba(255, 255, 255, 0.5);
                        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.2);
                        background-color: rgba(255, 255, 255, 0.25);
                    }
                    
                    @media (max-width: 768px) {
                        input, button {
                            font-size: 16px !important;
                        }
                    }
                    
                    /* Custom scrollbar */
                    div::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    div::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 2px;
                    }
                    
                    div::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 2px;
                    }
                    
                    div::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.5);
                    }
                `}</style>
            </div>
        </>
    );
};

export default ChatWidget;