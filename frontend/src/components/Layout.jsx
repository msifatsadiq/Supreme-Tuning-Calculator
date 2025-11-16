import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ST</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Supreme Tuning</h1>
                <p className="text-xs text-gray-400">Performance Calculator</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                Calculator
              </Link>
              {!isAdminRoute && (
                <Link
                  to="/admin/login"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 Supreme Tuning. All rights reserved.</p>
            <p className="mt-1">Performance tuning data for BMW, Mercedes-Benz, Audi, and Porsche</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
