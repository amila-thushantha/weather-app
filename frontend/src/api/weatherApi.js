const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function fetchComfortData(getAccessTokenSilently) {
  // safety check
  if (typeof getAccessTokenSilently !== "function") {
    throw new Error("getAccessTokenSilently is not a function (Auth0 not ready)");
  }

  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
  });

  const res = await fetch(`${BASE_URL}/api/comfort`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Failed to load comfort data (${res.status}) ${msg}`);
  }

  return res.json();
}
