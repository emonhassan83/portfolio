import config from '../config';

/**
 * Asks the Next.js client to drop its cached copy of the portfolio so dashboard
 * edits show up immediately. Failures are logged and never block the write;
 * the page still refreshes on its own within the ISR window.
 */
const revalidateClient = async () => {
  if (!config.client_url || !config.revalidate_secret) return;
  try {
    const res = await fetch(`${config.client_url}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': config.revalidate_secret },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.warn(`Client revalidation failed: ${res.status}`);
  } catch (error) {
    console.warn('Client revalidation failed:', (error as Error).message);
  }
};

export default revalidateClient;
