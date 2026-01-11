'use client';

import { useState } from 'react';
import type { SolverResult } from '@/lib/types';

interface PolicyMatrixProps {
  result: SolverResult;
}

export default function PolicyMatrix({ result }: PolicyMatrixProps) {
  const { policy_matrix, V_matrix, Continue_matrix } = result;
  const [hoveredCell, setHoveredCell] = useState<{ r: number; b: number } | null>(null);

  const R0 = policy_matrix.length - 1;
  const B0 = policy_matrix[0]?.length - 1 || 0;

  // 限制顯示的最大維度（避免渲染過多）
  const maxDisplay = 50;
  const displayR = Math.min(R0, maxDisplay);
  const displayB = Math.min(B0, maxDisplay);

  const renderCell = (r: number, b: number) => {
    const shouldContinue = policy_matrix[r][b];
    const bgColor = shouldContinue ? 'bg-green-400' : 'bg-red-300';
    const isHovered = hoveredCell?.r === r && hoveredCell?.b === b;

    return (
      <div
        key={`${r}-${b}`}
        className={`${bgColor} ${isHovered ? 'ring-2 ring-blue-500 z-10' : ''}
          relative cursor-pointer transition-all hover:scale-110`}
        style={{
          width: '100%',
          paddingBottom: '100%', // 正方形
        }}
        onMouseEnter={() => setHoveredCell({ r, b })}
        onMouseLeave={() => setHoveredCell(null)}
        title={`R=${r}, B=${b}\n${shouldContinue ? '繼續' : '停手'}\nV=${V_matrix[r][b].toFixed(2)}\nContinue=${Continue_matrix[r][b].toFixed(2)}`}
      />
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-black mb-2">策略矩陣（甜區圖）</h2>
        <p className="text-sm text-black">
          綠色 = 建議繼續，紅色 = 建議停手。滑鼠懸停查看詳情。
        </p>
        {(R0 > maxDisplay || B0 > maxDisplay) && (
          <p className="text-sm text-orange-600 mt-1">
            注意：矩陣過大，僅顯示前 {maxDisplay}x{maxDisplay} 的區域
          </p>
        )}
      </div>

      {/* 圖例 */}
      <div className="flex items-center gap-4 mb-4 text-sm text-black">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-400 border border-gray-300"></div>
          <span>繼續玩</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-300 border border-gray-300"></div>
          <span>停手</span>
        </div>
      </div>

      {/* 策略矩阵网格 */}
      <div className="relative">
        <div className="flex">
          {/* Y轴标签 */}
          <div className="flex flex-col-reverse items-end pr-2 pt-6">
            <div className="text-xs text-gray-500 mb-1">0</div>
            {displayR > 10 && <div className="text-xs text-gray-500" style={{ marginBottom: `${(displayR / 2 - 1) * 100 / displayR}%` }}>{Math.floor(displayR / 2)}</div>}
            <div className="text-xs text-gray-500" style={{ marginTop: 'auto' }}>{displayR}</div>
            <div className="text-xs font-medium text-gray-700 mb-2 transform -rotate-90 origin-center whitespace-nowrap" style={{ marginBottom: '50%' }}>
              中獎卡數 (R)
            </div>
          </div>

          {/* 主矩陣 */}
          <div className="flex-1 overflow-hidden">
            <div
              className="grid gap-0.5 bg-gray-200 p-0.5 rounded"
              style={{
                gridTemplateColumns: `repeat(${displayB + 1}, 1fr)`,
                gridTemplateRows: `repeat(${displayR + 1}, 1fr)`,
              }}
            >
              {Array.from({ length: displayR + 1 }, (_, r) => displayR - r).map((r) =>
                Array.from({ length: displayB + 1 }, (_, b) => b).map((b) => renderCell(r, b))
              )}
            </div>

            {/* X軸標籤 */}
            <div className="flex justify-between mt-2 px-0.5">
              <div className="text-xs text-gray-500">0</div>
              {displayB > 10 && <div className="text-xs text-gray-500">{Math.floor(displayB / 2)}</div>}
              <div className="text-xs text-gray-500">{displayB}</div>
            </div>
            <div className="text-xs font-medium text-gray-700 text-center mt-1">
              未中獎卡數 (B)
            </div>
          </div>
        </div>

        {/* 懸停資訊面板 */}
        {hoveredCell && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">狀態詳情</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">中獎卡數 (R):</span>
                <span className="font-semibold ml-1">{hoveredCell.r}</span>
              </div>
              <div>
                <span className="text-gray-600">未中卡數 (B):</span>
                <span className="font-semibold ml-1">{hoveredCell.b}</span>
              </div>
              <div>
                <span className="text-gray-600">決策:</span>
                <span className={`font-semibold ml-1 ${policy_matrix[hoveredCell.r][hoveredCell.b] ? 'text-green-600' : 'text-red-600'}`}>
                  {policy_matrix[hoveredCell.r][hoveredCell.b] ? '繼續' : '停手'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">V值:</span>
                <span className="font-semibold ml-1">{V_matrix[hoveredCell.r][hoveredCell.b].toFixed(2)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Continue值:</span>
                <span className="font-semibold ml-1">{Continue_matrix[hoveredCell.r][hoveredCell.b].toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
