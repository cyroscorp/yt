import { useEffect, useState } from 'react';

const BlurOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the overlay when the component mounts
    setIsVisible(true);

    // Hide the overlay after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 900);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <h1 className="text-white text-3xl mb-4">Touch/Click To Proceed</h1>
            <div className="relative w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-green-500 animate-progress" />
            </div>
          </div>
        </div>
      )}
      <div className={isVisible ? "blur-sm" : ""}>
        {/* The rest of your application goes here */}
      </div>

      {/* Adding CSS for animation */}
      <style>{`
        @keyframes progress {
          0% {
            width: 0;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0;
          }
        }
        
        .animate-progress {
          animation: progress 1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default BlurOverlay;
