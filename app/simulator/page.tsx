'use client';

import { useState, useRef } from 'react';
import AppHeader from '@/components/AppHeader';
import ParameterFormMobile, { type ParameterFormData } from '@/components/ParameterFormMobile';
import FixedBottomButton from '@/components/FixedBottomButton';
import ResultCardMobile from '@/components/ResultCardMobile';
import StrategySummary from '@/components/StrategySummary';
import PolicyMatrix from '@/components/PolicyMatrix';
import type { SolverResult } from '@/lib/types';

export default function SimulatorPage() {
  const [formData, setFormData] = useState<ParameterFormData>({
    R0: 4,
    B0: 76,
    payoutPerWin: 500,
    costPerGrab: 10,
    q: 0,
    scratchPerGrab: 1,
    grabsPerScratch: 1,
  });

  const [result, setResult] = useState<SolverResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const loadExample = () => {
    setFormData({
      R0: 4,
      B0: 76,
      payoutPerWin: 500,
      costPerGrab: 10,
      q: 0,
      scratchPerGrab: 1,
      grabsPerScratch: 1,
    });
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          R0: formData.R0,
          B0: formData.B0,
          payout_per_win: formData.payoutPerWin,
          cost_per_grab: formData.costPerGrab,
          q: formData.q,
          scratch_per_grab: formData.scratchPerGrab,
          grabs_per_scratch: formData.grabsPerScratch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '計算失敗');
      }

      setResult(data.data);

      // 計算完成後自動滑到結果區
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('Solver error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const canCalculate = formData.R0 >= 0 && formData.B0 >= 0 && (formData.R0 + formData.B0) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <AppHeader onLoadExample={loadExample} />

      {/* 主內容區 */}
      <main className="px-4 py-4 space-y-4 pb-24">
        {/* 參數輸入區 */}
        <ParameterFormMobile values={formData} onChange={setFormData} />

        {/* 錯誤提示 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-red-800 text-sm mb-1">計算錯誤</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 結果區 */}
        <div ref={resultRef}>
          <ResultCardMobile result={result} />
        </div>

        {/* 策略矩陣（僅在有結果時顯示） */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${showMatrix ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-base font-semibold text-gray-900">查看甜區圖</span>
              </div>
              <span className="text-xs text-gray-500">策略矩陣</span>
            </button>

            {showMatrix && (
              <div className="p-4 border-t border-gray-100 space-y-4">
                {/* 簡化的甜區摘要 */}
                <StrategySummary result={result} />

                {/* 完整策略矩陣 */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>完整甜區圖：</strong>綠色 = 建議繼續，紅色 = 建議停手。可滑動查看完整矩陣。
                  </p>
                  <div className="overflow-x-auto -mx-4 px-4">
                    <PolicyMatrix result={result} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 固定底部按鈕 */}
      <FixedBottomButton
        onClick={handleCalculate}
        disabled={!canCalculate}
        loading={isLoading}
      />
    </div>
  );
}
