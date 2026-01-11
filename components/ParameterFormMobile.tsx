'use client';

import { useState } from 'react';

export interface ParameterFormData {
  R0: number;
  B0: number;
  payoutPerWin: number;
  costPerGrab: number;
  q: number;
  scratchPerGrab: number;
  grabsPerScratch: number;
}

interface ParameterFormMobileProps {
  values: ParameterFormData;
  onChange: (values: ParameterFormData) => void;
}

export default function ParameterFormMobile({ values, onChange }: ParameterFormMobileProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateValue = (key: keyof ParameterFormData, value: number) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* 基本參數卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">基本參數</h3>

        <div className="space-y-4">
          {/* 第一行：中獎與未中獎卡數 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                中獎刮卡
              </label>
              <input
                type="number"
                min="0"
                value={values.R0}
                onChange={(e) => updateValue('R0', parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                未中刮卡
              </label>
              <input
                type="number"
                min="0"
                value={values.B0}
                onChange={(e) => updateValue('B0', parseInt(e.target.value) || 0)}
                className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="76"
              />
            </div>
          </div>

          {/* 第二行：中獎獎金 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              中獎獎金（元）
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.payoutPerWin}
              onChange={(e) => updateValue('payoutPerWin', parseFloat(e.target.value) || 0)}
              className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500"
            />
          </div>

          {/* 第三行：每次夾取成本 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              每次夾取成本（元）
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.costPerGrab}
              onChange={(e) => updateValue('costPerGrab', parseFloat(e.target.value) || 0)}
              className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {/* 進階參數卡片（可收合） */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-base font-semibold text-gray-900">進階參數</span>
          </div>
          <span className="text-xs text-gray-500">機械參數</span>
        </button>

        {showAdvanced && (
          <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                未中獎安慰獎（元）
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={values.q}
                onChange={(e) => updateValue('q', parseFloat(e.target.value) || 0)}
                className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">預設 0</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                一次夾拿幾張刮卡
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={values.scratchPerGrab}
                onChange={(e) => updateValue('scratchPerGrab', parseFloat(e.target.value) || 1)}
                className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
              <p className="text-xs text-gray-500 mt-1">預設 1</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                平均夾幾次拿到一張
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={values.grabsPerScratch}
                onChange={(e) => updateValue('grabsPerScratch', parseFloat(e.target.value) || 1)}
                className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
              <p className="text-xs text-gray-500 mt-1">預設 1（夾娃娃較難可設 1.5-2）</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
