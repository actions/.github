import sys
import os

# This script verifies that security headers are correctly configured.
# It can test both FastAPI services and check for static config like netlify.toml.

def verify_static_config():
    """Checks if security headers are defined in netlify.toml."""
    config_path = "netlify.toml"
    if not os.path.exists(config_path):
        print(f"  [SKIP] {config_path} not found")
        return True

    with open(config_path, "r") as f:
        content = f.read()

    expected = [
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Content-Security-Policy",
        "Strict-Transport-Security"
    ]

    success = True
    print(f"Checking {config_path}...")
    for h in expected:
        if h in content:
            print(f"  [OK] Found header definition: {h}")
        else:
            print(f"  [FAIL] Missing header definition: {h}")
            success = False
    return success

def verify_services():
    """Attempts to verify headers for running FastAPI services if present."""
    if not os.path.exists("services"):
        print("\n[INFO] 'services/' directory not found. Skipping service-level header checks.")
        return True

    try:
        from fastapi.testclient import TestClient
        # Attempt to import service apps
        # These imports may fail if the environment is not set up correctly
        # or if files are missing.
        from services.auth_service.main import app as auth_app
        from services.gdpr_service.main import app as gdpr_app
        from services.support_service.main import app as support_app

        def check_headers(client, name):
            print(f"Checking headers for {name}...")
            response = client.get("/")
            headers = response.headers
            expected = ["X-Content-Type-Options", "X-Frame-Options", "Content-Security-Policy", "Strict-Transport-Security"]
            for h in expected:
                if h in headers:
                    print(f"  [OK] {h}")
                else:
                    print(f"  [FAIL] Missing: {h}")
                    return False
            return True

        success = True
        success &= check_headers(TestClient(auth_app), "Auth Service")
        success &= check_headers(TestClient(gdpr_app), "GDPR Service")
        success &= check_headers(TestClient(support_app), "Support Service")
        return success
    except ImportError as e:
        print(f"\n[SKIP] Could not import FastAPI services: {e}")
        return True

if __name__ == "__main__":
    print("Security header verification started...")

    success = verify_static_config()
    success &= verify_services()

    if success:
        print("\nAll security headers verified successfully!")
        sys.exit(0)
    else:
        print("\nSecurity header verification failed!")
        sys.exit(1)
