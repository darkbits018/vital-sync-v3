import React, { useState } from 'react';
import { X, Smartphone, Wifi, Check, AlertCircle } from 'lucide-react';
import { friendsApi } from '../../services/friendsApi';

interface NFCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFriendAdded?: () => void;
}

export function NFCModal({ isOpen, onClose, onFriendAdded }: NFCModalProps) {
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'listening' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const startNFCListening = async () => {
    setNfcStatus('listening');
    setErrorMessage('');

    try {
      // Check if NFC is available
      if (!('NDEFReader' in window)) {
        throw new Error('NFC is not supported on this device');
      }

      // TODO: Implement actual NFC reading
      // const ndef = new NDEFReader();
      // await ndef.scan();
      
      // Mock NFC interaction
      setTimeout(() => {
        // Simulate successful NFC read
        setNfcStatus('success');
        setTimeout(() => {
          onFriendAdded?.();
          onClose();
        }, 2000);
      }, 3000);

    } catch (error) {
      setNfcStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'NFC operation failed');
    }
  };

  const stopNFCListening = () => {
    setNfcStatus('idle');
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">NFC Friend Add</h3>
                <p className="text-green-200 text-sm">Tap devices to connect</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* NFC Status Display */}
            <div className="text-center">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                nfcStatus === 'listening' ? 'bg-blue-100 dark:bg-blue-900/20 animate-pulse' :
                nfcStatus === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                nfcStatus === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                'bg-gray-100 dark:bg-gray-700'
              }`}>
                {nfcStatus === 'listening' && (
                  <div className="relative">
                    <Smartphone size={48} className="text-blue-600 dark:text-blue-400" />
                    <div className="absolute -top-2 -right-2">
                      <Wifi size={20} className="text-blue-600 dark:text-blue-400 animate-pulse" />
                    </div>
                  </div>
                )}
                {nfcStatus === 'success' && (
                  <Check size={48} className="text-green-600 dark:text-green-400" />
                )}
                {nfcStatus === 'error' && (
                  <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
                )}
                {nfcStatus === 'idle' && (
                  <Smartphone size={48} className="text-gray-400" />
                )}
              </div>

              <div className="space-y-2">
                {nfcStatus === 'idle' && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ready to Connect
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Tap the button below to start NFC listening
                    </p>
                  </>
                )}
                {nfcStatus === 'listening' && (
                  <>
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Listening for NFC...
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Hold your device close to your friend's device
                    </p>
                  </>
                )}
                {nfcStatus === 'success' && (
                  <>
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100">
                      Friend Added Successfully!
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      You're now connected
                    </p>
                  </>
                )}
                {nfcStatus === 'error' && (
                  <>
                    <h4 className="text-lg font-semibold text-red-900 dark:text-red-100">
                      Connection Failed
                    </h4>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      {errorMessage}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-3">
              {nfcStatus === 'idle' && (
                <button
                  onClick={startNFCListening}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Start NFC Listening
                </button>
              )}
              
              {nfcStatus === 'listening' && (
                <button
                  onClick={stopNFCListening}
                  className="w-full py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Stop Listening
                </button>
              )}
              
              {(nfcStatus === 'error' || nfcStatus === 'success') && (
                <button
                  onClick={() => setNfcStatus('idle')}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Try Again
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">How NFC works:</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Both devices need NFC enabled</li>
                <li>• Hold devices back-to-back</li>
                <li>• Keep devices close (within 4cm)</li>
                <li>• Wait for the connection confirmation</li>
              </ul>
            </div>

            {/* Browser Support Warning */}
            {!('NDEFReader' in window) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                <div className="flex items-start space-x-2">
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 text-sm">
                      Limited NFC Support
                    </h4>
                    <p className="text-yellow-800 dark:text-yellow-200 text-xs mt-1">
                      Your browser may not support NFC. Try using Chrome on Android or use QR codes instead.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}