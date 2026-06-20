const dict = {
  en: {
    // Step labels
    stepContractType: 'Contract Type',
    stepJurisdiction: 'Jurisdiction',
    stepYourDetails: 'Your Details',
    stepOtherParty: 'Other Party',
    stepTerms: 'Terms',
    stepReviewSave: 'Review & Save',

    // Step 0
    selectContractTypeTitle: 'Select Contract Type',
    selectContractTypeDesc: 'Choose the type of contract you need to draft.',

    // Step 1
    selectJurisdictionTitle: 'Select Jurisdiction',
    selectJurisdictionDesc: 'Select the province or territory where this contract will be governed.',

    // Step 2 — Party A
    yourDetailsTitle: 'Your Details',
    roleEmployer: 'As the Employer',
    roleLandlord: 'As the Landlord',
    roleDisclosingParty: 'As the Disclosing Party',
    roleYourInfo: 'Your information',

    // Step 3 — Party B
    otherPartyTitle: 'Other Party',
    roleEmployee: "The Employee's information",
    roleTenant: "The Tenant's information",
    roleReceivingParty: "The Receiving Party's information",
    roleOtherParty: "The other party's information",

    // Common fields
    fullName: 'Full Name',
    company: 'Company (optional)',
    titleRole: 'Title / Role (optional)',
    email: 'Email',
    phone: 'Phone (optional)',
    streetAddress: 'Street Address',
    city: 'City',
    province: 'Province',
    postalCode: 'Postal Code',

    // Step 4 — Terms
    contractTermsTitle: 'Contract Terms',
    contractTermsDesc: 'Specify the terms for your',
    sectionDates: 'Dates',
    startDate: 'Start Date',
    endDate: 'End Date (leave blank for indefinite)',

    // Employment
    sectionPositionComp: 'Position & Compensation',
    jobTitle: 'Job Title / Position',
    salaryWage: 'Salary / Wage',
    period: 'Period',
    optAnnual: 'Annual',
    optMonthly: 'Monthly',
    optHourly: 'Hourly',
    sectionEmploymentCond: 'Employment Conditions',
    probationPeriod: 'Probation Period (months)',
    terminationNoticeWeeks: 'Termination Notice (weeks)',
    weeklyHours: 'Weekly Hours',
    workDays: 'Work Days',
    annualVacation: 'Annual Vacation (weeks)',
    sectionBenefits: 'Benefits',

    // NDA
    sectionConfidentiality: 'Confidentiality Terms',
    confidentialityPeriod: 'Confidentiality Period (years)',

    // Service / Consulting / Freelance
    sectionScopePayment: 'Scope & Payment',
    projectDesc: 'Project / Scope Description',
    projectDescPlaceholder: 'Describe the services or project in detail...',
    deliverables: 'Deliverables',
    deliverablesPlaceholder: 'List the specific deliverables...',
    paymentAmount: 'Payment Amount (CAD)',
    paymentTermsLabel: 'Payment Terms',
    optNet15: 'Net 15 days',
    optNet30: 'Net 30 days',
    optNet60: 'Net 60 days',
    optUpfront: '100% Upfront',
    optSplit: '50/50 Split',
    optCompletion: 'Upon Completion',

    // Rental
    sectionRentalTerms: 'Rental Terms',
    propertyAddress: 'Property Address',
    propertyAddressPlaceholder: '123 Maple Avenue, Apt 4B',
    monthlyRent: 'Monthly Rent (CAD)',
    securityDeposit: 'Security Deposit (CAD)',
    terminationNoticeDays: 'Termination Notice (days)',

    // Non-Compete
    sectionNonCompete: 'Non-Competition Terms',
    restrictedPeriod: 'Restricted Period (months)',
    geographicTerritory: 'Geographic Territory',
    geographicTerritoryPlaceholder: 'Province of Ontario',
    competitiveBusinessDesc: 'Competitive Business Description',
    competitiveBusinessDescPlaceholder: 'Describe the type of competitive business...',

    // Partnership
    sectionPartnership: 'Partnership Terms',
    businessPurpose: 'Business Purpose',
    businessPurposePlaceholder: "Describe the Partnership's business...",
    profitShareA: 'Profit Share — Party A (%)',
    profitShareB: 'Profit Share — Party B (%)',

    // Step 5 — Review
    yourContractTitle: 'Your Contract',
    translating: 'Translating…',
    translateError: 'Translation failed — showing original.',
    saveDashboard: 'Save to Dashboard',
    saveLater: 'Save for Later',
    freePlanTitle: 'Free Plan — Watermarked Preview',
    freePlanDesc: 'Upgrade to Starter or Pro to remove the watermark and export as PDF or Word.',
    viewPlans: 'View plans',

    // Buttons
    back: 'Back',
    continue: 'Continue',
    generateContract: 'Generate Contract',

    // ContractView
    backDashboard: 'Back to Dashboard',
  },

  fr: {
    stepContractType: 'Type de contrat',
    stepJurisdiction: 'Juridiction',
    stepYourDetails: 'Vos informations',
    stepOtherParty: 'Autre partie',
    stepTerms: 'Conditions',
    stepReviewSave: 'Réviser et enregistrer',

    selectContractTypeTitle: 'Sélectionner le type de contrat',
    selectContractTypeDesc: 'Choisissez le type de contrat dont vous avez besoin.',

    selectJurisdictionTitle: 'Sélectionner la juridiction',
    selectJurisdictionDesc: 'Sélectionnez la province ou le territoire où ce contrat sera régi.',

    yourDetailsTitle: 'Vos informations',
    roleEmployer: "En tant qu'employeur",
    roleLandlord: 'En tant que propriétaire',
    roleDisclosingParty: 'En tant que partie divulgatrice',
    roleYourInfo: 'Vos informations',

    otherPartyTitle: 'Autre partie',
    roleEmployee: "Informations de l'employé",
    roleTenant: 'Informations du locataire',
    roleReceivingParty: 'Informations de la partie réceptrice',
    roleOtherParty: "Informations de l'autre partie",

    fullName: 'Nom complet',
    company: 'Entreprise (facultatif)',
    titleRole: 'Titre / Rôle (facultatif)',
    email: 'Courriel',
    phone: 'Téléphone (facultatif)',
    streetAddress: 'Adresse',
    city: 'Ville',
    province: 'Province',
    postalCode: 'Code postal',

    contractTermsTitle: 'Conditions du contrat',
    contractTermsDesc: 'Précisez les conditions de votre',
    sectionDates: 'Dates',
    startDate: 'Date de début',
    endDate: 'Date de fin (laisser vide pour durée indéterminée)',

    sectionPositionComp: 'Poste et rémunération',
    jobTitle: 'Titre du poste / Poste',
    salaryWage: 'Salaire / Traitement',
    period: 'Période',
    optAnnual: 'Annuel',
    optMonthly: 'Mensuel',
    optHourly: 'Horaire',
    sectionEmploymentCond: "Conditions d'emploi",
    probationPeriod: 'Période de probation (mois)',
    terminationNoticeWeeks: 'Préavis de résiliation (semaines)',
    weeklyHours: 'Heures hebdomadaires',
    workDays: 'Jours de travail',
    annualVacation: 'Vacances annuelles (semaines)',
    sectionBenefits: 'Avantages sociaux',

    sectionConfidentiality: 'Conditions de confidentialité',
    confidentialityPeriod: 'Période de confidentialité (années)',

    sectionScopePayment: 'Portée et paiement',
    projectDesc: 'Description du projet / Portée',
    projectDescPlaceholder: 'Décrivez les services ou le projet en détail...',
    deliverables: 'Livrables',
    deliverablesPlaceholder: 'Listez les livrables spécifiques...',
    paymentAmount: 'Montant du paiement (CAD)',
    paymentTermsLabel: 'Modalités de paiement',
    optNet15: 'Net 15 jours',
    optNet30: 'Net 30 jours',
    optNet60: 'Net 60 jours',
    optUpfront: "100% à l'avance",
    optSplit: 'Partage 50/50',
    optCompletion: 'À la livraison',

    sectionRentalTerms: 'Conditions de location',
    propertyAddress: 'Adresse du bien',
    propertyAddressPlaceholder: '123 avenue Maple, App. 4B',
    monthlyRent: 'Loyer mensuel (CAD)',
    securityDeposit: 'Dépôt de garantie (CAD)',
    terminationNoticeDays: 'Préavis de résiliation (jours)',

    sectionNonCompete: 'Conditions de non-concurrence',
    restrictedPeriod: 'Période de restriction (mois)',
    geographicTerritory: 'Territoire géographique',
    geographicTerritoryPlaceholder: 'Province de l'Ontario',
    competitiveBusinessDesc: "Description de l'activité concurrente",
    competitiveBusinessDescPlaceholder: "Décrivez le type d'activité concurrente...",

    sectionPartnership: 'Conditions du partenariat',
    businessPurpose: "Objet de l'entreprise",
    businessPurposePlaceholder: "Décrivez les activités du partenariat...",
    profitShareA: 'Part des bénéfices — Partie A (%)',
    profitShareB: 'Part des bénéfices — Partie B (%)',

    yourContractTitle: 'Votre contrat',
    translating: 'Traduction en cours…',
    translateError: 'Traduction échouée — affichage en anglais.',
    saveDashboard: 'Enregistrer dans le tableau de bord',
    saveLater: 'Enregistrer plus tard',
    freePlanTitle: 'Forfait gratuit — Aperçu avec filigrane',
    freePlanDesc: 'Passez à Starter ou Pro pour supprimer le filigrane et exporter en PDF ou Word.',
    viewPlans: 'Voir les forfaits',

    back: 'Retour',
    continue: 'Continuer',
    generateContract: 'Générer le contrat',

    backDashboard: 'Retour au tableau de bord',
  },
}

export function tr(lang, key) {
  return dict[lang]?.[key] ?? dict.en[key] ?? key
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]
