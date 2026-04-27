// c:\Obsidian\Ethyx\frontend\components\shared\LoadingOverlay.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = "Processing..." }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg-base/80 backdrop-blur-md rounded-2xl border border-teal-dim"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-teal mb-4" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="font-orbitron text-teal tracking-widest uppercase text-sm"
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
