import {
  bookingPassDetails,
  bookingPassStub,
  bookingPassSurprise,
  GUEST_NAME,
  STAY_BRAND,
} from "@/lib/content";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#717171;">
        ${escapeHtml(label)}
      </td>
      <td align="right" style="padding:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#222222;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function stubField(label: string, value: string, mono = false) {
  return `
    <td style="padding:0 12px 0 0;vertical-align:top;width:50%;">
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:500;color:#717171;">
        ${escapeHtml(label)}
      </p>
      <p style="margin:0;font-family:${mono ? "Menlo,Monaco,Consolas,monospace" : "Arial,Helvetica,sans-serif"};font-size:12px;font-weight:600;color:#222222;word-break:break-all;">
        ${escapeHtml(value)}
      </p>
    </td>
  `;
}

export const BOOKING_QR_CID = "booking-qr";

export function buildBookingConfirmationEmail() {
  const detailsHtml = bookingPassDetails.map(({ label, value }) => detailRow(label, value)).join("");
  const stubHtml = bookingPassStub
    .map(({ label, value }) => stubField(label, value, label === "Booking ID"))
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background:#fffbfc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;">
      <tr>
        <td align="center" style="padding:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:600;letter-spacing:-0.02em;color:#222222;">
          Booking confirmed.
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#717171;text-align:center;">
          Hi ${escapeHtml(GUEST_NAME)}, your stay at ${escapeHtml(STAY_BRAND)} is confirmed.
        </td>
      </tr>
      <tr>
        <td>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadde0;border-radius:12px;background:#ffffff;overflow:hidden;">
            <tr>
              <td style="padding:12px 20px;border-bottom:1px solid #eadde0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#222222;">
                      Booking pass
                    </td>
                    <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#f43f5e;">
                      ♥
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${detailsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 20px 20px;border-top:1px solid #eadde0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding-top:16px;">
                  <tr>
                    ${stubHtml}
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px 20px;border-top:1px solid #eadde0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="88" style="vertical-align:top;padding-right:14px;">
                      <img src="cid:${BOOKING_QR_CID}" alt="QR code surprise link" width="80" height="80" style="display:block;border:1px solid #ffe4e6;border-radius:8px;background:#ffffff;" />
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#222222;">
                        ${escapeHtml(bookingPassSurprise.scanPrompt)}
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#717171;">
                        ${escapeHtml(bookingPassSurprise.scanHint)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#717171;">
          Hosted with care by Prawn · Invite-only stay
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  const text = [
    "Booking confirmed.",
    "",
    `Hi ${GUEST_NAME}, your stay at ${STAY_BRAND} is confirmed.`,
    "",
    "Booking pass",
    ...bookingPassDetails.map(({ label, value }) => `${label}: ${value}`),
    "",
    ...bookingPassStub.map(({ label, value }) => `${label}: ${value}`),
    "",
    `${bookingPassSurprise.scanPrompt} — ${bookingPassSurprise.url}`,
  ].join("\n");

  return { html, text };
}
