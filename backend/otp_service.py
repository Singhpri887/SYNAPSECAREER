"""
SynapseCareer – Real OTP Generation & Delivery Service
=======================================================
• Generates cryptographically secure 6-digit OTPs (secrets module)
• Delivers via Gmail SMTP (real email) — configure via .env
• Delivers via Fast2SMS API (real Indian SMS) — configure via .env
• Server-side OTP store with 5-minute TTL + 3-attempt lockout
"""

import os
import secrets
import smtplib
import time
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# ── In-memory OTP store: { email: { otp, expires_at, attempts } } ──────────
_OTP_STORE: dict = {}

OTP_TTL        = 5 * 60        # 5 minutes
OTP_MAX_TRIES  = 3

# ── Credentials from .env ───────────────────────────────────────────────────
GMAIL_USER     = os.getenv("GMAIL_USER", "")      # your.email@gmail.com
GMAIL_PASS     = os.getenv("GMAIL_APP_PASS", "")  # Gmail App Password (16-char)
FAST2SMS_KEY   = os.getenv("FAST2SMS_API_KEY", "")# Fast2SMS API key


# ════════════════════════════════════════════════════════════════════════════
#  GENERATION
# ════════════════════════════════════════════════════════════════════════════

def generate_otp() -> str:
    """Return a cryptographically secure 6-digit OTP string."""
    return str(secrets.randbelow(900000) + 100000)   # 100000 – 999999


def store_otp(identifier: str, otp: str) -> None:
    """Persist OTP in server memory with expiry."""
    _OTP_STORE[identifier] = {
        "otp":        otp,
        "expires_at": time.time() + OTP_TTL,
        "attempts":   0
    }


def verify_otp(identifier: str, entered: str) -> dict:
    """
    Verify OTP. Returns:
      { success: bool, message: str, locked: bool }
    """
    record = _OTP_STORE.get(identifier)

    if not record:
        return {"success": False, "message": "OTP not found. Please request a new one.", "locked": False}

    if time.time() > record["expires_at"]:
        _OTP_STORE.pop(identifier, None)
        return {"success": False, "message": "OTP has expired. Please request a new one.", "locked": False}

    if record["attempts"] >= OTP_MAX_TRIES:
        return {"success": False, "message": "Too many failed attempts. Please request a new OTP.", "locked": True}

    if entered.strip() != record["otp"]:
        record["attempts"] += 1
        left = OTP_MAX_TRIES - record["attempts"]
        if left <= 0:
            return {"success": False, "message": "Account locked — max attempts reached. Request a new OTP.", "locked": True}
        return {"success": False, "message": f"Incorrect OTP. {left} attempt(s) remaining.", "locked": False}

    # ✅ Correct
    _OTP_STORE.pop(identifier, None)
    return {"success": True, "message": "OTP verified successfully.", "locked": False}


# ════════════════════════════════════════════════════════════════════════════
#  EMAIL DELIVERY  (Gmail SMTP via App Password)
# ════════════════════════════════════════════════════════════════════════════

