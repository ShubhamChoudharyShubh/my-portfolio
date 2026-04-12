"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const trackView = async () => {
            // Don't track admin pages or during development if needed
            if (pathname.startsWith("/admin")) return;

            try {
                await supabase.from("traffic_stats").insert({
                    path: pathname,
                    referrer: document.referrer || null,
                    user_agent: navigator.userAgent,
                });
            } catch (err) {
                console.error("Failed to track view:", err);
            }
        };

        trackView();
    }, [pathname, supabase]);

    return null;
}
