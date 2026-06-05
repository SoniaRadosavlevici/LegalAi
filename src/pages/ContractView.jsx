import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { sendContractReviewEmail } from '../lib/emailService'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import {
  Download, FileText, Send, ArrowRight, AlertTriangle,
  Calendar, Globe, Check, Loader, ChevronLeft
} from '../components/icons/Icons'

function downloadDoc(content, filename) {
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${filename}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 2cm; color: #000; }
          pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 12pt; }
        </style>
      </head>
      <body><pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body>
    </html>`
  const blob = new Blob([html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.doc`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPdf(filename) {
  const style = document.createElement('style')
  style.id = 'print-style'
  style.textContent = `
    @media print {
      body > *:not(#print-area) { display: none !important; }
      #print-area { display: block !important; }
    }
  `
  document.head.appendChild(style)
  window.print()
  document.head.removeChild(style)
}

export default function ContractView() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewSending, setReviewSending] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)
  const [finalizingDone, setFinalizingDone] = useState(false)
  const [error, setError] = useState('')

  const isPaid = profile?.plan === 'starter' || profile?.plan === 'pro'

  useEffect(() => {
    if (!user || !id) return
    supabase.from('contracts').select('*').eq('id', id).eq('user_id', user.id).single()
      .then(({ data, error: err }) => {
        if (err || !data) navigate('/dashboard')
        else setContract(data)
        setLoading(false)
      })
  }, [id, user])

  const handleReviewByLawyer = async () => {
    if (!contract) return
    setReviewSending(true)
    await sendContractReviewEmail({
      contractTitle: contract.title,
      contractContent: contract.content,
      senderName: profile?.full_name || user.email,
      senderEmail: user.email,
      userPlan: profile?.plan || 'free',
    })
    setReviewSending(false)
    setReviewSent(true)
  }

  const handleFinalize = async () => {
    const { error: err } = await supabase
      .from('contracts')
      .update({ status: 'final' })
      .eq('id', id)
    if (!err) {
      setContract(c => ({ ...c, status: 'final' }))
      setFinalizingDone(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader size={24} className="text-bronze animate-spin" />
      </div>
    )
  }

  if (!contract) return null

  return (
    <div className="min-h-screen bg-navy font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-24 w-full">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={14} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-[10px] uppercase tracking-luxury px-2 py-0.5 rounded-full border ${
                contract.status === 'final'
                  ? 'border-green-500/30 text-green-400 bg-green-500/10'
                  : 'border-gray-600 text-gray-500'
              }`}>
                {contract.status}
              </span>
              <span className="text-[10px] uppercase tracking-luxury text-bronze/60 border border-bronze/20 px-2 py-0.5 rounded-full">
                {contract.type}
              </span>
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">{contract.title}</h1>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Globe size={12} />
                {contract.jurisdiction}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {new Date(contract.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {/* Review by Lawyer — always visible */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReviewByLawyer}
              loading={reviewSending}
              disabled={reviewSent}
              className="gap-1.5 text-xs"
            >
              {reviewSent ? <><Check size={12} /> Sent for Review</> : <><Send size={12} /> Review by Lawyer</>}
            </Button>

            {contract.status !== 'final' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFinalize}
                className="gap-1.5 text-xs"
              >
                {finalizingDone ? <><Check size={12} /> Finalized</> : 'Mark as Final'}
              </Button>
            )}

            {isPaid && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadDoc(contract.content, contract.title)}
                  className="gap-1.5 text-xs"
                >
                  <FileText size={12} />
                  Download Word
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadPdf(contract.title)}
                  className="gap-1.5 text-xs"
                >
                  <Download size={12} />
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Free plan notice */}
        {!isPaid && (
          <div className="border border-bronze/20 bg-bronze/5 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-bronze flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-bronze font-medium">Free Plan — Export Unavailable</p>
                <p className="text-xs text-gray-500">Upgrade to download Word or PDF and remove the watermark.</p>
              </div>
            </div>
            <a href="/pricing" className="flex-shrink-0">
              <Button size="sm" className="gap-1.5 text-xs whitespace-nowrap">
                Upgrade
                <ArrowRight size={12} />
              </Button>
            </a>
          </div>
        )}

        {reviewSent && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            <p className="text-sm text-green-400">Contract sent for lawyer review. You'll be contacted at {user.email}.</p>
          </div>
        )}

        {/* Contract Content */}
        <div id="print-area" className={`bg-navy-700 border border-white/5 rounded-lg p-6 md:p-10
          ${!isPaid ? 'contract-watermark' : ''}`}
          onCopy={!isPaid ? e => e.preventDefault() : undefined}
          style={!isPaid ? { userSelect: 'none' } : {}}
        >
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed contract-content">
            {contract.content}
          </pre>
        </div>

        {/* Structured data for employment */}
        {contract.type === 'Employment' && contract.structured_data && Object.keys(contract.structured_data).length > 0 && (
          <div className="mt-8 bg-navy-700 border border-white/5 rounded-lg p-6">
            <h3 className="text-xs uppercase tracking-luxury text-bronze mb-4">Key Employment Terms</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Probation', value: `${contract.structured_data.probationPeriod || '—'} months` },
                { label: 'Notice Period', value: `${contract.structured_data.terminationNotice || '—'} weeks` },
                { label: 'Salary', value: contract.structured_data.salary ? `$${Number(contract.structured_data.salary).toLocaleString()} CAD` : '—' },
                { label: 'Vacation', value: `${contract.structured_data.vacation || '—'} weeks` },
              ].map(item => (
                <div key={item.label} className="text-center p-3 bg-navy-600/50 rounded">
                  <p className="text-[10px] uppercase tracking-luxury text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
