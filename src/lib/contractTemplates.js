function formatDate(dateStr) {
  if (!dateStr) return '[Date]'
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

function formatCurrency(amount) {
  if (!amount) return '$[Amount]'
  return `$${Number(amount).toLocaleString('en-CA')}`
}

function governingLaw(jurisdiction) {
  if (jurisdiction === 'Quebec') {
    return 'the Province of Quebec (including the Civil Code of Québec, CQLR c CCQ-1991)'
  }
  return `the Province/Territory of ${jurisdiction}`
}

function employmentStandards(jurisdiction) {
  const acts = {
    'Ontario': 'the Employment Standards Act, 2000, S.O. 2000, c. 41',
    'Quebec': 'An Act Respecting Labour Standards, CQLR c N-1.1',
    'British Columbia': 'the Employment Standards Act, R.S.B.C. 1996, c. 113',
    'Alberta': 'the Employment Standards Code, R.S.A. 2000, c. E-9',
    'Manitoba': 'the Employment Standards Code, C.C.S.M. c. E110',
    'Saskatchewan': 'the Saskatchewan Employment Act, SS 2013, c S-15.1',
    'Nova Scotia': 'the Labour Standards Code, R.S.N.S. 1989, c. 246',
    'New Brunswick': 'the Employment Standards Act, SNB 1982, c. E-7.2',
    'Newfoundland and Labrador': 'the Labour Standards Act, R.S.N.L. 1990, c. L-2',
    'Prince Edward Island': 'the Employment Standards Act, R.S.P.E.I. 1988, c. E-6.2',
    'Northwest Territories': 'the Employment Standards Act, S.N.W.T. 2007, c. 13',
    'Yukon': 'the Employment Standards Act, R.S.Y. 2002, c. 72',
    'Nunavut': 'the Labour Standards Act, R.S.N.W.T. 1988, c. L-1, as adapted for Nunavut',
  }
  return acts[jurisdiction] || 'applicable employment standards legislation'
}

export function generateContract(data) {
  const { contractType } = data
  switch (contractType) {
    case 'Employment': return generateEmploymentContract(data)
    case 'NDA': return generateNDAContract(data)
    case 'Service Agreement': return generateServiceContract(data)
    case 'Consulting': return generateConsultingContract(data)
    case 'Freelance': return generateFreelanceContract(data)
    case 'Partnership': return generatePartnershipContract(data)
    case 'Rental': return generateRentalContract(data)
    case 'Non-Compete': return generateNonCompeteContract(data)
    default: return generateEmploymentContract(data)
  }
}

export function extractStructuredData(contractType, terms) {
  if (contractType !== 'Employment') return {}
  return {
    probationPeriod: Number(terms.probationPeriod) || 3,
    terminationNotice: Number(terms.terminationNotice) || 2,
    salary: Number(terms.salary) || 0,
    salaryPeriod: terms.salaryPeriod || 'annual',
    benefits: terms.benefits || [],
    workHours: Number(terms.workHours) || 40,
    vacation: Number(terms.vacation) || 2,
    position: terms.position || '',
  }
}

function generateEmploymentContract({ partyA, partyB, terms, jurisdiction }) {
  const esa = employmentStandards(jurisdiction)
  const isQC = jurisdiction === 'Quebec'

  return `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.company || partyA.name}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Employer")

AND:

${partyB.name}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Employee")

RECITALS

WHEREAS the Employer wishes to employ the Employee, and the Employee wishes to accept such employment, on the terms and conditions set out in this Agreement;

NOW THEREFORE, in consideration of the mutual covenants herein and other good and valuable consideration, the parties agree as follows:

────────────────────────────────────────

1. EMPLOYMENT

1.1 Position. The Employer employs the Employee as ${terms.position || '[Position]'}, and the Employee accepts such employment on the terms set forth herein.

1.2 Duties. The Employee shall perform all duties customarily associated with the position, and such other duties as the Employer may reasonably assign from time to time.

1.3 Full-Time Service. Unless otherwise agreed in writing, the Employee shall devote their full working time, attention, and abilities to the performance of their duties.

────────────────────────────────────────

2. TERM AND PROBATION

2.1 Start Date. Employment commences on ${formatDate(terms.startDate)}.

${terms.endDate
  ? `2.2 Fixed Term. This Agreement is for a fixed term ending ${formatDate(terms.endDate)}, unless terminated earlier.`
  : `2.2 Indefinite Term. Employment continues indefinitely until terminated in accordance with this Agreement.`}

2.3 Probationary Period. The first ${terms.probationPeriod || 3} months constitute a probationary period, during which the Employer may terminate employment${isQC ? ' in accordance with An Act Respecting Labour Standards' : ' in accordance with ' + esa}.

────────────────────────────────────────

3. COMPENSATION

3.1 Base ${terms.salaryPeriod === 'hourly' ? 'Wage' : 'Salary'}. The Employer shall pay the Employee ${formatCurrency(terms.salary)} CAD per ${terms.salaryPeriod || 'year'}, less applicable statutory deductions, in accordance with the Employer's payroll schedule.

3.2 Annual Review. Compensation shall be reviewed annually at the Employer's discretion. Reviews do not guarantee increases.

${terms.bonus ? `3.3 Bonus. The Employee shall be eligible for a discretionary bonus of up to ${terms.bonus}, subject to individual and company performance criteria.` : ''}

────────────────────────────────────────

4. BENEFITS AND VACATION

4.1 Vacation. The Employee shall be entitled to ${terms.vacation || 2} weeks of paid vacation per year, accruing from the Start Date, to be taken at times agreed upon by both parties, subject to ${esa}.

${terms.benefits && terms.benefits.length > 0 ? `4.2 Employee Benefits. Subject to eligibility requirements, the Employee shall be entitled to:\n${terms.benefits.map(b => `   • ${b}`).join('\n')}` : ''}

4.3 Statutory Holidays. The Employee is entitled to statutory holidays as prescribed by ${esa}.

────────────────────────────────────────

5. HOURS OF WORK

5.1 Regular Hours. The Employee's regular hours are ${terms.workHours || 40} hours per week, generally ${terms.workDays || 'Monday to Friday'}.

5.2 Overtime. Any overtime shall be compensated in accordance with ${esa}. The Employer shall obtain prior written authorization before requesting overtime.

────────────────────────────────────────

6. PLACE OF WORK

6.1 The Employee's primary workplace is ${partyA.address}, ${partyA.city}, ${jurisdiction}. The Employer may require the Employee to work at other locations upon reasonable notice.

────────────────────────────────────────

7. CONFIDENTIALITY

7.1 Confidential Information. The Employee acknowledges access to confidential and proprietary information ("Confidential Information") including trade secrets, client lists, financial data, business strategies, and technical information.

7.2 Non-Disclosure. The Employee shall not disclose, reproduce, or use any Confidential Information for any purpose other than performing their duties, during or after employment. This obligation survives termination indefinitely.

7.3 Permitted Disclosures. Nothing herein restricts the Employee from disclosing information as required by law, provided the Employee gives the Employer prompt written notice of any such required disclosure.

────────────────────────────────────────

8. INTELLECTUAL PROPERTY

8.1 Assignment. All works, inventions, improvements, and developments created by the Employee in the course of employment and related to the Employer's business are the sole property of the Employer. The Employee hereby assigns all right, title, and interest therein to the Employer.

8.2 Moral Rights. To the extent permitted by law, the Employee waives all moral rights in any work created in the course of employment.

────────────────────────────────────────

9. NON-SOLICITATION

9.1 During Employment. The Employee shall not, directly or indirectly, solicit any clients, customers, or employees of the Employer.

9.2 Post-Employment. For twelve (12) months after termination, the Employee shall not solicit any client, customer, or employee with whom the Employee had material contact during the last twelve (12) months of employment.

────────────────────────────────────────

10. TERMINATION

10.1 Termination for Cause. The Employer may terminate this Agreement immediately and without notice or compensation for just cause, including gross misconduct, fraud, or wilful neglect of duties.

10.2 Termination Without Cause. The Employer may terminate this Agreement without cause by providing ${terms.terminationNotice || 2} weeks' written notice or pay in lieu thereof, plus any greater amount required by ${esa}. This represents reasonable notice commensurate with the Employee's tenure and position.

10.3 Resignation. The Employee may resign by providing ${Math.max(1, Math.floor((terms.terminationNotice || 2) / 2))} weeks' written notice to the Employer.

10.4 Return of Property. Upon termination, the Employee shall immediately return all Employer property, equipment, documents, and Confidential Information.

10.5 Survival. Sections 7, 8, and 9 survive the termination of this Agreement.

────────────────────────────────────────

11. GENERAL PROVISIONS

11.1 Governing Law. This Agreement is governed by and construed in accordance with the laws of ${governingLaw(jurisdiction)} and the federal laws of Canada applicable therein.

11.2 Entire Agreement. This Agreement constitutes the entire agreement between the parties and supersedes all prior representations, warranties, and understandings.

11.3 Amendments. No modification of this Agreement is valid unless in writing and signed by both parties.

11.4 Severability. If any provision is held invalid or unenforceable, the remaining provisions continue in full force.

11.5 Independent Legal Advice. The Employee acknowledges having had the opportunity to seek independent legal advice before signing this Agreement.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Employment Agreement as of the date first written above.

EMPLOYER:

____________________________    Date: ________________
${partyA.name}
${partyA.company ? `On behalf of ${partyA.company}` : ''}
Title: ${partyA.title || 'Authorized Signatory'}


EMPLOYEE:

____________________________    Date: ________________
${partyB.name}
`
}

function generateNDAContract({ partyA, partyB, terms, jurisdiction }) {
  return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}${partyA.company ? `, ${partyA.company}` : ''}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Disclosing Party")

AND:

${partyB.name}${partyB.company ? `, ${partyB.company}` : ''}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Receiving Party")

────────────────────────────────────────

1. PURPOSE

The parties wish to explore a potential business relationship (the "Purpose") and, in connection therewith, the Disclosing Party may disclose certain confidential and proprietary information to the Receiving Party.

────────────────────────────────────────

2. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means all information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including without limitation: trade secrets, business plans, financial information, customer lists, technical data, software, inventions, and processes.

────────────────────────────────────────

3. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party shall:

(a) Keep all Confidential Information strictly confidential;
(b) Not disclose Confidential Information to any third party without prior written consent;
(c) Use Confidential Information solely for the Purpose;
(d) Protect Confidential Information with at least the same degree of care as it uses to protect its own confidential information, but in no event less than reasonable care;
(e) Limit access to Confidential Information to those employees, agents, and advisors who need to know such information for the Purpose, and ensure they are bound by obligations at least as protective as this Agreement.

────────────────────────────────────────

4. EXCLUSIONS

The obligations of this Agreement shall not apply to information that:

(a) Is or becomes publicly known through no breach of this Agreement;
(b) Was rightfully known to the Receiving Party before disclosure;
(c) Is independently developed by the Receiving Party without use of Confidential Information;
(d) Is required to be disclosed by law, court order, or regulatory authority, provided the Receiving Party gives prompt prior written notice to the Disclosing Party.

────────────────────────────────────────

5. TERM

This Agreement commences on ${formatDate(terms.startDate)} and the confidentiality obligations shall continue for ${terms.confidentialityPeriod || 2} years from the date of disclosure of each item of Confidential Information.

────────────────────────────────────────

6. RETURN OR DESTRUCTION

Upon request by the Disclosing Party, the Receiving Party shall promptly return or certifiably destroy all Confidential Information and any copies thereof.

────────────────────────────────────────

7. NO LICENSE

Nothing in this Agreement grants any right, title, or interest in any Confidential Information, or any license to any intellectual property of the Disclosing Party.

────────────────────────────────────────

8. REMEDIES

The Receiving Party acknowledges that breach of this Agreement would cause irreparable harm to the Disclosing Party for which monetary damages would be insufficient. Accordingly, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, without bond or other security.

────────────────────────────────────────

9. GENERAL PROVISIONS

9.1 Governing Law. This Agreement is governed by the laws of ${governingLaw(jurisdiction)}.

9.2 Entire Agreement. This Agreement constitutes the entire agreement regarding confidentiality between the parties.

9.3 Amendments. Modifications must be in writing and signed by both parties.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

DISCLOSING PARTY:

____________________________    Date: ________________
${partyA.name}
${partyA.company || ''}


RECEIVING PARTY:

____________________________    Date: ________________
${partyB.name}
${partyB.company || ''}
`
}

function generateServiceContract({ partyA, partyB, terms, jurisdiction }) {
  return `SERVICE AGREEMENT

This Service Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}${partyA.company ? `, ${partyA.company}` : ''}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Client")

