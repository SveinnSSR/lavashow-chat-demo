import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../styles/theme';
import MessageFormatter from './MessageFormatter';

const ChatWidget = ({ 
    webhookUrl = 'https://lavashow-chat-2024.vercel.app/chat', 
    apiKey, 
    language = 'en' 
}) => {
    const messagesEndRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState([{
        type: 'bot',
        content: language === 'en' ? 
            "Hello! I'm Tinna. Would you like to learn about our unique lava demonstrations, experience packages, or how to get here?" :
            "Hæ! Ég er Tinna. Get ég aðstoðað þig?"
    }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState('');
    // Add window width tracking for responsive design
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    
    // Lava Show exact brand colors
    const brandOrange = '#FF4C1D'; // Closer to their website's orange
    
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
            <img 
                src="/images/tinna.png" 
                alt="Tinna"
                style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    objectFit: 'cover',
                    border: '1px solid ' + brandOrange
                }}
            />
            <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#333333',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: '1px solid #444444'
            }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
            </div>
        </div>
    );

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const messageText = inputValue.trim();
        setInputValue('');

        setMessages(prev => [...prev, {
            type: 'user',
            content: messageText
        }]);
        
        setIsTyping(true);

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || process.env.REACT_APP_API_KEY
                },
                body: JSON.stringify({ 
                    message: messageText,
                    language: language,
                    sessionId: sessionId // Send session ID to maintain context
                })
            });   

            const data = await response.json();
            setIsTyping(false);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.message
            }]);
        } catch (error) {
            console.error('Error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: language === 'en' ? 
                    "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                    "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund."
            }]);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : '400px',
            height: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : 'auto',
            maxHeight: isMinimized ? 'auto' : 'calc(100vh - 40px)',
            backgroundColor: isMinimized ? brandOrange : '#000000', // Orange when minimized, black when expanded
            borderRadius: isMinimized ? '50%' : '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: 'none',
            fontFamily: theme.fonts.body,
            overflow: 'hidden',
            transformOrigin: 'bottom right',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
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
                    justifyContent: isMinimized ? 'center' : 'flex-start',
                    cursor: 'pointer',
                    gap: '12px',
                    backgroundColor: isMinimized ? brandOrange : 'black', // Black header
                    width: '100%',
                    height: isMinimized ? '100%' : 'auto',
                    boxSizing: 'border-box',
                    flexDirection: isMinimized ? 'row' : 'column',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    borderBottom: '1px solid #333333'
                }}
            >
                <img 
                    src="/images/tinna.png" 
                    alt="Tinna" 
                    style={{ 
                        height: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        width: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: isMinimized ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                        border: '2px solid white' // White border for contrast
                    }}
                />
                {!isMinimized && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span style={{ 
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                        }}>
                            Tinna
                        </span>
                        <span style={{ 
                            color: brandOrange,
                            fontSize: '14px',
                            fontWeight: '500',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                        }}>
                            LAVA SHOW
                        </span>
                    </div>
                )}
                {!isMinimized && (
                    <span style={{ 
                        color: 'white',
                        fontSize: '12px',
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}>
                        ▽
                    </span>
                )}
            </div>

            {/* Chat area */}
            {!isMinimized && (
                <div style={{
                    height: '400px',
                    backgroundColor: '#121212', // Dark theme
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
                                    <img 
                                        src="/images/tinna.png" 
                                        alt="Tinna"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            marginTop: '4px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            objectFit: 'cover',
                                            border: '1px solid ' + brandOrange
                                        }}
                                    />
                                )}
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    backgroundColor: msg.type === 'user' ? brandOrange : '#333333',
                                    color: 'white',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                    border: msg.type === 'user' ? 
                                        '1px solid rgba(255, 255, 255, 0.1)' : 
                                        '1px solid #444444'
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
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Input area */}
            {!isMinimized && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#1A1A1A', // Dark input area
                    borderTop: '1px solid #333333',
                    display: 'flex',
                    gap: '8px'
                }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                        placeholder={language === 'en' ? "Type your message..." : "Skrifaðu skilaboð..."}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #444444',
                            outline: 'none',
                            fontSize: '14px',
                            backgroundColor: '#2A2A2A',
                            color: 'white',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping}
                        style={{
                            backgroundColor: isTyping ? '#666666' : brandOrange,
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            cursor: isTyping ? 'default' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            opacity: isTyping ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {language === 'en' ? 'Send' : 'Senda'}
                    </button>
                </div>
            )}

            {/* Add keyframes for typing animation */}
            <style jsx>{`
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
                    background-color: #AAAAAA; /* Light gray for dark background */
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
                
                @media (max-width: 768px) {
                    input, 
                    button {
                        font-size: 16px !important; /* Prevent zoom on mobile */
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;