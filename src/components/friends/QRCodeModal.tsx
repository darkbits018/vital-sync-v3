import React, { useState, useEffect } from 'react';
import { X, QrCode, Download, Share, Copy, Check } from 'lucide-react';
import { friendsApi } from '../../services/friendsApi';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'generate' | 'scan';
  onFriendAdded?: () => void;
}

export function QRCodeModal({ isOpen, onClose, mode, onFriendAdded }: QRCodeModalProps) {
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'generate') {
      generateQRCode();
    }
  }, [isOpen, mode]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const qrCode = await friendsApi.generateQRCode();
      setQrData(qrCode);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Add me on FitTracker',
          text: 'Connect with me on FitTracker to share our fitness journey!',
          url: qrData,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const startScanning = () => {
    setScanning(true);
    
    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported on this device');
      setScanning(false);
      return;
    }
    
    // Request camera access
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment' // Use back camera
      } 
    })
    .then(stream => {
      // In a real implementation, you would use a QR code scanning library here
      // For now, we'll simulate the scanning process
      console.log('Camera stream started:', stream);
      
      // Stop the stream after simulation
      stream.getTracks().forEach(track => track.stop());
      
      // Simulate successful scan after 3 seconds
      setTimeout(() => {
        setScanning(false);
        onFriendAdded?.();
        onClose();
      }, 3000);
    })
    .catch(error => {
      console.error('Camera access denied:', error);
      alert('Camera access is required to scan QR codes');
      setScanning(false);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {mode === 'generate' ? 'Share QR Code' : 'Scan QR Code'}
                </h3>
                <p className="text-blue-200 text-sm">
                  {mode === 'generate' ? 'Let others scan to add you' : 'Scan to add a friend'}
                </p>
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
          {mode === 'generate' ? (
            <div className="space-y-6">
              {/* QR Code Display */}
              <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                {loading ? (
                  <div className="py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Generating QR code...</p>
                  </div>
                ) : (
                  <div className="py-8">
                    {/* Mock QR Code - In production, use a QR code library */}
                    <div className="w-48 h-48 bg-gray-900 mx-auto rounded-lg flex items-center justify-center">
                      <QrCode size={120} className="text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
                      Others can scan this code to add you as a friend
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!loading && (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center space-y-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied ? (
                      <Check size={20} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy size={20} className="text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex flex-col items-center space-y-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Share size={20} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Share</span>
                  </button>

                  <button
                    onClick={() => {
                      // TODO: Implement download functionality
                      console.log('Download QR code');
                    }}
                    className="flex flex-col items-center space-y-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download size={20} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Save</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Camera View */}
              <div className="bg-gray-900 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
                {scanning ? (
                  <div className="text-center text-white">
                    <div className="animate-pulse">
                      <QrCode size={80} className="mx-auto mb-4" />
                    </div>
                    <p className="text-sm">Scanning for QR code...</p>
                    <div className="absolute inset-4 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                    <div className="absolute inset-8 border border-blue-400 rounded-lg opacity-50"></div>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <QrCode size={80} className="mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Camera will appear here</p>
                    <p className="text-xs opacity-50 mt-2">Point camera at QR code</p>
                  </div>
                )}
              </div>

              {/* Scan Button */}
              <button
                onClick={startScanning}
                disabled={scanning}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? 'Scanning...' : 'Start Camera & Scan'}
              </button>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to scan:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Allow camera access when prompted</li>
                  <li>• Point your camera at the QR code</li>
                  <li>• Make sure the code is well-lit</li>
                  <li>• Hold steady until recognized</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}