import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateContract, extractStructuredData } from '../lib/contractTemplates'
import { tr, SUPPORTED_LANGUAGES } from '../lib/translations'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Check, ChevronRight, ChevronLeft, FileText, AlertTriangle, Globe } from '../components/icons/Icons'

const CONTRACT_TYPES = [
  'Employment', 'NDA', 'Service Agreement', 'Consulting',
  'Freelance', 'Partnership', 'Rental', 'Non-Compete',
]

const JURISDICTIONS = [
  { name: 'Ontario', flag: '' },
  { name: 'Quebec', flag: '', civil: true },
  { name: 'British Columbia', flag: '' },
  { name: 'Alberta', flag: '' },
  { name: 'Manitoba', flag: '' },
  { name: 'Saskatchewan', flag: '' },
  { name: 'Nova Scotia', flag: '' },
  { name: 'New Brunswick', flag: '' },
  { name: 'Newfoundland and Labrador', flag: '' },
  { name: 'Prince Edward Island', flag: '' },
  { name: 'Northwest Territories', flag: '' },
  { name: 'Yukon', flag: '' },
  { name: 'Nunavut', flag: '' },
]

const BENEFITS_OPTIONS = [
  'Extended health coverage', 'Dental plan', 'Vision care',
  'RRSP matching', 'Life insurance', 'Short-term disability',
  'Long-term disability', 'Employee assistance program (EAP)',
  'Remote/hybrid work', 'Professional development fund',
  'Parental leave top-up', 'Stock options / equity',
]

const defaultParty = { name: '', company: '', address: '', city: '', province: '', postalCode: '', email: '', phone: '', title: '' }
const defaultTerms = {
  startDate: '', endDate: '', position: '', salary: '', salaryPeriod: 'annual',
  probationPeriod: 3, terminationNotice: 2, benefits: [], workHours: 40,
  workDays: 'Monday to Friday', vacation: 2, confidentialityPeriod: 2,
  projectDescription: '', paymentAmount: '', paymentTerms: 'net30', deliverables: '',
  monthlyRent: '', securityDeposit: '', propertyAddress: '', nonCompetePeriod: 12,
  territory: '', businessDescription: '',
}

