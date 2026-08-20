import { localExplain, type ExplainRequest } from "../../../lib/explain";

/** Mock-only: never call real AI providers. */
export async function POST(req: Request) {
  let body: ExplainRequest;
  try {
    body = (await req.json()) as ExplainRequest;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.prompt || !Array.isArray(body.options) || body.options.length < 2) {
    return Response.json({ error: "Missing question fields" }, { status: 400 });
  }

  return Response.json({
    explanation: localExplain(body),
    source: "mock",
  });
}
