import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Scale, CreditCard, Lock, Check, Shield } from '../components/icons/Icons'

const PLANS = {
  starter: { name: 'Starter', price: 30, features: ['20 contracts/month', 'PDF + Word export', 'No watermark', 'Lawyer review'] },
  pro: { name: 'Pro', price: 80, features: ['Unlimited contracts', 'PDF + Word export', 'No watermark', 'Consistency checker', 'Priority support'] },
}

export default function Checkout() {
  const { plan: planSlug } = useParams()
  const { user, profile, signUp, updatePlan } = useAuth()
  const navigate = useNavigate()
  const plan = PLANS[planSlug]

  const [tab, setTab] = useState(user ? 'payment' : 'account')
  const [accountForm, setAccountForm] = useState({ fullName: '', email: '', password: '' })
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!plan) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="text-gray-500">Invalid plan. <Link to="/pricing" className="text-bronze">View pricing</Link></p>
      </div>
    )
  }

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setProcessing(true)

    // Account creation step (if not logged in)
    if (!user && tab === 'account') {
      const { error: err } = await signUp(accountForm.email, accountForm.password, accountForm.fullName)
      if (err) { setError(err.message); setProcessing(false); return }
      setTab('payment')
      setProcessing(false)
      return
    }

    // Payment step — simulate processing
    await new Promise(r => setTimeout(r, 1800))

    // In production: integrate Stripe here
    // For now, just update the plan in Supabase if logged in
    if (user && updatePlan) {
      await updatePlan(planSlug)
    }

    setProcessing(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-bronze/30 text-bronze mb-6">
            <Check size={32} />
          </div>
          <h1 className="font-serif text-3xl text-white mb-3">Welcome to {plan.name}</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Your account has been upgraded. All {plan.name} features are now available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => navigate('/contract/new')}>Draft a Contract</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-8">
          <Link to="/pricing" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Pricing
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <h1 className="font-serif text-3xl text-white mb-2">Complete Your Order</h1>
            <p className="text-gray-500 text-sm mb-8">LegalAI {plan.name} — ${plan.price}/month CAD</p>

            {/* Step tabs */}
            {!user && (
              <div className="flex gap-1 mb-6 border border-white/5 rounded-lg p-1 bg-navy-700">
                {['account', 'payment'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-sm rounded transition-colors capitalize
                      ${tab === t ? 'bg-navy-600 text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    {t === 'account' ? '1. Account' : '2. Payment'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-400 mb-5">
                  {error}
                </div>
              )}

              {/* Account Form */}
              {!user && tab === 'account' && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4">Create Account</h3>
                  <Input
                    label="Full Name"
                    value={accountForm.fullName}
                    onChange={e => setAccountForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Jane Smith"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={accountForm.email}
                    onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="jane@company.com"
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={accountForm.password}
                    onChange={e => setAccountForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <Button type="submit" loading={processing} className="w-full mt-2">
                    Continue to Payment
                  </Button>
                  <p className="text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-bronze hover:text-bronze-light transition-colors">Sign in</Link>
                  </p>
                </div>
              )}

              {/* Payment Form */}
              {(user || tab === 'payment') && (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-luxury text-gray-500 mb-4 flex items-center gap-2">
                    <CreditCard size={14} />
                    Payment Details
                  </h3>

                  <Input
                    label="Cardholder Name"
                    value={cardForm.name}
                    onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Smith"
                    required
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardForm.number}
                        onChange={e => setCardForm(f => ({ ...f, number: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full bg-navy-700 border border-white/10 rounded px-4 py-3 pr-12 text-sm text-white
                          placeholder-gray-600 focus:outline-none focus:border-bronze/60 transition-colors"
                        required
                      />
                      <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">Expiry</label>
                      <input
                        type="text"
                        value={cardForm.expiry}
                        onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white
                          placeholder-gray-600 focus:outline-none focus:border-bronze/60 transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">CVV</label>
                      <input
                        type="text"
                        value={cardForm.cvv}
                        onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        maxLength={4}
                        className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white
                          placeholder-gray-600 focus:outline-none focus:border-bronze/60 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <Lock size={12} className="text-gray-600" />
                    <span className="text-xs text-gray-600">Payments processed securely via Stripe. We never store card details.</span>
                  </div>

                  <Button type="submit" loading={processing} className="w-full mt-2">
                    {processing ? 'Processing...' : `Pay $${plan.price} CAD`}
                  </Button>

                  <p className="text-center text-xs text-gray-600">
                    By completing your purchase, you agree to our Terms of Service. Cancel anytime.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-navy-700 border border-white/5 rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Scale size={18} className="text-bronze" strokeWidth={1.5} />
                <span className="font-serif text-white">LegalAI {plan.name}</span>
              </div>

              <div className="border-t border-white/5 pt-5 mb-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{plan.name} Plan</span>
                  <span className="text-white">${plan.price}/mo CAD</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>GST/HST (where applicable)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mb-5">
                <div className="flex justify-between font-medium">
                  <span className="text-white text-sm">Total</span>
                  <span className="text-bronze font-semibold">${plan.price} CAD/mo</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check size={13} className="text-bronze flex-shrink-0" />
                    <span className="text-gray-400">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                <Shield size={14} className="text-gray-600" />
                <p className="text-xs text-gray-600">30-day money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