AND:

${partyB.name}${partyB.company ? `, ${partyB.company}` : ''}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Service Provider")

────────────────────────────────────────

1. SERVICES

1.1 Scope. The Service Provider shall provide the following services (the "Services"):

${terms.projectDescription || '[Description of Services]'}

1.2 Deliverables. The Service Provider shall deliver:

${terms.deliverables || '[Description of Deliverables]'}

1.3 Standard of Performance. The Service Provider shall perform the Services in a professional and workmanlike manner consistent with industry standards.

────────────────────────────────────────

2. TERM

This Agreement commences on ${formatDate(terms.startDate)}${terms.endDate ? ` and terminates on ${formatDate(terms.endDate)}` : ' and continues until the Services are completed or terminated'}.

────────────────────────────────────────

3. COMPENSATION

3.1 Fees. The Client shall pay the Service Provider ${formatCurrency(terms.paymentAmount)} CAD for the Services.

3.2 Payment Terms. Payment is due ${
  terms.paymentTerms === 'net15' ? 'within 15 days of invoice' :
  terms.paymentTerms === 'net30' ? 'within 30 days of invoice' :
  terms.paymentTerms === 'net60' ? 'within 60 days of invoice' :
  'upon completion of the Services'
}.

3.3 Late Payment. Invoices not paid within the agreed period are subject to interest at 1.5% per month on the outstanding balance.

