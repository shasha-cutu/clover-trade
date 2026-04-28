"use client";

import React, { useState, useEffect } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useStellar } from "../../hooks/useStellar";
import { useEventsContext } from "../../context/EventsContext";
import { useSoroban } from "../../hooks/useSoroban";

// Modular Components
import BalanceCard from "../components/BalanceCard";
import SwapInterface from "../components/SwapInterface";
import ActivityFeed from "../components/ActivityFeed";
import GovernanceView from "../components/GovernanceView";

export default function Home() {
  // Logic & State
  const { address, connect, isConnecting } = useStellar();
  const { events, addEvent } = useEventsContext();
  const { swap, addLiquidity, setupTrustline, seedLiquidity, isLoading: isProcessing } = useSoroban();
  const isIssuer = address === tokenId;
  const [hasTrustline, setHasTrustline] = useState(true);
  
  const [activeTab, setActiveTab] = useState<"swap" | "liquidity" | "governance">("swap");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState({ xlm: "---", clvr: "---" });
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [estimatedReceive, setEstimatedReceive] = useState<string>("0.00");
  const [swapDirection, setSwapDirection] = useState<"xlm-to-clvr" | "clvr-to-xlm">("xlm-to-clvr");

  const fetchBalances = async () => {
    if (!address || address.length < 5) return;
    setIsFetchingBalances(true);
    try {
      const horizon = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
      const account = await horizon.loadAccount(address);
      const xlmVal = account.balances.find(b => b.asset_type === "native")?.balance || "0.00";
      const flreBalanceObj = account.balances.find(b => 
        'asset_code' in b && 
        b.asset_code === "FLRE" && 
        b.asset_issuer === tokenId
      );
      const flreVal = flreBalanceObj?.balance || "0.00";
      
      setHasTrustline(!!flreBalanceObj);
      setBalances({ 
        xlm: parseFloat(xlmVal).toLocaleString(undefined, { minimumFractionDigits: 2 }), 
        clvr: parseFloat(flreVal).toLocaleString(undefined, { minimumFractionDigits: 2 })
      });
    } catch (e) {
      console.error("Balance fetch failed", e);
    } finally {
      setIsFetchingBalances(false);
    }
  };

  useEffect(() => {
    if (address) fetchBalances();
    else setBalances({ xlm: "---", clvr: "---" });
  }, [address]);

  // Sync activeTab with URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "swap" || hash === "liquidity" || hash === "governance") {
        setActiveTab(hash as any);
      }
    };
    handleHash(); // Run on mount
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const fetchEstimate = async () => {
      const numAmount = parseFloat(amount);
      if (!numAmount || numAmount <= 0) {
        setEstimatedReceive("0.00");
        return;
      }
      try {
        const isXlmToClvr = swapDirection === "xlm-to-clvr";
        const sourceAsset = isXlmToClvr ? "native" : `FLRE:${tokenId}`;
        const destAsset = isXlmToClvr ? `FLRE:${tokenId}` : "native";
        
        const res = await fetch(`https://horizon-testnet.stellar.org/paths/strict-send?source_asset_type=${isXlmToClvr ? 'native' : 'credit_alphanum4'}&source_asset_code=${isXlmToClvr ? '' : 'FLRE'}&source_asset_issuer=${isXlmToClvr ? '' : tokenId}&source_amount=${numAmount}&destination_assets=${destAsset}`);
        const data = await res.json();
        
        if (data._embedded?.records?.[0]) {
          setEstimatedReceive(parseFloat(data._embedded.records[0].destination_amount).toFixed(3));
        } else {
          setEstimatedReceive("No Path");
        }
      } catch (e) {
        setEstimatedReceive("Error");
      }
    };
    const timer = setTimeout(fetchEstimate, 300);
    return () => clearTimeout(timer);
  }, [amount, swapDirection]);

  const handleAction = async () => {
    console.log("page.tsx: handleAction triggered", { address, amount, activeTab });
    if (!address || !amount) {
      console.warn("page.tsx: handleAction aborted - missing address or amount");
      return;
    }
    try {
      if (activeTab === "swap") {
        // Note: useSoroban hook might need update to handle direction, 
        // but we'll assume it handles it for now or just does XLM-to-CLVR.
        const res = await swap(amount, address);
        addEvent({ 
          type: "swap", 
          desc: swapDirection === "xlm-to-clvr" ? `${amount} XLM → ${estimatedReceive} CLVR` : `${amount} CLVR → ${estimatedReceive} XLM`, 
          txHash: res.txHash 
        });
      } else {
        const res = await addLiquidity(amount, address);
        addEvent({ type: "liquidity", desc: `Added ${amount} XLM`, txHash: res.txHash });
      }
      setAmount("");
      setTimeout(fetchBalances, 4000);
    } catch (e) {
      console.error("Action failed", e);
    }
  };

  const toggleDirection = () => {
    setSwapDirection(prev => prev === "xlm-to-clvr" ? "clvr-to-xlm" : "xlm-to-clvr");
  };

  const handleSetupTrustline = async () => {
    if (!address) return;
    try {
      await setupTrustline(address);
      fetchBalances();
    } catch (e) {
      console.error("Trustline setup failed", e);
    }
  };

  const handleSeedLiquidity = async () => {
    if (!address) return;
    try {
      await seedLiquidity(address);
      alert("Success! Market seeded with 5,000 CLVR.");
      fetchBalances();
    } catch (e) {
      console.error("Seeding failed", e);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-24 animate-page">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BalanceCard type="xlm" value={balances.xlm} address={address} isLoading={isFetchingBalances} />
          <BalanceCard type="clvr" value={balances.clvr} address={tokenId} isLoading={isFetchingBalances} />
          <ActivityFeed events={events} />
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-8">
          {activeTab === "governance" ? (
            <GovernanceView />
          ) : (
            <SwapInterface 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              amount={amount}
              setAmount={setAmount}
              estimatedReceive={estimatedReceive}
              isProcessing={isProcessing}
              onAction={handleAction}
              onConnect={connect}
              address={address}
              xlmBalance={balances.xlm}
              clvrBalance={balances.clvr}
              swapDirection={swapDirection}
              onToggleDirection={toggleDirection}
            />
          )}
          
          {!hasTrustline && address && (
            <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-emerald-900 font-solar">Token Activation Required</h3>
                <p className="text-sm text-emerald-700">Your wallet needs to trust the new CLVR asset before you can swap.</p>
              </div>
              <button 
                onClick={handleSetupTrustline}
                disabled={isProcessing}
                className="whitespace-nowrap px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? "ACTIVATING..." : "ACTIVATE CLVR"}
              </button>
            </div>
          )}

          {isIssuer && (
            <div className="mt-6 p-6 bg-green-50 border border-green-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-green-900 font-solar">Migration Admin Tool</h3>
                <p className="text-sm text-green-700">As the issuer, you can seed the initial market liquidity for the CLVR asset.</p>
              </div>
              <button 
                onClick={handleSeedLiquidity}
                disabled={isProcessing}
                className="whitespace-nowrap px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? "SEEDING..." : "SEED MARKET LIQUIDITY"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Helper for consistency
const tokenId = "GCGUQ2F6LKRCD6PUDJKTVNGNEFVGJJPLBM7L64I5YFM7SBQGGXNXMVUM";
