// import React, { useState } from 'react';

// interface ShareButtonProps {
//     shareData: {
//         title: string;
//         text: string;
//         url: string;
//     };
//     children: React.ReactNode;
//     className?: string;
//     onShare?: () => void; // Optional callback
// }

// const ShareButton: React.FC<ShareButtonProps> = ({ shareData, children, className, onShare }) => {
//     const [showToast, setShowToast] = useState(false);

//     const handleShare = async () => {
//         if (onShare) {
//             onShare();
//         }

//         if (navigator.share) {
//             try {
//                 await navigator.share(shareData);
//             } catch (error) {
//                 console.error('Error sharing:', error);
//             }
//         } else {
//             // Fallback for desktop: copy link to clipboard
//             try {
//                 await navigator.clipboard.writeText(shareData.url);
//                 setShowToast(true);
//                 setTimeout(() => setShowToast(false), 2000); // Hide toast after 2 seconds
//             } catch (error) {
//                 console.error('Failed to copy:', error);
//                 alert('Failed to copy link.');
//             }
//         }
//     };

//     return (
//         <>
//             <button onClick={handleShare} className={className}>
//                 {children}
//             </button>

//             {/* Toast Notification */}
//             {showToast && (
//                 <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
//                     Link copied to clipboard!
//                 </div>
//             )}
//         </>
//     );
// };

// export default ShareButton;






import React from 'react';

interface ShareButtonProps {
  shareData: ShareData;
  className?: string;
  children: React.ReactNode;
  onShare?: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ shareData, className, children, onShare }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      if (shareData.url) {
        navigator.clipboard.writeText(shareData.url)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Failed to copy link:', err));
      } else {
        alert('Sharing is not supported on this browser.');
      }
    }
    if (onShare) {
        onShare();
    }
  };

  return (
    <button onClick={handleShare} className={className}>
      {children}
    </button>
  );
};

export default ShareButton;
