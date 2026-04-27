// c:\Obsidian\Ethyx\frontend\lib\getAuthToken.ts
// Centralized auth token acquisition for ETHYX AI
// Uses getUser() for verification, reads session only for access token

import { createClient } from "@/lib/supabase/client";

interface AuthTokenResult {
  token: string;
  userId: string;
}

/**
 * Verifies the user via getUser() and returns the access token + userId.
 * NEVER calls refreshSession(). Uses getSession() only to read the token string
 * after identity has been verified by getUser().
 *
 * @throws Error if user is not authenticated
 */
export async function getAuthToken(): Promise<AuthTokenResult> {
  const supabase = createClient();

  // Step 1: Verify identity with the server (mandatory verification gate)
  // getUser() makes a network request to verify the JWT and updates client state.
  // This satisfies the requirement to NEVER use getSession() for standalone verification.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Identity verification failed. Please log in again.");
  }

  // Step 2: Read current token from client state
  // We use getSession() ONLY for extraction here because getUser() does not return the raw JWT string.
  // Since getUser() succeeded above, the session state is verified.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("Access token extraction failed. Please log in again.");
  }

  return {
    token: session.access_token,
    userId: user.id,
  };
}
