import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateContract, extractStructuredData } from '../lib/contractTemplates'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Check, ChevronRight, ChevronLeft, FileText, AlertTriangle } from '../components/icons/Icons'

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

const STEPS = [
  'Contract Type',
  'Jurisdiction',
  'Your Details',
  'Other Party',
  'Terms',
  'Review & Save',
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

export default function ContractWizard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [contractType, setContractType] = useState(searchParams.get('type') || '')
  const [jurisdiction, setJurisdiction] = useState('')
  const [partyA, setPartyA] = useState({ ...defaultParty })
  const [partyB, setPartyB] = useState({ ...defaultParty })
  const [terms, setTerms] = useState({ ...defaultTerms })
  const [generatedContent, setGeneratedContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updatePartyA = (key, val) => setPartyA(p => ({ ...p, [key]: val }))
  const updatePartyB = (key, val) => setPartyB(p => ({ ...p, [key]: val }))
  const updateTerms = (key, val) => setTerms(t => ({ ...t, [key]: val }))

  const toggleBenefit = (b) => {
    setTerms(t => ({
      ...t,
      benefits: t.benefits.includes(b) ? t.benefits.filter(x => x !== b) : [...t.benefits, b]
    }))
  }

  const goNext = () => {
    if (step === 4) {
      const data = { contractType, jurisdiction, partyA, partyB, terms }
      setGeneratedContent(generateContract(data))
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
      content: generatedContent,
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

  const selectedJurisdiction = JURISDICTIONS.find(j => j.name === jurisdiction)

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
                <h2 className="font-serif text-3xl text-white mb-2">Select Contract Type</h2>
                <p className="text-gray-500 text-sm mb-8">Choose the type of contract you need to draft.</p>
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
                <h2 className="font-serif text-3xl text-white mb-2">Select Jurisdiction</h2>
                <p className="text-gray-500 text-sm mb-8">Select the province or territory where this contract will be governed.</p>
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
                <h2 className="font-serif text-3xl text-white mb-2">Your Details</h2>
                <p className="text-gray-500 text-sm mb-8">
                  {contractType === 'Employment' ? 'As the Employer' :
                   contractType === 'Rental' ? 'As the Landlord' :
                   contractType === 'NDA' ? 'As the Disclosing Party' : 'Your information'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input label="Full Name" value={partyA.name} onChange={e => updatePartyA('name', e.target.value)} placeholder="Jane Smith" required />
                  <Input label="Company (optional)" value={partyA.company} onChange={e => updatePartyA('company', e.target.value)} placeholder="Acme Corp" />
                  <Input label="Title / Role (optional)" value={partyA.title} onChange={e => updatePartyA('title', e.target.value)} placeholder="CEO" />
                  <Input label="Email" type="email" value={partyA.email} onChange={e => updatePartyA('email', e.target.value)} placeholder="jane@example.com" required />
                  <Input label="Phone (optional)" value={partyA.phone} onChange={e => updatePartyA('phone', e.target.value)} placeholder="+1 (416) 555-0100" />
                  <Input label="Street Address" value={partyA.address} onChange={e => updatePartyA('address', e.target.value)} placeholder="123 Main Street" />
                  <Input label="City" value={partyA.city} onChange={e => updatePartyA('city', e.target.value)} placeholder="Toronto" />
                  <Input label="Province" value={partyA.province} onChange={e => updatePartyA('province', e.target.value)} placeholder="Ontario" />
                  <Input label="Postal Code" value={partyA.postalCode} onChange={e => updatePartyA('postalCode', e.target.value)} placeholder="M5H 2N2" />
                </div>
              </div>
            )}

            {/* Step 3: Other Party (Party B) */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">Other Party</h2>
                <p className="text-gray-500 text-sm mb-8">
                  {contractType === 'Employment' ? 'The Employee\'s information' :
                   contractType === 'Rental' ? 'The Tenant\'s information' :
                   contractType === 'NDA' ? 'The Receiving Party\'s information' : 'The other party\'s information'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input label="Full Name" value={partyB.name} onChange={e => updatePartyB('name', e.target.value)} placeholder="John Doe" required />
                  <Input label="Company (optional)" value={partyB.company} onChange={e => updatePartyB('company', e.target.value)} placeholder="Company Ltd." />
                  <Input label="Email (optional)" type="email" value={partyB.email} onChange={e => updatePartyB('email', e.target.value)} placeholder="john@example.com" />
                  <Input label="Phone (optional)" value={partyB.phone} onChange={e => updatePartyB('phone', e.target.value)} placeholder="+1 (416) 555-0101" />
                  <Input label="Street Address" value={partyB.address} onChange={e => updatePartyB('address', e.target.value)} placeholder="456 King Street" />
                  <Input label="City" value={partyB.city} onChange={e => updatePartyB('city', e.target.value)} placeholder="Toronto" />
                  <Input label="Province" value={partyB.province} onChange={e => updatePartyB('province', e.target.value)} placeholder="Ontario" />
                  <Input label="Postal Code" value={partyB.postalCode} onChange={e => updatePartyB('postalCode', e.target.value)} placeholder="M5V 1A1" />
                </div>
              </div>
            )}

            {/* Step 4: Terms */}
            {step === 4 && (
              <div>
                <h2 className="font-serif text-3xl text-white mb-2">Contract Terms</h2>
                <p className="text-gray-500 text-sm mb-8">Specify the terms for your {contractType}.</p>

                <div className="space-y-8">
                  {/* Common dates */}
                  <div>
                    <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input label="Start Date" type="date" value={terms.startDate} onChange={e => updateTerms('startDate', e.target.value)} required />
                      <Input label="End Date (leave blank for indefinite)" type="date" value={terms.endDate} onChange={e => updateTerms('endDate', e.target.value)} />
                    </div>
                  </div>

                  {/* Employment-specific */}
                  {contractType === 'Employment' && (
                    <>
                      <div>
                        <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Position & Compensation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input label="Job Title / Position" value={terms.position} onChange={e => updateTerms('position', e.target.value)} placeholder="Software Engineer" />
                          <div className="flex gap-3">
                            <Input label="Salary / Wage" type="number" value={terms.salary} onChange={e => updateTerms('salary', e.target.value)} placeholder="75000" className="flex-1" />
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">Period</label>
                              <select
                                value={terms.salaryPeriod}
                                onChange={e => updateTerms('salaryPeriod', e.target.value)}
                                className="bg-navy-700 border border-white/10 rounded px-3 py-3 text-sm text-white focus:outline-none focus:border-bronze/60"
                              >
                                <option value="annual">Annual</option>
                                <option value="monthly">Monthly</option>
                                <option value="hourly">Hourly</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Employment Conditions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input label="Probation Period (months)" type="number" value={terms.probationPeriod} onChange={e => updateTerms('probationPeriod', e.target.value)} min={0} max={12} />
                          <Input label="Termination Notice (weeks)" type="number" value={terms.terminationNotice} onChange={e => updateTerms('terminationNotice', e.target.value)} min={0} />
                          <Input label="Weekly Hours" type="number" value={terms.workHours} onChange={e => updateTerms('workHours', e.target.value)} min={1} max={80} />
                          <Input label="Work Days" value={terms.workDays} onChange={e => updateTerms('workDays', e.target.value)} placeholder="Monday to Friday" />
                          <Input label="Annual Vacation (weeks)" type="number" value={terms.vacation} onChange={e => updateTerms('vacation', e.target.value)} min={2} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Benefits</h3>
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
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Confidentiality Terms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Confidentiality Period (years)"
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
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Scope & Payment</h3>
                      <div className="space-y-5">
                        <Input
                          label="Project / Scope Description"
                          type="textarea"
                          value={terms.projectDescription}
                          onChange={e => updateTerms('projectDescription', e.target.value)}
                          placeholder="Describe the services or project in detail..."
                          rows={4}
                        />
                        <Input
                          label="Deliverables"
                          type="textarea"
                          value={terms.deliverables}
                          onChange={e => updateTerms('deliverables', e.target.value)}
                          placeholder="List the specific deliverables..."
                          rows={3}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input
                            label="Payment Amount (CAD)"
                            type="number"
                            value={terms.paymentAmount}
                            onChange={e => updateTerms('paymentAmount', e.target.value)}
                            placeholder="5000"
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">Payment Terms</label>
                            <select
                              value={terms.paymentTerms}
                              onChange={e => updateTerms('paymentTerms', e.target.value)}
                              className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-bronze/60"
                            >
                              <option value="net15">Net 15 days</option>
                              <option value="net30">Net 30 days</option>
                              <option value="net60">Net 60 days</option>
                              <option value="upfront">100% Upfront</option>
                              <option value="split">50/50 Split</option>
                              <option value="completion">Upon Completion</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rental */}
                  {contractType === 'Rental' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Rental Terms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Property Address"
                          value={terms.propertyAddress}
                          onChange={e => updateTerms('propertyAddress', e.target.value)}
                          placeholder="123 Maple Avenue, Apt 4B"
                          className="md:col-span-2"
                        />
                        <Input label="Monthly Rent (CAD)" type="number" value={terms.monthlyRent} onChange={e => updateTerms('monthlyRent', e.target.value)} placeholder="2000" />
                        <Input label="Security Deposit (CAD)" type="number" value={terms.securityDeposit} onChange={e => updateTerms('securityDeposit', e.target.value)} placeholder="2000" />
                        <Input label="Termination Notice (days)" type="number" value={terms.terminationNotice} onChange={e => updateTerms('terminationNotice', e.target.value)} placeholder="60" />
                      </div>
                    </div>
                  )}

                  {/* Non-Compete */}
                  {contractType === 'Non-Compete' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Non-Competition Terms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input label="Restricted Period (months)" type="number" value={terms.nonCompetePeriod} onChange={e => updateTerms('nonCompetePeriod', e.target.value)} min={1} max={24} />
                        <Input label="Geographic Territory" value={terms.territory} onChange={e => updateTerms('territory', e.target.value)} placeholder="Province of Ontario" />
                        <Input
                          label="Competitive Business Description"
                          type="textarea"
                          value={terms.businessDescription}
                          onChange={e => updateTerms('businessDescription', e.target.value)}
                          placeholder="Describe the type of competitive business..."
                          className="md:col-span-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* Partnership */}
                  {contractType === 'Partnership' && (
                    <div>
                      <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Partnership Terms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Business Purpose"
                          type="textarea"
                          value={terms.projectDescription}
                          onChange={e => updateTerms('projectDescription', e.target.value)}
                          placeholder="Describe the Partnership's business..."
                          className="md:col-span-2"
                        />
                        <Input label="Profit Share — Party A (%)" type="number" value={terms.profitSharingA} onChange={e => updateTerms('profitSharingA', e.target.value)} placeholder="50" min={0} max={100} />
                        <Input label="Profit Share — Party B (%)" type="number" value={terms.profitSharingB} onChange={e => updateTerms('profitSharingB', e.target.value)} placeholder="50" min={0} max={100} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Review & Save */}
            {step === 5 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-3xl text-white mb-1">Your Contract</h2>
                    <p className="text-sm text-gray-500">
                      {contractType} — {jurisdiction} — Generated {new Date().toLocaleDateString('en-CA')}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-400 mb-4">
                    {error}
                  </div>
                )}

                <div className={`relative bg-navy-700 border border-white/5 rounded-lg p-6 md:p-8 mb-6
                  ${profile?.plan === 'free' ? 'contract-watermark' : ''}`}
                  onCopy={profile?.plan === 'free' ? e => e.preventDefault() : undefined}
                >
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed contract-content">
                    {generatedContent}
                  </pre>
                </div>

                {profile?.plan === 'free' && (
                  <div className="border border-bronze/20 bg-bronze/5 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-bronze font-medium">Free Plan — Watermarked Preview</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Upgrade to Starter or Pro to remove the watermark and export as PDF or Word.
                        <a href="/pricing" className="text-bronze ml-1 hover:text-bronze-light transition-colors">View plans</a>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={saveContract} loading={saving} className="flex-1">
                    Save to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Save for Later
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
              Back
            </Button>
            <Button onClick={goNext} disabled={!canProceed()} className="gap-1.5">
              {step === 4 ? 'Generate Contract' : 'Continue'}
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
