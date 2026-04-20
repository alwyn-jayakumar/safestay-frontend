import { useState } from 'react';
import { Scanner as QrScanner,  } from '@yudiel/react-qr-scanner';
import type{ IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useGeolocation } from '../../hooks/useGeolocation';

interface ScannerProps {
  onVerified: (data: { qr: string; coords: { lat: number; lng: number } }) => void;
}

export const Scanner = ({ onVerified }: ScannerProps) => {
  const { location, getLocation, error: gpsError } = useGeolocation();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0 && location && !isVerifying) {
      setIsVerifying(true);
      const qrValue = detectedCodes[0].rawValue;
      
      console.log("Match found! Verifying location...");
      onVerified({ qr: qrValue, coords: location });
    }
  };

  return (
    <div className="p-6 flex flex-col items-center max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Caregiver Check-in</h2>
        <p className="text-slate-500 text-sm">Position the patient's QR code in the frame</p>
      </div>
      
      {!location ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
          <p className="mb-4 text-slate-600">Location access is required to verify your visit.</p>
          <button 
            onClick={getLocation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
          >
            Enable GPS
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-square overflow-hidden rounded-3xl border-4 border-white shadow-2xl bg-black">
          <QrScanner
            onScan={handleScan}
            onError={(error) => console.error(error)}
            constraints={{ facingMode: 'environment' }}
          />
          {/* Visual Overlay */}
          <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none">
            <div className="w-full h-full border-2 border-blue-400 rounded-xl animate-pulse" />
          </div>
        </div>
      )}
      
      {gpsError && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
          ⚠️ GPS Error: {gpsError}
        </div>
      )}

      {isVerifying && (
        <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Verifying Visit...
        </div>
      )}
    </div>
  );
};