3.4 Expenses. The Client shall reimburse pre-approved expenses within 30 days of submission of receipts.

────────────────────────────────────────

4. INDEPENDENT CONTRACTOR

The Service Provider is an independent contractor and not an employee, agent, or partner of the Client. The Service Provider is responsible for all applicable taxes, insurance, and statutory obligations.

────────────────────────────────────────

5. INTELLECTUAL PROPERTY

Unless otherwise agreed in writing, all work product, deliverables, and intellectual property created by the Service Provider specifically for the Client under this Agreement shall be owned by the Client upon full payment of all fees.

────────────────────────────────────────

6. CONFIDENTIALITY

Each party shall keep confidential all non-public information received from the other party and shall not use such information except for the purpose of performing its obligations under this Agreement.

────────────────────────────────────────

7. TERMINATION

7.1 Termination for Convenience. Either party may terminate this Agreement on 30 days' written notice.

7.2 Termination for Cause. Either party may terminate immediately for material breach if the breach is not cured within 15 days of written notice.

7.3 Effect of Termination. Upon termination, the Client shall pay for all Services satisfactorily performed to the date of termination.

────────────────────────────────────────

8. LIMITATION OF LIABILITY

Neither party shall be liable for indirect, incidental, special, or consequential damages. The Service Provider's total liability shall not exceed the total fees paid in the three months preceding the claim.

