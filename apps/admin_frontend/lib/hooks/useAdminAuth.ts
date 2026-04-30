"use client";

import { useQuery } from "@apollo/client/react";
import { ADMIN_ME } from "../graphql/queries/auth.queries";
import { useEffect, useRef } from "react";
import { useNavigate } from "./useNavigate";

interface AdminMeResponse {
  adminMe: {
    id: string;
    fName: string;
    lName: string;
    email: string;
    userType: string;
    status: string;
    sessionExpires: string | null; // ← add
  } | null;
}

export function useRedirectIfLoggedIn() {
  const { navigate } = useNavigate();
  const { data, loading } = useQuery<AdminMeResponse>(ADMIN_ME, {
    errorPolicy: "ignore",
  });

  useEffect(() => {
    if (!loading && data?.adminMe) {
      navigate("/home");
    }
  }, [data, loading, navigate]);

  return { loading };
}

export function useRequireAuth() {
  const { navigate } = useNavigate();
  const { data, loading, refetch } = useQuery<AdminMeResponse>(ADMIN_ME, {
    errorPolicy: "ignore",
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!loading && !data?.adminMe) {
      navigate("/");
    }
  }, [data, loading, navigate]);

  // ← token refresh logic here
  useTokenRefresh(data?.adminMe?.sessionExpires, refetch);

  return { admin: data?.adminMe, loading };
}

// ← internal hook, not exported
function useTokenRefresh(
  sessionExpires: string | null | undefined,
  refetch: () => void,
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // schedule refresh 1 min before expiry
  useEffect(() => {
    if (!sessionExpires) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    const expiresAt = new Date(sessionExpires).getTime();
    const delay = expiresAt - Date.now() - 60 * 1000;

    if (delay <= 0) {
      refetch(); // already close to expiry → refetch immediately
      return;
    }

    timerRef.current = setTimeout(() => {
      refetch(); // middleware auto refreshes token
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sessionExpires]);

  // user comes back to tab → refetch immediately
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
}
