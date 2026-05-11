/**
 * Twilio Verify OTP Service
 * 
 * Uses Twilio Verify API v2 to send and verify OTP codes.
 * Twilio handles OTP generation, delivery, and verification server-side.
 * 
 * ⚠️ SECURITY NOTE: In production, these API calls should go through
 * your own backend server. Auth tokens should never be in client code.
 */

// Credentials loaded from .env file (never hardcoded!)
// See .env.example for the required variables.
const TWILIO_ACCOUNT_SID = process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID || '';

const VERIFY_BASE_URL = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}`;

// Helper to create Basic Auth header
function getAuthHeader(): string {
  // btoa is available in React Native
  const credentials = `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`;
  // Use a manual base64 encoding approach for React Native compatibility
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < credentials.length) {
    const a = credentials.charCodeAt(i++);
    const b = i < credentials.length ? credentials.charCodeAt(i++) : 0;
    const c = i < credentials.length ? credentials.charCodeAt(i++) : 0;
    const triplet = (a << 16) | (b << 8) | c;
    result += base64Chars[(triplet >> 18) & 0x3f];
    result += base64Chars[(triplet >> 12) & 0x3f];
    result += i - 2 < credentials.length ? base64Chars[(triplet >> 6) & 0x3f] : '=';
    result += i - 1 < credentials.length ? base64Chars[triplet & 0x3f] : '=';
  }
  return `Basic ${result}`;
}

// Helper to encode form data (application/x-www-form-urlencoded)
function encodeFormData(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * Send OTP to a phone number via Twilio Verify API
 * @param phone - 10-digit Indian mobile number (without country code)
 * @returns { success: boolean, message: string }
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    const phoneE164 = `+91${phone}`;
    console.log(`[Twilio OTP] Sending verification to ${phoneE164}`);

    const response = await fetch(`${VERIFY_BASE_URL}/Verifications`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormData({
        To: phoneE164,
        Channel: 'sms',
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === 'pending') {
      console.log(`[Twilio OTP] Verification sent successfully, SID: ${data.sid}`);
      return { success: true, message: 'OTP sent successfully!' };
    } else {
      const errorMsg = data?.message || 'Failed to send OTP. Please try again.';
      console.error('[Twilio OTP] Send error:', data);
      return { success: false, message: errorMsg };
    }
  } catch (error: any) {
    console.error('[Twilio OTP] Network error:', error);
    return { success: false, message: 'Network error. Please check your internet connection.' };
  }
}

/**
 * Verify an OTP code entered by the user via Twilio Verify API
 * @param phone - 10-digit Indian mobile number
 * @param code - The 6-digit OTP entered by user
 * @returns { success: boolean, message: string }
 */
export async function verifyOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const phoneE164 = `+91${phone}`;
    console.log(`[Twilio OTP] Verifying code for ${phoneE164}`);

    const response = await fetch(`${VERIFY_BASE_URL}/VerificationCheck`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormData({
        To: phoneE164,
        Code: code,
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === 'approved') {
      console.log(`[Twilio OTP] Verification approved!`);
      return { success: true, message: 'Phone number verified!' };
    } else if (data.status === 'pending') {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    } else {
      const errorMsg = data?.message || 'Verification failed. Please try again.';
      console.error('[Twilio OTP] Verify error:', data);
      return { success: false, message: errorMsg };
    }
  } catch (error: any) {
    console.error('[Twilio OTP] Network error:', error);
    return { success: false, message: 'Network error. Please check your internet connection.' };
  }
}

/**
 * Resend OTP — just calls sendOTP again (Twilio generates a new code)
 */
export async function resendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  return sendOTP(phone);
}