────────────────────────────────────────

9. GENERAL PROVISIONS

9.1 Governing Law. This Agreement is governed by the laws of ${governingLaw(jurisdiction)}.

9.2 Entire Agreement. This Agreement constitutes the entire agreement between the parties.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT:

____________________________    Date: ________________
${partyA.name}


SERVICE PROVIDER:

____________________________    Date: ________________
${partyB.name}
`
}

function generateConsultingContract({ partyA, partyB, terms, jurisdiction }) {
  return `CONSULTING AGREEMENT

This Consulting Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}${partyA.company ? `, ${partyA.company}` : ''}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Company")

AND:

${partyB.name}${partyB.company ? `, ${partyB.company}` : ''}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Consultant")

────────────────────────────────────────

1. ENGAGEMENT

The Company engages the Consultant to provide consulting services in the area of:

${terms.projectDescription || '[Area of Expertise / Consulting Scope]'}

────────────────────────────────────────

2. TERM

This Agreement commences on ${formatDate(terms.startDate)}${terms.endDate ? ` and expires on ${formatDate(terms.endDate)}` : ' and continues until terminated'}.

────────────────────────────────────────

3. CONSULTING FEES

3.1 Rate. The Company shall pay the Consultant ${formatCurrency(terms.paymentAmount)} CAD ${terms.salaryPeriod === 'hourly' ? 'per hour' : 'as a flat fee'}.

