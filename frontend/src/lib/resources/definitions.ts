import { ResourceDefinition } from './types';

export const RESOURCE_GUIDES: ResourceDefinition[] = [
  // --- Guide 1: How EMI is Calculated ---
  {
    slug: 'how-emi-is-calculated',
    title: 'How EMI is Calculated — Formula, Example & Amortization Explained',
    description: 'Understand the EMI formula, see a worked example, and learn how monthly loan payments are split between principal and interest.',
    metaDescription: 'Learn how EMI is calculated using the standard formula. Includes a worked example, amortization breakdown, and a link to a free EMI calculator.',
    keywords: ['emi formula', 'how emi is calculated', 'loan amortization explained', 'emi calculation formula', 'monthly installment formula'],
    publishedAt: '2024-01-15',
    isPublished: true,
    intro:
      'EMI (Equated Monthly Installment) is the fixed monthly amount a borrower pays to a lender over the entire loan tenure. It includes both a principal component and an interest component — though the proportion of each changes every month.',
    sections: [
      {
        heading: 'The EMI Formula',
        body: 'The standard EMI calculation uses the reducing-balance compound interest method:\n\nEMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)\n\nWhere P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the total number of monthly installments.',
      },
      {
        heading: 'Principal vs Interest in Each Payment',
        body: 'In the early months, the interest component is higher because the outstanding balance is large. As you pay down the principal, the interest portion decreases and the principal portion increases. This is called amortization.\n\nFor example, on a ₹20 lakh loan at 9% p.a. for 10 years, the first EMI might include ₹7,000 in interest and ₹5,000 in principal. By the final year, the same EMI might include only ₹900 in interest and ₹11,100 in principal.',
      },
      {
        heading: 'What Affects Your EMI?',
        body: 'Three factors determine your EMI: the loan amount (higher amount = higher EMI), the interest rate (higher rate = higher EMI and more total interest paid), and the tenure (longer tenure = lower EMI but significantly more total interest paid over the life of the loan).\n\nExtending your tenure from 10 to 20 years on a ₹30 lakh loan at 8.5% reduces the monthly payment, but can double the total interest paid.',
      },
      {
        heading: 'Prepayments and How They Help',
        body: 'A prepayment is an extra lump-sum payment towards the outstanding principal. Because it reduces the principal balance, all future interest calculations are based on the lower amount. A ₹1 lakh prepayment made in the 3rd year of a 20-year home loan can save several lakhs in total interest and shorten the tenure by years.',
      },
    ],
    examples: [
      {
        title: 'Home Loan Calculation',
        description: 'Loan: ₹30,00,000. Interest rate: 8.5% p.a. Tenure: 20 years (240 months).\n\nr = 8.5 / 12 / 100 = 0.007083\nn = 240\n\nEMI = 3000000 × 0.007083 × (1.007083)^240 / ((1.007083)^240 − 1)\n    ≈ ₹26,035/month\n\nTotal payable: ₹62,48,400. Total interest: ₹32,48,400.',
      },
    ],
    notes: [
      'Actual EMIs from lenders may differ slightly due to rounding conventions used in their loan management systems.',
      'Processing fees, insurance premiums, and prepayment charges are not part of the EMI formula.',
    ],
    faqs: [
      {
        question: 'Is EMI calculated on the original loan amount or the outstanding balance?',
        answer:
          'The EMI amount is fixed throughout the tenure (for a fixed-rate loan). However, the interest portion of each EMI is calculated on the remaining outstanding balance — this is why interest decreases and principal increases over time.',
      },
      {
        question: 'Can I reduce my EMI after taking a loan?',
        answer:
          'Some lenders allow you to make a prepayment and then choose between reducing the EMI or reducing the tenure. Reducing the tenure saves more interest overall.',
      },
      {
        question: 'What is a moratorium period?',
        answer:
          'A moratorium is a period at the start of the loan where no EMI is due. Interest usually continues to accrue during this time and is added to the principal.',
      },
    ],
    relatedTools: [
      { slug: 'emi-calculator', label: 'EMI & Loan Amortization Calculator' },
      { slug: 'compound-interest-calculator', label: 'Compound Interest Calculator' },
      { slug: 'percentage-calculator', label: 'Percentage Calculator' },
    ],
  },

  // --- Guide 2: What is Base64? ---
  {
    slug: 'what-is-base64',
    title: 'What is Base64? Encoding Explained with Examples',
    description: 'Base64 is a way to represent binary data as plain text. Learn how it works, when to use it, and why it is not encryption.',
    metaDescription: 'Understand what Base64 encoding is, how it converts binary to text, when to use it, and why it is different from encryption.',
    keywords: ['what is base64', 'base64 explained', 'base64 encoding', 'how base64 works', 'base64 vs encryption'],
    publishedAt: '2024-01-20',
    isPublished: true,
    intro:
      'Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 printable ASCII characters. It is not compression and it is not encryption — it is a way to safely pass binary content through systems that only handle text.',
    sections: [
      {
        heading: 'Why Base64 Exists',
        body: 'Many protocols and formats — email (SMTP), HTTP headers, JSON, and XML — were designed for text. Embedding raw binary data (an image, a certificate, a PDF) directly in a text medium causes problems: certain byte sequences conflict with control characters or special syntax.\n\nBase64 solves this by converting every 3 bytes of binary data into 4 printable ASCII characters. The output contains only letters (A–Z, a–z), digits (0–9), and two special characters (+ and /).',
      },
      {
        heading: 'How It Works',
        body: 'Base64 works by taking 3 bytes (24 bits) at a time and splitting them into four 6-bit groups. Each 6-bit group maps to one character in the Base64 alphabet (64 characters = 6 bits).\n\nIf the total input length is not a multiple of 3, padding characters (=) are added to make the output length a multiple of 4. This is why Base64 strings often end with = or ==.',
      },
      {
        heading: 'URL-Safe Base64',
        body: 'Standard Base64 uses + and / which have special meaning in URLs. URL-safe Base64 (RFC 4648) replaces + with - (minus) and / with _ (underscore). Padding may be omitted. URL-safe Base64 is used in JWT tokens, OAuth parameters, and any context where the encoded value appears in a URL.',
      },
      {
        heading: 'Base64 is Not Encryption',
        body: 'Base64 is an encoding, not a cipher. Anyone can decode a Base64 string without a key. Do not use Base64 to protect sensitive data — use proper encryption (AES, TLS) for that purpose. Base64 is used for transport compatibility, not security.',
      },
      {
        heading: 'Common Uses of Base64',
        body: 'Base64 is used to embed images directly in HTML or CSS as data URIs (data:image/png;base64,...), to send binary attachments in email (MIME multipart), to encode API keys and credentials in HTTP Basic Auth headers, to store binary blobs in JSON APIs, and to encode cryptographic keys and certificates in PEM format.',
      },
    ],
    examples: [
      {
        title: 'Encoding a Basic Auth credential',
        description: 'The username "alice" and password "secret" are combined as "alice:secret", then Base64-encoded to "YWxpY2U6c2VjcmV0". The HTTP request includes the header: Authorization: Basic YWxpY2U6c2VjcmV0',
      },
    ],
    notes: [
      'Base64 increases data size by approximately 33% compared to the original binary.',
      'Padding (=) at the end can be safely stripped in URL-safe contexts and added back during decoding.',
    ],
    faqs: [
      {
        question: 'Can I Base64-encode an entire file?',
        answer:
          'Yes, but the output will be 33% larger than the original. Text-based tools (including this one) handle text encoding. Encoding binary files (images, PDFs) requires reading the raw bytes — typically done in code rather than a text-input tool.',
      },
      {
        question: 'Is Base64 the same as hex encoding?',
        answer:
          'Both convert binary to printable characters, but differently. Hex uses 2 characters per byte (16² = 256 values) — it doubles the size. Base64 uses about 1.33 characters per byte — more efficient than hex for large data.',
      },
    ],
    relatedTools: [
      { slug: 'base64-converter', label: 'Base64 Encoder & Decoder' },
      { slug: 'url-encoder-decoder', label: 'URL Encoder & Decoder' },
      { slug: 'hash-generator', label: 'Cryptographic Hash Generator' },
    ],
  },

  // --- Guide 3: JSON Formatting Explained ---
  {
    slug: 'json-formatting-explained',
    title: 'JSON Formatting Explained — Syntax, Common Errors & Best Practices',
    description: 'Learn how JSON is structured, what causes syntax errors, and when to format vs minify your JSON.',
    metaDescription: 'Understand JSON structure, common syntax errors, and when to use formatted vs minified JSON. Practical guide with examples.',
    keywords: ['json formatting', 'json syntax', 'json errors', 'json minify', 'json beautify', 'what is json'],
    publishedAt: '2024-01-25',
    isPublished: true,
    intro:
      'JSON (JavaScript Object Notation) is a lightweight text format for storing and transporting data. It is easy for humans to read when formatted, and easy for machines to parse. Understanding its syntax rules prevents the errors that every developer encounters eventually.',
    sections: [
      {
        heading: 'JSON Data Types',
        body: 'JSON supports six value types: strings (in double quotes), numbers (integer or decimal), booleans (true or false), null, arrays (ordered lists in square brackets), and objects (key-value pairs in curly braces).\n\nAll keys must be strings and must use double quotes. Values can be any of the six types, including nested objects and arrays.',
      },
      {
        heading: 'Common Syntax Errors',
        body: 'Single quotes around keys or values (JSON requires double quotes). Trailing commas after the last element in an array or object. Comments — JSON does not support // or /* */ comments. Unquoted keys. Numbers with leading zeros (e.g., 007 is invalid). Control characters in strings that are not properly escaped.',
      },
      {
        heading: 'Formatted vs Minified JSON',
        body: 'Formatted JSON (also called beautified or pretty-printed) uses indentation and line breaks to make the structure readable. It is useful during development, debugging, and in version-controlled config files.\n\nMinified JSON removes all unnecessary whitespace to reduce file size. Minified JSON is typically used in production API responses and stored data where every byte matters.',
      },
      {
        heading: 'When to Validate',
        body: 'Always validate JSON before using it in production. A single missing comma or unclosed bracket causes the entire parse to fail. Most languages throw a parse error with a position hint — paste the JSON into a formatter to pinpoint the exact location.',
      },
    ],
    examples: [
      {
        title: 'Valid JSON object',
        description: '{ "name": "Alice", "age": 30, "active": true, "scores": [95, 87, 92], "address": null }',
      },
      {
        title: 'Common error: trailing comma',
        description: '{ "name": "Alice", "age": 30, }  ← The comma after 30 is invalid. Remove it.',
      },
    ],
    notes: [
      'JSON is a strict subset of JavaScript object notation but has stricter rules — a valid JS object literal is often not valid JSON.',
      'Many tools accept JSON5 (a superset that allows comments and single quotes), but standard parsers do not.',
    ],
    faqs: [
      {
        question: 'Does JSON support comments?',
        answer:
          'No. Standard JSON does not support comments. If you need annotated config files, consider YAML (which allows # comments) or JSON5.',
      },
      {
        question: 'What is NDJSON?',
        answer:
          'NDJSON (Newline-Delimited JSON) is a format where each line is a valid JSON value, typically used for streaming large datasets and log files.',
      },
    ],
    relatedTools: [
      { slug: 'json-formatter', label: 'JSON Formatter & Validator' },
      { slug: 'yaml-to-json', label: 'YAML to JSON Converter' },
      { slug: 'json-to-yaml', label: 'JSON to YAML Converter' },
    ],
  },

  // --- Guide 4: HEX, RGB, HSL Explained ---
  {
    slug: 'hex-rgb-hsl-explained',
    title: 'HEX, RGB & HSL Color Formats Explained — When to Use Each',
    description: 'Learn the difference between HEX, RGB, and HSL color formats and when each is the right choice for CSS and design work.',
    metaDescription: 'Understand HEX, RGB, and HSL color formats. See how they work, how to convert between them, and when to use each in CSS and design.',
    keywords: ['hex rgb hsl', 'color formats explained', 'hex to rgb', 'hsl color', 'css color formats', 'color codes'],
    publishedAt: '2024-02-01',
    isPublished: true,
    intro:
      'Color on screens is defined by mixing red, green, and blue light. HEX, RGB, and HSL are three ways to write the same information — they differ in readability and how easy it is to manipulate the color mathematically.',
    sections: [
      {
        heading: 'HEX — The Web Standard',
        body: 'HEX colors are written as #RRGGBB where each pair of hex digits (00–FF) represents the intensity of red, green, and blue on a 0–255 scale.\n\nFor example, #2563EB means: Red = 0x25 = 37, Green = 0x63 = 99, Blue = 0xEB = 235.\n\nHEX is compact and widely supported. A 3-digit shorthand (#RGB) works when each component has repeated digits: #FF6600 = #F60.\n\n8-digit HEX (#RRGGBBAA) includes an alpha channel for transparency.',
      },
      {
        heading: 'RGB — Direct Numeric Control',
        body: 'RGB writes the three channels as decimal numbers: rgb(37, 99, 235). It is easier to read than HEX for someone not comfortable with hexadecimal.\n\nrgba(37, 99, 235, 0.5) adds an alpha value (0.0 = transparent, 1.0 = opaque) for semi-transparency.\n\nRGB is useful when generating colors programmatically since the channel values are direct integers.',
      },
      {
        heading: 'HSL — Designed for Human Intuition',
        body: 'HSL stands for Hue, Saturation, and Lightness. Hue is a degree on the color wheel (0° = red, 120° = green, 240° = blue). Saturation is how vivid the color is (0% = grey, 100% = full color). Lightness is brightness (0% = black, 50% = normal, 100% = white).\n\nHSL is more intuitive for design work. To create a hover state, decrease lightness by 10%. To desaturate a color, lower saturation. These adjustments are obvious in HSL but not in HEX.',
      },
      {
        heading: 'OKLCH — The Modern Successor',
        body: 'OKLCH is a perceptually uniform color space supported in modern CSS. "Perceptually uniform" means that equal numerical changes in lightness produce equal perceived brightness changes across all hues — something HSL does not guarantee.\n\nFor design systems and accessible color scales, OKLCH gives more predictable results than HSL. It is supported in CSS Color Module 4.',
      },
    ],
    examples: [
      {
        title: 'Same color, four formats',
        description: 'Electric Blue: #2563EB = rgb(37, 99, 235) = hsl(221, 83%, 53%) = oklch(56%, 0.23, 264°). All four values describe exactly the same color.',
      },
    ],
    faqs: [
      {
        question: 'Which format should I use in CSS?',
        answer:
          'HEX is most common for static colors. HSL is better when you need to derive related colors (lighter, darker, more saturated). OKLCH is the modern choice for design systems. All are valid CSS.',
      },
      {
        question: 'Can I use transparency with HEX?',
        answer:
          'Yes. 8-digit HEX (#RRGGBBAA) includes an alpha value. For example, #2563EBCC sets 80% opacity (CC hex = 204 decimal = 204/255 ≈ 80%).',
      },
    ],
    relatedTools: [
      { slug: 'color-converter', label: 'Color Converter — HEX, RGB, HSL & OKLCH' },
      { slug: 'color-palette-generator', label: 'Color Palette Generator' },
    ],
  },

  // --- Guide 5: How Image Compression Works ---
  {
    slug: 'how-image-compression-works',
    title: 'How Image Compression Works — JPEG, PNG & WebP Explained',
    description: 'Understand how JPEG, PNG, and WebP compress images and how to choose the right format for the web.',
    metaDescription: 'Learn how JPEG, PNG, and WebP image compression works, and when to use each format to balance quality and file size for web images.',
    keywords: ['image compression', 'jpeg vs png', 'webp format', 'lossy vs lossless', 'optimize images for web', 'image formats explained'],
    publishedAt: '2024-02-10',
    isPublished: true,
    intro:
      'Image files on the web need to be small enough to load quickly and clear enough to look good. Three formats handle this trade-off in different ways: JPEG uses lossy compression designed for photographs, PNG uses lossless compression for graphics with sharp edges, and WebP is a modern format that handles both efficiently.',
    sections: [
      {
        heading: 'Lossy vs Lossless Compression',
        body: 'Lossless compression reduces file size without removing any data — the original can be perfectly reconstructed from the compressed file. PNG uses lossless compression.\n\nLossy compression achieves smaller file sizes by permanently discarding data the algorithm determines is least perceptible to the human eye. JPEG and WebP (in lossy mode) use lossy compression. Once compressed, the discarded data cannot be recovered.',
      },
      {
        heading: 'JPEG — Best for Photographs',
        body: 'JPEG (Joint Photographic Experts Group) was designed for photographs with continuous tonal variations. It works by applying the Discrete Cosine Transform (DCT) to blocks of 8×8 pixels, then discarding high-frequency detail.\n\nAt high quality settings (85–95), JPEG files look nearly identical to the original. At lower settings (50–75), compression artifacts — blocky patterns around edges — become visible.\n\nJPEG does not support transparency. Use PNG or WebP when you need a transparent background.',
      },
      {
        heading: 'PNG — Best for Graphics & UI',
        body: 'PNG (Portable Network Graphics) uses DEFLATE lossless compression. Because nothing is discarded, PNG preserves every pixel exactly. This makes it ideal for logos, icons, screenshots, and any image with sharp edges or text.\n\nPNG supports full alpha transparency. However, PNG files are significantly larger than JPEG for photographic content.',
      },
      {
        heading: 'WebP — The Modern Choice',
        body: 'WebP was developed by Google and supports both lossy and lossless compression. Lossy WebP typically produces files 25–35% smaller than equivalent JPEG at similar quality. Lossless WebP is typically 26% smaller than PNG.\n\nWebP also supports transparency (like PNG) and animation (like GIF). It is supported by all modern browsers. For new web projects, WebP is generally the best choice for most images.',
      },
      {
        heading: 'Choosing a Quality Level',
        body: 'For JPEG and lossy WebP, quality is a dial between file size and visual fidelity. A quality setting of 75–85 is a good starting point for most web images — visually excellent and meaningfully smaller than the original. For hero images where quality is critical, 85–92 is reasonable. For thumbnails and secondary images, 60–75 saves significant bandwidth.',
      },
    ],
    examples: [
      {
        title: 'File size comparison for a product photo',
        description: 'A 3000×2000 product photograph: Original TIFF = 17 MB. JPEG at 85% = 1.2 MB. WebP at 75% = 800 KB. The WebP version loads in under 200ms on a typical mobile connection; the TIFF would take over 30 seconds.',
      },
    ],
    notes: [
      'Never re-save a JPEG from another JPEG — each save applies compression again and degrades quality. Always work from the original high-quality source.',
      'SVG is not covered here — it is a vector format (mathematical descriptions of shapes), not a raster pixel format.',
    ],
    faqs: [
      {
        question: 'When should I use PNG instead of JPEG?',
        answer:
          'Use PNG for logos, icons, screenshots, and any image with text or sharp geometric edges. Use JPEG for photographs and images with complex color gradients.',
      },
      {
        question: 'Is WebP safe to use for all users?',
        answer:
          'WebP is supported by Chrome, Edge, Firefox, and Safari (since Safari 14). If you need to support very old browsers, provide a JPEG fallback using the HTML <picture> element.',
      },
      {
        question: 'Does compressing an image make it load faster?',
        answer:
          'Yes — smaller file size means less data to transfer. A 200 KB image loads roughly 5× faster than a 1 MB image on a slow mobile connection.',
      },
    ],
    relatedTools: [
      { slug: 'image-compressor', label: 'Image Compressor' },
      { slug: 'svg-optimizer', label: 'SVG Optimizer & Viewer' },
    ],
  },
];
