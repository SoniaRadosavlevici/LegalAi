async function translateChunk(text, targetLang) {
  if (!text.trim() || /^[─═━┅\s]+$/.test(text)) return text
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|${targetLang}`
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const d = await r.json()
    if (d.responseStatus === 200) return d.responseData.translatedText
  } catch {}
  return text
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text, targetLang } = req.body
  if (!text || !targetLang) return res.status(400).json({ error: 'Missing parameters' })
  if (targetLang === 'en') return res.json({ translated: text })

  // Split into paragraph blocks (separated by blank lines)
  const rawBlocks = text.split('\n\n')

  // For blocks > 450 chars, split further at line boundaries
  const chunks = []
  for (let b = 0; b < rawBlocks.length; b++) {
    const block = rawBlocks[b]
    if (block.length <= 450) {
      chunks.push({ text: block, blockIdx: b, part: 0 })
    } else {
      const lines = block.split('\n')
      let current = ''
      let part = 0
      for (const line of lines) {
        if (current.length + line.length + 1 > 450 && current) {
          chunks.push({ text: current.trimEnd(), blockIdx: b, part: part++ })
          current = line + '\n'
        } else {
          current += line + '\n'
        }
      }
      if (current.trim()) chunks.push({ text: current.trimEnd(), blockIdx: b, part: part })
    }
  }

  // Translate with concurrency limit of 5
  const results = new Array(chunks.length)
  let cursor = 0
  async function worker() {
    while (cursor < chunks.length) {
      const i = cursor++
      results[i] = await translateChunk(chunks[i].text, targetLang)
    }
  }
  await Promise.all(Array.from({ length: 5 }, worker))

  // Reconstruct: group results back into blocks
  const blockParts = {}
  chunks.forEach((chunk, i) => {
    if (!blockParts[chunk.blockIdx]) blockParts[chunk.blockIdx] = []
    blockParts[chunk.blockIdx][chunk.part] = results[i]
  })

  const translatedBlocks = rawBlocks.map((_, b) =>
    blockParts[b] ? blockParts[b].join('\n') : rawBlocks[b]
  )

  res.json({ translated: translatedBlocks.join('\n\n') })
}
