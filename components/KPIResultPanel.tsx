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
    force_play_all,
  } = result;

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  const getRecommendationColor = (shouldContinue: boolean) => {
    return shouldContinue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRecommendationText = (shouldContinue: boolean) => {
    return shouldContinue ? '建議繼續玩' : '建議停手';
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
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            平均每中一次成本
            {!policy_start && <span className="text-red-600 ml-1">（強制玩到底）</span>}
          </h4>
          <p className="text-2xl font-bold text-purple-700">
            {policy_start
              ? (avg_cost_per_win !== null ? `${formatCurrency(avg_cost_per_win)} 元` : 'N/A')
              : (force_play_all.avg_cost_per_win !== null ? `${formatCurrency(force_play_all.avg_cost_per_win)} 元` : 'N/A')
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {policy_start
              ? '在最優策略下的平均中獎成本'
              : '如果硬要賭到底，每中一次的平均成本'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            期望中獎次數
            {!policy_start && <span className="text-red-600 ml-1">（強制玩到底）</span>}
          </h4>
          <p className="text-2xl font-bold text-green-700">
            {policy_start
              ? expected_wins.toFixed(2)
              : force_play_all.expected_wins.toFixed(2)
            } 次
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {policy_start
              ? '最優策略下的預期中獎次數'
              : '如果硬要賭到底，預期能中幾次'}
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            期望總成本
            {!policy_start && <span className="text-red-600 ml-1">（強制玩到底）</span>}
          </h4>
          <p className="text-2xl font-bold text-orange-700">
            {policy_start
              ? formatCurrency(expected_total_cost)
              : formatCurrency(force_play_all.expected_total_cost)
            } 元
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {policy_start
              ? '最優策略下的預期總花費'
              : '如果硬要賭到底，預期總花費'}
          </p>
        </div>
      </div>

      {/* 如果建議停手，額外顯示強制玩到底的淨利潤警告 */}
      {!policy_start && (
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ 賭博警告</h4>
          <p className="text-sm text-red-700">
            如果你硬要賭到底（玩到沒有中獎卡為止），期望淨利潤為：
            <span className="font-bold text-lg ml-2">
              {force_play_all.expected_net_profit >= 0 ? '+' : ''}{formatCurrency(force_play_all.expected_net_profit)} 元
            </span>
          </p>
          <p className="text-xs text-red-600 mt-2">
            這是平均值。實際結果可能更好或更差，但長期來看你會{force_play_all.expected_net_profit >= 0 ? '賺' : '虧'}這麼多錢。
          </p>
        </div>
      )}

      {/* 解釋說明 */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-800 mb-2">如何理解這些數字？</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>最優期望淨利</strong>：如果你嚴格按照最優策略玩，平均能賺（或虧）多少錢</li>
          <li>• <strong>起手決策</strong>：現在這個狀態下，是否值得開始玩或繼續玩</li>
          <li>• <strong>平均每中一次成本</strong>：{policy_start ? '在最優策略下' : '如果硬要賭到底'}，每中一次獎平均要花多少錢（含未中的成本）</li>
          {!policy_start && (
            <li className="text-red-600">• <strong>注意</strong>：標示「強制玩到底」的數字是假設你會一直玩到沒有中獎卡為止，不考慮最優策略</li>
          )}
        </ul>
      </div>
    </div>
  );
}
