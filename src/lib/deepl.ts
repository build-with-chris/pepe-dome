/**
 * DeepL-Übersetzung Deutsch → Englisch für die Admin-Übersetzen-Buttons.
 *
 * Lag vorher direkt in der Event-Route. Artikel nutzen denselben Aufruf,
 * deshalb liegt er hier.
 *
 * Benötigt DEEPL_API_KEY in der Env (Free-Keys enden auf ":fx" und laufen
 * gegen api-free.deepl.com).
 */

export async function deeplTranslate(texts: string[], apiKey: string): Promise<string[]> {
  if (texts.length === 0) return []

  const endpoint = apiKey.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate'

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      source_lang: 'DE',
      target_lang: 'EN-GB',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`DeepL ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as { translations: { text: string }[] }
  return data.translations.map((t) => t.text)
}
