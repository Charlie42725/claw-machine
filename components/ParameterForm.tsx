'use client';

import { useState } from 'react';
import type { GameParameters } from '@/lib/types';

interface ParameterFormProps {
  onSubmit: (params: GameParameters) => void;
  isLoading?: boolean;
}

export default function ParameterForm({ onSubmit, isLoading }: ParameterFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 基本参数
  const [R0, setR0] = useState(4);
  const [B0, setB0] = useState(76);
  const [payoutPerWin, setPayoutPerWin] = useState(500);
  const [costPerGrab, setCostPerGrab] = useState(10);

  // 进阶参数
  const [q, setQ] = useState(0);
  const [scratchPerGrab, setScratchPerGrab] = useState(1);
  const [grabsPerScratch, setGrabsPerScratch] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params: GameParameters = {
      R0,
      B0,
      payout_per_win: payoutPerWin,
      cost_per_grab: costPerGrab,
      q,
      scratch_per_grab: scratchPerGrab,
      grabs_per_scratch: grabsPerScratch,
    };

    onSubmit(params);
  };

  const loadExample = () => {
    setR0(4);
    setB0(76);
    setPayoutPerWin(500);
    setCostPerGrab(10);
    setQ(0);
    setScratchPerGrab(1);
    setGrabsPerScratch(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">遊戲參數</h2>
        <button
          type="button"
          onClick={loadExample}
          className="px-3 py-1 text-sm text-black bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
        >
          載入範例
        </button>
      </div>

      {/* 基本參數 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black border-b pb-2">基本參數</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              剩餘中獎刮卡數 (R0)
            </label>
            <input
              type="number"
              min="0"
              value={R0}
              onChange={(e) => setR0(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              剩餘未中刮卡數 (B0)
            </label>
            <input
              type="number"
              min="0"
              value={B0}
              onChange={(e) => setB0(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              中獎獎金 (元)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={payoutPerWin}
              onChange={(e) => setPayoutPerWin(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              每次夾取成本 (元)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={costPerGrab}
              onChange={(e) => setCostPerGrab(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
        </div>
      </div>

      {/* 進階參數 */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <span className="mr-2">{showAdvanced ? '▼' : '▶'}</span>
          進階參數 (機械參數)
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l-2 border-blue-200">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                未中獎安慰獎 (元)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={q}
                onChange={(e) => setQ(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-black mt-1">預設 0</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                一次夾拿幾張刮卡
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={scratchPerGrab}
                onChange={(e) => setScratchPerGrab(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-black mt-1">預設 1</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                平均夾幾次拿到一張
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={grabsPerScratch}
                onChange={(e) => setGrabsPerScratch(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-black mt-1">預設 1 (夾娃娃較難可設為 1.5-2)</p>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
      >
        {isLoading ? '計算中...' : '計算最優策略'}
      </button>
    </form>
  );
}
