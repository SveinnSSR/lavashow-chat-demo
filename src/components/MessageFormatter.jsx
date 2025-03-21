import React from 'react';

const MessageFormatter = ({ message }) => {
  if (!message) return null;
  
  // Function to make URLs clickable
  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#FF4B12',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };
  
  // First split by paragraphs (double newlines)
  const paragraphs = message.split('\n\n');
  
  return (
    <div style={{ width: '100%', lineHeight: '1.6' }}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        // Then process each paragraph line by line
        const lines = paragraph.split('\n');
        
        return (
          <div key={paragraphIndex} style={{ marginBottom: paragraphIndex < paragraphs.length - 1 ? '16px' : '0' }}>
            {lines.map((line, lineIndex) => {
              // Handle package headings (wrapped in **)
              if (line.includes('**')) {
                return (
                  <div key={`${paragraphIndex}-${lineIndex}`} style={{
                    fontWeight: '600',
                    color: '#FF4B12', // Lava Show orange
                    margin: '10px 0',
                    fontSize: '15px'
                  }}>
                    {linkifyText(line.replaceAll('**', ''))}
                  </div>
                );
              }
              
              // Handle bullet points
              if (line.trim().startsWith('-')) {
                return (
                  <div key={`${paragraphIndex}-${lineIndex}`} style={{
                    margin: '8px 0',
                    paddingLeft: '20px',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '8px',
                      top: '0'
                    }}>•</span>
                    {linkifyText(line.substring(1).trim())}
                  </div>
                );
              }
              
              // Regular text
              if (line.trim()) {
                return (
                  <p key={`${paragraphIndex}-${lineIndex}`} style={{
                    margin: lineIndex === 0 ? '0' : '8px 0',
                    color: line.includes('Pricing:') ? '#666' : 'inherit'
                  }}>
                    {linkifyText(line)}
                  </p>
                );
              }
              
              // Empty lines within a paragraph
              return <br key={`${paragraphIndex}-${lineIndex}`} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MessageFormatter;