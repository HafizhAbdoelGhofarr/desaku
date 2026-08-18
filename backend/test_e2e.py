import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

try:
    requests.get(BASE_URL.replace("/api/v1", "/"))
except:
    print("Server not running on port 8000")
    sys.exit(1)

print("Starting tests...")

# 1. Login admin
res = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
assert res.status_code == 200, "Login failed"
admin_token = res.json()["access_token"]
admin_headers = {"Authorization": f"Bearer {admin_token}"}

# 2. Check Indicators (weight field)
res = requests.get(f"{BASE_URL}/indicators")
assert res.status_code == 200, "Failed to get indicators"
inds = res.json()
assert len(inds) > 0
assert 'weight' in inds[0], "Weight field is missing from response"

# 3. Test Verify Protection
res = requests.patch(
    f"{BASE_URL}/indicator-values/1/verify",
    json={"status": "rejected", "catatan": "re-verify test"},
    headers=admin_headers
)
# Assuming indicator value 1 was seeded as verified, it should be rejected with 400
assert res.status_code == 400, f"Expected 400 bad request, got {res.status_code}. Protection missing?"

# 4. Simulation
sim_data = {
    "village_id": 1,
    "periode": "2026",
    "overrides": [
        {"indicator_id": 1, "nilai": 100.0}
    ]
}
res = requests.post(f"{BASE_URL}/simulate", json=sim_data)
assert res.status_code == 200, "Simulation failed"

print("All tests passed!")
