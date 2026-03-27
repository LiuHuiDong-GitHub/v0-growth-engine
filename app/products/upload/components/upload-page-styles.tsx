/**
 * 产品上传页内联 keyframes 与全局样式（步骤 2 从 page 抽离，逻辑不变）
 * 保持与原 page 内 <style> 完全一致，不改变类名与动画行为。
 */
export function UploadPageStyles() {
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
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
  )
}
