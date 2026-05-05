export async function submitWaitlist(email: string): Promise<{ success: true }> {
  await new Promise((r) => setTimeout(r, 400));
  console.log("[waitlist] new signup:", email);
  return { success: true };
}
