import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useGeolocation } from '../../hooks/useGeolocation';

export const Scanner = ({ onVerified }: { onVerified: (data: any) => void }) => {
  const { location, getLocation, error: gpsError } = useGeolocation();
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'VERIFYING'>('IDLE');

  const handleScan = async (result: any) => {
    if (result && location) {
      setStatus('VERIFYING');
      // Send result.text + location to your FastAPI backend
      // Backend will check if coords are within 50m of Patient's address
      onVerified({ qr: result.text, coords: location });
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Daily Check-in</h2>
      
      {!location ? (
        <button 
          onClick={getLocation}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold active:scale-95 transition"
        >
          Enable GPS to Start
        </button>
      ) : (
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border-4 border-blue-500 shadow-2xl">
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%' }}
          />
        </div>
      )}
      
      {gpsError && <p className="text-red-500 mt-2">Error: {gpsError}</p>}
      <p className="mt-4 text-gray-500 text-sm">Stand near the patient's QR code</p>
    </div>
  );
};