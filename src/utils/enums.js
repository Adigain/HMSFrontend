export const DESIGNATIONS = Object.freeze({
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  ASSISTANT: 'ASSISTANT',
  NURSING: 'NURSING',
  LAB: 'LAB',
  MAINTENANCE: 'MAINTENANCE',
  RECEPTION: 'RECEPTION'
});

export const DESIGNATION_OPTIONS = Object.values(DESIGNATIONS).map(v => ({ value: v, label: v }));
