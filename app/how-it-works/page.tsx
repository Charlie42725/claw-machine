import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← 返回首頁
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">工作原理</h1>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">遊戲情境</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                <strong>機台設定：</strong>夾娃娃機內有一疊「刮刮卡」，總共 N 張。
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>其中有 <strong>R 張中獎卡</strong>（刮到即得固定獎金）</li>
                <li>其餘 <strong>B 張沒獎卡</strong>（刮到得 0 元，或安慰獎 q 元）</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>遊戲規則：</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>每「夾一次」花費 cost_per_grab 元</li>
                <li>夾到後立即刮開（不放回）</li>
                <li>中獎得 payout_per_win 元，未中得 0 元（或 q 元）</li>
                <li>每次刮完後可選擇：繼續夾 或 停手離場</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">為什麼不能只看「下一抽期望值」？</h2>
            <p className="text-gray-700 mb-4">
              很多人會用「下一抽的期望收益」來決定是否繼續：
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm">
                下一抽 EV = (R/(R+B)) × 中獎收益 + (B/(R+B)) × 未中收益 - 成本
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              <strong>問題是：</strong>這只考慮了「下一抽」，沒考慮「抽完之後的未來決策」。
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>舉例：</strong>假設現在 R=1, B=20，下一抽 EV 是負的。但如果你抽到那 1 張中獎卡後，
                就可以立即停手；而如果抽到沒獎卡，剩下的狀態 (R=1, B=19) 可能更糟，你也會停手。
                這時「抽一次」的真實價值，應該考慮「抽完後的最優後續策略」，而不是只看即時收益。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">動態規劃：最優停止策略</h2>
            <p className="text-gray-700 mb-4">
              我們用 <strong>動態規劃 (DP)</strong> 來解決這個問題：
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">1. 定義狀態</h3>
            <p className="text-gray-700 mb-4">
              狀態 (R, B) 表示：剩餘 R 張中獎卡、B 張沒獎卡。
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">2. 價值函數</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
              <p className="font-mono text-sm mb-2">V(R, B) = max(0, Continue(R, B))</p>
              <p className="text-sm text-gray-600">
                V(R,B) 是「在狀態 (R,B) 下，執行最優策略的期望淨利」
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">3. 繼續玩的期望值</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
              <p className="font-mono text-sm mb-2">
                Continue(R, B) = (R/(R+B)) × [gR + V(R-1, B)] + (B/(R+B)) × [gB + V(R, B-1)]
              </p>
              <p className="text-sm text-gray-600 mt-2">其中：</p>
              <ul className="text-sm text-gray-600 list-disc list-inside ml-4">
                <li>gR = payout_per_win - effective_cost（抽到中獎卡的即時收益）</li>
                <li>gB = q - effective_cost（抽到沒獎卡的即時收益）</li>
                <li>V(R-1, B) 和 V(R, B-1) 是「抽完後剩餘狀態的最優期望淨利」</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">4. 決策規則</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">
                如果 <code className="bg-white px-2 py-1 rounded">Continue(R, B) {'>'} 0</code>，則繼續玩；
                否則停手。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">本工具計算什麼？</h2>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">✓ 最優期望淨利 V(R0, B0)</h4>
                <p className="text-sm text-gray-700">
                  告訴你在起始狀態下，嚴格執行最優策略能賺/虖多少錢
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">✓ 起手決策 policy(R0, B0)</h4>
                <p className="text-sm text-gray-700">
                  現在這個狀態該「繼續」還是「停手」
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">✓ 完整策略矩陣</h4>
                <p className="text-sm text-gray-700">
                  每個 (R, B) 狀態的最優決策，視覺化成「甜區圖」
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">✓ 平均每中一次成本</h4>
                <p className="text-sm text-gray-700">
                  在最優策略下，每中一次獎平均要花多少錢（含未中的成本）
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">进阶参数：机械倍率</h2>
            <p className="text-gray-700 mb-4">
              现实中的夹娃娃机可能不是「夹一次就拿到一张刮卡」：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>grabs_per_scratch</strong>（平均要夹几次才拿到一张刮卡）：
                例如设为 1.8，表示平均夹 1.8 次才成功拿到 1 张刮卡
              </li>
              <li>
                <strong>scratch_per_grab</strong>（一次夹拿几张刮卡）：
                例如设为 2，表示每次夹成功能拿到 2 张刮卡
              </li>
            </ul>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <p className="font-mono text-sm">
                有效每刮成本 = cost_per_grab × grabs_per_scratch / scratch_per_grab
              </p>
            </div>
          </section>

          <section className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">开始使用</h2>
            <p className="text-gray-700 mb-4">
              准备好了吗？输入你的机台参数，立即计算最优策略。
            </p>
            <Link
              href="/simulator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              开始计算 →
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
