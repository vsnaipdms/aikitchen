import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Page not found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This page doesn&apos;t exist.</p>
        <Link href="/" className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">Go Home</Link>
      </div>
    </div>
  );
}
