import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Scale, Check } from '../components/icons/Icons'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [linkInvalid, setLinkInvalid] = useState(false)

  useEffect(() => {
    let resolved = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        resolved = true
        setSessionReady(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        resolved = true
        setSessionReady(true)
      }
    })

    const timer = setTimeout(() => {
      if (!resolved) setLinkInvalid(true)
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) setError(err.message)
    else setDone(true)
  }

  if (linkInvalid) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 justify-center">
            <span className="text-bronze"><Scale size={22} strokeWidth={1.5} /></span>
            <span className="font-serif text-xl text-white">LegalAI</span>
          </Link>
          <div className="bg-navy-700 border border-white/5 rounded-lg p-8">
            <h2 className="font-serif text-xl text-white mb-2">Link Expired</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button variant="outline" size="sm">Request a New Link</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <span className="text-bronze"><Scale size={22} strokeWidth={1.5} /></span>
            <span className="font-serif text-xl text-white">LegalAI</span>
          </Link>
          <h1 className="font-serif text-3xl text-white mb-2">New Password</h1>
          <p className="text-sm text-gray-500">Choose a strong password for your account</p>
        </div>

        <div className="bg-navy-700 border border-white/5 rounded-lg p-8">
          {done ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-bronze/30 text-bronze mb-5">
                <Check size={24} />
              </div>
              <h2 className="font-serif text-xl text-white mb-2">Password Updated</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Your password has been changed. You can now sign in.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">Go to Sign In</Button>
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
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  Update Password
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
