import React, { useState } from 'react';
import './SocialShare.css';

const SocialShare = ({ media, searchQuery }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const generateShareCard = () => {
    const cardData = {
      title: media?.title || searchQuery,
      type: media?.type || 'media',
      image: media?.image,
      platforms: media?.platforms || [],
      description: media?.description || `Found amazing ${media?.type || 'content'} on WhereToFind!`,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Create shareable URL
    const shareUrl = `${window.location.origin}/share/${encodeURIComponent(JSON.stringify(cardData))}`;
    setShareUrl(shareUrl);
    return shareUrl;
  };

  const shareToSocial = async (platform) => {
    const url = generateShareCard();
    const text = `🎬 Found "${media?.title || searchQuery}" on ${media?.platforms?.length || 0} platforms! 🔍 WhereToFind.com`;
    
    const shareData = {
      title: `WhereToFind - ${media?.title || searchQuery}`,
      text: text,
      url: url
    };

    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'reddit':
          window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
          break;
        default:
          if (navigator.share) {
            await navigator.share(shareData);
          }
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const downloadShareImage = async () => {
    setIsSharing(true);
    try {
      // Create canvas for share image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1200;
      canvas.height = 630;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#475569');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Add logo
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('WhereToFind', 50, 80);

      // Add media title
      ctx.font = 'bold 36px Arial';
      ctx.fillText(media?.title || searchQuery, 50, 150);

      // Add platforms
      if (media?.platforms?.length) {
        ctx.font = '24px Arial';
        ctx.fillText(`Available on ${media.platforms.length} platforms`, 50, 200);
        
        const platforms = media.platforms.slice(0, 5);
        platforms.forEach((platform, index) => {
          ctx.fillText(`• ${platform}`, 50, 240 + (index * 30));
        });
      }

      // Add call to action
      ctx.font = 'bold 28px Arial';
      ctx.fillText('Find where to watch, buy, or stream', 50, 500);
      ctx.font = '24px Arial';
      ctx.fillText('WhereToFind.com', 50, 540);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wheretofind-${media?.title || searchQuery}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Image generation error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="social-share">
      <div className="share-header">
        <h3>🎉 Share Your Find!</h3>
        <p>Help others discover amazing content</p>
      </div>

      <div className="share-buttons">
        <button 
          className="share-btn twitter" 
          onClick={() => shareToSocial('twitter')}
          title="Share on Twitter"
        >
          <i className="fab fa-twitter"></i>
          Twitter
        </button>

        <button 
          className="share-btn facebook" 
          onClick={() => shareToSocial('facebook')}
          title="Share on Facebook"
        >
          <i className="fab fa-facebook"></i>
          Facebook
        </button>

        <button 
          className="share-btn reddit" 
          onClick={() => shareToSocial('reddit')}
          title="Share on Reddit"
        >
          <i className="fab fa-reddit"></i>
          Reddit
        </button>

        <button 
          className="share-btn whatsapp" 
          onClick={() => shareToSocial('whatsapp')}
          title="Share on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
          WhatsApp
        </button>

        <button 
          className="share-btn telegram" 
          onClick={() => shareToSocial('telegram')}
          title="Share on Telegram"
        >
          <i className="fab fa-telegram"></i>
          Telegram
        </button>

        <button 
          className="share-btn copy" 
          onClick={() => shareToSocial('copy')}
          title="Copy Link"
        >
          <i className="fas fa-link"></i>
          Copy Link
        </button>

        <button 
          className="share-btn download" 
          onClick={downloadShareImage}
          disabled={isSharing}
          title="Download Share Image"
        >
          <i className="fas fa-download"></i>
          {isSharing ? 'Generating...' : 'Download Image'}
        </button>
      </div>

      {shareUrl && (
        <div className="share-url">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            onClick={(e) => e.target.select()}
          />
        </div>
      )}
    </div>
  );
};

export default SocialShare; 