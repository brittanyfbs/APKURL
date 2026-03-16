from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
import re
import os

app = FastAPI(title="APKURL Security Engine")

# --- Models ---
class UrlRequest(BaseModel):
    url: string

class ScanResponse(BaseModel):
    riskLevel: str
    explanation: str
    detectedIssues: List[str]

# --- ML Mock Logic (To be replaced with real .pkl models) ---
def analyze_url_logic(url: str):
    issues = []
    risk_score = 0
    
    # 1. Length Check
    if len(url) > 50:
        issues.append("URL length is unusually long")
        risk_score += 30
    
    # 2. TLD Check
    high_risk_tlds = ['.xyz', '.top', '.pw', '.loan', '.date']
    if any(url.endswith(tld) or f"{tld}/" in url for tld in high_risk_tlds):
        issues.append("High-risk Top Level Domain (TLD) detected")
        risk_score += 40
        
    # 3. Brand Impersonation (Simple check)
    brands = ['paypal', 'apple', 'netflix', 'google', 'bank']
    for brand in brands:
        if brand in url and not url.startswith(f"https://{brand}.com"):
            issues.append(f"Potential brand impersonation of {brand.capitalize()}")
            risk_score += 50
            
    # 4. Special Characters
    if url.count('.') > 3:
        issues.append("Excessive subdomains detected")
        risk_score += 20

    if risk_score >= 70:
        return "High", f"This URL shows multiple signs of phishing and brand impersonation. It is likely trying to steal your data.", issues
    elif risk_score >= 30:
        return "Medium", "This URL has some suspicious characteristics. Exercise caution before entering any information.", issues
    else:
        return "Low", "No significant threats were detected for this URL.", issues

def analyze_apk_logic(filename: str, permissions: List[str] = []):
    issues = []
    risk_score = 0
    
    # Mocking permission analysis
    dangerous_perms = {
        "READ_SMS": 30,
        "RECEIVE_SMS": 30,
        "READ_CALL_LOG": 20,
        "ACCESS_FINE_LOCATION": 20,
        "BIND_ACCESSIBILITY_SERVICE": 50,
        "SYSTEM_ALERT_WINDOW": 40
    }
    
    for perm in permissions:
        if perm in dangerous_perms:
            issues.append(f"Dangerous permission requested: {perm}")
            risk_score += dangerous_perms[perm]
            
    if "Flashlight" in filename and "READ_SMS" in permissions:
        issues.append("Contextual Mismatch: Flashlight app should not read SMS")
        risk_score += 50

    if risk_score >= 70:
        return "High", "This APK requests highly dangerous permissions that are common in spyware and banking trojans.", issues
    elif risk_score >= 30:
        return "Medium", "This app requests some sensitive permissions. Verify the developer before installing.", issues
    else:
        return "Low", "This app appears to have standard permission requirements.", issues

# --- Endpoints ---

@app.post("/api/v1/scan/url", response_model=ScanResponse)
async def scan_url(request: UrlRequest):
    level, desc, issues = analyze_url_logic(request.url)
    return {
        "riskLevel": level,
        "explanation": desc,
        "detectedIssues": issues
    }

@app.post("/api/v1/scan/apk", response_model=ScanResponse)
async def scan_apk(
    file: UploadFile = File(...),
    permissions: str = Form("[]") # Passed as a JSON string from Android
):
    import json
    try:
        perms_list = json.loads(permissions)
    except:
        perms_list = []
        
    level, desc, issues = analyze_apk_logic(file.filename, perms_list)
    return {
        "riskLevel": level,
        "explanation": desc,
        "detectedIssues": issues
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
