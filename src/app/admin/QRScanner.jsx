import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaCheckCircle, FaExclamationCircle, FaCamera, FaImage, FaUpload } from 'react-icons/fa';
import { scanBookingQR } from '../../services/api';
import './QRScanner.css';

const READER_ID = 'qr-camera-reader';

const QRScanner = () => {
  const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const html5QrRef = useRef(null);
  const loadingRef = useRef(false);
  const fileInputRef = useRef(null);

  // ─── Teardown camera ───────────────────────────────────────────────────────
  const stopCamera = useCallback(async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch (_) {}
      try { html5QrRef.current.clear(); } catch (_) {}
      html5QrRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // ─── Start camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    if (html5QrRef.current) return;
    setScanResult(null);
    setError(null);

    const qr = new Html5Qrcode(READER_ID);
    html5QrRef.current = qr;

    try {
      await qr.start(
        { facingMode: 'environment' },
        { fps: 20, qrbox: { width: 220, height: 220 } },
        onScanSuccess,
        () => {}
      );
      setCameraActive(true);
    } catch (err) {
      setError('Could not access camera. Check permissions.');
      html5QrRef.current = null;
    }
  }, []);

  // ─── Auto-start camera when tab switches to camera ─────────────────────────
  useEffect(() => {
    if (mode === 'camera') {
      const t = setTimeout(startCamera, 150);
      return () => clearTimeout(t);
    } else {
      stopCamera();
    }
    return () => {};
  }, [mode]);

  // Cleanup on unmount
  useEffect(() => () => { stopCamera(); }, []);

  // ─── Shared API call (used by both camera and file upload paths) ────────────
  const handleScanResult = async (decodedText) => {
    setLoading(true);
    setError(null);
    setScanResult(null);
    try {
      const data = await scanBookingQR(decodedText);
      if (!data.error && data.success) {
        setScanResult(data.booking);
      } else {
        setError(data.error || data.message || 'Check-in failed');
      }
    } catch {
      setError('Network error or server unavailable');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // ─── Camera scan success (guard prevents double-fires) ────────────────────
  const onScanSuccess = async (decodedText) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    // Pause camera feed
    if (html5QrRef.current) {
      try { await html5QrRef.current.pause(); } catch (_) {}
    }
    await handleScanResult(decodedText);
  };

  // ─── Process a file for QR scanning ───────────────────────────────────────
  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setScanResult(null);

    const qr = new Html5Qrcode('qr-file-scratch');
    try {
      const result = await qr.scanFile(file, false);
      // Don't go through onScanSuccess (which has a loadingRef guard for camera);
      // call handleScanResult directly — it owns loading state from here.
      loadingRef.current = true;
      await handleScanResult(result);
    } catch {
      setError('No QR code detected in image. Try a clearer photo.');
      setLoading(false);
      loadingRef.current = false;
    } finally {
      try { qr.clear(); } catch (_) {}
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ─── Resume scanning ───────────────────────────────────────────────────────
  const resumeScan = async () => {
    setScanResult(null);
    setError(null);
    setImagePreview(null);
    if (mode === 'camera' && html5QrRef.current) {
      try { await html5QrRef.current.resume(); } catch (_) {}
    }
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setScanResult(null);
    setError(null);
    setImagePreview(null);
    setMode(newMode);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="qr-scanner-view">
      {/* Hidden scratch div required by Html5Qrcode for file scanning */}
      <div id="qr-file-scratch" style={{ display: 'none' }} />

      <div className="scanner-terminal-card">
        {/* Header */}
        <div className="terminal-header">
          <div className="terminal-brand">
            <span className="brand-dot" />
            <span className="brand-text">CHECK-IN TERMINAL</span>
          </div>
          <h1>QR Code Scanner</h1>
          <p>Scan a guest's booking QR code via camera or upload an image</p>
        </div>

        {/* Mode Tabs */}
        <div className="scanner-tabs">
          <button
            className={`scanner-tab ${mode === 'camera' ? 'active' : ''}`}
            onClick={() => switchMode('camera')}
          >
            <FaCamera /> Camera
          </button>
          <button
            className={`scanner-tab ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => switchMode('upload')}
          >
            <FaImage /> Upload Image
          </button>
        </div>

        {/* ── CAMERA MODE ── */}
        {mode === 'camera' && (
          <div className="terminal-viewfinder-wrap">
            <div className="scanner-viewfinder">
              <div className="viewfinder-corner top-left" />
              <div className="viewfinder-corner top-right" />
              <div className="viewfinder-corner bottom-left" />
              <div className="viewfinder-corner bottom-right" />
              <div className="scan-laser" />
              <div id={READER_ID} className="qr-reader" />
              {!cameraActive && !error && (
                <div className="camera-starting-overlay">
                  <div className="loading-spinner" />
                  <span>Starting camera…</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── UPLOAD MODE ── */}
        {mode === 'upload' && (
          <div className="upload-zone-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="qr-file-input"
            />
            <label
              htmlFor="qr-file-input"
              className={`upload-drop-zone ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-preview' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="upload-preview-wrap">
                  <img src={imagePreview} alt="QR Preview" className="upload-preview-img" />
                  <span className="upload-preview-hint">Click to choose a different image</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon-ring">
                    <FaUpload className="upload-icon" />
                  </div>
                  <span className="upload-title">Drop QR image here</span>
                  <span className="upload-subtitle">or click to browse files</span>
                  <span className="upload-formats">PNG · JPG · WEBP · GIF</span>
                </div>
              )}
            </label>
          </div>
        )}

        {/* ── Status Area ── */}
        <div className="terminal-status-area">
          {loading && (
            <div className="scanner-loading">
              <div className="loading-spinner" />
              <span>Processing check-in details…</span>
            </div>
          )}

          {error && !loading && (
            <div className="scan-result-card error-result">
              <div className="result-header">
                <FaExclamationCircle className="result-error-icon" />
                <h3>Scan Failed</h3>
                <span className="result-badge error">Invalid</span>
              </div>
              <div className="result-body">
                <p className="error-message">{error}</p>
              </div>
              <button className="btn-resume-v2 btn-error-retry" onClick={resumeScan}>Try Again</button>
            </div>
          )}

          {scanResult && !loading && (
            <div className="scan-result-card success-result">
              <div className="result-header">
                <FaCheckCircle className="result-success-icon" />
                <h3>Check-In Success</h3>
                <span className="result-badge confirmed">Verified</span>
              </div>
              <div className="result-body">
                <div className="result-row">
                  <span className="result-label">GUEST</span>
                  <span className="result-value">{scanResult.guest}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">BOOKING ID</span>
                  <span className="result-value monospace">#{scanResult.id?.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">ROOM</span>
                  <span className="result-value highlight-room">{scanResult.roomNo || 'Auto-Assigned'}</span>
                </div>
              </div>
              <button className="btn-resume-v2" onClick={resumeScan}>Scan Next Guest</button>
            </div>
          )}

          {!loading && !error && !scanResult && mode === 'camera' && cameraActive && (
            <div className="scan-instructions-v2">
              <div className="instructions-icon-pulse">
                <div className="pulse-ring" />
                <div className="pulse-dot" />
              </div>
              <span>Scanning Active &amp; Ready</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
