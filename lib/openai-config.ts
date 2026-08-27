/**
 * Modelos OpenAI canónicos (mismo criterio que Furgocasa / Alemán / GVC Abogados).
 *
 * Texto: gpt-5.6-terra
 * Clasificación rápida: gpt-4o-mini
 *
 * GPT-5.x no acepta temperature custom.
 * Este vertical no genera portadas ni imágenes de cuerpo (web legal).
 */

export const OPENAI_TEXT_MODEL =
  process.env.OPENAI_TEXT_MODEL?.trim() || "gpt-5.6-terra";

export const OPENAI_FAST_MODEL =
  process.env.OPENAI_FAST_MODEL?.trim() || "gpt-4o-mini";

export type GptReasoningEffort = "none" | "low" | "medium" | "high" | "xhigh" | "max";

export function isGpt5Model(model: string): boolean {
  return /^gpt-5/i.test(model);
}

export type ChatCompletionConfigInput = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: GptReasoningEffort;
  json?: boolean;
};

type ChatCompletionConfigBase = {
  model: string;
  temperature?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
  response_format?: { type: "json_object" };
} & Record<string, unknown>;

export type ChatCompletionConfig =
  | (ChatCompletionConfigBase & { stream?: false })
  | (ChatCompletionConfigBase & { stream: true });

export function chatCompletionConfig(
  input: ChatCompletionConfigInput & { stream: true }
): ChatCompletionConfigBase & { stream: true };
export function chatCompletionConfig(
  input?: ChatCompletionConfigInput & { stream?: false }
): ChatCompletionConfigBase & { stream?: false };
export function chatCompletionConfig(
  input: ChatCompletionConfigInput & { stream?: boolean } = {}
): ChatCompletionConfig {
  const model = input.model?.trim() || OPENAI_TEXT_MODEL;
  const gpt5 = isGpt5Model(model);
  const params: ChatCompletionConfigBase & { stream?: boolean } = { model };

  if (input.stream) params.stream = true;
  if (input.json) params.response_format = { type: "json_object" };

  if (gpt5) {
    if (input.maxTokens != null) params.max_completion_tokens = input.maxTokens;
    if (input.reasoningEffort) params.reasoning_effort = input.reasoningEffort;
  } else {
    if (input.temperature != null) params.temperature = input.temperature;
    if (input.maxTokens != null) params.max_tokens = input.maxTokens;
  }

  return params as ChatCompletionConfig;
}

export function chatMessageText(completion: {
  choices?: Array<{ message?: { content?: string | null } }>;
}): string {
  return completion.choices?.[0]?.message?.content?.trim() || "";
}

/** Web Search nativo de GPT-5.6 Terra (Responses API). No hace falta SerpAPI. */
export const OPENAI_WEB_SEARCH_TOOL = {
  type: "web_search" as const,
  search_context_size: "high" as const,
  user_location: {
    type: "approximate" as const,
    country: "ES",
    city: "Murcia",
    region: "Murcia",
    timezone: "Europe/Madrid",
  },
};

export function responseOutputText(response: {
  output_text?: string | null;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string | null }>;
  }>;
}): string {
  const direct = response.output_text?.trim();
  if (direct) return direct;

  const parts: string[] = [];
  for (const item of response.output || []) {
    if (item.type !== "message") continue;
    for (const block of item.content || []) {
      if (block.type === "output_text" && block.text) parts.push(block.text);
    }
  }
  return parts.join("\n").trim();
}
