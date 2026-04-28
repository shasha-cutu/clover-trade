"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BalanceCardProps {
  type: "xlm" | "clvr";
  value: string;
  address?: string;
  isLoading?: boolean;
}

export default function BalanceCard({ type, value, address, isLoading }: BalanceCardProps) {
  const [copied, setCopied] = useState(false);
  const isXLM = type === "xlm";
  
  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6 group overflow-hidden relative">
      {/* Clover Accent Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 opacity-20 group-hover:opacity-40 ${isXLM ? 'bg-emerald-400' : 'bg-green-500'}`} />
      
      <div className="flex justify-between items-center relative z-10">
        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
          {type} Balance
        </span>
        <div className={`w-2 h-2 rounded-full animate-pulse ${isXLM ? 'bg-emerald-400' : 'bg-green-500'}`} />
      </div>
      
      <div className="relative z-10">
        {isLoading ? (
          <div className="h-10 w-32 skeleton rounded-lg" />
        ) : (
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {value} <span className="text-emerald-500 uppercase text-lg">{type}</span>
          </h2>
        )}
        <p className="text-sm font-medium text-slate-400 mt-1">
          ≈ ${value === "---" ? "0.00" : (parseFloat(value.replace(/,/g, '')) * (isXLM ? 0.11 : 1.05)).toFixed(2)} USD
        </p>
      </div>
      
      {address && (
        <div className="flex items-center justify-between pt-4 border-t border-emerald-50 relative z-10">
          <span className="text-slate-500 font-mono text-xs truncate mr-4">
            {address.slice(0, 12)}...{address.slice(-12)}
          </span>
          <button 
            onClick={handleCopy}
            className="p-2 bg-emerald-50 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
