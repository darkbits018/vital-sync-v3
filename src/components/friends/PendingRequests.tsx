import React from 'react';
import { Check, X, Clock, MessageCircle } from 'lucide-react';
import { FriendRequest } from '../../types/friends';

interface PendingRequestsProps {
  requests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
}

export function PendingRequests({ requests, onAcceptRequest, onDeclineRequest }: PendingRequestsProps) {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Pending Requests
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You're all caught up! New friend requests will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {request.fromUser.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {request.fromUser.name}
                  </span>
                  {request.fromUser.isVerified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  @{request.fromUser.username}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Clock size={10} />
                  <span>{getTimeAgo(request.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAcceptRequest(request.id)}
                className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                title="Accept"
              >
                <Check size={16} />
              </button>
              
              <button
                onClick={() => onDeclineRequest(request.id)}
                className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                title="Decline"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-3">
              <div className="flex items-start space-x-2">
                <MessageCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{request.message}"
                </p>
              </div>
            </div>
          )}

          {/* Expiry Warning */}
          {request.expiresAt && new Date() > new Date(request.expiresAt.getTime() - 86400000) && (
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                ⚠️ This request expires soon
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}