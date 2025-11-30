import { MessageCircle } from 'lucide-react';

interface TopBarProps {
  userName: string;
  onAskBravo: () => void;
}

export default function TopBar({ userName, onAskBravo }: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">Good Morning, {userName} 👋</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
          "The only bad workout is the one you didn't do."
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <button 
          onClick={onAskBravo}
          className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-shadow text-sm sm:text-base"
        >
          <MessageCircle size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden xs:inline sm:inline">Ask BRAVO</span>
        </button>
      </div>
    </div>
  );
}
