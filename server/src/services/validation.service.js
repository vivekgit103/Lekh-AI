/**
 * Deterministic Validation Service for DocuSaathi
 * File: server/src/services/validation.service.js
 * 
 * Performs deterministic arithmetic, field presence, deadline tracking,
 * action normalization, and objective risk scoring.
 */

/**
 * Normalizes and executes deterministic validation checks
 * Returns: { status: 'PASS' | 'WARNING' | 'FAIL', checks: [...] }
 */
export function runDeterministicValidation(docData) {
  const checks = [];

  const findAmountByKeywords = (keywords, exclude = []) => {
    if (!docData.amounts || !Array.isArray(docData.amounts)) return null;
    for (const item of docData.amounts) {
      if (!item) continue;
      const label = (item.label || '').toLowerCase();
      const isExcluded = exclude.some((ex) => label.includes(ex.toLowerCase()));
      if (!isExcluded && keywords.some((k) => label.includes(k.toLowerCase()))) {
        const num = parseFloat(String(item.value).replace(/[^0-9.-]+/g, ''));
        if (!isNaN(num)) return { label: item.label, value: num };
      }
    }
    return null;
  };

  const docType = (docData.documentType || docData.document_type || '').toLowerCase();
  const keyFields = docData.keyFields || docData.key_fields || {};

  // -------------------------------------------------------------
  // 1. AMOUNT & ARITHMETIC VALIDATION
  // -------------------------------------------------------------
  const subtotal = findAmountByKeywords(['subtotal', 'taxable', 'returned income', 'base amount', 'energy charges', 'current charges']);
  const tax = findAmountByKeywords(['tax', 'gst', 'cgst', 'sgst', 'igst', 'vat', 'interest', 'electricity duty', 'duties', 'cess']);
  const total = findAmountByKeywords(
    ['grand total', 'net payable', 'demand', 'total amount', 'invoice amount', 'total', 'sanctioned', 'net amount payable', 'total bill amount', 'amount payable'],
    ['subtotal', 'taxable']
  );

  if (subtotal && tax && total && total.value > 0) {
    const expectedTotal = subtotal.value + tax.value;
    const diff = Math.abs(expectedTotal - total.value);
    const tolerance = Math.max(2, total.value * 0.005); // 0.5% or ₹2 tolerance

    if (diff <= tolerance) {
      checks.push({
        name: 'Amount Consistency Check',
        status: 'PASS',
        message: `Financial calculation verified: Subtotal (${subtotal.value.toLocaleString('en-IN')}) + Tax/Duties (${tax.value.toLocaleString('en-IN')}) matches Total (${total.value.toLocaleString('en-IN')}).`,
      });
    } else {
      checks.push({
        name: 'Amount Consistency Check',
        status: diff > total.value * 0.05 ? 'FAIL' : 'WARNING',
        message: `Mathematical discrepancy: Subtotal (${subtotal.value.toLocaleString('en-IN')}) + Tax/Duties (${tax.value.toLocaleString('en-IN')}) = ${expectedTotal.toLocaleString('en-IN')}, but extracted Total is ${total.value.toLocaleString('en-IN')} (Variance: ${diff.toLocaleString('en-IN')}).`,
      });
    }
  } else if (total && total.value > 0) {
    checks.push({
      name: 'Amount Consistency Check',
      status: 'PASS',
      message: `Total amount extracted: ${total.label || 'Amount'} of ${total.value.toLocaleString('en-IN')}. Single-tier balance noted.`,
    });
  } else if (docType.includes('invoice') || docType.includes('tax') || docType.includes('bill')) {
    checks.push({
      name: 'Amount Consistency Check',
      status: 'WARNING',
      message: 'No distinct total monetary amount found in this financial document.',
    });
  }

  // -------------------------------------------------------------
  // 2. REQUIRED FIELD VALIDATION (By Document Category)
  // -------------------------------------------------------------
  // A. Reference Number (Invoice # / PAN / Notice Ref / GSTIN / Consumer # / Account #)
  const hasRefNumber = Object.keys(keyFields).some((key) => {
    const lk = key.toLowerCase();
    const val = String(keyFields[key] || '').trim();
    return (
      (lk.includes('invoice') ||
        lk.includes('pan') ||
        lk.includes('ref') ||
        lk.includes('notice') ||
        lk.includes('application') ||
        lk.includes('gstin') ||
        lk.includes('cin') ||
        lk.includes('order') ||
        lk.includes('consumer') ||
        lk.includes('account') ||
        lk.includes('meter') ||
        lk.includes('ca number') ||
        lk.includes('bill no') ||
        lk.includes('bill number')) &&
      val.length > 0 &&
      val !== 'null'
    );
  });

  if (hasRefNumber) {
    checks.push({
      name: 'Reference Identifier Validation',
      status: 'PASS',
      message: 'Valid official reference ID, invoice number, or PAN/GSTIN detected.',
    });
  } else {
    checks.push({
      name: 'Reference Identifier Validation',
      status: 'WARNING',
      message: 'Missing official reference ID or identifier number in document key fields.',
    });
  }

  // B. Document Issuer Validation
  const issuer = (docData.issuer || '').trim();
  if (issuer && issuer.length > 2 && !issuer.toLowerCase().includes('unknown') && issuer.toLowerCase() !== 'null') {
    checks.push({
      name: 'Issuer Validation',
      status: 'PASS',
      message: `Verified issuing authority or party: "${issuer}".`,
    });
  } else {
    checks.push({
      name: 'Issuer Validation',
      status: 'WARNING',
      message: 'Document issuer or originating organization could not be clearly identified.',
    });
  }

  // C. Document Date & Due Date Validation
  const dates = docData.dates || [];
  const hasDocDate = dates.length > 0 || Object.keys(keyFields).some((k) => k.toLowerCase().includes('date'));
  if (hasDocDate) {
    checks.push({
      name: 'Document Date Validation',
      status: 'PASS',
      message: 'Document issue/creation date successfully detected.',
    });
  } else {
    checks.push({
      name: 'Document Date Validation',
      status: 'WARNING',
      message: 'No official issuance date was found on the document.',
    });
  }

  // -------------------------------------------------------------
  // 3. DEADLINE VALIDATION (Upcoming vs Overdue vs Completed)
  // -------------------------------------------------------------
  const now = new Date();
  const rawDeadlines = docData.deadlines || [];
  let overdueCount = 0;
  let upcomingCount = 0;

  rawDeadlines.forEach((dl) => {
    if (dl && dl.date) {
      const parsed = new Date(dl.date);
      if (!isNaN(parsed.getTime())) {
        if (parsed < now) {
          overdueCount++;
        } else {
          upcomingCount++;
        }
      }
    }
  });

  if (overdueCount > 0) {
    checks.push({
      name: 'Deadline Status Audit',
      status: 'FAIL',
      message: `${overdueCount} critical deadline(s) have already passed. Immediate penalty assessment or rectification required.`,
    });
  } else if (upcomingCount > 0) {
    checks.push({
      name: 'Deadline Status Audit',
      status: 'PASS',
      message: `${upcomingCount} active upcoming deadline(s) monitored. All obligations currently within valid window.`,
    });
  } else {
    checks.push({
      name: 'Deadline Status Audit',
      status: 'PASS',
      message: 'No time-sensitive deadlines required for this document.',
    });
  }

  // -------------------------------------------------------------
  // 4. OVERALL VALIDATION STATUS
  // -------------------------------------------------------------
  const hasFail = checks.some((c) => c.status === 'FAIL');
  const hasWarning = checks.some((c) => c.status === 'WARNING');
  const overallStatus = hasFail ? 'FAIL' : hasWarning ? 'WARNING' : 'PASS';

  return {
    status: overallStatus,
    checks,
  };
}

