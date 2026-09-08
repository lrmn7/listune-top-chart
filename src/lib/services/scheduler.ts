import { statsProvider } from './statsProvider';
import { trackCurrentRepo } from '../db';

let schedulerStarted = false;
let timerId: NodeJS.Timeout | null = null;

/**
 * Starts the internal automated scraper.
 * - Runs a check 15 seconds after server startup to refresh data if it is empty or stale.
 * - Runs periodically in the background based on AUTO_REFRESH_INTERVAL_HOURS (default: 6 hours).
 */
export function startAutoRefresh(): void {
  if (schedulerStarted) return;
  schedulerStarted = true;

  if (process.env.AUTO_REFRESH_ENABLED === 'false') {
    console.log('ℹ️ [AutoScheduler] Auto-refresh is disabled via AUTO_REFRESH_ENABLED=false');
    return;
  }

  const intervalHours = parseFloat(process.env.AUTO_REFRESH_INTERVAL_HOURS || '6') || 6;
  const intervalMs = intervalHours * 60 * 60 * 1000;

  console.log(`⏱️ [AutoScheduler] Automatic background scraping active (Interval: every ${intervalHours} hours)`);

  // Helper to schedule the next run dynamically
  function scheduleNextRun(delayMs: number) {
    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(async () => {
      console.log('⏰ [AutoScheduler] Scheduled interval reached. Starting automatic data refresh...');
      try {
        await statsProvider.refreshAllStats();
      } catch (err) {
        console.error('❌ [AutoScheduler] Error during scheduled refresh:', err);
      }
      // Schedule subsequent runs at regular interval
      scheduleNextRun(intervalMs);
    }, delayMs);

    if (timerId.unref) {
      timerId.unref();
    }
  }

  // Initial check 15 seconds after server boots up
  setTimeout(async () => {
    try {
      const latest = await trackCurrentRepo.findLatestUpdated();
      const now = Date.now();
      const lastUpdatedMs = latest?.lastUpdated ? new Date(latest.lastUpdated).getTime() : 0;
      const isStaleOrEmpty = !latest || (now - lastUpdatedMs >= intervalMs);

      if (isStaleOrEmpty) {
        console.log('🔄 [AutoScheduler] Initial check: Data is stale or empty. Starting automatic background refresh...');
        try {
          await statsProvider.refreshAllStats();
        } catch (err) {
          console.error('❌ [AutoScheduler] Error during initial refresh:', err);
        }
        scheduleNextRun(intervalMs);
      } else {
        const remainingMs = Math.max(60000, intervalMs - (now - lastUpdatedMs));
        const nextInMinutes = Math.round(remainingMs / 60000);
        console.log(`✅ [AutoScheduler] Data is up to date (last updated: ${latest.lastUpdated.toISOString()}). Resuming schedule: next refresh in ~${nextInMinutes} minutes.`);
        scheduleNextRun(remainingMs);
      }
    } catch (err) {
      console.warn('⚠️ [AutoScheduler] Could not check latest update time on startup:', err);
      scheduleNextRun(intervalMs);
    }
  }, 15000);
}
