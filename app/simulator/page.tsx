'use client';

import { useState } from 'react';
import ParameterForm from '@/components/ParameterForm';
import KPIResultPanel from '@/components/KPIResultPanel';
import PolicyMatrix from '@/components/PolicyMatrix';
import type { GameParameters, SolverResult } from '@/lib/types';

export default function SimulatorPage() {
  const [result, setResult] = useState<SolverResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async (params: GameParameters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '計算失敗');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      console.error('Solver error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-5">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            夾娃娃刮刮卡決策工具
          </h1>
          <p className="text-black">
            基於動態規劃的最優停止策略計算器
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：参数输入 */}
          <div>
            <ParameterForm onSubmit={handleSolve} isLoading={isLoading} />
          </div>

          {/* 右側：結果展示 */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong className="font-bold">錯誤：</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {result && (
              <>
                <KPIResultPanel result={result} />
              </>
            )}

            {!result && !error && (
              <div className="bg-white p-12 rounded-lg shadow-md text-center text-black">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-black text-opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">輸入參數並點擊計算以查看結果</p>
              </div>
            )}
          </div>
        </div>

        {/* 策略矩陣（全寬） */}
        {result && (
          <div className="mt-6">
            <PolicyMatrix result={result} />
          </div>
        )}
      </div>
    </div>
  );
}
