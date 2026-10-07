export const SAMPLE_DOCUMENTS = {
  tax_notice: {
    documentType: 'Tax Notice',
    documentTitle: 'Intimation u/s 143(1) of the Income-tax Act, 1961',
    issuer: 'Income Tax Department, Government of India (CPC Bengaluru)',
    language: 'en',
    summary: 'The Income Tax Department has processed your ITR for Assessment Year 2024-25 and determined a net payable tax demand of ₹24,850 due to an apparent discrepancy in Chapter VI-A deductions claimed versus Form 26AS/AIS records.',
    keyFields: {
      'PAN': 'ABCDE1234F',
      'Assessment Year': '2024-25',
      'Financial Year': '2023-24',
      'Communication Ref No': 'CPC/2324/1431/9876543210',
      'Filing Date': '2024-07-28',
      'Jurisdiction': 'Ward 12(3), New Delhi',
      'Notice Date': '2024-09-15',
    },
    amounts: [
      { label: 'Returned Income by Taxpayer', value: 850000, currency: 'INR' },
      { label: 'Assessed Income by CPC', value: 925000, currency: 'INR' },
      { label: 'Tax Demand Payable', value: 24850, currency: 'INR' },
      { label: 'Interest u/s 234B & 234C', value: 3120, currency: 'INR' },
    ],
    dates: [
      { label: 'Notice Issued Date', value: '2024-09-15' },
      { label: 'Return Filed Date', value: '2024-07-28' },
    ],
    deadlines: [
      {
        title: 'Respond to Notice / Pay Outstanding Demand on e-Filing Portal',
        date: '2024-10-15',
        priority: 'HIGH',
      },
      {
        title: 'File Rectification Request u/s 154 if deduction proof available',
        date: '2024-10-30',
        priority: 'MEDIUM',
      },
    ],
    risks: [
      {
        level: 'HIGH',
        reason: 'Unaddressed demand will attract 1% per month interest under section 220(2) and automatic adjustment against future refunds.',
      },
      {
        level: 'MEDIUM',
        reason: 'Bank accounts or assets could be subjected to recovery proceedings if ignored past 60 days.',
      },
    ],
    actions: [
      {
        step: 1,
        title: 'Cross-check Form 26AS & AIS/TIS',
        description: 'Verify if the disallowed deduction of ₹75,000 matches your 80C/80D proofs submitted to employer.',
        urgency: 'HIGH',
      },
      {
        step: 2,
        title: 'Submit Response on Incometax.gov.in',
        description: 'Login to e-Filing portal -> Pending Actions -> Response to Outstanding Demand -> Agree or Disagree with reason.',
        urgency: 'HIGH',
      },
      {
        step: 3,
        title: 'File Rectification or Pay Challan',
        description: 'If you accept the variance, pay via e-Pay Tax using Challan ITNS 280 (Self-Assessment/Regular).',
        urgency: 'MEDIUM',
      },
    ],
    explanation: 'This is an automated intimation from Centralized Processing Center (CPC). It is NOT an audit penalty yet, but an intimation that their calculation differs from yours. You have 30 days to either accept and pay or submit reasons for disagreement along with evidence.',
  },

  gst_invoice: {
    documentType: 'Tax Invoice (GST)',
    documentTitle: 'Tax Invoice - Cloud Infrastructure & IT Consulting',
    issuer: 'Apex Tech Solutions Pvt Ltd (GSTIN: 27AABCA1234F1Z5)',
    language: 'en',
    summary: 'Monthly recurring B2B invoice for cloud deployment, enterprise DevOps support, and custom software maintenance for October 2024.',
    keyFields: {
      'Invoice Number': 'ATS/2024-25/1042',
      'Invoice Date': '2024-10-01',
      'Buyer Name': 'Bharat Logistics Corp',
      'Buyer GSTIN': '29AABCB5678G1Z2',
      'Place of Supply': '29-Karnataka (Inter-State IGST)',
      'Payment Terms': 'Net 15 Days',
    },
    amounts: [
      { label: 'Taxable Subtotal', value: 120000, currency: 'INR' },
      { label: 'Integrated GST (18%)', value: 21600, currency: 'INR' },
      { label: 'Total Invoice Amount', value: 141600, currency: 'INR' },
      { label: 'TDS Deductible u/s 194C (2%)', value: 2400, currency: 'INR' },
    ],
    dates: [
      { label: 'Invoice Date', value: '2024-10-01' },
      { label: 'Due Date', value: '2024-10-16' },
    ],
    deadlines: [
      {
        title: 'Invoice Payment Due Date',
        date: '2024-10-16',
        priority: 'MEDIUM',
      },
      {
        title: 'GSTR-2B ITC Matching & Filing Reconciliation',
        date: '2024-11-14',
        priority: 'MEDIUM',
      },
    ],
    risks: [
      {
        level: 'LOW',
        reason: 'Vendor GSTIN is active and complies with Indian e-Invoice IRN schema. No arithmetic discrepancies.',
      },
    ],
    actions: [
      {
        step: 1,
        title: 'Approve for Accounts Payable',
        description: 'Match against Purchase Order PO-2024-889 before authorizing wire transfer.',
        urgency: 'LOW',
      },
      {
        step: 2,
        title: 'Deduct TDS u/s 194C and deposit by 7th of next month',
        description: 'Deduct ₹2,400 TDS and issue Form 16A quarterly.',
        urgency: 'MEDIUM',
      },
      {
        step: 3,
        title: 'Claim Input Tax Credit (ITC) of ₹21,600 in GSTR-3B',
        description: 'Ensure vendor files GSTR-1 by 11th so ITC reflects in your auto-populated GSTR-2B.',
        urgency: 'LOW',
      },
    ],
    explanation: 'A clean B2B GST tax invoice with valid GSTIN and correct 18% IGST calculation. The invoice has clear payment terms of 15 days.',
  },

  bank_letter: {
    documentType: 'Bank Notice / Sanction Letter',
    documentTitle: 'Home Loan In-Principle Sanction Letter',
    issuer: 'State Bank of India - Retail Assets Central Processing Centre',
    language: 'en',
    summary: 'Sanction letter approving a floating rate residential housing loan of ₹65,00,000 subject to legal title clearance, valuation, and mortgage creation.',
    keyFields: {
      'Loan Application No': 'HL/2024/098172',
      'Sanction Date': '2024-09-20',
      'Loan Product': 'SBI Regular Home Loan',
      'Interest Rate': '8.50% p.a. (EBR + 0.15%)',
      'Tenure': '240 Months (20 Years)',
      'Estimated Monthly EMI': '₹56,432',
    },
    amounts: [
      { label: 'Sanctioned Loan Amount', value: 6500000, currency: 'INR' },
      { label: 'Processing Fee + GST (Non-refundable)', value: 11800, currency: 'INR' },
      { label: 'Monthly EMI', value: 56432, currency: 'INR' },
    ],
    dates: [
      { label: 'Letter Date', value: '2024-09-20' },
      { label: 'Validity Date', value: '2024-11-20' },
    ],
    deadlines: [
      {
        title: 'Sanction Acceptance & Fee Payment Deadline',
        date: '2024-11-20',
        priority: 'HIGH',
      },
      {
        title: 'Original Property Documents Submission for Legal Search',
        date: '2024-10-25',
        priority: 'MEDIUM',
      },
    ],
    risks: [
      {
        level: 'MEDIUM',
        reason: 'Sanction lapses automatically after 60 days if acceptance copy and processing fees are not submitted.',
      },
      {
        level: 'LOW',
        reason: 'Floating interest rate subject to RBI repo rate revisions.',
      },
    ],
    actions: [
      {
        step: 1,
        title: 'Countersign Duplicate Sanction Letter',
        description: 'Sign and return duplicate copy to the RACPC loan officer.',
        urgency: 'HIGH',
      },
      {
        step: 2,
        title: 'Submit Title Deeds for Legal Search',
        description: 'Provide parent sale deeds, approved building plan, and NOC from builder/society.',
        urgency: 'MEDIUM',
      },
    ],
    explanation: 'Your home loan has been pre-approved for ₹65 Lakhs at 8.5% interest. You have 60 days to complete legal documentation and property valuation before disbursal.',
  },

  rent_agreement: {
    documentType: 'Rental Agreement',
    documentTitle: 'Residential Lease Agreement',
    issuer: 'Landlord: Ramesh Sharma / Tenant: Priya Nair',
    language: 'en',
    summary: '11-month residential tenancy agreement for Flat No. 402, Green Meadows, Bengaluru, commencing 1st Nov 2024 with a monthly rent of ₹32,000.',
    keyFields: {
      'Property Address': 'Flat 402, Green Meadows, Whitefield, Bengaluru - 560066',
      'Tenancy Period': '11 Months (01-Nov-2024 to 30-Sep-2025)',
      'Monthly Rent': '₹32,000',
      'Security Deposit': '₹1,50,000',
      'Lock-in Period': '6 Months',
      'Notice Period': '1 Month prior written notice',
      'Annual Escalation': '5% on renewal',
    },
    amounts: [
      { label: 'Monthly Rent', value: 32000, currency: 'INR' },
      { label: 'Refundable Security Deposit', value: 150000, currency: 'INR' },
      { label: 'Maintenance Charges (Payable to Society)', value: 4500, currency: 'INR' },
    ],
    dates: [
      { label: 'Lease Start Date', value: '2024-11-01' },
      { label: 'Lease Expiry Date', value: '2025-09-30' },
      { label: 'Rent Due Day', value: 'Every 5th of the month' },
    ],
    deadlines: [
      {
        title: 'Security Deposit Transfer Due',
        date: '2024-10-31',
        priority: 'HIGH',
      },
      {
        title: 'Lock-in Period Expiry',
        date: '2025-04-30',
        priority: 'LOW',
      },
      {
        title: 'Renewal / Vacation Notice Deadline',
        date: '2025-08-31',
        priority: 'MEDIUM',
      },
    ],
    risks: [
      {
        level: 'HIGH',
        reason: 'Clause 8 forfeits entire deposit if tenant vacates before 6 months lock-in period completes.',
      },
      {
        level: 'MEDIUM',
        reason: 'Late payment attracts 18% annual interest penalty after 5th of every month.',
      },
    ],
    actions: [
      {
        step: 1,
        title: 'Obtain Stamp Duty E-Certificate & Notarize',
        description: 'Ensure agreement is executed on ₹200 e-stamp paper and notarized.',
        urgency: 'HIGH',
      },
      {
        step: 2,
        title: 'Document Existing Inventory & Meter Readings',
        description: 'Take timestamped photos of appliances and electrical meters before move-in.',
        urgency: 'MEDIUM',
      },
    ],
    explanation: 'A standard 11-month residential lease. Pay special attention to the strict 6-month lock-in clause and 1-month notice requirement.',
  },
};
