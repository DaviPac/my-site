export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error("Token inválido", e);
    return null;
  }
}

export async function swr(key, fetchFn, onUpdate) { // stale while revalidate
  const cache = sessionStorage.getItem(key);
  let parsed = null;
  if (cache) {
    try {
      parsed = JSON.parse(cache);
      onUpdate(parsed.data); // 1. mostra dado antigo imediatamente
    } catch (e) {
      parsed = null;
    }
  }

  // 2. revalida em segundo plano
  try {
    const fresh = await fetchFn();
    sessionStorage.setItem(key, JSON.stringify({ data: fresh, timestamp: Date.now() }));
    onUpdate(fresh); // 3. atualiza com dado novo
  } catch (e) {
    console.warn("SWR fallback: usando dados antigos", e);
  }
}