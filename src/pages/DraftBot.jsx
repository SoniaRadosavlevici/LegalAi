import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ChevronLeft, Send, Check } from '../components/icons/Icons'
import Button from '../components/ui/Button'
import { sendLawyerDraftReviewEmail } from '../lib/emailService'

export default function DraftBot() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showConfirm, setShowConfirm] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleConfirm = async () => {
    setSending(true)
    await sendLawyerDraftReviewEmail({ senderEmail: user?.email })
    setSending(false)
    setSent(true)
    setShowConfirm(false)
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-navy">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 flex-shrink-0 bg-navy">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Dashboard
        </button>

        {sent ? (
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <Check size={12} />
            Sent for Review
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShowConfirm(true)}
          >
            <Send size={12} />
            Have a Lawyer Review This
          </Button>
        )}
      </div>

      <iframe
        src="https://legal-ai-khaki-eight.vercel.app/"
        className="flex-1 w-full border-0"
        title="Contract Drafting Assistant"
        allow="clipboard-write; clipboard-read"
      />

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-navy-700 border border-white/10 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="font-serif text-xl text-white mb-3">Request Lawyer Review</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your contract will be sent to a lawyer for review. You will receive a quote within 48 hours.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button size="sm" loading={sending} onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
