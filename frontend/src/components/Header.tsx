import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">WM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Worker Management</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/workers"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Workers
            </Link>
            <Link
              href="/admin/login"
              className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Admin Login
            </Link>
          </nav>
          <div className="md:hidden">
            <Link
              href="/admin/login"
              className="text-white bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

