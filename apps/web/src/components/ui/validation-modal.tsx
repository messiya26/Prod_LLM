"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ValidationModalProps {
  errors: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function ValidationModal({ errors, isOpen, onClose }: ValidationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[90%] max-w-md"
          >
            <div className="bg-[#111827] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 px-6 py-4 flex items-center justify-between border-b border-red-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                    <FaExclamationTriangle className="text-red-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-cream font-bold text-base">Champs requis</h3>
                    <p className="text-cream/40 text-xs">Veuillez corriger les erreurs suivantes</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-cream/[0.05] flex items-center justify-center hover:bg-cream/[0.1] transition-colors">
                  <FaTimes className="text-cream/40 text-sm" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-2.5">
                {errors.map((err, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.08]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-cream/70 text-sm">{err}</span>
                  </motion.div>
                ))}
              </div>

              <div className="px-6 pb-5">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all"
                >
                  Compris, je corrige
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
