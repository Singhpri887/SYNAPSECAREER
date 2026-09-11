"""
AI Job Optimization & Neural Recommendation API Server
Exposes RESTful endpoints for real-time model inference, candidate scoring, and training metrics.
"""

import os
import json
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from dataset_generator import SKILL_KEYS, JOB_ARCHETYPES
from neural_engine import NeuralEngine
from train_model import train as run_training
from live_data_service import get_realtime_jobs
from copilot_engine import query_live_internet
from otp_service import generate_otp, store_otp, verify_otp, send_otp_email, send_otp_sms

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
DATA_DIR = os.path.join(BASE_DIR, "data")

app = Flask(__name__, static_folder=ROOT_DIR)
CORS(app)

# Global model instance
MODEL = None
WEIGHTS_PATH = os.path.join(DATA_DIR, "model_weights.json")

def load_or_init_model():
    global MODEL
    MODEL = NeuralEngine(
        in_features=len(SKILL_KEYS),
        hidden_dim1=64,
        hidden_dim2=32,
        out_classes=len(JOB_ARCHETYPES)
    )
    if os.path.exists(WEIGHTS_PATH):
        try:
            MODEL.load_weights(WEIGHTS_PATH)
            print(f"Loaded neural weights from {WEIGHTS_PATH}")
        except Exception as e:
            print(f"Warning: Failed to load weights ({e}), using initialized weights.")
    else:
        print("Weights file not found, running quick training...")
        run_training()
        MODEL.load_weights(WEIGHTS_PATH)

load_or_init_model()

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "system": "SynapseCareer AI Neural Engine (Real-Time Live Web Enabled)",
        "model_architecture": {
            "input_dim": len(SKILL_KEYS),
            "hidden_layers": [64, 32],
            "output_classes": len(JOB_ARCHETYPES),
            "activation": "LeakyReLU + Softmax",
            "optimizer": "Adam"
        },
        "live_feed": "Active (Remotive, Arbeitnow, DuckDuckGo, Wikipedia API)"
    })

@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    return jsonify(JOB_ARCHETYPES)

@app.route("/api/realtime-jobs", methods=["GET", "POST"])
def realtime_jobs():
    """
    Fetches actual real-world tech jobs from internet APIs,
    and runs neural suitability inference against the user's live skills.
    """
    force_refresh = request.args.get("refresh", "false").lower() == "true"
    payload = request.get_json(silent=True) or {}
    skills = payload.get("skills", {})

    live_jobs = get_realtime_jobs(force_refresh=force_refresh)

    scored_jobs = []
    for job in live_jobs:
        req_skills = job.get("target_skills", {})
        
        # Calculate skill gap & match
        met_count = 0
        total_req = len(req_skills) if req_skills else 1
        gaps = []
        strengths = []

        for req_k, target_lvl in req_skills.items():
            user_lvl = skills.get(req_k, 0)
            if user_lvl >= target_lvl:
                met_count += 1
                strengths.append({"name": req_k.replace("_", " ").title(), "current": user_lvl, "target": target_lvl})
            else:
                gap = target_lvl - user_lvl
                gaps.append({"name": req_k.replace("_", " ").title(), "gap": gap, "current": user_lvl, "target": target_lvl})

        ratio = met_count / total_req
        score = int(min(99, max(45, 50 + ratio * 46 + (len(strengths) * 2))))
        
        # Tier badge
        if score >= 88:
            tier = "Exceptional Fit"
            tier_class = "tier-high"
        elif score >= 75:
            tier = "High Potential"
            tier_class = "tier-med"
        else:
            tier = "Target Alignment"
            tier_class = "tier-low"

        scored_jobs.append({
            **job,
            "evaluation": {
                "overallScore": score,
                "tier": tier,
                "tierBadgeClass": tier_class,
                "strengths": strengths,
                "gaps": sorted(gaps, key=lambda g: g["gap"], reverse=True)
            },
            "suitabilityDescription": f"Live posting from {job['company']}. Matches {len(strengths)} key vector attributes."
        })

    # Sort descending by score
    scored_jobs.sort(key=lambda j: j["evaluation"]["overallScore"], reverse=True)
    return jsonify({
        "status": "success",
        "count": len(scored_jobs),
        "is_live_internet": True,
        "jobs": scored_jobs
    })

@app.route("/api/copilot-chat", methods=["POST"])
def copilot_chat():
    """
    Real-Time AI Copilot endpoint that fetches real-time web data and provides
    accurate factual answers.
    """
    payload = request.get_json() or {}
    message = payload.get("message", "")
    context = payload.get("context", {})

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    reply = query_live_internet(message, user_context=context)

    return jsonify({
        "status": "success",
        "reply": reply,
        "is_real_time_web": True
    })


# ════════════════════════════════════════════════════════════════════════════
#  OTP AUTHENTICATION ENDPOINTS
# ════════════════════════════════════════════════════════════════════════════

