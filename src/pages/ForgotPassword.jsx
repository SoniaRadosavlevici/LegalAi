import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale, Check } from '../components/icons/Icons'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await resetPassword(email)
    setLoading(false)
    if (err) setError(err.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <span className="text-bronze"><Scale size={22} strokeWidth={1.5} /></span>
            <span className="font-serif text-xl text-white">LegalAI</span>
          </Link>
          <h1 className="font-serif text-3xl text-white mb-2">Reset Password</h1>
          <p className="text-sm text-gray-500">Enter your email and we'll send a reset link</p>
        </div>

        <div className="bg-navy-700 border border-white/5 rounded-lg p-8">
          {sent ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-bronze/30 text-bronze mb-5">
                <Check size={24} />
              </div>
              <h2 className="font-serif text-xl text-white mb-2">Email Sent</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Check your inbox at <span className="text-white">{email}</span> for the reset link.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-400 mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-bronze hover:text-bronze-light transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
