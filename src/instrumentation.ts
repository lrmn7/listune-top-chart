export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Avoid running background scheduler during build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return;
    }
    const { startAutoRefresh } = await import('./lib/services/scheduler');
    startAutoRefresh();
  }
}
