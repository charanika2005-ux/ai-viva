import { Zap, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-surface-700/30 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">AI Viva</span>
            </Link>
            <p className="text-sm text-surface-500 leading-relaxed">
              AI-powered interview simulation platform to help you practice and ace your next interview.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm text-surface-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-surface-400 hover:text-white transition-colors">How It Works</a></li>
              <li><Link to="/register" className="text-sm text-surface-400 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-surface-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-surface-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-surface-400 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-surface-700/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} AI Viva. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-surface-500 hover:text-white transition-colors">
              <ExternalLink className="h-4 w-4" />
            </a>
            <a href="#" className="text-surface-500 hover:text-white transition-colors">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