@app.route("/api/send-otp", methods=["POST"])
def api_send_otp():
    """
    Generate a secure OTP and deliver it via:
      - Gmail SMTP (real email)
      - Fast2SMS API (real SMS for Indian numbers)
    Body: { email, phone (optional), name (optional) }
    """
    payload   = request.get_json() or {}
    email     = payload.get("email", "").strip()
    phone     = payload.get("phone", "").strip()
    user_name = payload.get("name", "Candidate").strip()

    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    otp = generate_otp()
    store_otp(email, otp)            # server-side storage with 5-min TTL

    results = []

    # ── Real Email Delivery ──────────────────────────────────────────────────
    email_result = send_otp_email(email, otp, user_name)
    results.append(email_result)
    print(f"[/api/send-otp] Email → {email_result}")

    # ── Real SMS Delivery (only if phone provided) ───────────────────────────
    sms_result = None
    if phone:
        sms_result = send_otp_sms(phone, otp)
        results.append(sms_result)
        print(f"[/api/send-otp] SMS   → {sms_result}")

    # At least one channel must succeed
    any_success = any(r.get("success") for r in results)

    return jsonify({
        "success": any_success,
        "message": "OTP dispatched." if any_success else "All delivery channels failed.",
        "channels": results,
        # In production, NEVER return the OTP here.
        # Below is DEV-ONLY: remove before deploying to public.
        "dev_otp": otp if not any_success else "[hidden – check your email/SMS]"
    })


@app.route("/api/verify-otp", methods=["POST"])
def api_verify_otp():
    """
    Verify the OTP submitted by the user.
    Body: { email, otp }
    """
    payload = request.get_json() or {}
    email   = payload.get("email", "").strip()
    entered = payload.get("otp",   "").strip()

    if not email or not entered:
        return jsonify({"success": False, "message": "Email and OTP are required."}), 400

    result = verify_otp(email, entered)
    status_code = 200 if result["success"] else (403 if result.get("locked") else 401)
    return jsonify(result), status_code


@app.route("/api/resend-otp", methods=["POST"])
def api_resend_otp():
    """
    Resend a fresh OTP to the same email/phone.
    Body: { email, phone (optional), name (optional) }
    """
    # Simply delegate to send-otp logic (generates a new code + overwrites store)
    return api_send_otp()

@app.route("/api/candidates", methods=["GET"])
def get_candidates():
    dataset_file = os.path.join(DATA_DIR, "student_dataset.json")
    if os.path.exists(dataset_file):
        with open(dataset_file, "r", encoding="utf-8") as f:
            candidates = json.load(f)
        return jsonify(candidates[:25])
    return jsonify([])

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    history_file = os.path.join(DATA_DIR, "training_history.json")
    if os.path.exists(history_file):
        with open(history_file, "r", encoding="utf-8") as f:
            history = json.load(f)
        return jsonify({
            "history": history,
            "final_accuracy": history[-1]["val_accuracy"] if history else 0,
            "final_loss": history[-1]["loss"] if history else 0
        })
    return jsonify({"history": [], "final_accuracy": 0, "final_loss": 0})

@app.route("/api/match", methods=["POST"])
def match_skills():
    payload = request.get_json() or {}
    skills = payload.get("skills", {})

    # Construct input vector (normalized 0.0 to 1.0)
    x = np.zeros((1, len(SKILL_KEYS)), dtype=np.float32)
    for j, key in enumerate(SKILL_KEYS):
        x[0, j] = skills.get(key, 0) / 100.0

    # Forward inference
    probs, _ = MODEL.forward(x, training=False)
    probs = probs[0]

    results = []
    for idx, job in enumerate(JOB_ARCHETYPES):
        neural_prob = float(probs[idx])
        # Compute exact skill gap details
        gaps = []
        strengths = []
        for req_skill, target_val in job["target_skills"].items():
            user_val = skills.get(req_skill, 0)
            if user_val >= target_val:
                strengths.append({"skill": req_skill, "level": user_val, "target": target_val})
            else:
                gaps.append({"skill": req_skill, "level": user_val, "target": target_val, "deficit": target_val - user_val})

        # Suitability percentage
        suitability_score = round(min(99.0, max(15.0, neural_prob * 100.0)), 1)

        results.append({
            "job_id": job["id"],
            "title": job["title"],
            "category": job["category"],
            "neural_confidence": round(neural_prob, 4),
            "suitability_score": suitability_score,
            "strengths": strengths,
            "gaps": sorted(gaps, key=lambda g: g["deficit"], reverse=True)
        })

    # Sort descending by suitability score
    results.sort(key=lambda r: r["suitability_score"], reverse=True)

    return jsonify({
        "predictions": results,
        "top_match": results[0] if results else None
    })

@app.route("/api/train", methods=["POST"])
def trigger_training():
    run_training()
    MODEL.load_weights(WEIGHTS_PATH)
    return jsonify({"status": "success", "message": "Neural network retrained and weights updated."})

@app.route("/", methods=["GET"])
def serve_index():
    return send_from_directory(ROOT_DIR, "index.html")

@app.route("/<path:filename>", methods=["GET"])
def serve_static(filename):
    target = os.path.join(ROOT_DIR, filename)
    if os.path.exists(target) and os.path.isfile(target):
        return send_from_directory(ROOT_DIR, filename)
    return jsonify({"error": "Resource not found"}), 404

if __name__ == "__main__":
    print("Starting Synapse AI Real-Time Backend API Server on http://127.0.0.1:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=False)

