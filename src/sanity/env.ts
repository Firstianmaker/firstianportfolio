export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? '';
export const apiVersion = '2026-09-01';
export const isSanityConfigured = Boolean(projectId && dataset);

export function assertSanityEnvironment() {
  if (Boolean(projectId) !== Boolean(dataset)) {
    throw new Error('Set both NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET, or leave both unset for the initial content preview.');
  }
}
