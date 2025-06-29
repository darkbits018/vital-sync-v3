import React from 'react';
import { X, Crown, Check, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  features?: string[];
  onUpgradeClick?: () => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = 'Upgrade to Premium',
  message = 'Unlock all features and remove limitations',
  features = [],
  onUpgradeClick,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const defaultFeatures = [
    'Unlimited challenges',
    'Create custom challenges',
    'Full leaderboard access',
    'Exclusive rewards',
    'Advanced analytics',
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <Crown size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Premium Benefits</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{feature}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={onUpgradeClick}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center space-x-2"
            >
              <Crown size={18} />
              <span>Upgrade Now</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}