import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null) {
  return user?.app_metadata?.role === "admin";
}

export async function updateSession(request: NextRequest) {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const admin = isAdminUser(user);

  if (path.startsWith("/admin/unauthorized")) {
    return supabaseResponse;
  }

  if (path.startsWith("/admin/login")) {
    if (user && admin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  if (path.startsWith("/admin")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("next", path);
      return NextResponse.redirect(redirectUrl);
    }
    if (!admin) {
      return NextResponse.redirect(
        new URL("/admin/unauthorized", request.url),
      );
    }
  }

  return supabaseResponse;
}
