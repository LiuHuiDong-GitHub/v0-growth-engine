/**
 * 产品详情页动画 keyframes
 * 设计意图：从 page 内联 <style> 抽出，便于维护与复用
 */
export function ProductDetailStyles() {
  return (
    <style>{`
      @keyframes borderBlink {
        0%, 100% {
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
        }
        50% {
          border-color: rgba(239, 68, 68, 0.9);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
        }
      }
      @keyframes shake-text {
        0% { transform: scale(1); }
        25% { transform: scale(1.05) translate(-2px, 0); }
        50% { transform: scale(1); }
        75% { transform: scale(1.05) translate(2px, 0); }
        100% { transform: scale(1); }
      }
      .animate-pulse {
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .animate-shake-text {
        animation: shake-text 0.82s cubic-bezier(.36,.07,.19,.97) both;
      }
    `}</style>
  )
}