function LanguageToggle({ lang, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-navy-800 border border-white/10 rounded p-0.5">
      <Globe size={12} className="text-gray-500 ml-1.5" />
      {SUPPORTED_LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
            lang === l.code
              ? 'bg-bronze text-navy font-semibold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export default function ContractWizard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [lang, setLang] = useState('en')
  const [contractType, setContractType] = useState(searchParams.get('type') || '')
  const [jurisdiction, setJurisdiction] = useState('')
  const [partyA, setPartyA] = useState({ ...defaultParty })
  const [partyB, setPartyB] = useState({ ...defaultParty })
  const [terms, setTerms] = useState({ ...defaultTerms })
  const [generatedContent, setGeneratedContent] = useState('')
  const [displayContent, setDisplayContent] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const t = (key) => tr(lang, key)

  const updatePartyA = (key, val) => setPartyA(p => ({ ...p, [key]: val }))
  const updatePartyB = (key, val) => setPartyB(p => ({ ...p, [key]: val }))
  const updateTerms = (key, val) => setTerms(t => ({ ...t, [key]: val }))

  const toggleBenefit = (b) => {
    setTerms(t => ({
      ...t,
      benefits: t.benefits.includes(b) ? t.benefits.filter(x => x !== b) : [...t.benefits, b]
    }))
  }

  async function applyLanguage(content, targetLang) {
    if (targetLang === 'en') {
      setDisplayContent(content)
      return
    }
    setTranslating(true)
    setTranslateError(false)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, targetLang }),
      })
      const data = await res.json()
      if (data.translated) {
        setDisplayContent(data.translated)
      } else {
        setTranslateError(true)
        setDisplayContent(content)
      }
    } catch {
      setTranslateError(true)
      setDisplayContent(content)
    } finally {
      setTranslating(false)
    }
  }

  async function handleLangChange(newLang) {
    setLang(newLang)
    if (step === 5 && generatedContent) {
      await applyLanguage(generatedContent, newLang)
    }
  }

  const goNext = async () => {
    if (step === 4) {
      const data = { contractType, jurisdiction, partyA, partyB, terms }
      const content = generateContract(data)
      setGeneratedContent(content)
      await applyLanguage(content, lang)
    }
    setStep(s => Math.min(s + 1, 5))
    window.scrollTo(0, 0)
  }

  const goBack = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo(0, 0) }

  const canProceed = () => {
    if (step === 0) return !!contractType
    if (step === 1) return !!jurisdiction
    if (step === 2) return !!(partyA.name && partyA.email)
    if (step === 3) return !!(partyB.name)
    if (step === 4) return !!(terms.startDate)
    return true
  }

  const saveContract = async () => {
    setSaving(true)
    setError('')
    const title = `${contractType} — ${partyB.name || 'Draft'}`.slice(0, 100)
    const structuredData = extractStructuredData(contractType, terms)

    const { data, error: err } = await supabase.from('contracts').insert({
      user_id: user.id,
      title,
      type: contractType,
      jurisdiction,
      content: generatedContent, // always save the original English
      structured_data: structuredData,
      status: 'draft',
      category: contractType,
    }).select().single()

    setSaving(false)
    if (err) {
      setError('Failed to save contract. Please try again.')
    } else {
      navigate(`/contract/${data.id}`)
    }
  }

  const STEPS = [
    t('stepContractType'),
    t('stepJurisdiction'),
    t('stepYourDetails'),
    t('stepOtherParty'),
    t('stepTerms'),
    t('stepReviewSave'),
  ]

  const selectedJurisdiction = JURISDICTIONS.find(j => j.name === jurisdiction)

  const partyARole =
    contractType === 'Employment' ? t('roleEmployer') :
    contractType === 'Rental' ? t('roleLandlord') :
    contractType === 'NDA' ? t('roleDisclosingParty') : t('roleYourInfo')

  const partyBRole =
    contractType === 'Employment' ? t('roleEmployee') :
    contractType === 'Rental' ? t('roleTenant') :
    contractType === 'NDA' ? t('roleReceivingParty') : t('roleOtherParty')

  return (
    <div className="min-h-screen bg-navy font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs font-medium flex-shrink-0 transition-all
                  ${i < step ? 'bg-bronze border-bronze text-navy font-bold'
                    : i === step ? 'border-bronze text-bronze'
                    : 'border-white/10 text-gray-600'}`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors ${i < step ? 'bg-bronze/40' : 'bg-white/5'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {STEPS.map((label, i) => (
              <span key={i} className={`text-[10px] uppercase tracking-luxury flex-1 text-center
                ${i === step ? 'text-bronze' : i < step ? 'text-gray-500' : 'text-gray-700'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Contract Type */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">{t('selectContractTypeTitle')}</h2>
                <p className="text-gray-500 text-sm mb-8">{t('selectContractTypeDesc')}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CONTRACT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setContractType(type)}
                      className={`p-4 rounded-lg border text-left transition-all duration-200
                        ${contractType === type
                          ? 'border-bronze bg-bronze/10 text-bronze'
                          : 'border-white/5 bg-navy-700 text-gray-400 hover:border-white/20 hover:text-white'}`}
                    >
                      <FileText size={18} className="mb-2" strokeWidth={1.5} />
                      <p className="text-sm font-medium">{type}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Jurisdiction */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">{t('selectJurisdictionTitle')}</h2>
                <p className="text-gray-500 text-sm mb-8">{t('selectJurisdictionDesc')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {JURISDICTIONS.map(j => (
                    <button
                      key={j.name}
                      onClick={() => setJurisdiction(j.name)}
                      className={`p-4 rounded-lg border text-left transition-all duration-200 flex items-start justify-between
                        ${jurisdiction === j.name
                          ? 'border-bronze bg-bronze/10'
                          : 'border-white/5 bg-navy-700 hover:border-white/20'}`}
                    >
                      <div>
                        <p className={`text-sm font-medium ${jurisdiction === j.name ? 'text-bronze' : 'text-white'}`}>
                          {j.name}
                        </p>
                        {j.civil && (
                          <span className="text-[10px] uppercase tracking-luxury text-amber-500 mt-1 block">Civil Code</span>
                        )}
                      </div>
                      {jurisdiction === j.name && <Check size={14} className="text-bronze flex-shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
                {selectedJurisdiction?.civil && (
                  <div className="mt-4 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-400">
                      Quebec is governed by the Civil Code of Québec rather than common law. Contracts are drafted with Quebec-specific provisions and language.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Your Details (Party A) */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">{t('yourDetailsTitle')}</h2>
                <p className="text-gray-500 text-sm mb-8">{partyARole}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input label={t('fullName')} value={partyA.name} onChange={e => updatePartyA('name', e.target.value)} placeholder="Jane Smith" required />
                  <Input label={t('company')} value={partyA.company} onChange={e => updatePartyA('company', e.target.value)} placeholder="Acme Corp" />
                  <Input label={t('titleRole')} value={partyA.title} onChange={e => updatePartyA('title', e.target.value)} placeholder="CEO" />
                  <Input label={t('email')} type="email" value={partyA.email} onChange={e => updatePartyA('email', e.target.value)} placeholder="jane@example.com" required />
                  <Input label={t('phone')} value={partyA.phone} onChange={e => updatePartyA('phone', e.target.value)} placeholder="+1 (416) 555-0100" />
                  <Input label={t('streetAddress')} value={partyA.address} onChange={e => updatePartyA('address', e.target.value)} placeholder="123 Main Street" />
                  <Input label={t('city')} value={partyA.city} onChange={e => updatePartyA('city', e.target.value)} placeholder="Toronto" />
                  <Input label={t('province')} value={partyA.province} onChange={e => updatePartyA('province', e.target.value)} placeholder="Ontario" />
                  <Input label={t('postalCode')} value={partyA.postalCode} onChange={e => updatePartyA('postalCode', e.target.value)} placeholder="M5H 2N2" />
                </div>
              </div>
            )}

            {/* Step 3: Other Party (Party B) */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">{t('otherPartyTitle')}</h2>
                <p className="text-gray-500 text-sm mb-8">{partyBRole}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input label={t('fullName')} value={partyB.name} onChange={e => updatePartyB('name', e.target.value)} placeholder="John Doe" required />
                  <Input label={t('company')} value={partyB.company} onChange={e => updatePartyB('company', e.target.value)} placeholder="Company Ltd." />
                  <Input label={t('email')} type="email" value={partyB.email} onChange={e => updatePartyB('email', e.target.value)} placeholder="john@example.com" />
                  <Input label={t('phone')} value={partyB.phone} onChange={e => updatePartyB('phone', e.target.value)} placeholder="+1 (416) 555-0101" />
                  <Input label={t('streetAddress')} value={partyB.address} onChange={e => updatePartyB('address', e.target.value)} placeholder="456 King Street" />
                  <Input label={t('city')} value={partyB.city} onChange={e => updatePartyB('city', e.target.value)} placeholder="Toronto" />
                  <Input label={t('province')} value={partyB.province} onChange={e => updatePartyB('province', e.target.value)} placeholder="Ontario" />
                  <Input label={t('postalCode')} value={partyB.postalCode} onChange={e => updatePartyB('postalCode', e.target.value)} placeholder="M5V 1A1" />
                </div>
              </div>
            )}

            {/* Step 4: Terms */}
            {step === 4 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">{t('contractTermsTitle')}</h2>
                <p className="text-gray-500 text-sm mb-8">{t('contractTermsDesc')} {contractType}.</p>

                <div className="space-y-8">
                  {/* Common dates */}
                  <div>
                    <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionDates')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input label={t('startDate')} type="date" value={terms.startDate} onChange={e => updateTerms('startDate', e.target.value)} required />
                      <Input label={t('endDate')} type="date" value={terms.endDate} onChange={e => updateTerms('endDate', e.target.value)} />
                    </div>
                  </div>

                  {/* Employment-specific */}
                  {contractType === 'Employment' && (
                    <>
                      <div>
                        <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionPositionComp')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input label={t('jobTitle')} value={terms.position} onChange={e => updateTerms('position', e.target.value)} placeholder="Software Engineer" />
                          <div className="flex gap-3">
                            <Input label={t('salaryWage')} type="number" value={terms.salary} onChange={e => updateTerms('salary', e.target.value)} placeholder="75000" className="flex-1" />
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">{t('period')}</label>
                              <select
                                value={terms.salaryPeriod}
                                onChange={e => updateTerms('salaryPeriod', e.target.value)}
                                className="bg-navy-700 border border-white/10 rounded px-3 py-3 text-sm text-white focus:outline-none focus:border-bronze/60"
                              >
                                <option value="annual">{t('optAnnual')}</option>
                                <option value="monthly">{t('optMonthly')}</option>
                                <option value="hourly">{t('optHourly')}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionEmploymentCond')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input label={t('probationPeriod')} type="number" value={terms.probationPeriod} onChange={e => updateTerms('probationPeriod', e.target.value)} min={0} max={12} />
                          <Input label={t('terminationNoticeWeeks')} type="number" value={terms.terminationNotice} onChange={e => updateTerms('terminationNotice', e.target.value)} min={0} />
                          <Input label={t('weeklyHours')} type="number" value={terms.workHours} onChange={e => updateTerms('workHours', e.target.value)} min={1} max={80} />
                          <Input label={t('workDays')} value={terms.workDays} onChange={e => updateTerms('workDays', e.target.value)} placeholder="Monday to Friday" />
                          <Input label={t('annualVacation')} type="number" value={terms.vacation} onChange={e => updateTerms('vacation', e.target.value)} min={2} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionBenefits')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {BENEFITS_OPTIONS.map(b => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => toggleBenefit(b)}
                              className={`p-3 rounded border text-xs text-left transition-all
                                ${terms.benefits.includes(b)
                                  ? 'border-bronze/40 bg-bronze/10 text-bronze'
                                  : 'border-white/5 bg-navy-700 text-gray-400 hover:border-white/20 hover:text-white'}`}
                            >
                              <span className="flex items-center gap-1.5">
                                {terms.benefits.includes(b) && <Check size={10} />}
                                {b}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* NDA-specific */}
                  {contractType === 'NDA' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionConfidentiality')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label={t('confidentialityPeriod')}
                          type="number"
                          value={terms.confidentialityPeriod}
                          onChange={e => updateTerms('confidentialityPeriod', e.target.value)}
                          min={1}
                          max={10}
                        />
                      </div>
                    </div>
                  )}

                  {/* Service / Consulting / Freelance */}
                  {['Service Agreement', 'Consulting', 'Freelance'].includes(contractType) && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionScopePayment')}</h3>
                      <div className="space-y-5">
                        <Input
                          label={t('projectDesc')}
                          type="textarea"
                          value={terms.projectDescription}
                          onChange={e => updateTerms('projectDescription', e.target.value)}
                          placeholder={t('projectDescPlaceholder')}
                          rows={4}
                        />
                        <Input
                          label={t('deliverables')}
                          type="textarea"
                          value={terms.deliverables}
                          onChange={e => updateTerms('deliverables', e.target.value)}
                          placeholder={t('deliverablesPlaceholder')}
                          rows={3}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input
                            label={t('paymentAmount')}
                            type="number"
                            value={terms.paymentAmount}
                            onChange={e => updateTerms('paymentAmount', e.target.value)}
                            placeholder="5000"
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">{t('paymentTermsLabel')}</label>
                            <select
                              value={terms.paymentTerms}
                              onChange={e => updateTerms('paymentTerms', e.target.value)}
                              className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-bronze/60"
                            >
                              <option value="net15">{t('optNet15')}</option>
                              <option value="net30">{t('optNet30')}</option>
                              <option value="net60">{t('optNet60')}</option>
                              <option value="upfront">{t('optUpfront')}</option>
                              <option value="split">{t('optSplit')}</option>
                              <option value="completion">{t('optCompletion')}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rental */}
                  {contractType === 'Rental' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionRentalTerms')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label={t('propertyAddress')}
                          value={terms.propertyAddress}
                          onChange={e => updateTerms('propertyAddress', e.target.value)}
                          placeholder={t('propertyAddressPlaceholder')}
                          className="md:col-span-2"
                        />
                        <Input label={t('monthlyRent')} type="number" value={terms.monthlyRent} onChange={e => updateTerms('monthlyRent', e.target.value)} placeholder="2000" />
                        <Input label={t('securityDeposit')} type="number" value={terms.securityDeposit} onChange={e => updateTerms('securityDeposit', e.target.value)} placeholder="2000" />
                        <Input label={t('terminationNoticeDays')} type="number" value={terms.terminationNotice} onChange={e => updateTerms('terminationNotice', e.target.value)} placeholder="60" />
                      </div>
                    </div>
                  )}

                  {/* Non-Compete */}
                  {contractType === 'Non-Compete' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionNonCompete')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input label={t('restrictedPeriod')} type="number" value={terms.nonCompetePeriod} onChange={e => updateTerms('nonCompetePeriod', e.target.value)} min={1} max={24} />
                        <Input label={t('geographicTerritory')} value={terms.territory} onChange={e => updateTerms('territory', e.target.value)} placeholder={t('geographicTerritoryPlaceholder')} />
                        <Input
                          label={t('competitiveBusinessDesc')}
                          type="textarea"
                          value={terms.businessDescription}
                          onChange={e => updateTerms('businessDescription', e.target.value)}
                          placeholder={t('competitiveBusinessDescPlaceholder')}
                          className="md:col-span-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* Partnership */}
                  {contractType === 'Partnership' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">{t('sectionPartnership')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label={t('businessPurpose')}
                          type="textarea"
                          value={terms.projectDescription}
                          onChange={e => updateTerms('projectDescription', e.target.value)}
                          placeholder={t('businessPurposePlaceholder')}
                          className="md:col-span-2"
                        />
                        <Input label={t('profitShareA')} type="number" value={terms.profitSharingA} onChange={e => updateTerms('profitSharingA', e.target.value)} placeholder="50" min={0} max={100} />
                        <Input label={t('profitShareB')} type="number" value={terms.profitSharingB} onChange={e => updateTerms('profitSharingB', e.target.value)} placeholder="50" min={0} max={100} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Review & Save */}
            {step === 5 && (
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-3xl text-white mb-1">{t('yourContractTitle')}</h2>
                    <p className="text-sm text-gray-500">
                      {contractType} — {jurisdiction} — Generated {new Date().toLocaleDateString('en-CA')}
                    </p>
                  </div>
                  <LanguageToggle lang={lang} onChange={handleLangChange} />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-400 mb-4">
                    {error}
                  </div>
                )}

                {translateError && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded px-4 py-3 text-sm text-amber-400 mb-4">
                    {t('translateError')}
                  </div>
                )}

                <div className={`relative bg-navy-700 border border-white/5 rounded-lg p-6 md:p-8 mb-6
                  ${profile?.plan === 'free' ? 'contract-watermark' : ''}`}
                  onCopy={profile?.plan === 'free' ? e => e.preventDefault() : undefined}
                >
                  {translating ? (
                    <div className="flex items-center gap-3 py-8 justify-center text-gray-500">
                      <div className="w-4 h-4 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">{t('translating')}</span>
                    </div>
                  ) : (
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed contract-content">
                      {displayContent}
                    </pre>
                  )}
                </div>

                {profile?.plan === 'free' && (
                  <div className="border border-bronze/20 bg-bronze/5 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-bronze font-medium">{t('freePlanTitle')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t('freePlanDesc')}
                        <a href="/pricing" className="text-bronze ml-1 hover:text-bronze-light transition-colors">{t('viewPlans')}</a>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={saveContract} loading={saving} className="flex-1">
                    {t('saveDashboard')}
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    {t('saveLater')}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
            <Button variant="ghost" onClick={goBack} disabled={step === 0} className="gap-1.5">
              <ChevronLeft size={16} />
              {t('back')}
            </Button>
            <Button onClick={goNext} disabled={!canProceed()} className="gap-1.5">
              {step === 4 ? t('generateContract') : t('continue')}
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