3.2 Invoicing. The Consultant shall submit invoices ${terms.paymentTerms === 'monthly' ? 'monthly' : 'upon completion of each milestone'}.

3.3 Payment. The Company shall remit payment within ${
  terms.paymentTerms === 'net15' ? '15' : terms.paymentTerms === 'net60' ? '60' : '30'
} days of receiving a valid invoice.

────────────────────────────────────────

4. INDEPENDENT CONTRACTOR STATUS

The Consultant is an independent contractor. Nothing in this Agreement creates an employment, agency, or partnership relationship. The Consultant is solely responsible for their own income taxes, CPP contributions, and EI premiums.

────────────────────────────────────────

5. CONFIDENTIALITY AND NON-DISCLOSURE

The Consultant agrees to keep confidential all proprietary and confidential information of the Company obtained during the engagement, both during and for two (2) years after the termination of this Agreement.

────────────────────────────────────────

6. INTELLECTUAL PROPERTY

All deliverables, reports, analyses, and work product produced under this Agreement shall be the property of the Company upon payment in full. The Consultant retains rights to pre-existing tools and methodologies.

────────────────────────────────────────

7. NON-SOLICITATION

During the term and for twelve (12) months thereafter, the Consultant shall not solicit or hire any employee of the Company without prior written consent.

────────────────────────────────────────

8. TERMINATION

Either party may terminate this Agreement upon 30 days' written notice, or immediately for material breach.

────────────────────────────────────────

9. GOVERNING LAW

This Agreement is governed by the laws of ${governingLaw(jurisdiction)}.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Consulting Agreement as of the date first written above.

THE COMPANY:

____________________________    Date: ________________
${partyA.name}${partyA.company ? `\n${partyA.company}` : ''}


THE CONSULTANT:

____________________________    Date: ________________
${partyB.name}${partyB.company ? `\n${partyB.company}` : ''}
`
}

function generateFreelanceContract({ partyA, partyB, terms, jurisdiction }) {
  return `FREELANCE AGREEMENT

This Freelance Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}${partyA.company ? `, ${partyA.company}` : ''}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Client")

AND:

${partyB.name}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Freelancer")

────────────────────────────────────────

1. PROJECT SCOPE

The Freelancer agrees to perform the following project (the "Project"):

${terms.projectDescription || '[Detailed project description]'}

Deliverables:
${terms.deliverables || '[List of deliverables]'}

────────────────────────────────────────

2. TIMELINE

Project commences: ${formatDate(terms.startDate)}
${terms.endDate ? `Project deadline: ${formatDate(terms.endDate)}` : 'Timeline to be agreed upon in writing.'}

────────────────────────────────────────

3. PAYMENT

3.1 Project Fee. The Client shall pay the Freelancer ${formatCurrency(terms.paymentAmount)} CAD.

3.2 Payment Schedule. ${
  terms.paymentTerms === 'upfront' ? '100% upfront before work commences.' :
  terms.paymentTerms === 'split' ? '50% upfront, 50% upon delivery.' :
  'Upon completion and acceptance of the Project.'
}

3.3 Revisions. Up to two rounds of revisions are included. Additional revisions are billed at ${formatCurrency(terms.revisionRate || 100)} CAD per hour.

