
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { RiskLevel, ScanType } from "../types";

export const analyzeContent = async (content: string, type: ScanType) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are an elite cybersecurity threat intelligence engine. Your goal is to provide 99.9% accurate risk assessments for URLs and APKs.
  
  TONE AND LANGUAGE:
  - Use SIMPLE, PLAIN ENGLISH for the "explanation" field. 
  - Avoid overly technical jargon. 
  - Explain exactly WHAT the item is and HOW it could harm the user (e.g., "This link is trying to steal your bank login" instead of "Credential harvesting detected").
  - Be direct and helpful.

  URL ANALYSIS (PHISHING/SCAM):
  - Check for Homograph attacks (e.g., Cyrillic characters that look like Latin).
  - Analyze TLD reputation: .xyz, .top, .pw, .loan, .date are high-risk.
  - Detect brand impersonation: "apple-support-login.com", "secure-paypal-verify.net".
  - Look for URL shortening service abuse (bit.ly, t.co) when used in suspicious contexts.
  - Identify "Urgency" patterns: /account-suspended, /verify-identity-now.
  
  APK ANALYSIS (MALWARE/SPYWARE):
  - Flag "Dangerous Permission Clusters":
    * Spyware: READ_SMS + READ_CALL_LOG + INTERNET + ACCESS_FINE_LOCATION.
    * Banking Trojan: BIND_ACCESSIBILITY_SERVICE + SYSTEM_ALERT_WINDOW + RECEIVE_SMS.
    * Ransomware: BIND_DEVICE_ADMIN + PROCESS_OUTGOING_CALLS.
  - Contextual Mismatch: A "Calculator" or "Flashlight" app requesting CONTACTS or SMS is an immediate HIGH risk.
  - Overlay Attack potential: Apps requesting DRAW_OVER_OTHER_APPS without a clear utility reason.

  OUTPUT JSON: {
    riskLevel: "High" | "Medium" | "Low",
    explanation: string (SIMPLE ENGLISH: Explain what this is and how it harms the user),
    detectedIssues: string[] (specific technical indicators for the log)
  }`;

  const prompt = type === 'URL' 
    ? `Perform deep-packet style inspection on URL: "${content}"`
    : `Perform static analysis on APK metadata/permissions: "${content}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      maxOutputTokens: 600, 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING },
          explanation: { type: Type.STRING },
          detectedIssues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["riskLevel", "explanation", "detectedIssues"],
      },
    },
  });

  try {
    const text = response.text?.trim() || '{}';
    const result = JSON.parse(text);
    
    return {
      riskLevel: (result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1).toLowerCase()) as RiskLevel,
      explanation: result.explanation,
      detectedIssues: result.detectedIssues,
    };
  } catch (error) {
    console.error("Analysis Parse Error:", error);
    return {
      riskLevel: RiskLevel.MEDIUM,
      explanation: "Analysis completed but format was unexpected. Exercise caution.",
      detectedIssues: ["Anomalous pattern detected"],
    };
  }
};
