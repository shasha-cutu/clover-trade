"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, PieChart, Activity, Clover } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        {/* Animated Background Clover Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-emerald-100/30 to-transparent opacity-60 blur-3xl -z-10" />
        
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 items-center gap-12 text-left">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold mb-8">
              <Clover size={16} className="animate-pulse" />
              SOROBAN MAINNET READY
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-slate-950 mb-8 leading-[0.9]">
              GREENIFY YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                STELLAR ASSETS
              </span>
            </h1>
            
            <p className="max-w-xl text-xl text-slate-600 mb-12">
              CloverTrade is the high-performance Soroban engine for tokens, liquidity, and governance. 
              Experience the future of DeFi on Stellar with clover-powered precision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard" className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center">
                START TRADING
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="btn-secondary w-full sm:w-auto text-center">
                LEARN MORE
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block animate-float">
            <img 
              src="/hero-clover.png" 
              alt="CloverTrade Engine" 
              className="w-full h-auto drop-shadow-[0_0_50px_rgba(16,185,129,0.2)] rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50/50 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">Clover-Powered Capabilities</h2>
            <p className="text-slate-500 mt-4">Built on the robust Soroban smart contract framework.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-emerald-500" />}
              title="Infinite Liquidity"
              desc="Constant product AMM ensuring seamless swaps between native XLM and CLVR tokens with minimal slippage."
            />
            <FeatureCard 
              icon={<Shield className="text-green-500" />}
              title="Advanced Tokens"
              desc="Secure, administrative-controlled token logic with built-in supply tracking and role-based permissions."
            />
            <FeatureCard 
              icon={<PieChart className="text-emerald-600" />}
              title="Emerald Governance"
              desc="Stake your assets and vote on proposals to shape the future of the CloverTrade ecosystem."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatBox label="Active Users" value="12.4K+" />
          <StatBox label="Total Volume" value="$48.2M" />
          <StatBox label="Tokens Listed" value="85" />
          <StatBox label="Avg. Fee" value="0.01%" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:row items-center justify-between gap-8">
          <div className="text-xl font-black tracking-tighter">
            CLOVER <span className="text-emerald-500">TRADE</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">GitHub</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Twitter</a>
          </div>
          <div className="text-sm text-slate-400">
            © 2026 CloverTrade Ecosystem. Built on Stellar.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-8 group hover:border-emerald-200">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold text-emerald-600 mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-4xl font-black text-slate-900">{value}</div>
    </div>
  );
}
