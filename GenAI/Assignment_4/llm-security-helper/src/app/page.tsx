"use client";

import { useState, useEffect } from "react";

type Tab = "code" | "specs";

export default function Home() {
  const [tab, setTab] = useState<Tab>("code");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const endpoint = tab === "code" ? "/api/code-scan" : "/api/spec-scan";
      const body = tab === "code" ? { code: input } : { specs: input };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data.result);
    } catch (err: unknown) {
      setResult(
        `Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-lg font-bold text-white mt-6 mb-2 flex items-center gap-2"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("**") && line.includes(":**")) {
        const [label, ...rest] = line.split(":**");
        const cleanLabel = label.replace(/\*\*/g, "");
        const value = rest.join(":**").replace(/\*\*/g, "");
        const severityColors: Record<string, string> = {
          Critical: "text-red-400 bg-red-400/10 px-2 py-0.5 rounded",
          High: "text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded",
          Medium: "text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded",
          Low: "text-green-400 bg-green-400/10 px-2 py-0.5 rounded",
        };
        const severityMatch = value.trim();
        const severityClass = severityColors[severityMatch];

        return (
          <p key={i} className="text-sm mb-1 ml-4">
            <span className="text-cyan-400 font-semibold">{cleanLabel}:</span>{" "}
            {severityClass ? (
              <span className={severityClass}>{severityMatch}</span>
            ) : (
              <span className="text-gray-300">{value}</span>
            )}
          </p>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-sm text-gray-300 ml-4 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-[#06080f] text-gray-100 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px]" />

      <div
        className={`relative z-10 max-w-5xl mx-auto px-6 py-16 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg shadow-lg shadow-blue-500/20">
              🛡️
            </div>
            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                LLM Security Helper
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Analyze code for security vulnerabilities or evaluate GenAI app
            specs against OWASP LLM Top 10 &amp; MITRE ATLAS — powered by Llama
            3.1 via Groq.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-900/50 p-1 rounded-2xl w-fit border border-white/5">
          <button
            onClick={() => {
              setTab("code");
              setResult("");
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              tab === "code"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="mr-2">{"</>"}</span>
            Code → Security Fixes
          </button>
          <button
            onClick={() => {
              setTab("specs");
              setResult("");
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              tab === "specs"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="mr-2">📋</span>
            Specs → Vulnerabilities
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-gray-600 font-mono">
              {tab === "code" ? "security-scan.input" : "spec-analysis.input"}
            </span>
          </div>

          {/* Textarea */}
          <div className="p-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                tab === "code"
                  ? "// Paste your code snippet here...\n// e.g. a login function, API endpoint, database query\n// The analyzer will focus only on security issues"
                  : "Describe your GenAI / Agentic app:\n\n• What does it do?\n• What LLM does it use?\n• What data/tools/APIs can it access?\n• How do users interact with it?\n• What permissions does the AI have?"
              }
              rows={14}
              spellCheck={false}
              className="w-full bg-transparent p-5 text-sm font-mono text-gray-200 placeholder-gray-700 focus:outline-none resize-y leading-relaxed"
            />
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-gray-600">
              {input.length > 0
                ? `${input.length} characters`
                : "Waiting for input..."}
            </p>
            <button
              onClick={analyze}
              disabled={loading || !input.trim()}
              className="group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Run Analysis"
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div
            className="mt-8 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm shadow-2xl overflow-hidden animate-in"
            style={{ animation: "fadeUp 0.4s ease-out" }}
          >
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-white">
                  Analysis Complete
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
              >
                Copy Raw
              </button>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
              {formatResult(result)}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-700">
            Built with Next.js · Llama 3.1 8B via Groq · OWASP LLM Top 10 ·
            MITRE ATLAS
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </main>
  );
}