3.4 Late Payment Interest. Overdue invoices accrue interest at 2% per month.

────────────────────────────────────────

4. OWNERSHIP AND RIGHTS

Upon receipt of full payment, the Client shall own all rights to the final deliverables. The Freelancer retains rights to preliminary work and may display the completed Project in their portfolio unless otherwise agreed in writing.

────────────────────────────────────────

5. INDEPENDENT CONTRACTOR

The Freelancer is an independent contractor and is responsible for all applicable taxes and statutory obligations.

────────────────────────────────────────

6. CONFIDENTIALITY

The Freelancer shall keep all Client information confidential and shall not disclose it to any third party.

────────────────────────────────────────

7. KILL FEE

If the Client cancels the Project after work has commenced, the Client shall pay a kill fee equal to 50% of the remaining unpaid balance.

────────────────────────────────────────

8. GOVERNING LAW

This Agreement is governed by the laws of ${governingLaw(jurisdiction)}.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT:

____________________________    Date: ________________
${partyA.name}


FREELANCER:

____________________________    Date: ________________
${partyB.name}
`
}

function generatePartnershipContract({ partyA, partyB, terms, jurisdiction }) {
  return `PARTNERSHIP AGREEMENT

This Partnership Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(a "Partner")

AND:

${partyB.name}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(a "Partner")

(collectively, the "Partners")

────────────────────────────────────────

1. FORMATION

The Partners hereby agree to form a general partnership (the "Partnership") governed by this Agreement and the laws of ${governingLaw(jurisdiction)}.

────────────────────────────────────────

2. BUSINESS PURPOSE

The Partnership shall carry on the business of:

${terms.projectDescription || '[Business description]'}

────────────────────────────────────────

3. CAPITAL CONTRIBUTIONS

Each Partner shall contribute to the Partnership as follows:

${partyA.name}: ${terms.capitalA || '[Capital contribution]'}
${partyB.name}: ${terms.capitalB || '[Capital contribution]'}

────────────────────────────────────────

4. PROFIT AND LOSS SHARING

4.1 Profits and losses shall be shared as follows:
${partyA.name}: ${terms.profitSharingA || '50'}%
${partyB.name}: ${terms.profitSharingB || '50'}%

4.2 Distributions shall be made ${terms.distributionSchedule || 'quarterly'}, subject to maintaining adequate working capital reserves.

────────────────────────────────────────

5. MANAGEMENT AND DECISION MAKING

5.1 Ordinary Decisions. Ordinary business decisions shall be made by mutual agreement of the Partners.

5.2 Major Decisions. The following decisions require unanimous consent of all Partners:
   • Admission of new partners
   • Sale or encumbrance of Partnership assets over $10,000
   • Incurring debts over $5,000
   • Amendments to this Agreement
   • Dissolution of the Partnership

5.3 Duties. Each Partner shall devote their best efforts to the Partnership business. Partners shall not engage in business activities competitive with the Partnership without consent.

────────────────────────────────────────

6. BANKING AND ACCOUNTS

The Partnership shall maintain a separate bank account in the Partnership's name. All Partnership funds shall be deposited therein. Withdrawals require the signature of ${terms.signatories === 'one' ? 'any one Partner' : 'both Partners'}.

────────────────────────────────────────

7. PARTNER SALARIES

Partners shall receive management salaries of:
${partyA.name}: ${formatCurrency(terms.salaryA || 0)} CAD per year
${partyB.name}: ${formatCurrency(terms.salaryB || 0)} CAD per year

Salaries are subject to review annually.

────────────────────────────────────────

8. ADMISSION OF NEW PARTNERS

No new partners may be admitted without unanimous written consent of existing Partners.

────────────────────────────────────────

9. WITHDRAWAL AND DISSOLUTION

9.1 Voluntary Withdrawal. A Partner may withdraw upon 90 days' written notice. The withdrawing Partner shall be entitled to their proportionate share of net assets.

