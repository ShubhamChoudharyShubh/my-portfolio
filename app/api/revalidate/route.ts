import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Purge the entire site cache for all layouts and pages
    try {
        revalidatePath("/", "layout");
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json(
            { revalidated: false, error: "Failed to revalidate" },
            { status: 500 },
        );
    }
}
