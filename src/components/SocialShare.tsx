
import { Share2, MessageCircle } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  message?: string;
  url?: string;
}

const SocialShare = ({ 
  message = "Check out EasyMove - Rwanda's best moving and delivery service! 🚛✨", 
  url = window.location.origin 
}: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareMessage = `${message}\n\nDownload now: ${url}`;
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(url);

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedMessage}`,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      name: "Facebook",
      icon: Share2,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Twitter",
      icon: Share2,
      url: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      color: "bg-blue-400 hover:bg-blue-500"
    }
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EasyMove Rwanda',
          text: message,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share EasyMove</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border p-4 z-50 min-w-[200px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-900">Share EasyMove</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            {socialLinks.map((social) => (
              <button
                key={social.name}
                onClick={() => handleShare(social.url)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white transition-colors ${social.color}`}
              >
                <social.icon className="h-4 w-4" />
                <span className="text-sm">Share on {social.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
