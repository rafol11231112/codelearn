"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DevToolsBlocker() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let reloadTimeout: NodeJS.Timeout;

    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        setShowWarning(true);
        clearTimeout(reloadTimeout);
        reloadTimeout = setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setShowWarning(false);
        clearTimeout(reloadTimeout);
      }
    };

    const checkDebugger = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        setShowWarning(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    };

    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      setShowWarning(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    const preventKeyShortcuts = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        setShowWarning(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    };

    const interval = setInterval(detectDevTools, 500);
    const debugInterval = setInterval(checkDebugger, 1000);

    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('keydown', preventKeyShortcuts);

    const devtoolsCheck = () => {
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          window.location.reload();
        }
      });
      console.log(element);
    };

    const consoleInterval = setInterval(devtoolsCheck, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(debugInterval);
      clearInterval(consoleInterval);
      clearTimeout(reloadTimeout);
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventKeyShortcuts);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl border-2 border-red-600">
              <p className="font-semibold">⚠️ Unauthorized Access Detected</p>
              <p className="text-sm mt-1">Reloading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

