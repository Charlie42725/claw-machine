'use client';

import type { SolverResult } from '@/lib/types';

interface KPIResultPanelProps {
  result: SolverResult;
}

export default function KPIResultPanel({ result }: KPIResultPanelProps) {
  const {
    V_start,
    policy_start,
    effective_cost_per_scratch,
    avg_cost_per_win,
    expected_wins,
    expected_total_cost,
  } = result;

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  const getRecommendationColor = (shouldContinue: boolean) => {
    return shouldContinue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRecommendationText = (shouldContinue: boolean) => {
    return shouldContinue ? '建議繼續玩' : '庭議停手';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">計算結果</h2>

      {/* 核心決策建議 */}
      <div className={`p-4 rounded-lg ${getRecommendationColor(policy_start)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">起手決策</h3>
            <p className="text-2xl font-bold mt-1">{getRecommendationText(policy_start)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">最優期望淨利</p>
            <p className="text-2xl font-bold">
              {V_start >= 0 ? '+' : ''}{formatCurrency(V_start)} 元
            </p>
          </div>
        </div>
      </div>

      {/* KPI 指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">有效每刮成本</h4>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(effective_cost_per_scratch)} 元
          </p>
          <p className="text-xs text-gray-500 mt-1">
            考慮機械參數後的實際單次成本
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">平均每中一次成本</h4>
          <p className="text-2xl font-bold text-purple-700">
            {avg_cost_per_win !== null ? `${formatCurrency(avg_cost_per_win)} 元` : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {avg_cost_per_win !== null
              ? '在最優策略下的平均中獎成本'
              : '最優策略多為停手，期望中獎次數趨近0'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">期望中獎次數</h4>
          <p className="text-2xl font-bold text-green-700">
            {expected_wins.toFixed(2)} 次
          </p>
          <p className="text-xs text-gray-500 mt-1">
            最優策略下的預期中獎次數
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">期望總成本</h4>
          <p className="text-2xl font-bold text-orange-700">
            {formatCurrency(expected_total_cost)} 元
          </p>
          <p className="text-xs text-gray-500 mt-1">
            最優策略下的預期總花費
          </p>
        </div>
      </div>

      {/* 解释说明 */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-800 mb-2">如何理解这些数字？</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>最优期望净利</strong>：如果你严格按照最优策略玩，平均能赚（或亏）多少钱</li>
          <li>• <strong>起手决策</strong>：现在这个状态下，是否值得开始玩或继续玩</li>
          <li>• <strong>平均每中一次成本</strong>：在最优策略下，每中一次奖平均要花多少钱（含未中的成本）</li>
        </ul>
      </div>
    </div>
  );
}
