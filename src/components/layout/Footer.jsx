import { Link } from 'react-router-dom'
import { Scale } from '../icons/Icons'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-bronze"><Scale size={20} strokeWidth={1.5} /></span>
              <span className="font-serif text-lg text-white">LegalAI</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              AI-powered contract drafting for Canadian businesses. Compliant with all 13 provincial and territorial jurisdictions.
            </p>
            <p className="text-xs text-gray-600 mt-4">
              LegalAI does not provide legal advice. Always consult a qualified lawyer for legal matters.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxury text-gray-500 mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                ['Pricing', '/pricing'],
                ['Find a Lawyer', '/find-lawyer'],
                ['New Contract', '/contract/new'],
                ['Dashboard', '/dashboard'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-luxury text-gray-500 mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map(item => (
                <li key={item}>
                  <span className="text-sm text-gray-600 cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} LegalAI Technologies Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Serving all 13 Canadian provinces and territories
          </p>
        </div>
      </div>
    </footer>
  )
}