9.2 Dissolution. The Partnership may be dissolved upon unanimous agreement of all Partners, or upon the death, incapacity, or bankruptcy of a Partner.

9.3 Winding Up. Upon dissolution, the Partnership shall wind up its affairs, pay all liabilities, and distribute remaining assets in proportion to capital accounts.

────────────────────────────────────────

10. DISPUTE RESOLUTION

Disputes shall first be resolved by good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to mediation, and if still unresolved, to binding arbitration in ${partyA.city}, ${jurisdiction}.

────────────────────────────────────────

11. GOVERNING LAW

This Agreement is governed by the laws of ${governingLaw(jurisdiction)}.

────────────────────────────────────────

IN WITNESS WHEREOF, the Partners have executed this Partnership Agreement as of the date first written above.

PARTNER:

____________________________    Date: ________________
${partyA.name}


PARTNER:

____________________________    Date: ________________
${partyB.name}
`
}

function generateRentalContract({ partyA, partyB, terms, jurisdiction }) {
  return `RESIDENTIAL TENANCY AGREEMENT

This Residential Tenancy Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}${partyA.company ? `, ${partyA.company}` : ''}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Landlord")

AND:

${partyB.name}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Tenant")

────────────────────────────────────────

1. RENTAL PROPERTY

The Landlord agrees to rent to the Tenant the following property (the "Premises"):

${terms.propertyAddress || '[Property Address]'}
${terms.propertyType || 'Residential unit'}, ${jurisdiction}

────────────────────────────────────────

2. TERM

This Agreement commences on ${formatDate(terms.startDate)}${terms.endDate ? ` and expires on ${formatDate(terms.endDate)}` : ' and continues on a month-to-month basis'}.

────────────────────────────────────────

3. RENT

3.1 Monthly Rent. The Tenant shall pay ${formatCurrency(terms.monthlyRent)} CAD per month.

3.2 Due Date. Rent is due on the 1st day of each month.

3.3 Late Fee. Rent not received by the 5th day of the month is subject to a late fee of $25 CAD per day, subject to applicable tenancy legislation.

3.4 Method of Payment. Rent shall be paid by ${terms.paymentMethod || 'e-transfer or cheque'}.

────────────────────────────────────────

4. SECURITY DEPOSIT

4.1 Amount. The Tenant shall pay a security deposit of ${formatCurrency(terms.securityDeposit)} CAD upon execution of this Agreement.

4.2 Return. The security deposit shall be returned within 21 days of the end of the tenancy, less any deductions for unpaid rent or damage beyond normal wear and tear, subject to applicable residential tenancy legislation.

────────────────────────────────────────

5. UTILITIES AND SERVICES

The following are included in the monthly rent:
${terms.includedUtilities && terms.includedUtilities.length > 0 ? terms.includedUtilities.map(u => `   • ${u}`).join('\n') : '   • None (Tenant is responsible for all utilities)'}

────────────────────────────────────────

6. OCCUPANCY

Only the following persons may occupy the Premises: ${partyB.name}${terms.additionalOccupants ? `, ${terms.additionalOccupants}` : ''}.

────────────────────────────────────────

7. PETS

Pets are ${terms.petsAllowed ? 'permitted, subject to the Landlord\'s approval and an additional pet deposit of ' + formatCurrency(terms.petDeposit || 200) + ' CAD' : 'not permitted on the Premises'}.

────────────────────────────────────────

8. MAINTENANCE AND REPAIRS

8.1 Landlord Obligations. The Landlord shall maintain the Premises in a good state of repair, fit for habitation, and compliant with health, safety, and maintenance standards.

8.2 Tenant Obligations. The Tenant shall keep the Premises clean and undamaged, and promptly notify the Landlord of any required repairs.

────────────────────────────────────────

9. ENTRY BY LANDLORD

The Landlord may enter the Premises with at least 24 hours' written notice, except in cases of emergency.

────────────────────────────────────────

10. TERMINATION

10.1 Notice. Either party may terminate this Agreement by providing ${terms.terminationNotice || 60} days' written notice, subject to applicable residential tenancy legislation in ${jurisdiction}.

