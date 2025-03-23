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
    
    // Initialize session ID on component mount
    useEffect(() => {
        // Create a unique session ID for this conversation
        setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
    }, []);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // We'll use the global CSS for typing animations instead of inline styles

    const TypingIndicator = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
            alignItems: 'flex-start',
            gap: '12px'
        }}>
            <img 
                src="/images/tinna.png" 
                alt="Tinna"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    objectFit: 'cover'
                }}
            />
            <div style={{
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
            </div>
        </div>
    );

    const handleSend = async () => {
        if (!inputValue.trim()) return;

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
            width: isMinimized ? '260px' : '400px',
            backgroundColor: '#FF4B12',
            borderRadius: isMinimized ? '40px' : '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            fontFamily: theme.fonts.body,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: 1000
        }}>
            {/* Header */}
            <div 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                    padding: isMinimized ? '16px 20px' : '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: '12px',
                    backgroundColor: '#FF4B12',
                    width: '100%',
                    boxSizing: 'border-box',
                    flexDirection: isMinimized ? 'row' : 'row',
                    justifyContent: isMinimized ? 'flex-start' : 'center',
                    boxShadow: '0 2px 10px rgba(255, 75, 18, 0.2)'
                }}
            >
                <img 
                    src="/images/tinna.png" 
                    alt="Tinna" 
                    style={{ 
                        height: isMinimized ? '40px' : '60px',
                        width: isMinimized ? '40px' : '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMinimized ? 'flex-start' : 'flex-start',
                    gap: '4px'
                }}>
                    <span style={{ 
                        color: 'white',
                        fontSize: isMinimized ? '16px' : '18px',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                    }}>
                        Tinna
                    </span>
                    <span style={{ 
                        color: '#ffffff',
                        fontSize: isMinimized ? '14px' : '15px',
                        opacity: 0.9
                    }}>
                        LAVA SHOW
                    </span>
                </div>
                <span style={{ 
                    color: 'white',
                    fontSize: '12px',
                    marginLeft: 'auto',
                    opacity: 0.8
                }}>
                    {isMinimized ? '△' : '▽'}
                </span>
            </div>

            {/* Chat area */}
            {!isMinimized && (
                <>
                    <div style={{
                        height: '400px',
                        backgroundColor: '#fff',
                        overflowY: 'auto',
                        padding: '16px',
                        backgroundImage: 'linear-gradient(to bottom, #f8f8f8, #ffffff)'
                    }}>
                        {messages.map((msg, index) => (
                            <div className="chat-bubble message-transition" key={index} style={{
                                display: 'flex',
                                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: msg.type === 'bot' ? '16px' : '12px',
                                alignItems: 'flex-start',
                                gap: '12px'
                            }}>
                                {msg.type === 'bot' && (
                                    <img 
                                        src="/images/tinna.png" 
                                        alt="Tinna"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            marginTop: '4px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                <div style={{
                                    maxWidth: '75%',
                                    padding: '12px 16px',
                                    borderRadius: '18px',
                                    backgroundColor: msg.type === 'user' ? '#FF4B12' : '#f8f8f8',
                                    color: msg.type === 'user' ? 'white' : '#333333',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: msg.type === 'user' ? 
                                        '0 2px 8px rgba(255, 75, 18, 0.1)' : 
                                        '0 2px 8px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {msg.type === 'bot' ? (
                                        <MessageFormatter message={msg.content} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderTop: '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <input
                            className="chat-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={language === 'en' ? "Type your message..." : "Skrifaðu skilaboð..."}
                            style={{
                                flex: 1,
                                padding: '12px 18px',
                                borderRadius: '24px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '14px',
                                backgroundColor: '#f8f8f8'
                            }}
                        />
                        <button
                            className="send-button"
                            onClick={handleSend}
                            style={{
                                backgroundColor: '#FF4B12',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '24px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 2px 4px rgba(255, 75, 18, 0.2)'
                            }}
                        >
                            {language === 'en' ? 'Send' : 'Senda'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;