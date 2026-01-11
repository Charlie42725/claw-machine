'use client';

import type { SolverResult } from '@/lib/types';

interface StrategySummaryProps {
  result: SolverResult;
}

export default function StrategySummary({ result }: StrategySummaryProps) {
  const { policy_matrix, R_start, B_start } = result as SolverResult & {
    R_start?: number;
    B_start?: number;
  };

  // 找出"甜區"的邊界（簡化算法：找出建議繼續的最小R值）
  const findSweetSpot = () => {
    const R0 = policy_matrix.length - 1;
    const B0 = policy_matrix[0]?.length - 1 || 0;

    // 遍歷找出不同B值下，建議繼續的最小R值
    const sweetSpots: { b: number; minR: number }[] = [];

    for (let b = 0; b <= Math.min(B0, 20); b += Math.floor(B0 / 5) || 1) {
      let minR = -1;
      for (let r = 0; r <= R0; r++) {
        if (policy_matrix[r][b]) {
          minR = r;
          break;
        }
      }
      if (minR >= 0) {
        sweetSpots.push({ b, minR });
      }
    }

    return sweetSpots;
  };

  const sweetSpots = findSweetSpot();

  if (sweetSpots.length === 0) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <p className="text-sm text-red-700">
          <strong>建議：</strong>在大多數狀態下都不建議繼續玩。
        </p>
      </div>
    );
  }

  // 找出平均甜區條件
  const avgMinR = Math.round(
    sweetSpots.reduce((sum, spot) => sum + spot.minR, 0) / sweetSpots.length
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">甜區條件</h4>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>簡單判斷：</strong>當剩餘中獎卡數 ≥ <span className="font-bold text-green-700">{avgMinR}</span> 張時，
          在多數情況下值得繼續。
        </p>
        <p className="text-xs text-gray-600 mt-2">
          詳細策略請查看下方完整甜區圖（綠色區域 = 建議繼續）
        </p>
      </div>
    </div>
  );
}
