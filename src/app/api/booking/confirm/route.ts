import { NextResponse } from "next/server";
import { sendBookingConfirmationEmail } from "@/lib/email/send-booking-confirmation";

export async function POST() {
  try {
    const result = await sendBookingConfirmationEmail();

    return NextResponse.json({
      ok: true,
      message: `Confirmation email sent to ${result.guestName}`,
      to: result.to,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send confirmation email";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
