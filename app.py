"""
Root Unified Launcher: SynapseCareer
Runs both the AI Neural Backend (Port 5000) and Web UI (Port 8000),
and automatically opens the application in your browser!
"""

import os
import sys
import time
import socket
import webbrowser
import subprocess

def find_free_port(preferred_ports=(8000, 8088, 3000, 8888, 8081)):
    for port in preferred_ports:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.4)
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    # Fallback to ephemeral port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

def is_backend_running(port=5000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.4)
        return s.connect_ex(('127.0.0.1', port)) == 0

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")

    print("\n" + "=" * 60)
    print("⚡ SYNAPSECAREER: AI RECRUITMENT & JOB RECOMMENDER")
    print("=" * 60)

    # 1. Start Python AI Backend on Port 5000 if not running
    if is_backend_running(5000):
        print("✓ Python AI Backend is ALREADY running on http://127.0.0.1:5000")
    else:
        print("Starting Python AI Backend on http://127.0.0.1:5000 ...")
        subprocess.Popen([sys.executable, "app.py"], cwd=backend_dir)
        time.sleep(1.5)

    # 2. Find clean available port for Frontend Web Server
    frontend_port = find_free_port()
    print(f"Starting Frontend Web Server on http://localhost:{frontend_port} ...")
    subprocess.Popen([sys.executable, "-m", "http.server", str(frontend_port)], cwd=root_dir)
    time.sleep(1.0)

    url = f"http://localhost:{frontend_port}"
    print("=" * 60)
    print(f"🌐 Launching application in your browser: {url}")
    print("=" * 60)
    print("\nPress Ctrl+C in this window anytime to stop.\n")

    # 3. Open in user's browser automatically
    webbrowser.open(url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping services. Goodbye!")

if __name__ == "__main__":
    main()
