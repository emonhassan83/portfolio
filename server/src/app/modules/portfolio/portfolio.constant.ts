/** Collections editable from the dashboard, addressed as /api/portfolio/:resource. */
export const PORTFOLIO_RESOURCES = [
  'experience',
  'projects',
  'stack',
  'practices',
  'credentials',
] as const;

export const NODE_KINDS = ['client', 'edge', 'service', 'async', 'data', 'external'] as const;
export const PROJECT_SIZES = ['lg', 'md', 'sm'] as const;
export const CREDENTIAL_KINDS = ['education', 'certification'] as const;

/** Singleton key for the profile document. */
export const PROFILE_KEY = 'main';
