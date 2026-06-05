import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendLawyerContactEmail } from '../lib/emailService'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { MapPin, Phone, Mail, Globe, DollarSign, Search, Check, X } from '../components/icons/Icons'

const LAWYERS = [
  {
    id: 1, name: 'Sarah Mitchell', province: 'Ontario',
    expertise: ['Employment', 'NDA', 'Non-Compete'],
    rate: 250, languages: ['English'],
    bio: 'Senior partner with 18 years in employment and commercial law, specializing in complex employment disputes and executive agreements.',
    phone: '+1 (416) 555-0123', email: 's.mitchell@legalai.ca',
    city: 'Toronto',
  },
  {
    id: 2, name: 'Jonah Batist', province: 'Quebec',
    firm: 'Greenspoon Winikoff S.E.N.C.R.L., LLP',
    expertise: ['Corporate/Commercial', 'M&A', 'Business Law', 'Start-up Advisory'],
    rate: 350, languages: ['English', 'French'],
    bio: 'Partner at Greenspoon advising on corporate and commercial law, mergers and acquisitions, and general business matters, with a focus on technology-sector start-ups. Active board member of Compass Startup Legal Clinic.',
    phone: '+1 (514) 499-9400 ext. 235', email: 'j.batist@gplegal.com',
    city: 'Montreal',
    photo: 'https://www.gplegal.com/images/profile-pictures/Jonah-Profile-2025-11-14.webp',
  },
  {
    id: 3, name: 'Thomas Chen', province: 'British Columbia',
    expertise: ['Commercial', 'Consulting', 'Partnership'],
    rate: 260, languages: ['English'],
    bio: 'Technology and commercial law specialist advising startups and established companies across Western Canada.',
    phone: '+1 (604) 555-0125', email: 't.chen@legalai.ca',
    city: 'Vancouver',
  },
  {
    id: 4, name: 'Alexandra Petrov', province: 'Alberta',
    expertise: ['Employment', 'Service Agreement', 'Non-Compete'],
    rate: 270, languages: ['English'],
    bio: 'Energy sector and commercial contract specialist with deep expertise in Alberta employment law.',
    phone: '+1 (403) 555-0126', email: 'a.petrov@legalai.ca',
    city: 'Calgary',
  },
  {
    id: 5, name: 'David Reyes', province: 'Manitoba',
    expertise: ['Employment', 'Rental', 'Partnership'],
    rate: 220, languages: ['English'],
    bio: 'Corporate and real estate law practitioner serving Winnipeg businesses since 2005.',
    phone: '+1 (204) 555-0127', email: 'd.reyes@legalai.ca',
    city: 'Winnipeg',
  },
  {
    id: 6, name: 'Margaret Wilson', province: 'Saskatchewan',
    expertise: ['Partnership', 'Service Agreement', 'Freelance'],
    rate: 215, languages: ['English'],
    bio: 'Agricultural and commercial law practitioner with expertise in business formations and partnership disputes.',
    phone: '+1 (306) 555-0128', email: 'm.wilson@legalai.ca',
    city: 'Saskatoon',
  },
  {
    id: 7, name: 'James MacLeod', province: 'Nova Scotia',
    expertise: ['Commercial', 'Consulting', 'NDA'],
    rate: 230, languages: ['English'],
    bio: 'Maritime and commercial law specialist serving Atlantic Canada\'s business community.',
    phone: '+1 (902) 555-0129', email: 'j.macleod@legalai.ca',
    city: 'Halifax',
  },
  {
    id: 8, name: 'Michelle Boudreau', province: 'New Brunswick',
    expertise: ['Employment', 'NDA', 'Service Agreement'],
    rate: 225, languages: ['English', 'French'],
    bio: 'Bilingual corporate lawyer specializing in employment and confidentiality agreements across the Maritimes.',
    phone: '+1 (506) 555-0130', email: 'm.boudreau@legalai.ca',
    city: 'Fredericton',
  },
  {
    id: 9, name: 'Robert Parsons', province: 'Newfoundland and Labrador',
    expertise: ['Employment', 'Service Agreement', 'Consulting'],
    rate: 235, languages: ['English'],
    bio: 'Energy and commercial law specialist with 15 years advising NL-based businesses.',
    phone: '+1 (709) 555-0131', email: 'r.parsons@legalai.ca',
    city: "St. John's",
  },
  {
    id: 10, name: 'Catherine Murphy', province: 'Prince Edward Island',
    expertise: ['Rental', 'Commercial', 'Partnership'],
    rate: 200, languages: ['English'],
    bio: 'Real estate and commercial law practitioner specializing in rental and business agreements on PEI.',
    phone: '+1 (902) 555-0132', email: 'c.murphy@legalai.ca',
    city: 'Charlottetown',
  },
  {
    id: 11, name: 'Nathan Tootoo', province: 'Northwest Territories',
    expertise: ['Employment', 'Commercial', 'Consulting'],
    rate: 245, languages: ['English'],
    bio: 'Indigenous and commercial law specialist with employment expertise serving Northern Canada.',
    phone: '+1 (867) 555-0133', email: 'n.tootoo@legalai.ca',
    city: 'Yellowknife',
  },
  {
    id: 12, name: 'Heather Blackwood', province: 'Yukon',
    expertise: ['Partnership', 'Commercial', 'Service Agreement'],
    rate: 240, languages: ['English'],
    bio: 'Mining and commercial law specialist with partnership and contract expertise in the Yukon.',
    phone: '+1 (867) 555-0134', email: 'h.blackwood@legalai.ca',
    city: 'Whitehorse',
  },
  {
    id: 13, name: 'Isaac Aqiaruq', province: 'Nunavut',
    expertise: ['Employment', 'Commercial', 'Rental'],
    rate: 250, languages: ['English'],
    bio: 'Land and commercial rights specialist practicing in Nunavut with community-centered legal approach.',
    phone: '+1 (867) 555-0135', email: 'i.aqiaruq@legalai.ca',
    city: 'Iqaluit',
  },
]

