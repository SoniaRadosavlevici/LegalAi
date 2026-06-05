import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale, Check } from '../components/icons/Icons'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { data, error: err } = await signUp(form.email, form.password, form.fullName)
    setLoading(false)
    if (err) {
      setError(err.message)
    } else if (data?.user?.identities?.length === 0) {
      setError('An account with this email already exists.')
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-bronze/30 text-bronze mb-6">
            <Check size={28} />
          </div>
          <h1 className="font-serif text-3xl text-white mb-3">Check Your Email</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            We've sent a confirmation link to <span className="text-white">{form.email}</span>.
            Click the link to activate your account.
          </p>
          <Link to="/login">
            <Button variant="outline">Back to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <span className="text-bronze"><Scale size={22} strokeWidth={1.5} /></span>
            <span className="font-serif text-xl text-white">LegalAI</span>
          </Link>
          <h1 className="font-serif text-3xl text-white mb-2">Create Account</h1>
          <p className="text-sm text-gray-500">Start with a free account — no credit card required</p>
        </div>

        <div className="bg-navy-700 border border-white/5 rounded-lg p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-400 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Free Account
            </Button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-5 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-bronze hover:text-bronze-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
