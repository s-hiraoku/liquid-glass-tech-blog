/**
 * Simple test page for Tailwind CSS 4 verification
 */

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ✨ Tailwind CSS 4 動作確認
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Next.js 15 + Tailwind CSS 4 + TypeScript の組み合わせが正常に動作しています！
          </p>

          {/* Gradient Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🎨 Tailwind CSS 4 Features
              </h3>
              <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                <li>✅ Latest color system</li>
                <li>✅ Enhanced dark mode</li>
                <li>✅ Backdrop blur effects</li>
                <li>✅ Container queries</li>
              </ul>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🚀 Performance
              </h3>
              <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                <li>✅ Faster compilation</li>
                <li>✅ Smaller bundle size</li>
                <li>✅ Better tree shaking</li>
                <li>✅ Optimized utilities</li>
              </ul>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="space-y-4">
            <div className="inline-flex space-x-4">
              <div className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                Primary Button
              </div>
              <div className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                Secondary Button
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}