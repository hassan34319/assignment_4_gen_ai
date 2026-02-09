import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { specs } = await req.json();

    if (!specs || typeof specs !== "string") {
      return NextResponse.json(
        { error: "Specs are required" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an AI security expert specializing in LLM and Agentic AI application security. Given the specifications for a GenAI/Agentic application, identify potential vulnerabilities mapped to two frameworks:

**OWASP Top 10 for LLM Applications (2025):**
LLM01 - Prompt Injection
LLM02 - Sensitive Information Disclosure
LLM03 - Supply Chain Vulnerabilities
LLM04 - Data and Model Poisoning
LLM05 - Improper Output Handling
LLM06 - Excessive Agency
LLM07 - System Prompt Leakage
LLM08 - Vector and Embedding Weaknesses
LLM09 - Misinformation
LLM10 - Unbounded Consumption

**MITRE ATLAS (Adversarial Threat Landscape for AI Systems):**
Reference relevant ATLAS techniques (e.g., AML.T0043 - Craft Adversarial Data, AML.T0040 - ML Model Inference API Access, AML.T0042 - Verify Attack, AML.T0054 - LLM Prompt Injection, etc.)

For each vulnerability found, use this format:

### [Number]. [Vulnerability Name]
**OWASP LLM Category:** LLM0X - Name
**ATLAS Technique:** AML.TXXXX - Name (if applicable)
**Risk Level:** Critical | High | Medium | Low
**Description:** What could go wrong and why.
**Attack Scenario:** A specific, realistic attack against this app.
**Mitigation:** Clear, actionable steps to prevent this.

Be specific to the given app specs — do not give generic advice.`,
        },
        {
          role: "user",
          content: `Analyze these GenAI/Agentic application specifications for potential vulnerabilities:\n\n${specs}`,
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
    console.error("Spec scan error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
