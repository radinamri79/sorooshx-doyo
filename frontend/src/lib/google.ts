const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function getGoogleOAuthUrl(redirectPath = "/auth/google/callback") {
  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}${redirectPath}`
      : `http://localhost:3000${redirectPath}`;

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
