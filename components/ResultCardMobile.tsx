'use client';

import type { SolverResult } from '@/lib/types';

interface ResultCardMobileProps {
  result: SolverResult | null;
}

export default function ResultCardMobile({ result }: ResultCardMobileProps) {
  if (!result) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center border border-blue-100">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
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
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未計算</h3>
        <p className="text-sm text-gray-600">請輸入參數後點擊下方計算按鈕</p>
      </div>
    );
  }

  const {
    V_start,
    policy_start,
    effective_cost_per_scratch,
    avg_cost_per_win,
    expected_wins,
    expected_total_cost,
    force_play_all,
  } = result;

  const formatCurrency = (value: number) => value.toFixed(2);

  return (
    <div className="space-y-4">
      {/* 主要決策卡片 */}
      <div
        className={`rounded-xl p-6 ${
          policy_start
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
            : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">建議策略</p>
            <p
              className={`text-2xl font-bold ${
                policy_start ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {policy_start ? '✓ 建議繼續玩' : '✗ 建議停手'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 mb-1">期望淨利</p>
            <p className={`text-2xl font-bold ${V_start >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {V_start >= 0 ? '+' : ''}
              {formatCurrency(V_start)}
            </p>
            <p className="text-xs text-gray-500">元</p>
          </div>
        </div>

        {/* 簡短說明 */}
        <div className="bg-white/60 rounded-lg p-3 text-sm text-gray-700">
          {policy_start ? (
            <p>
              在目前狀態下，繼續玩的期望淨利為正，值得繼續。
            </p>
          ) : (
            <p>
              在目前狀態下，繼續玩的期望淨利為負，不建議繼續。
            </p>
          )}
        </div>
      </div>

      {/* KPI 指標卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">關鍵指標</h3>

        <div className="space-y-4">
          {/* 有效每刮成本 */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">有效每刮成本</p>
              <p className="text-xs text-gray-500">考慮機械參數後</p>
            </div>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(effective_cost_per_scratch)} 元</p>
          </div>

          {/* 期望中獎次數 */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">
                期望中獎次數
                {!policy_start && <span className="text-red-600 text-xs ml-1">*</span>}
              </p>
              <p className="text-xs text-gray-500">
                {policy_start ? '最優策略下' : '如果硬要賭到底'}
              </p>
            </div>
            <p className="text-lg font-bold text-green-600">
              {policy_start ? expected_wins.toFixed(2) : force_play_all.expected_wins.toFixed(2)} 次
            </p>
          </div>

          {/* 期望總成本 */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">
                期望總成本
                {!policy_start && <span className="text-red-600 text-xs ml-1">*</span>}
              </p>
              <p className="text-xs text-gray-500">
                {policy_start ? '最優策略下' : '如果硬要賭到底'}
              </p>
            </div>
            <p className="text-lg font-bold text-orange-600">
              {policy_start
                ? formatCurrency(expected_total_cost)
                : formatCurrency(force_play_all.expected_total_cost)}{' '}
              元
            </p>
          </div>

          {/* 平均每中一次成本 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                平均每中一次成本
                {!policy_start && <span className="text-red-600 text-xs ml-1">*</span>}
              </p>
              <p className="text-xs text-gray-500">
                {policy_start ? '最優策略下' : '如果硬要賭到底'}
              </p>
            </div>
            <p className="text-lg font-bold text-purple-600">
              {policy_start
                ? avg_cost_per_win !== null
                  ? `${formatCurrency(avg_cost_per_win)} 元`
                  : 'N/A'
                : force_play_all.avg_cost_per_win !== null
                ? `${formatCurrency(force_play_all.avg_cost_per_win)} 元`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* 賭博警告（僅建議停手時顯示） */}
      {!policy_start && (
        <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">賭博警告</h4>
              <p className="text-sm text-red-700 mb-2">
                如果硬要賭到底，期望淨利潤：
                <span className="font-bold">
                  {force_play_all.expected_net_profit >= 0 ? '+' : ''}
                  {formatCurrency(force_play_all.expected_net_profit)} 元
                </span>
              </p>
              <p className="text-xs text-red-600">
                * 標示星號的指標為「強制玩到底」的數據
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
