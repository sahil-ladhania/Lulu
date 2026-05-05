export async function submitWaitlist(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit");
    }

    return { success: true };
  } catch (err) {
    console.error("[waitlist] error:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Failed to join waitlist" 
    };
  }
}
