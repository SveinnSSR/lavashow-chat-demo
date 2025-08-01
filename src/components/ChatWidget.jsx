import React, { useState, useEffect, useRef } from 'react';

const ChatWidget = ({ 
    webhookUrl = 'https://lavashow-chat-2024.vercel.app/chat', // Your deployed backend
    apiKey, 
    language = 'en' // Default to English for showcase
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
    // Add window width tracking for responsive design
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    
    // Initialize session ID on component mount
    useEffect(() => {
        // Create a unique session ID for this conversation
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
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #6DD5ED, #F7C59F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                }}
            >
                S
            </div>
            <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
                background: 'linear-gradient(135deg, #6DD5ED, #F7C59F)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '20px',
                margin: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(109, 213, 237, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '120px'
            }}
            onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #50A3A2, #FBB03B)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(109, 213, 237, 0.4)';
            }}
            onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #6DD5ED, #F7C59F)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(109, 213, 237, 0.3)';
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
        <>
            {/* Gradient background that extends around the widget */}
            <div style={{
                position: 'fixed',
                bottom: '-30px',
                right: '-30px',
                width: isMinimized ? '140px' : '600px',
                height: isMinimized ? '140px' : '750px',
                background: 'linear-gradient(135deg, #6DD5ED 0%, #50A3A2 30%, #F7C59F 70%, #FBB03B 100%)',
                borderRadius: '30px',
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
            backgroundColor: isMinimized ? 'transparent' : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: isMinimized ? 'none' : 'blur(12px)',
            borderRadius: isMinimized ? '50%' : '16px',
            boxShadow: isMinimized ? 
                '0 8px 32px rgba(109, 213, 237, 0.15), 0 4px 16px rgba(247, 197, 159, 0.1)' : 
                '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            overflow: 'hidden',
            transformOrigin: 'bottom right',
            transition: 'all 0.3s ease',
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
                        'linear-gradient(135deg, #10B981, #F97316)' : 
                        'rgba(255, 255, 255, 0.2)',
                    backdropFilter: isMinimized ? 'none' : 'blur(8px)',
                    width: '100%',
                    height: isMinimized ? '100%' : 'auto',
                    boxSizing: 'border-box',
                    flexDirection: 'column',
                    boxShadow: isMinimized ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                    borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    borderRadius: isMinimized ? '50%' : '16px 16px 0 0'
                }}
            >
                <div 
                    style={{
                        height: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        width: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(135deg, #6DD5ED, #F7C59F)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: isMinimized ? '20px' : '24px',
                        fontWeight: '600',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
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
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                        }}>
                            Sóley
                        </span>
                        <span style={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                        }}>
                            AI ASSISTANT
                        </span>
                    </div>
                )}
                {!isMinimized && (
                    <span style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        position: 'absolute',
                        right: '16px',
                        top: '16px'
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
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            background: 'linear-gradient(135deg, #6DD5ED, #F7C59F)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        S
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    background: msg.type === 'user' ? 
                                        'linear-gradient(135deg, #6DD5ED, #F7C59F)' : 
                                        'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(8px)',
                                    color: msg.type === 'user' ? 'white' : '#1f2937',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: msg.type === 'user' ? 
                                        '0 4px 12px rgba(109, 213, 237, 0.3)' : 
                                        '0 2px 8px rgba(0, 0, 0, 0.05)',
                                    border: msg.type === 'user' ? 
                                        '1px solid rgba(255, 255, 255, 0.2)' : 
                                        '1px solid rgba(255, 255, 255, 0.2)'
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
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            <p style={{
                                margin: '0 0 8px 0',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Choose a time:
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                justifyContent: 'center'
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
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0 0 16px 16px',
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
                            padding: '10px 16px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(4px)',
                            outline: 'none',
                            fontSize: '14px',
                            color: 'white',
                            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
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
                                'linear-gradient(135deg, #6DD5ED, #F7C59F)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '24px',
                            cursor: isTyping ? 'default' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: isTyping ? 
                                'none' : 
                                '0 4px 12px rgba(109, 213, 237, 0.3)',
                            opacity: isTyping ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                        }}
                        className="send-button"
                    >
                        Send
                    </button>
                </div>
            )}

            {/* Add keyframes for typing animation */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                @keyframes typingAnimation {
                    0% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0.4;
                    }
                }
                
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, #6DD5ED, #F7C59F);
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 1px;
                    animation: typingAnimation 1s infinite;
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
                    border-color: rgba(109, 213, 237, 0.5);
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(109, 213, 237, 0.1);
                    background-color: rgba(255, 255, 255, 0.8);
                }
                
                .send-button:hover:not(:disabled) {
                    background: linear-gradient(135deg, #50A3A2, #FBB03B);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(109, 213, 237, 0.4);
                }
                
                @media (max-width: 768px) {
                    input, 
                    button {
                        font-size: 16px !important; /* Prevent zoom on mobile */
                    }
                }
            `}</style>
        </div>
        </>
    );
};

export default ChatWidget;