import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import { Scale, Shield, Globe, FileText, Zap, ArrowRight, Check } from '../components/icons/Icons'

const features = [
  {
    icon: <Scale size={24} />,
    title: 'Canadian Law Compliant',
    desc: 'Every contract is generated in compliance with provincial and territorial legislation, including Quebec\'s Civil Code.',
  },
  {
    icon: <Globe size={24} />,
    title: 'All 13 Jurisdictions',
    desc: 'From Ontario\'s Employment Standards Act to Nunavut\'s adapted Labour Standards — every province and territory covered.',
  },
  {
    icon: <Zap size={24} />,
    title: 'AI-Powered Drafting',
    desc: 'Generate complete, clause-rich contracts in minutes. Our AI understands the nuances of Canadian commercial law.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure Storage',
    desc: 'Contracts stored securely and organized by category. Access your entire library anytime, anywhere.',
  },
  {
    icon: <FileText size={24} />,
    title: 'Export Ready',
    desc: 'Download as Word or PDF. Professional formatting ready for signing and filing.',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Explore the platform',
    features: [
      '3 contract previews per month',
      'Watermarked drafts',
      'All 8 contract types',
      'All 13 jurisdictions',
    ],
    excluded: ['PDF / Word export', 'Remove watermark'],
    cta: 'Start Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$30',
    period: '/month CAD',
    desc: 'For individuals and freelancers',
    features: [
      '20 contracts per month',
      'PDF + Word export',
      'No watermark',
      'All contract types',
      'All 13 jurisdictions',
    ],
    excluded: [],
    cta: 'Start Starter',
    href: '/checkout/starter',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$80',
    period: '/month CAD',
    desc: 'For businesses and legal teams',
    features: [
      'Unlimited contracts',
      'PDF + Word export',
      'No watermark',
      'All contract types',
      'All 13 jurisdictions',
      'Priority support',
    ],
    excluded: [],
    cta: 'Start Pro',
    href: '/checkout/pro',
    highlight: true,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bronze/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-bronze/3 rounded-full blur-[80px]" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 border border-bronze/30 text-bronze text-xs tracking-luxury uppercase px-4 py-2 rounded-full mb-8">
                <Scale size={12} />
                Canadian Contract Intelligence
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6"
            >
              Draft Legal Contracts<br />
              <span className="text-bronze">Built for Canada.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-10"
            >
              AI-powered contract generation compliant with all 13 provincial and territorial jurisdictions —
              including Quebec's Civil Code. Professional. Precise. Instant.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Drafting Free
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-6 text-sm text-gray-500">
              {['All 13 jurisdictions', 'Quebec Civil Code included', 'PDF & Word export', 'No legal expertise required'].map(item => (
                <span key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-bronze" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-luxury text-bronze mb-4">Platform Features</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From NDA to employment agreements — complete contract drafting in minutes, not days.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-navy-700 border border-white/5 rounded-lg p-6 hover:border-bronze/20 transition-colors duration-300"
              >
                <div className="text-bronze mb-4">{f.icon}</div>
                <h3 className="font-serif text-lg text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contract Types Strip */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-luxury text-gray-600 text-center mb-6">Contract Types</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Employment', 'NDA', 'Service Agreement', 'Consulting', 'Freelance', 'Partnership', 'Rental', 'Non-Compete'].map(type => (
              <span
                key={type}
                className="border border-white/10 text-gray-400 text-sm px-4 py-2 rounded-full hover:border-bronze/30 hover:text-bronze transition-colors duration-200"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-luxury text-bronze mb-4">Pricing</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Simple, Transparent</h2>
            <p className="text-gray-500 text-lg">All prices in Canadian dollars. Cancel anytime.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-lg p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-navy-700 border-2 border-bronze'
                    : 'bg-navy-700 border border-white/5'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-bronze text-navy text-[10px] font-bold tracking-luxury uppercase px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-luxury text-gray-400 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-serif text-4xl text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-500">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Check size={14} className="text-bronze flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.excluded.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600 line-through">
                      <span className="w-3.5 h-3.5 flex-shrink-0 border border-gray-700 rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to={plan.href}>
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Scale size={36} className="text-bronze mx-auto mb-6" strokeWidth={1} />
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Start Drafting Today
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Join thousands of Canadian businesses who trust LegalAI for their contract needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg">
                  Create Free Account
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/find-lawyer">
                <Button variant="outline" size="lg">
                  Find a Lawyer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