def send_otp_email(to_email: str, otp: str, user_name: str = "Candidate") -> dict:
    """
    Send OTP to `to_email` via Gmail SMTP.
    Requires GMAIL_USER and GMAIL_APP_PASS in .env
    """
    if not GMAIL_USER or not GMAIL_PASS:
        return {
            "success": False,
            "channel": "email",
            "message": "Gmail credentials not configured in .env (GMAIL_USER / GMAIL_APP_PASS)"
        }

    subject = "SynapseCareer – Your Login OTP"

    html_body = f"""
    <html><body style="margin:0;padding:0;background:#050811;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#050811;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a,#1e1b4b);
                 border-radius:16px;border:1px solid rgba(0,240,255,0.25);overflow:hidden;">
            <!-- Header -->
            <tr><td style="background:linear-gradient(135deg,rgba(124,58,237,0.8),rgba(0,240,255,0.5));padding:28px 36px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:2px;">⚡ SYNAPSE<span style="color:#00f0ff;">CAREER</span></h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:1px;">AI NEURAL PATHWAY MATCHING ENGINE</p>
            </td></tr>
            <!-- Body -->
            <tr><td style="padding:36px 40px;text-align:center;">
              <p style="color:#94a3b8;font-size:15px;margin:0 0 8px;">Hello <strong style="color:#e2e8f0;">{user_name}</strong>,</p>
              <p style="color:#64748b;font-size:13px;margin:0 0 28px;">Use the verification code below to complete your sign-in:</p>
              <!-- OTP Box -->
              <div style="background:rgba(0,0,0,0.4);border:2px solid rgba(0,240,255,0.4);border-radius:14px;
                          padding:22px 32px;display:inline-block;margin-bottom:28px;">
                <span style="font-size:38px;font-weight:900;letter-spacing:14px;
                             color:#00f0ff;font-family:'Courier New',monospace;">{otp}</span>
              </div>
              <p style="color:#64748b;font-size:12px;margin:0 0 6px;">⏱ Valid for <strong style="color:#f59e0b;">5 minutes</strong> only</p>
              <p style="color:#64748b;font-size:12px;margin:0;">🔒 Do not share this OTP with anyone</p>
            </td></tr>
            <!-- Footer -->
            <tr><td style="background:rgba(0,0,0,0.3);padding:18px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="color:#334155;font-size:11px;margin:0;">If you didn't request this, you can safely ignore it.</p>
              <p style="color:#1e293b;font-size:10px;margin:6px 0 0;">© 2024 SynapseCareer · AI Career Intelligence Platform</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body></html>
    """

    plain_body = f"SynapseCareer Login OTP\n\nHello {user_name},\n\nYour OTP is: {otp}\n\nValid for 5 minutes. Do not share it.\n\n- SynapseCareer Team"

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"SynapseCareer <{GMAIL_USER}>"
        msg["To"]      = to_email

        msg.attach(MIMEText(plain_body, "plain"))
        msg.attach(MIMEText(html_body,  "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(GMAIL_USER, GMAIL_PASS)
            server.sendmail(GMAIL_USER, to_email, msg.as_string())

        print(f"[OTP EMAIL] ✅ Sent to {to_email}")
        return {"success": True, "channel": "email", "message": f"OTP emailed to {to_email}"}

    except smtplib.SMTPAuthenticationError:
        return {"success": False, "channel": "email",
                "message": "Gmail authentication failed. Check GMAIL_USER / GMAIL_APP_PASS in .env"}
    except Exception as e:
        return {"success": False, "channel": "email", "message": str(e)}


# ════════════════════════════════════════════════════════════════════════════
#  SMS DELIVERY  (Fast2SMS – Indian numbers, free tier available)
# ════════════════════════════════════════════════════════════════════════════

def send_otp_sms(phone: str, otp: str) -> dict:
    """
    Send OTP via Fast2SMS (https://www.fast2sms.com — Indian SMS gateway).
    Requires FAST2SMS_API_KEY in .env
    Phone should be 10-digit Indian mobile number.
    """
    if not FAST2SMS_KEY:
        return {
            "success": False,
            "channel": "sms",
            "message": "Fast2SMS API key not configured in .env (FAST2SMS_API_KEY)"
        }

    # Normalize: strip country code if present
    phone = phone.strip().lstrip("+").lstrip("91").strip()
    if len(phone) != 10 or not phone.isdigit():
        return {"success": False, "channel": "sms", "message": f"Invalid Indian phone number: {phone}"}

    url = "https://www.fast2sms.com/dev/bulkV2"
    payload = {
        "route":    "otp",
        "variables_values": otp,
        "numbers":  phone,
        "flash":    0
    }
    headers = {
        "authorization": FAST2SMS_KEY,
        "Content-Type":  "application/json"
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=8)
        data = resp.json()
        if data.get("return") is True:
            print(f"[OTP SMS] ✅ Sent to {phone}")
            return {"success": True, "channel": "sms", "message": f"OTP SMS sent to +91-{phone}"}
        else:
            return {"success": False, "channel": "sms", "message": data.get("message", "Fast2SMS delivery failed")}
    except Exception as e:
        return {"success": False, "channel": "sms", "message": str(e)}
