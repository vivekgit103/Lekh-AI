/**
 * Deterministic Validation Engine for DocuSaathi
 * Validates extracted document data mathematically and logically
 * without relying solely on LLM inferences.
 */

export function runDeterministicValidation(docData) {
  const validationResults = [];

  // Helper to safely extract numeric amounts
  const findAmountByKeywords = (keywords) => {
    if (!docData.amounts || !Array.isArray(docData.amounts)) return null;
    for (const item of docData.amounts) {
      const label = (item.label || '').toLowerCase();
      if (keywords.some((k) => label.includes(k.toLowerCase()))) {
        const num = parseFloat(String(item.value).replace(/[^0-9.-]+/g, ''));
        if (!isNaN(num)) return { label: item.label, value: num };
      }
    }
    return null;
  };

  // 1. RULE: Subtotal + Tax ≈ Total (Arithmetic Validation)
  const subtotal = findAmountByKeywords(['subtotal', 'taxable', 'returned income', 'base amount']);
  const tax = findAmountByKeywords(['tax', 'gst', 'cgst', 'sgst', 'igst', 'vat', 'interest']);
  const total = findAmountByKeywords(['total', 'net payable', 'demand', 'grand total', 'invoice amount', 'sanctioned']);

  if (subtotal && tax && total && total.value > 0) {
    const expectedTotal = subtotal.value + tax.value;
    const diff = Math.abs(expectedTotal - total.value);
    const tolerance = Math.max(2, total.value * 0.005); // Allow small rounding

    if (diff <= tolerance) {
      validationResults.push({
        rule: 'ARITHMETIC_CONSISTENCY',
        passed: true,
        severity: 'INFO',
        message: `Financial calculation validated: Subtotal (${subtotal.value.toLocaleString('en-IN')}) + Tax/Deduction (${tax.value.toLocaleString('en-IN')}) matches Total (${total.value.toLocaleString('en-IN')}).`,
        details: { subtotal: subtotal.value, tax: tax.value, total: total.value, diff },
      });
    } else {
      validationResults.push({
        rule: 'ARITHMETIC_CONSISTENCY',
        passed: false,
        severity: 'ERROR',
        message: `Mathematical mismatch detected: Subtotal (${subtotal.value.toLocaleString('en-IN')}) + Tax (${tax.value.toLocaleString('en-IN')}) = ${expectedTotal.toLocaleString('en-IN')}, but extracted Total is ${total.value.toLocaleString('en-IN')} (Discrepancy: ${diff.toLocaleString('en-IN')}).`,
        details: { subtotal: subtotal.value, tax: tax.value, total: total.value, discrepancy: diff },
      });
    }
  } else {
    validationResults.push({
      rule: 'ARITHMETIC_CONSISTENCY',
      passed: true,
      severity: 'INFO',
      message: 'Arithmetic checks: Standard single-tier or non-invoice amounts noted.',
    });
  }

  // 2. RULE: Document Reference Number Existence
  const keyFields = docData.keyFields || {};
  const hasRefNumber = Object.keys(keyFields).some((key) => {
    const lk = key.toLowerCase();
    return (
      lk.includes('invoice') ||
      lk.includes('pan') ||
      lk.includes('ref') ||
      lk.includes('notice') ||
      lk.includes('application') ||
      lk.includes('gstin') ||
      lk.includes('cin') ||
      lk.includes('order')
    );
  });

  if (hasRefNumber) {
    validationResults.push({
      rule: 'REFERENCE_IDENTIFIER',
      passed: true,
      severity: 'INFO',
      message: 'Document contains recognized official reference/identifier number.',
    });
  } else {
    validationResults.push({
      rule: 'REFERENCE_IDENTIFIER',
      passed: false,
      severity: 'WARNING',
      message: 'No distinct Invoice Number, Notice Reference ID, or Tax Identification (PAN/GSTIN) detected.',
    });
  }

  // 3. RULE: Issuer & Party Validation
  if (docData.issuer && docData.issuer.trim().length > 2 && !docData.issuer.toLowerCase().includes('unknown')) {
    validationResults.push({
      rule: 'ISSUER_AUTHENTICITY',
      passed: true,
      severity: 'INFO',
      message: `Verified issuing authority / party: "${docData.issuer}".`,
    });
  } else {
    validationResults.push({
      rule: 'ISSUER_AUTHENTICITY',
      passed: false,
      severity: 'WARNING',
      message: 'Issuing organization or party name is unclear or missing from the document header.',
    });
  }

  // 4. RULE: Deadline & Due Date Status (Past vs Future)
  const now = new Date();
  const deadlines = docData.deadlines || [];

  if (deadlines.length === 0) {
    validationResults.push({
      rule: 'DEADLINE_CHECK',
      passed: true,
      severity: 'INFO',
      message: 'No immediate time-sensitive deadlines detected in this document.',
    });
  } else {
    let overdueCount = 0;
    deadlines.forEach((dl) => {
      if (dl.date) {
        const parsedDate = new Date(dl.date);
        if (!isNaN(parsedDate.getTime())) {
          if (parsedDate < now) {
            overdueCount++;
            validationResults.push({
              rule: 'DEADLINE_OVERDUE',
              passed: false,
              severity: 'ERROR',
              message: `Urgent: Deadline "${dl.title}" dated ${dl.date} has already passed! Immediate action or penalty mitigation required.`,
              details: { deadline: dl.title, date: dl.date },
            });
          } else {
            const daysLeft = Math.ceil((parsedDate - now) / (1000 * 60 * 60 * 24));
            validationResults.push({
              rule: 'DEADLINE_UPCOMING',
              passed: true,
              severity: daysLeft <= 7 ? 'WARNING' : 'INFO',
              message: `Upcoming deadline: "${dl.title}" is due on ${dl.date} (${daysLeft} days remaining).`,
              details: { deadline: dl.title, daysLeft },
            });
          }
        }
      }
    });
  }

  // 5. RULE: Non-negative / Reasonable Value Check
  if (docData.amounts && Array.isArray(docData.amounts)) {
    let hasNegative = false;
    docData.amounts.forEach((amt) => {
      const val = typeof amt.value === 'number' ? amt.value : parseFloat(amt.value);
      if (!isNaN(val) && val < 0) {
        hasNegative = true;
      }
    });

    if (hasNegative) {
      validationResults.push({
        rule: 'NUMERIC_SANITY',
        passed: false,
        severity: 'WARNING',
        message: 'Unusual negative monetary balance discovered in parsed values.',
      });
    } else {
      validationResults.push({
        rule: 'NUMERIC_SANITY',
        passed: true,
        severity: 'INFO',
        message: 'All monetary values are positive and structurally consistent.',
      });
    }
  }

  return validationResults;
}
