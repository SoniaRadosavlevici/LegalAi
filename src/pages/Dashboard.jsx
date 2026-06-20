import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import {
  Folder, FileText, Plus, ChevronDown, ChevronRight,
  Calendar, Globe, Briefcase
} from '../components/icons/Icons'

const CATEGORIES = [
  'Employment', 'NDA', 'Service Agreement', 'Consulting',
  'Freelance', 'Partnership', 'Rental', 'Non-Compete',
]

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

function CategoryCard({ category, contracts, isOpen, onToggle }) {
  const navigate = useNavigate()

  return (
    <div className="bg-navy-700 border border-white/5 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-navy-600/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-bronze">
            <Folder size={20} strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">{category}</p>
            <p className="text-xs text-gray-500">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="text-gray-500">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 p-5 space-y-4">
              {/* Contract List */}
              <div className="space-y-2">
                {contracts.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">No contracts in this category yet.</p>
                ) : contracts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/contract/${c.id}`)}
                    className="w-full flex items-center justify-between p-4 bg-navy-600/50 hover:bg-navy-600
                      border border-white/5 rounded transition-colors text-left group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <FileText size={16} className="text-gray-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate group-hover:text-bronze transition-colors">
                          {c.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Globe size={10} />
                            {c.jurisdiction}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar size={10} />
                            {formatDate(c.created_at)}
                          </span>
                          <span className={`text-[10px] uppercase tracking-luxury px-2 py-0.5 rounded-full border ${
                            c.status === 'final'
                              ? 'border-green-500/30 text-green-400 bg-green-500/10'
                              : 'border-gray-600 text-gray-500'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-bronze flex-shrink-0 transition-colors" />
                  </button>
                ))}
              </div>

              <Link to={`/contract/new?type=${encodeURIComponent(category)}`}>
                <Button variant="ghost" size="sm" className="mt-2 text-xs gap-1">
                  <Plus size={12} />
                  New {category} Contract
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Dashboard() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openCategories, setOpenCategories] = useState({ Employment: true })

  useEffect(() => {
    if (!user) return
    supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setContracts(data || [])
        setLoading(false)
      })
  }, [user])

  const toggleCategory = cat => setOpenCategories(o => ({ ...o, [cat]: !o[cat] }))

  const contractsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = contracts.filter(c => c.category === cat)
    return acc
  }, {})

  const totalContracts = contracts.length
  const isPaid = profile?.plan === 'starter' || profile?.plan === 'pro'

  return (
    <div className="min-h-screen bg-navy font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-luxury text-bronze mb-1">Dashboard</p>
            <h1 className="font-serif text-3xl text-white">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Your Contracts'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalContracts} contract{totalContracts !== 1 ? 's' : ''} across {Object.values(contractsByCategory).filter(c => c.length > 0).length} categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isPaid && (
              <Link to="/pricing">
                <Button variant="outline" size="sm" className="text-xs">
                  Upgrade Plan
                </Button>
              </Link>
            )}
            <Link to="/contract/new">
              <Button size="sm" className="gap-1.5">
                <Plus size={14} />
                New Contract
              </Button>
            </Link>
          </div>
        </div>

        {/* Plan Banner for Free */}
        {profile?.plan === 'free' && (
          <div className="border border-bronze/20 bg-bronze/5 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-bronze font-medium mb-0.5">You're on the Free plan</p>
              <p className="text-xs text-gray-500">Contracts have watermarks and cannot be exported. Upgrade to remove restrictions.</p>
            </div>
            <Link to="/pricing" className="flex-shrink-0">
              <Button size="sm">Upgrade Now</Button>
            </Link>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-navy-700 border border-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat}
                category={cat}
                contracts={contractsByCategory[cat]}
                isOpen={!!openCategories[cat]}
                onToggle={() => toggleCategory(cat)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
