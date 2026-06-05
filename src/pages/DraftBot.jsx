import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from '../components/icons/Icons'

export default function DraftBot() {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 flex flex-col bg-navy">
      <div className="flex items-center px-4 py-2 border-b border-white/10 flex-shrink-0 bg-navy">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Dashboard
        </button>
      </div>
      <iframe
        src="https://legal-ai-khaki-eight.vercel.app/"
        className="flex-1 w-full border-0"
        title="Contract Drafting Assistant"
        allow="clipboard-write; clipboard-read"
      />
    </div>
  )
}
