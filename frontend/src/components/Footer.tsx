import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">WM</span>
              </div>
              <span className="text-xl font-bold text-white">Worker Management</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              A comprehensive worker management and tracking system designed to simplify 
              worker activity tracking, daily updates, and salary management for companies.
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Worker Management System. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/workers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Worker Directory
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Daily Updates</li>
              <li>Salary Management</li>
              <li>Attendance Tracking</li>
              <li>Reports & Analytics</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>Built with Next.js, React, and PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}

