function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

export function isEmergencyCase(caseItem) {
  return normalize(caseItem?.requestType) === 'emergency';
}

export function isReliefCase(caseItem) {
  return normalize(caseItem?.requestType) === 'relief';
}

export function isCriticalEmergencyCase(caseItem) {
  return (
    isEmergencyCase(caseItem) &&
    normalize(caseItem?.priority) === 'critical'
  );
}

export function isVisibleCrisisCase(caseItem) {
  return isReliefCase(caseItem) || isCriticalEmergencyCase(caseItem);
}

export function filterCrisisCases(cases, filter = 'all') {
  const normalizedFilter = normalize(filter);

  if (normalizedFilter === 'emergency') {
    return cases.filter(isCriticalEmergencyCase);
  }

  if (normalizedFilter === 'relief') {
    return cases.filter(isReliefCase);
  }

  if (normalizedFilter === 'pending') {
    return cases.filter((item) => !item?.assignedStaffId);
  }

  if (normalizedFilter === 'assigned') {
    return cases.filter((item) => Boolean(item?.assignedStaffId));
  }

  return cases;
}

export function summarizeCrisisCases(cases) {
  return {
    emergencyCritical: cases.filter(isCriticalEmergencyCase).length,
    relief: cases.filter(isReliefCase).length,
    pending: cases.filter((item) => !item?.assignedStaffId).length,
    assigned: cases.filter((item) => Boolean(item?.assignedStaffId)).length,
    total: cases.length,
  };
}

// Backward-compatible exports for any older local imports.
export const filterCriticalCasesByAssignment = filterCrisisCases;
export const summarizeCriticalCases = summarizeCrisisCases;
