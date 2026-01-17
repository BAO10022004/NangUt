
export const LoadingForm = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        {/* Main spinner */}
        <div className="loading-spinner-main">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-core"></div>
        </div>

        {/* Loading text */}
        <div className="loading-text">
          <span className="text-glitch" data-text={message}>
            {message}
          </span>
        </div>

        {/* Progress dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        {/* Cyber lines */}
        <div className="cyber-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
      </div>

      <style>{`
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          background: rgba(0, 10, 10, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .loading-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, 0.1),
            transparent
          );
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          to {
            left: 100%;
          }
        }

        .loading-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        /* Main Spinner */
        .loading-spinner-main {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .spinner-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-radius: 50%;
          animation: rotate 3s linear infinite;
        }

        .spinner-ring:nth-child(1) {
          border-top-color: #00ffff;
          border-right-color: #00ffff;
          animation-duration: 1.5s;
        }

        .spinner-ring:nth-child(2) {
          border-bottom-color: #00ff64;
          border-left-color: #00ff64;
          animation-duration: 2s;
          animation-direction: reverse;
        }

        .spinner-ring:nth-child(3) {
          border-top-color: #00c8ff;
          border-bottom-color: #00c8ff;
          animation-duration: 2.5s;
        }

        .spinner-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: radial-gradient(
            circle,
            rgba(0, 255, 255, 0.8),
            rgba(0, 255, 255, 0) 70%
          );
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        /* Loading Text */
        .loading-text {
          position: relative;
        }

        .text-glitch {
          color: #00ffff;
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 
            0 0 10px rgba(0, 255, 255, 0.8),
            0 0 20px rgba(0, 255, 255, 0.4);
          animation: glitch 3s infinite;
          position: relative;
          display: inline-block;
        }

        .text-glitch::before,
        .text-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        .text-glitch::before {
          animation: glitch-1 2s infinite;
          color: #ff00ff;
          z-index: -1;
        }

        .text-glitch::after {
          animation: glitch-2 2s infinite;
          color: #00ff00;
          z-index: -2;
        }

        @keyframes glitch {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(0, 255, 255, 0.8),
              0 0 20px rgba(0, 255, 255, 0.4);
          }
          20%, 60% {
            text-shadow: 
              0 0 10px rgba(0, 255, 255, 0.8),
              0 0 20px rgba(0, 255, 255, 0.4),
              -2px 0 rgba(255, 0, 255, 0.5),
              2px 0 rgba(0, 255, 0, 0.5);
          }
        }

        @keyframes glitch-1 {
          0%, 100% {
            transform: translate(0);
            opacity: 0;
          }
          20% {
            transform: translate(-2px, -2px);
            opacity: 0.8;
          }
        }

        @keyframes glitch-2 {
          0%, 100% {
            transform: translate(0);
            opacity: 0;
          }
          40% {
            transform: translate(2px, 2px);
            opacity: 0.8;
          }
        }

        /* Loading Dots */
        .loading-dots {
          display: flex;
          gap: 12px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .dot:nth-child(2) {
          animation-delay: -0.16s;
          background: #00ff64;
          box-shadow: 0 0 10px rgba(0, 255, 100, 0.8);
        }

        .dot:nth-child(3) {
          background: #00c8ff;
          box-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Cyber Lines */
        .cyber-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .line {
          position: absolute;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, 0.5),
            transparent
          );
          height: 1px;
        }

        .line-1 {
          top: 20%;
          width: 60%;
          left: -60%;
          animation: slideLine 3s linear infinite;
        }

        .line-2 {
          top: 50%;
          width: 40%;
          left: -40%;
          animation: slideLine 4s linear infinite 1s;
        }

        .line-3 {
          top: 80%;
          width: 50%;
          left: -50%;
          animation: slideLine 3.5s linear infinite 0.5s;
        }

        @keyframes slideLine {
          to {
            left: 100%;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .loading-spinner-main {
            width: 80px;
            height: 80px;
          }

          .spinner-core {
            width: 30px;
            height: 30px;
          }

          .text-glitch {
            font-size: 14px;
            letter-spacing: 1px;
          }

          .dot {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};
