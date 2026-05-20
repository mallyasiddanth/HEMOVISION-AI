import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, ChevronRight, X, Eye, Hand, RefreshCw } from 'lucide-react';
import type { PatientData } from '../types';

interface DiagnosticCaptureProps {
  patientData: PatientData;
  onComplete: (images: { eyes: string; nailbeds: string; hands: string }) => void;
  onCancel: () => void;
}

const DiagnosticCapture: React.FC<DiagnosticCaptureProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'eyes' | 'nailbeds' | 'hands'>('eyes');
  const [capturedImages, setCapturedImages] = useState<{ eyes: string; nailbeds: string; hands: string }>({
    eyes: '',
    nailbeds: '',
    hands: ''
  });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraActive, step]);

  const startCamera = async () => {
    setCameraError('');
    
    // 1. Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('SECURE_CONTEXT_REQUIRED: Mobile browsers and some desktop browsers block camera on non-HTTPS links.');
      setIsCameraActive(false);
      return;
    }

    try {
      // 2. Clear any existing streams
      stopCamera();

      // 3. Define constraints
      const constraints = { 
        video: { 
          facingMode: { ideal: step === 'eyes' ? 'user' : 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready before playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => {
            console.error("Video play failed", e);
            setCameraError("PLAYER_ERROR: Could not start video stream playback.");
          });
        };
      }
    } catch (err: any) {
      console.error("Detailed Camera Error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('PERMISSION_DENIED: Please click the "Camera" icon in your browser address bar and choose "Allow".');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('DEVICE_NOT_FOUND: No camera hardware detected on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('DEVICE_IN_USE: Another application is already using the camera. Please close it and try again.');
      } else {
        setCameraError(`HARDWARE_ERROR: ${err.message || 'Unknown camera error occurred.'}`);
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("Stopped track:", track.label);
      });
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0);
        
        // Convert canvas to base64 image string
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
        handleImageSelection(imageData);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageSelection(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelection = (dataUrl: string) => {
    setCapturedImages(prev => ({ ...prev, [step]: dataUrl }));
    setIsCameraActive(false);
  };

  const handleNext = () => {
    if (step === 'eyes') {
      setStep('nailbeds');
    } else if (step === 'nailbeds') {
      setStep('hands');
    } else {
      onComplete(capturedImages);
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Diagnostic Biometrics</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '0.1em' }}>STEP 02: </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {step === 'eyes' ? 'Ocular Vascular Analysis' : (step === 'nailbeds' ? 'Capillary Refill Mapping' : 'Palmar Surface Analysis')}
            </span>
          </div>
        </div>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={28} />
        </button>
      </div>

      {cameraError && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.15)', 
          border: '1px solid var(--hospital-danger)', 
          color: '#fca5a5', 
          padding: '20px', 
          borderRadius: '16px', 
          marginBottom: '32px',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontWeight: 800, color: 'var(--hospital-danger)' }}>
            <AlertCircle size={20} color="var(--hospital-danger)" />
            DIAGNOSTIC HARDWARE ERROR
          </div>
          {cameraError}
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => { setCameraError(''); setIsCameraActive(true); }}
              className="hospital-btn hospital-btn-outline" 
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--hospital-danger)', color: 'white' }}
            >
              <RefreshCw size={14} /> Retry Hardware Sync
            </button>
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
              Or use <strong>Upload Data</strong> below.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div style={{ 
          flex: 1, 
          height: '4px', 
          background: 'var(--accent-cyan)', 
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(125, 211, 252, 0.4)'
        }} />
        <div style={{ 
          flex: 1, 
          height: '4px', 
          background: step === 'nailbeds' || step === 'hands' || capturedImages.nailbeds ? 'var(--accent-cyan)' : 'var(--glass-border)', 
          borderRadius: '2px',
          boxShadow: step === 'nailbeds' || step === 'hands' || capturedImages.nailbeds ? '0 0 10px rgba(125, 211, 252, 0.4)' : 'none',
          transition: 'all 0.3s ease'
        }} />
        <div style={{ 
          flex: 1, 
          height: '4px', 
          background: step === 'hands' || capturedImages.hands ? 'var(--accent-cyan)' : 'var(--glass-border)', 
          borderRadius: '2px',
          boxShadow: step === 'hands' || capturedImages.hands ? '0 0 10px rgba(125, 211, 252, 0.4)' : 'none',
          transition: 'all 0.3s ease'
        }} />
      </div>

      <div style={{ 
        aspectRatio: '16/9', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '40px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)'
      }}>
        {capturedImages[step] && !isCameraActive ? (
          <img 
            src={capturedImages[step]} 
            alt="Biometric Capture" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : isCameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--accent-cyan)',
              border: '1px solid var(--glass-border)'
            }}>
              {step === 'eyes' ? <Eye size={48} /> : <Hand size={48} />}
            </div>
            <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>READY FOR BIOMETRIC SCAN</p>
          </div>
        )}

        {isCameraActive && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'var(--accent-cyan)',
            boxShadow: '0 0 15px var(--accent-cyan)',
            animation: 'scanLine 2s linear infinite',
            zIndex: 10
          }} />
        )}

        <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {!isCameraActive ? (
            <>
              <button 
                onClick={() => setIsCameraActive(true)}
                className="hospital-btn"
                style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  border: '1px solid var(--glass-border)',
                  padding: '12px 24px'
                }}
              >
                <Camera size={20} />
                {capturedImages[step] ? 'Retake Scan' : 'Initialize Camera'}
              </button>
              <label className="hospital-btn" style={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                backdropFilter: 'blur(8px)',
                color: 'white',
                border: '1px solid var(--glass-border)',
                padding: '12px 24px',
                cursor: 'pointer'
              }}>
                <Upload size={20} />
                Upload Data
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </>
          ) : (
            <button 
              onClick={capturePhoto}
              style={{ 
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '6px solid rgba(125, 211, 252, 0.4)',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(255,255,255,0.2)'
              }}
            />
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} />
          <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
            {step === 'eyes' ? 'Focus on sclera (white part) of the eye.' : (step === 'nailbeds' ? 'Capture distal phalanges (fingertips) clearly.' : 'Position open palms clearly within frame.')}
          </p>
        </div>
        <button
          onClick={handleNext}
          disabled={!capturedImages[step]}
          className="hospital-btn hospital-btn-primary"
          style={{ 
            opacity: capturedImages[step] ? 1 : 0.5,
            cursor: capturedImages[step] ? 'pointer' : 'not-allowed'
          }}
        >
          {step === 'eyes' ? 'Next: Nailbed Scan' : (step === 'nailbeds' ? 'Next: Hand Scan' : 'Process Diagnostic Data')}
          {capturedImages[step] && <ChevronRight size={20} />}
        </button>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

// Internal utility icon for error display
const AlertCircle = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default DiagnosticCapture;
