export function buildRewritePrompt(originalArticle, competitorContents) {
  const competitors = competitorContents
    .map(c => `URL: ${c.url}\n${c.content.slice(0, 1500)}`)
    .join("\n\n---\n\n");

  return `
You are an expert technical content writer and SEO specialist.

Your job is to rewrite and significantly improve the given article using competitor references.

======================
OBJECTIVE
======================
- Create a HIGH-QUALITY, SEO-optimized article
- Make it more informative, structured, and readable than competitors
- Ensure originality (no copying)

======================
STRICT RULES
======================
- Do NOT copy sentences from competitors
- Do NOT mention competitors or URLs
- Do NOT hallucinate facts
- Stay aligned with the original topic
- Use only relevant information

======================
SEO REQUIREMENTS
======================
- Use the main topic naturally throughout
- Add clear headings (H1, H2, H3)
- Improve readability and flow
- Add examples where useful

======================
OUTPUT FORMAT (MANDATORY)
======================
# Title

## Introduction
(Engaging intro, 3–5 sentences)

## What is it
(Clear explanation)

## Why it matters
(Value + importance)

## How it works
(Step-by-step or breakdown)

## Applications
(Real-world use cases)

## Conclusion
(Summary + final insight)

======================
ORIGINAL ARTICLE
======================
Title: ${originalArticle.title}

Content:
${originalArticle.content.slice(0, 2000)}

======================
COMPETITOR REFERENCES
======================
${competitors}
`;
}
