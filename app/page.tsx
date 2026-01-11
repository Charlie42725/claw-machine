import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <main className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              夾娃娃刮刮卡決策工具
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              基於動態規劃的最優停止策略計算器。幫你找到「甜區」，理性決策何時該玩、何時該停。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/simulator"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg shadow-lg"
              >
                開始計算
              </Link>
              <Link
                href="/how-it-works"
                className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors text-lg shadow-lg border border-gray-200"
              >
                工作原理
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">精準決策</h3>
              <p className="text-gray-600">
                告訴你當前狀態下是「繼續玩」還是「停手」，以及最優期望淨利
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">策略視覺化</h3>
              <p className="text-gray-600">
                生成完整的策略矩陣熱力圖，直觀看到「甜區」在哪裡
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">成本分析</h3>
              <p className="text-gray-600">
                計算平均每中一次的成本、期望中獎次數和總花費
              </p>
            </div>
          </div>

          {/* How it works preview */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">這是什麼？</h2>
            <p className="text-gray-700 mb-4">
              機台內有一疊「刮刮卡」，總共 N 張，其中有 R 張是中獎卡，其餘 B 張是沒獎卡。
              每「夾到一次」就拿到 1 張刮刮卡並立即刮開。
            </p>
            <p className="text-gray-700 mb-4">
              <strong>關鍵問題：</strong>在每次刮完後，你應該「繼續夾下一次」還是「停手離場」？
            </p>
            <p className="text-gray-700 mb-6">
              本工具使用動態規劃計算最優策略，不是只看「下一抽的期望值」，而是考慮「未來所有可能路徑」，
              告訴你在什麼狀態下該停手、什麼狀態下值得拚。
            </p>
            <Link
              href="/how-it-works"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              瞭解更多原理 →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
