// src/components/MessageFormatter.jsx
import React from 'react';

const MessageFormatter = ({ message }) => {
  if (!message) return null;
  
  // Lava Show brand color
  const brandOrange = '#FF4C1D';
  
  // Base link styles that can be reused
  const baseLinkStyles = {
    color: '#333333',            // Dark text for contrast
    textDecoration: 'none',      // Remove underline
    backgroundColor: '#f2f2f2',  // Light background for button effect
    padding: '6px 12px',         // Add padding for button look
    borderRadius: '4px',         // Rounded corners
    display: 'inline-block',     // Make it block-level for padding
    marginTop: '8px',            // Add some space above
    fontSize: '14px',            // Slightly smaller font
    fontWeight: '500',           // Medium weight
    transition: 'all 0.2s ease', // Smooth hover effect
    cursor: 'pointer',           // Show clickable cursor
    border: '1px solid #e0e0e0'  // Subtle border
  };

  // Different variations for different types of links
  const linkStyles = {
    default: {
      ...baseLinkStyles
    },
    maps: {
      ...baseLinkStyles,
      paddingLeft: '28px',
      position: 'relative'
    },
    tickets: {
      ...baseLinkStyles,
      backgroundColor: '#FFE8E3'  // Light orange background for tickets
    },
    locations: {
      ...baseLinkStyles,
      backgroundColor: '#FFF0EB'  // Different light orange for locations
    }
  };

  // Function to determine link style based on URL
  const getLinkStyle = (url) => {
    if (url.includes('maps') || url.includes('location')) return linkStyles.maps;
    if (url.includes('ticket') || url.includes('book')) return linkStyles.tickets;
    if (url.includes('location') || url.includes('reykjavik') || url.includes('hella')) return linkStyles.locations;
    return linkStyles.default;
  };
  
  // Function to format both markdown-style links and regular URLs
  const processText = (text) => {
    // First check for button-style links with format [Button Text](URL)
    const buttonLinkRegex = /\[(.*?)\]\s*\((.*?)\)/g;
    let buttonMatches = [];
    
    // Find all button-style links and store them
    let match;
    while ((match = buttonLinkRegex.exec(text)) !== null) {
      buttonMatches.push({
        fullMatch: match[0],
        text: match[1],
        url: match[2],
        index: match.index
      });
    }
    
    // If no button links, just process regular URLs
    if (buttonMatches.length === 0) {
      return processUrls(text);
    }
    
    // Process button-style links
    const parts = [];
    let lastIndex = 0;
    
    buttonMatches.forEach((match, index) => {
      // Add text before the button
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(processUrls(beforeText));
      }
      
      // Get appropriate style based on URL
      const linkStyle = getLinkStyle(match.url);
      
      // Add the button
      parts.push(
        <a 
          key={`button-${index}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e9e9e9';
            e.target.style.color = brandOrange; // Change to Lava Show orange on hover
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            // Reset to original colors based on link type
            const url = e.target.href;
            e.target.style.color = '#333333';
            
            if (url.includes('maps') || url.includes('location')) {
              e.target.style.backgroundColor = '#f2f2f2';
            } else if (url.includes('ticket') || url.includes('book')) {
              e.target.style.backgroundColor = '#FFE8E3';
            } else if (url.includes('location') || url.includes('reykjavik') || url.includes('hella')) {
              e.target.style.backgroundColor = '#FFF0EB';
            } else {
              e.target.style.backgroundColor = '#f2f2f2';
            }
            
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {match.url.includes('maps') || match.url.includes('location') ? '📍 ' : ''}{match.text}
        </a>
      );
      
      lastIndex = match.index + match.fullMatch.length;
    });
    
    // Add any remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(processUrls(remainingText));
    }
    
    return parts;
  };
  
  // Function to process regular URLs (keeping your existing linkifyText functionality)
  const processUrls = (text) => {
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
              color: brandOrange,
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
  
  // First split by paragraphs (double newlines) - KEEPING YOUR EXISTING APPROACH
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
                    color: brandOrange, // Lava Show orange
                    margin: '10px 0',
                    fontSize: '15px'
                  }}>
                    {processText(line.replaceAll('**', ''))}
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
                    {processText(line.substring(1).trim())}
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
                    {processText(line)}
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