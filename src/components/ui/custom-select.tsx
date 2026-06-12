'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  disabled = false,
  className = "",
  icon,
  placeholder = "Select option"
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Find currently selected option label
  const selectedOption = options.find(opt => opt.value === value)
  const displayLabel = selectedOption ? selectedOption.label : placeholder

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`cyber-input flex items-center justify-between rounded-lg py-3 px-4 text-xs transition-all duration-300 relative ${
          isOpen ? 'border-[#ff7300] ring-2 ring-orange-500/10' : ''
        } ${icon ? 'pl-9' : ''}`}
      >
        <div className="flex items-center gap-2 text-slate-200 font-medium overflow-hidden">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <span className="truncate">{displayLabel}</span>
        </div>
        
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#ff7300]' : ''}`} 
        />
      </div>

      {/* Floating Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-1.5 rounded-lg border border-orange-500/25 bg-[#09101f]/95 shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(255,115,0,0.12)] backdrop-blur-xl overflow-hidden max-h-60 overflow-y-auto"
            style={{ zIndex: 100 }}
          >
            <div className="py-1">
              {options.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                    }}
                    className={`px-4 py-2.5 text-xs font-mono transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-orange-500/10 text-[#ff7300] font-semibold border-l-2 border-[#ff7300]' 
                        : 'text-slate-350 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff7300] shadow-[0_0_6px_#ff7300]" />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
