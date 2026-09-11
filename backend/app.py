"""
App entrypoint alias for the SynapseCareer API server
Enables running: python app.py directly from the backend folder
"""

from api_server import app

if __name__ == "__main__":
    print("Starting Synapse AI Backend API Server on http://127.0.0.1:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=False)