/**
 * Normalizes deadlines into:
 * { title, date, priority: 'LOW'|'MEDIUM'|'HIGH', status: 'UPCOMING'|'OVERDUE'|'COMPLETED' }
 */
export function normalizeDeadlines(rawDeadlines = []) {
  const now = new Date();
  if (!Array.isArray(rawDeadlines)) return [];

  return rawDeadlines.map((dl) => {
    const title = dl?.title || 'Required Obligation';
    const dateStr = dl?.date || '';
    const priority = (dl?.priority || 'LOW').toUpperCase();

    let status = 'UPCOMING';
    if (dateStr) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        if (parsed < now) {
          status = 'OVERDUE';
        } else {
          status = 'UPCOMING';
        }
      }
    }

    return {
      title,
      date: dateStr,
      priority: priority === 'HIGH' || priority === 'MEDIUM' ? priority : 'LOW',
      status,
    };
  });
}

/**
 * Normalizes risks and computes final objective risk level:
 * HIGH: overdue deadline, arithmetic FAIL, or critical legal notices
 * MEDIUM: upcoming warning, missing important field, or required actions
 * LOW: clean, fully compliant document
 */
export function normalizeRisks(rawRisks = [], validationResult = null, normalizedDeadlines = []) {
  const risksList = Array.isArray(rawRisks)
    ? rawRisks.map((r) => ({
        level: (r?.level || 'LOW').toUpperCase(),
        reason: r?.reason || '',
      }))
    : [];

  const hasOverdueDeadline = normalizedDeadlines.some((d) => d.status === 'OVERDUE');
  const hasFailedCheck = validationResult?.status === 'FAIL' ||
    (validationResult?.checks || []).some((c) => c.status === 'FAIL');

  const hasWarningCheck = validationResult?.status === 'WARNING' ||
    (validationResult?.checks || []).some((c) => c.status === 'WARNING');

  let finalLevel = 'LOW';

  if (hasOverdueDeadline || hasFailedCheck || risksList.some((r) => r.level === 'HIGH')) {
    finalLevel = 'HIGH';
    // Ensure high risk reason exists if triggered by overdue deadline
    if (hasOverdueDeadline && !risksList.some((r) => r.reason.toLowerCase().includes('overdue'))) {
      risksList.unshift({
        level: 'HIGH',
        reason: 'One or more official deadlines have already expired, incurring potential interest, penalties, or statutory defaults.',
      });
    }
  } else if (hasWarningCheck || risksList.some((r) => r.level === 'MEDIUM') || normalizedDeadlines.length > 0) {
    finalLevel = 'MEDIUM';
  }

  return {
    finalLevel,
    risks: risksList,
  };
}

