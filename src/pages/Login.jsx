import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale } from '../components/icons/Icons'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(form.email, form.password)
    setLoading(false)
    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : err.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <span className="text-bronze"><Scale size={22} strokeWidth={1.5} /></span>
            <span className="font-serif text-xl text-white">LegalAI</span>
          </Link>
          <h1 className="font-serif text-3xl text-white mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="bg-navy-700 border border-white/5 rounded-lg p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm text-red-400 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
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
              placeholder="Your password"
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-bronze hover:text-bronze-light transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link to="/signup" className="text-bronze hover:text-bronze-light transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
