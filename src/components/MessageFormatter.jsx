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
    backgroundColor: '#f5f5f5',  // Slightly lighter background for better contrast
    padding: '8px 14px',         // Increased padding for better button appearance
    borderRadius: '6px',         // Slightly more rounded corners
    display: 'inline-block',     // Make it block-level for padding
    marginTop: '8px',            // Add some space above
    marginBottom: '4px',         // Add some space below
    fontSize: '14px',            // Slightly smaller font
    fontWeight: '500',           // Medium weight
    transition: 'all 0.2s ease', // Smooth hover effect
    cursor: 'pointer',           // Show clickable cursor
    border: '1px solid #e0e0e0',  // Subtle border
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' // Subtle shadow for depth
  };

  // Different variations for different types of links
  const linkStyles = {
    default: {
      ...baseLinkStyles
    },
    maps: {
      ...baseLinkStyles,
      paddingLeft: '32px',       // More space for the icon
      position: 'relative',
      backgroundColor: '#F7F7F7' // Slightly different background for maps
    },
    tickets: {
      ...baseLinkStyles,
      backgroundColor: '#FFF1ED', // Warmer, more distinctive light orange
      borderColor: '#FFD6CC'     // Stronger border color
    },
    locations: {
      ...baseLinkStyles,
      backgroundColor: '#FFEBE6', // Different light orange for locations
      borderColor: '#FFCEC1'     // Stronger border color
    }
  };

  // Function to determine link style based on URL
  const getLinkStyle = (url) => {
    if (url.includes('maps') || url.includes('location') || url.includes('directions')) 
      return linkStyles.maps;
    if (url.includes('ticket') || url.includes('book') || url.includes('experience')) 
      return linkStyles.tickets;
    if (url.includes('reykjavik') || url.includes('vik') || url.includes('address')) 
      return linkStyles.locations;
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
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.color = brandOrange; 
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
            if (match.url.includes('ticket') || match.url.includes('book')) {
              e.target.style.backgroundColor = '#FFE8E0';
            } else if (match.url.includes('location') || match.url.includes('reykjavik') || match.url.includes('vik')) {
              e.target.style.backgroundColor = '#FFE2DB';
            } else if (match.url.includes('maps')) {
              e.target.style.backgroundColor = '#F2F2F2';
            }
          }}
          onMouseLeave={(e) => {
            // Reset to original colors based on link type
            const url = e.target.href;
            e.target.style.color = '#333333';
            e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            
            if (url.includes('maps') || url.includes('directions')) {
              e.target.style.backgroundColor = '#F7F7F7';
            } else if (url.includes('ticket') || url.includes('book') || url.includes('experience')) {
              e.target.style.backgroundColor = '#FFF1ED';
            } else if (url.includes('reykjavik') || url.includes('vik') || url.includes('address')) {
              e.target.style.backgroundColor = '#FFEBE6';
            } else {
              e.target.style.backgroundColor = '#f5f5f5';
            }
            
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {match.url.includes('maps') || match.url.includes('location') || match.url.includes('directions') ? 
            <span style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px'
            }}>📍</span> : ''
          }
          {match.text}
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
  
  // Function to process regular URLs (converting them to button-style links)
  const processUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Determine what kind of URL it is and create appropriate button text
        let buttonText = "Visit Website";
        let isMapLink = false;
        
        if (part.includes('google.com/maps') || part.includes('maps.app') || part.includes('goo.gl/maps')) {
          buttonText = "📍 View on Google Maps 📍";
          isMapLink = true;
        } else if (part.includes('ticket') || part.includes('booking') || part.includes('book') || part.includes('experience')) {
          buttonText = "Book Your Experience";
        } else if (part.includes('menu') || part.includes('food')) {
          buttonText = "View Menu";
        } else if (part.includes('instagram')) {
          buttonText = "Visit Instagram";
        } else if (part.includes('facebook')) {
          buttonText = "Visit Facebook";
        } else if (part.includes('twitter') || part.includes('x.com')) {
          buttonText = "Visit Twitter";
        }
        
        // Get appropriate style based on URL type
        const linkStyle = isMapLink ? 
          { ...linkStyles.maps } : 
          (part.includes('ticket') || part.includes('book')) ? 
            { ...linkStyles.tickets } : 
            { ...linkStyles.default };
        
        return (
          <a 
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            title={part} // Show full URL on hover
            style={linkStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.color = brandOrange; 
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
              if (part.includes('ticket') || part.includes('book')) {
                e.target.style.backgroundColor = '#FFE8E0';
              } else if (isMapLink) {
                e.target.style.backgroundColor = '#F2F2F2';
              }
            }}
            onMouseLeave={(e) => {
              // Reset to original colors based on link type
              e.target.style.color = '#333333';
              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              
              if (isMapLink) {
                e.target.style.backgroundColor = '#F7F7F7';
              } else if (part.includes('ticket') || part.includes('book')) {
                e.target.style.backgroundColor = '#FFF1ED';
              } else {
                e.target.style.backgroundColor = '#f5f5f5';
              }
              
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {isMapLink && 
              <span style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px'
              }}>📍</span>
            }
            {buttonText}
          </a>
        );
      }
      return part;
    });
  };
  
  // First split by paragraphs (double newlines) - KEEPING YOUR EXISTING APPROACH
  const paragraphs = message.split('\n\n');
  
  return (
    <div style={{ width: '100%', lineHeight: '1.6', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
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