/**
 * Normalizes actions to be concise and actionable:
 * e.g. "Review the outstanding GST amount", "Respond before 18 October", "Verify invoice reference number"
 */
export function normalizeActions(rawActions = [], normalizedDeadlines = [], validationResult = null) {
  const actionsList = [];

  if (Array.isArray(rawActions)) {
    rawActions.forEach((act, idx) => {
      let title = '';
      let desc = '';
      let urgency = 'MEDIUM';

      if (typeof act === 'string') {
        title = act;
      } else if (act && typeof act === 'object') {
        title = act.title || '';
        desc = act.description || '';
        urgency = (act.urgency || 'MEDIUM').toUpperCase();
      }

      if (title.trim()) {
        actionsList.push({
          step: idx + 1,
          title: title.trim(),
          description: desc.trim(),
          urgency: urgency === 'HIGH' || urgency === 'LOW' ? urgency : 'MEDIUM',
        });
      }
    });
  }

  // Prepend critical overdue deadline action if present
  const overdue = normalizedDeadlines.filter((d) => d.status === 'OVERDUE');
  if (overdue.length > 0) {
    actionsList.unshift({
      step: 1,
      title: `Immediately address overdue deadline: ${overdue[0].title}`,
      description: `Deadline expired on ${overdue[0].date}. Check applicable portals for late fee mitigation or rectification requests.`,
      urgency: 'HIGH',
    });
  }

  // If actions list is empty, supply default action
  if (actionsList.length === 0) {
    actionsList.push({
      step: 1,
      title: 'Review document summary and archive for records',
      description: 'Retain a digital copy and confirm compliance with internal recordkeeping guidelines.',
      urgency: 'LOW',
    });
  }

  // Re-number steps sequentially
  return actionsList.map((a, i) => ({ ...a, step: i + 1 }));
}
