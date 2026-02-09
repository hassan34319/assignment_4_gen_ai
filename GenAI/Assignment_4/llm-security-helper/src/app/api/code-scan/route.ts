import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code snippet is required" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a senior application security engineer. Analyze the provided code snippet for security vulnerabilities ONLY — do not suggest general refactoring, style changes, or performance improvements.

For each vulnerability found, respond in this exact format:

### Vulnerability [number]: [Name]
**Severity:** Critical | High | Medium | Low
**CWE:** CWE-XXX (if applicable)
**Location:** [line or section reference]
**Description:** What the vulnerability is and why it's dangerous.
**Exploit Scenario:** How an attacker could exploit this.
**Fix:** The specific code change needed to remediate this.

If no security vulnerabilities are found, say so clearly.`,
        },
        {
          role: "user",
          content: `Analyze this code for security vulnerabilities:\n\n${code}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    return NextResponse.json({
      result:
        completion.choices[0]?.message?.content || "No response generated.",
    });
  } catch (error: unknown) {
    console.error("Code scan error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