10.2 Early Termination. The Tenant shall be responsible for rent until a replacement tenant is found or the notice period expires, whichever is earlier.

────────────────────────────────────────

11. GOVERNING LAW

This Agreement is governed by the laws of ${governingLaw(jurisdiction)} and applicable residential tenancy legislation.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

LANDLORD:

____________________________    Date: ________________
${partyA.name}


TENANT:

____________________________    Date: ________________
${partyB.name}
`
}

function generateNonCompeteContract({ partyA, partyB, terms, jurisdiction }) {
  return `NON-COMPETITION AND NON-SOLICITATION AGREEMENT

This Non-Competition and Non-Solicitation Agreement (the "Agreement") is entered into as of ${formatDate(terms.startDate)}.

BETWEEN:

${partyA.name}${partyA.company ? `, ${partyA.company}` : ''}
${partyA.address}, ${partyA.city}, ${partyA.province} ${partyA.postalCode}
(the "Company")

AND:

${partyB.name}
${partyB.address}, ${partyB.city}, ${partyB.province} ${partyB.postalCode}
(the "Restricted Party")

────────────────────────────────────────

RECITALS

WHEREAS the Restricted Party has or will have access to confidential information, trade secrets, and business relationships of the Company;

AND WHEREAS the Company requires protection of its legitimate business interests;

NOW THEREFORE, in consideration of employment, compensation, and other good and valuable consideration, the parties agree as follows:

────────────────────────────────────────

1. DEFINITIONS

"Competitive Business" means any business that is engaged in ${terms.businessDescription || '[description of competitive business]'}.

"Restricted Period" means ${terms.nonCompetePeriod || 12} months following the termination of the Restricted Party's relationship with the Company.

"Restricted Territory" means ${terms.territory || jurisdiction + ' and surrounding area within 50 km'}.

────────────────────────────────────────

2. NON-COMPETITION

During the Restricted Period and within the Restricted Territory, the Restricted Party shall not, directly or indirectly:

(a) Own, manage, operate, control, be employed by, provide services to, or participate in any Competitive Business;

(b) Accept any engagement that would require the use or disclosure of the Company's Confidential Information;

(c) Take any action intended to divert business away from the Company.

────────────────────────────────────────

3. NON-SOLICITATION OF CLIENTS

During the Restricted Period, the Restricted Party shall not, directly or indirectly, solicit, approach, or accept business from any client, customer, or prospective client of the Company with whom the Restricted Party had contact, or about whom they obtained confidential information, during their relationship with the Company.

────────────────────────────────────────

4. NON-SOLICITATION OF EMPLOYEES

During the Restricted Period, the Restricted Party shall not, directly or indirectly, solicit, recruit, or hire any employee or contractor of the Company, or encourage any such person to terminate their relationship with the Company.

────────────────────────────────────────

5. CONFIDENTIALITY

The Restricted Party shall maintain in strict confidence all Confidential Information of the Company, both during and after their relationship with the Company.

────────────────────────────────────────

6. REASONABLENESS

The Restricted Party acknowledges that the restrictions contained in this Agreement are reasonable and necessary to protect the Company's legitimate business interests, and that the Company would suffer irreparable harm in the event of a breach.

────────────────────────────────────────

7. REMEDIES

The Restricted Party acknowledges that breach of this Agreement would cause irreparable harm to the Company for which monetary damages would be inadequate. The Company shall be entitled to seek injunctive relief, specific performance, and all other remedies available at law or in equity.

────────────────────────────────────────

8. SEVERABILITY

If any restriction is found to be unenforceable, the court is invited to reduce the restriction to the minimum extent necessary to make it enforceable, rather than void the entire provision.

────────────────────────────────────────

9. GOVERNING LAW

This Agreement is governed by the laws of ${governingLaw(jurisdiction)}.

────────────────────────────────────────

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

THE COMPANY:

____________________________    Date: ________________
${partyA.name}
${partyA.company || ''}


RESTRICTED PARTY:

____________________________    Date: ________________
${partyB.name}
`
}