const ALL_PROVINCES = [...new Set(LAWYERS.map(l => l.province))].sort()
const ALL_EXPERTISE = [...new Set(LAWYERS.flatMap(l => l.expertise))].sort()
const ALL_LANGUAGES = ['English', 'French']

function LawyerContactModal({ lawyer, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await sendLawyerContactEmail({
        lawyerName: lawyer.name,
        lawyerProvince: lawyer.province,
        senderName: form.name,
        senderEmail: form.email,
        message: form.message,
      })
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-navy-700 border border-white/10 rounded-lg p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-lg text-white">Contact {lawyer.name}</h3>
            <p className="text-xs text-gray-500">{lawyer.city}, {lawyer.province}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-bronze/30 text-bronze mb-4">
              <Check size={20} />
            </div>
            <p className="text-white font-medium mb-1">Message Sent</p>
            <p className="text-sm text-gray-500">We'll connect you with {lawyer.name} shortly.</p>
            <Button onClick={onClose} className="mt-5" size="sm">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded px-3 py-2 text-sm text-red-400">{error}</div>
            )}
            <Input label="Your Name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
            <Input label="Your Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
            <Input
              label="Message"
              type="textarea"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe what you need help with..."
              rows={4}
              required
            />
            <div className="flex gap-3 pt-1">
              <Button type="submit" loading={sending} className="flex-1">Send Inquiry</Button>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function FindLawyer() {
  const [search, setSearch] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [filterExpertise, setFilterExpertise] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [selectedLawyer, setSelectedLawyer] = useState(null)

  const filtered = LAWYERS.filter(l => {
    if (filterProvince && l.province !== filterProvince) return false
    if (filterExpertise && !l.expertise.includes(filterExpertise)) return false
    if (filterLanguage && !l.languages.includes(filterLanguage)) return false
    if (maxRate && l.rate > Number(maxRate)) return false
    if (search) {
      const q = search.toLowerCase()
      return l.name.toLowerCase().includes(q) ||
        l.province.toLowerCase().includes(q) ||
        l.expertise.some(e => e.toLowerCase().includes(q)) ||
        l.city.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-navy font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-luxury text-bronze mb-3">Legal Directory</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Find a Lawyer</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Connect with qualified Canadian lawyers across all 13 provinces and territories.
            Reviewed and verified by LegalAI.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-navy-700 border border-white/5 rounded-lg p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search lawyers, cities, expertise..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-navy-600/50 border border-white/10 rounded px-4 py-2.5 pl-9
                  text-sm text-white placeholder-gray-600 focus:outline-none focus:border-bronze/60"
              />
            </div>
            <select
              value={filterProvince}
              onChange={e => setFilterProvince(e.target.value)}
              className="bg-navy-600/50 border border-white/10 rounded px-4 py-2.5 text-sm text-white
                focus:outline-none focus:border-bronze/60"
            >
              <option value="">All Provinces</option>
              {ALL_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filterExpertise}
              onChange={e => setFilterExpertise(e.target.value)}
              className="bg-navy-600/50 border border-white/10 rounded px-4 py-2.5 text-sm text-white
                focus:outline-none focus:border-bronze/60"
            >
              <option value="">All Expertise</option>
              {ALL_EXPERTISE.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <div className="flex gap-2">
              <select
                value={filterLanguage}
                onChange={e => setFilterLanguage(e.target.value)}
                className="flex-1 bg-navy-600/50 border border-white/10 rounded px-3 py-2.5 text-sm text-white
                  focus:outline-none focus:border-bronze/60"
              >
                <option value="">Any Language</option>
                {ALL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {(filterProvince || filterExpertise || filterLanguage || search || maxRate) && (
                <button
                  onClick={() => { setFilterProvince(''); setFilterExpertise(''); setFilterLanguage(''); setSearch(''); setMaxRate('') }}
                  className="p-2.5 border border-white/10 rounded text-gray-500 hover:text-white hover:border-white/20 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="text-white">{filtered.length}</span> of {LAWYERS.length} lawyers
        </p>

        {/* Lawyer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((lawyer, i) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="bg-navy-700 border border-white/5 rounded-lg p-6 flex flex-col
                hover:border-bronze/20 transition-colors duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  {lawyer.photo && (
                    <img
                      src={lawyer.photo}
                      alt={lawyer.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-white mb-0.5">{lawyer.name}</h3>
                    {lawyer.firm && (
                      <p className="text-[11px] text-bronze/70 mb-0.5 truncate">{lawyer.firm}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={11} />
                      {lawyer.city}, {lawyer.province}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-bronze font-semibold text-sm">${lawyer.rate}<span className="text-gray-500 font-normal text-xs">/hr CAD</span></p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{lawyer.bio}</p>

              {/* Expertise */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {lawyer.expertise.map(e => (
                  <span key={e} className="text-[10px] uppercase tracking-luxury bg-navy-500 text-gray-400 px-2 py-1 rounded">
                    {e}
                  </span>
                ))}
              </div>

              {/* Languages */}
              <div className="flex items-center gap-1.5 mb-5">
                <Globe size={11} className="text-gray-600" />
                <span className="text-xs text-gray-500">{lawyer.languages.join(' / ')}</span>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-5 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={11} className="text-gray-600" />
                  {lawyer.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={11} className="text-gray-600" />
                  {lawyer.email}
                </div>
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={() => setSelectedLawyer(lawyer)}
              >
                Contact Lawyer
              </Button>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No lawyers match your filters.</p>
            <button
              onClick={() => { setFilterProvince(''); setFilterExpertise(''); setFilterLanguage(''); setSearch('') }}
              className="text-bronze text-sm mt-2 hover:text-bronze-light transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {selectedLawyer && (
        <LawyerContactModal lawyer={selectedLawyer} onClose={() => setSelectedLawyer(null)} />
      )}

      <Footer />
    </div>
  )
}
