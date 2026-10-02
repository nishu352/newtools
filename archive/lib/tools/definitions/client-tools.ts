import { ToolDefinition } from '../types';

export const CLIENT_FOUNDATION_TOOLS: ToolDefinition[] = [
  // 1. JSON Formatter & Validator
  {
    id: 'tool-json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    shortDescription: 'Beautify, validate, minify, and inspect JSON payloads entirely in your browser.',
    description:
      'A fast, client-side JSON formatter and validator. Clean messy JSON, validate syntax with exact error positions, and minify payloads for production use. Zero data leaves your browser.',
    category: 'developer',
    icon: 'Braces',
    keywords: ['json', 'formatter', 'beautifier', 'validator', 'minify', 'prettify', 'parser'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online JSON Formatter & Validator — Fast & 100% Private',
      description:
        'Format, beautify, and validate JSON online. 100% client-side execution ensures your data is never uploaded or logged.',
      keywords: ['json formatter', 'json beautifier', 'json validator', 'online json format', 'private json tools'],
    },
    features: [
      'Prettify with customizable 2-space or 4-space indentation',
      'Minify JSON for compact network payloads',
      'Precise error highlighting with syntax messages',
      'Copy to clipboard with one click',
      '100% client-side: Zero data is transmitted to any server',
    ],
    faqs: [
      {
        question: 'Is my JSON data uploaded to a server?',
        answer:
          'No. This tool runs 100% inside your browser using JavaScript. No network requests are made with your data.',
      },
      {
        question: 'Can this tool validate large JSON files?',
        answer:
          'Yes, it handles large JSON files up to several megabytes smoothly within your browser memory.',
      },
      {
        question: 'What is the difference between Format and Minify?',
        answer:
          'Format (beautify) adds readable indentation and line breaks. Minify removes all whitespace to produce the smallest possible JSON string — useful for API payloads and storage.',
      },
      {
        question: 'Does the validator show where an error is?',
        answer:
          'Yes. If your JSON contains a syntax error, the tool shows the exact position (line and column) of the problem.',
      },
    ],
    content: {
      intro:
        'Paste any JSON string — from an API response, config file, or log — and instantly format it into readable, indented output or compact it for production use.',
      useCases:
        'JSON Formatter is useful when you receive a minified API response and need to inspect its structure, when you want to catch a syntax error before deploying a config file, or when you need to minify a payload to reduce bandwidth.',
      howToUse: [
        { step: 1, title: 'Paste your JSON', description: 'Paste the JSON string into the input panel on the left.' },
        { step: 2, title: 'Choose an action', description: 'Click "Format" to beautify with indentation, or "Minify" to compact into a single line.' },
        { step: 3, title: 'Copy the result', description: 'Click "Copy" to put the output on your clipboard, or use the download button for larger payloads.' },
      ],
      examples: [
        {
          title: 'Format a minified API response',
          input: '{"user":{"id":1,"name":"Alice","roles":["admin","editor"]}}',
          output: '{\n  "user": {\n    "id": 1,\n    "name": "Alice",\n    "roles": [\n      "admin",\n      "editor"\n    ]\n  }\n}',
          description: 'A minified JSON object becomes readable with 2-space indentation.',
        },
      ],
      notes: [
        'JSON requires double quotes for all keys and string values — single quotes are not valid.',
        'Trailing commas and comments are not part of the JSON standard and will cause validation errors.',
        'Very large inputs (tens of MB) may be slow — the browser has to parse the entire string in memory.',
      ],
      limitations: [
        'Cannot handle binary content or non-UTF-8 encoded files.',
        'Does not validate against a JSON Schema — it validates JSON syntax only.',
      ],
    },
    relatedToolSlugs: ['yaml-to-json', 'json-to-yaml', 'base64-converter', 'sql-formatter'],
    relatedGuideSlug: 'json-formatting-explained',
  },

  // 2. Base64 Encoder & Decoder
  {
    id: 'tool-base64-converter',
    slug: 'base64-converter',
    name: 'Base64 Encoder & Decoder',
    shortDescription: 'Encode plain text to Base64 or decode Base64 strings to UTF-8 text in real time.',
    description:
      'Instantly convert plain text into Base64 format or decode Base64 strings back to readable UTF-8 text. Includes standard and RFC 4648 URL-safe formatting options.',
    category: 'developer',
    icon: 'Binary',
    keywords: ['base64', 'encoder', 'decoder', 'url safe base64', 'utf8', 'binary'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Base64 Encoder & Decoder — 100% Private In-Browser Tool',
      description:
        'Encode and decode Base64 strings in real time. Works offline in your browser with zero data storage.',
      keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'url safe base64'],
    },
    features: [
      'Bidirectional encoding and decoding',
      'Supports standard Base64 and RFC 4648 URL-safe Base64',
      'Instant live translation as you type',
      'Clean invalid character detection',
      'Zero server upload: Runs strictly in your browser',
    ],
    faqs: [
      {
        question: 'Is Base64 encryption?',
        answer:
          'No. Base64 is an encoding scheme, not encryption. It transforms binary data into printable ASCII characters. Anyone with the encoded string can decode it.',
      },
      {
        question: 'What is URL-safe Base64?',
        answer:
          'Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 (RFC 4648) replaces + with - and / with _ so the encoded string can be safely used in query parameters.',
      },
      {
        question: 'Why does my decoded output look garbled?',
        answer:
          'The input was probably encoded from binary data (an image or file), not text. Base64 decoding of binary produces unreadable byte sequences when displayed as UTF-8.',
      },
    ],
    content: {
      intro:
        'Base64 encoding converts binary data or text into a set of 64 printable ASCII characters. This tool encodes and decodes instantly as you type — no server involved.',
      useCases:
        'Base64 is used to include binary content (images, certificates) in JSON or XML, to embed fonts in CSS, to pass data in email headers, and to encode API tokens for Basic Auth headers.',
      howToUse: [
        { step: 1, title: 'Choose direction', description: 'Select "Encode" to turn text into Base64, or "Decode" to convert Base64 back to text.' },
        { step: 2, title: 'Type or paste input', description: 'Enter your text or Base64 string in the input box.' },
        { step: 3, title: 'Copy the output', description: 'The result updates live. Click "Copy" to use it.' },
      ],
      examples: [
        {
          title: 'Encode a Basic Auth credential',
          input: 'username:password',
          output: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
          description: 'HTTP Basic Auth headers use Base64 to encode "username:password". The result is set in the Authorization header as "Basic dXNlcm5hbWU6cGFzc3dvcmQ=".',
        },
      ],
      notes: [
        'Base64 increases data size by approximately 33% compared to the original.',
        'The = characters at the end are padding to make the output length a multiple of 4.',
      ],
      limitations: [
        'This tool encodes and decodes text only. Binary file encoding (images, PDFs) is not supported.',
        'Very long strings may wrap in the output box — the actual string has no line breaks.',
      ],
    },
    relatedToolSlugs: ['url-encoder-decoder', 'hash-generator', 'json-formatter'],
    relatedGuideSlug: 'what-is-base64',
  },

  // 3. Word & Text Counter
  {
    id: 'tool-word-counter',
    slug: 'word-counter',
    name: 'Word & Text Counter',
    shortDescription: 'Real-time word, character, sentence, paragraph, and reading time statistics.',
    description:
      'Detailed real-time text analysis tool. Count words, characters (with and without spaces), sentences, paragraphs, and calculate estimated reading and speaking times.',
    category: 'text-content',
    icon: 'FileText',
    keywords: ['word counter', 'character counter', 'reading time', 'text statistics', 'sentence counter'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online Word & Character Counter — Real-Time Text Statistics',
      description:
        'Analyze your text with instant counts for words, characters, sentences, paragraphs, and reading time. Fully private and browser-based.',
      keywords: ['word count', 'character count', 'reading time calculator', 'text analyzer'],
    },
    features: [
      'Live counts updated instantaneously as you type',
      'Characters with and without whitespace',
      'Average reading and speaking time estimations',
      'Sentence and paragraph counters',
      'Quick case transformation helpers',
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer:
          'Reading time is estimated at 200 words per minute, which is a common average for adult silent reading. Speaking time uses 130 words per minute.',
      },
      {
        question: 'Does the character count include spaces?',
        answer:
          'Both counts are shown: characters with spaces and characters without spaces. Use the one that matches your requirement (e.g., Twitter counts with spaces, some limits count without).',
      },
    ],
    content: {
      intro:
        'Paste an essay, article, or any text and get an instant breakdown: word count, character count, sentence count, paragraphs, and estimated reading time.',
      howToUse: [
        { step: 1, title: 'Paste or type text', description: 'Enter your content in the text area.' },
        { step: 2, title: 'Read the statistics', description: 'All counts update instantly. No button press needed.' },
      ],
      examples: [
        {
          title: 'Blog post estimate',
          description: 'A 1,000-word blog post takes roughly 5 minutes to read at average reading speed and about 7–8 minutes to read aloud.',
        },
      ],
      notes: [
        'Reading speed varies significantly between individuals. The 200 wpm estimate is for informational content, not technical documentation.',
        'Sentences are detected by period, exclamation mark, or question mark followed by a space.',
      ],
    },
    relatedToolSlugs: ['case-converter', 'duplicate-line-remover', 'text-diff'],
  },

  // 4. UUID Generator
  {
    id: 'tool-uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    shortDescription: 'Generate cryptographically secure RFC 4122 Version 4 UUIDs in bulk.',
    description:
      'Generate cryptographically secure v4 UUIDs directly in your browser using the native Web Crypto API. Support for bulk generation, uppercase format, and hyphen stripping.',
    category: 'developer',
    icon: 'KeyRound',
    keywords: ['uuid', 'guid', 'v4 uuid', 'random generator', 'crypto uuid', 'unique id'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online UUID / GUID v4 Generator — Bulk & Cryptographically Secure',
      description:
        'Generate secure RFC 4122 v4 UUIDs individually or in bulk. 100% browser-based with zero network transmission.',
      keywords: ['uuid generator', 'guid generator', 'v4 uuid online', 'bulk uuid generator'],
    },
    features: [
      'Cryptographically secure generation via Web Crypto API',
      'Bulk generation up to 100 UUIDs per click',
      'Uppercase and lowercase hex options',
      'Optional hyphen removal for compact alphanumeric IDs',
      'Single-item and bulk copy-to-clipboard functionality',
    ],
    faqs: [
      {
        question: 'Are these UUIDs cryptographically secure?',
        answer:
          'Yes. They use the browser\'s native crypto.randomUUID() or crypto.getRandomValues() API, conforming to RFC 4122 v4.',
      },
      {
        question: 'Can two generated UUIDs ever be identical?',
        answer:
          'The probability of a collision is approximately 1 in 2^122 — effectively zero for any practical use case. UUID v4 is safe to use as a unique identifier without a central authority.',
      },
      {
        question: 'What is the difference between UUID and GUID?',
        answer:
          'They are functionally identical. UUID (Universally Unique Identifier) is the formal name from RFC 4122. GUID (Globally Unique Identifier) is Microsoft\'s term for the same concept.',
      },
    ],
    content: {
      intro:
        'A UUID v4 is a 128-bit identifier generated from random numbers. This tool uses your browser\'s cryptographic random number generator — no server call needed.',
      howToUse: [
        { step: 1, title: 'Set quantity', description: 'Choose how many UUIDs to generate (1–100).' },
        { step: 2, title: 'Choose format', description: 'Pick lowercase or uppercase, with or without hyphens.' },
        { step: 3, title: 'Generate & copy', description: 'Click Generate, then copy individual UUIDs or all at once.' },
      ],
      examples: [
        {
          title: 'Standard UUID v4',
          output: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          description: 'Standard hyphenated lowercase UUID v4 — the most common format for database primary keys and REST API identifiers.',
        },
      ],
      notes: [
        'UUID v4 identifiers are random, not based on time or machine identity.',
        'Version 4 (random) UUIDs are the most widely supported format. Other versions (v1 time-based, v5 name-based) are not supported by this tool.',
      ],
    },
    relatedToolSlugs: ['hash-generator', 'url-encoder-decoder', 'base64-converter'],
  },

  // 5. URL Encoder / Decoder
  {
    id: 'tool-url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    shortDescription: 'Encode and decode URI components and query strings compliant with RFC 3986.',
    description:
      'Convert query strings, special characters, and parameters into percent-encoded URI strings or decode encoded URLs back to readable text in real time.',
    category: 'developer',
    icon: 'Link',
    keywords: ['url encode', 'url decode', 'uri component', 'percent encoding', 'query encoder'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online URL Encoder & Decoder — RFC 3986 Compliant',
      description:
        'Encode and decode query strings and full URLs in real time. Private, browser-side tool with zero server requests.',
      keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component encoder'],
    },
    features: [
      'Component mode (encodeURIComponent) for query parameter values',
      'Full URL mode (encodeURI) preserving protocol and slashes',
      'Instant live bidirectional conversion',
      'Malformed URI sequence error detection',
      'Zero server upload: Runs strictly in your browser',
    ],
    faqs: [
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer:
          'encodeURI encodes a full URL and preserves characters like /, :, and ?. encodeURIComponent encodes a single parameter value and converts /, :, and ? into percent sequences — necessary when the value itself contains those characters.',
      },
      {
        question: 'Why does a space become %20 or +?',
        answer:
          '%20 is the standard percent-encoding for a space in RFC 3986. The + sign is an older HTML form encoding (application/x-www-form-urlencoded) that also represents a space. This tool uses %20.',
      },
    ],
    content: {
      intro:
        'URLs can only contain a limited set of ASCII characters. Special characters — spaces, accented letters, ampersands — must be percent-encoded before use in a URL.',
      howToUse: [
        { step: 1, title: 'Choose mode', description: 'Select "Encode component" for a single query value, or "Encode full URL" for a complete address.' },
        { step: 2, title: 'Paste input', description: 'Enter the text or URL. The result updates instantly.' },
        { step: 3, title: 'Copy and use', description: 'Copy the encoded or decoded string and use it in your application.' },
      ],
      examples: [
        {
          title: 'Encode a search query for a URL',
          input: 'hello world & more',
          output: 'hello%20world%20%26%20more',
          description: 'Spaces become %20 and & becomes %26 so the value can be safely passed as a query parameter.',
        },
      ],
      notes: [
        'Hash (#) and question mark (?) are structural URL characters — encode them only if they are inside a parameter value, not part of the URL structure.',
      ],
    },
    relatedToolSlugs: ['base64-converter', 'hash-generator', 'json-formatter'],
  },

  // 6. Hash Generator
  {
    id: 'tool-hash-generator',
    slug: 'hash-generator',
    name: 'Cryptographic Hash Generator',
    shortDescription: 'Generate SHA-256, SHA-384, and SHA-512 hashes using native Web Crypto.',
    description:
      'Compute cryptographic message digests (SHA-256, SHA-384, SHA-512) directly inside your browser. No strings are ever transmitted over the network.',
    category: 'developer',
    icon: 'Hash',
    keywords: ['hash generator', 'sha256', 'sha384', 'sha512', 'checksum', 'crypto hash'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online SHA-256 / SHA-512 Hash Generator — 100% Private',
      description:
        'Generate SHA-256, SHA-384, and SHA-512 hashes locally with Web Crypto API. Fast, free, and zero data retention.',
      keywords: ['sha256 generator', 'sha512 online', 'crypto hash generator', 'private hash tool'],
    },
    features: [
      'High-performance Web Crypto API (SubtleCrypto) calculation',
      'Simultaneous generation across SHA-256, SHA-384, and SHA-512',
      'Uppercase and lowercase hexadecimal format toggle',
      'One-click copy for individual hash digests',
      '100% private: Never touches server memory',
    ],
    faqs: [
      {
        question: 'Can I reverse a SHA-256 hash to get the original input?',
        answer:
          'No. SHA is a one-way hash function. Given a hash, it is computationally infeasible to recover the original message — that is its security property.',
      },
      {
        question: 'Which algorithm should I use?',
        answer:
          'SHA-256 is the standard for most uses including file checksums, digital signatures, and password storage (when combined with a salt). SHA-512 provides a larger digest and is preferred for high-security contexts.',
      },
      {
        question: 'Is this tool suitable for password hashing?',
        answer:
          'Not directly. Password storage requires a key-stretching function (bcrypt, Argon2, PBKDF2) which adds a cost factor and salt. Plain SHA-256 is too fast for secure password hashing.',
      },
    ],
    content: {
      intro:
        'A cryptographic hash function maps any input to a fixed-size digest. The same input always produces the same hash; any change in the input produces a completely different hash.',
      useCases:
        'Hash generators are used to verify file integrity (compare the SHA-256 of a downloaded file against the official checksum), to fingerprint content, and to sign data in authentication systems.',
      howToUse: [
        { step: 1, title: 'Enter text', description: 'Type or paste the text you want to hash.' },
        { step: 2, title: 'Read the digests', description: 'SHA-256, SHA-384, and SHA-512 outputs appear instantly.' },
        { step: 3, title: 'Copy the hash', description: 'Click the copy icon next to the digest you need.' },
      ],
      examples: [
        {
          title: 'Verify a downloaded file',
          description: 'Run the file contents through SHA-256. If the result matches the checksum published by the software author, the file has not been modified.',
        },
      ],
      notes: [
        'SHA-1 and MD5 are not supported — both have known collision vulnerabilities and should not be used for security purposes.',
      ],
    },
    relatedToolSlugs: ['uuid-generator', 'base64-converter', 'url-encoder-decoder'],
  },

  // 7. Percentage Calculator
  {
    id: 'tool-percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentage values, percentage increase/decrease, and differences.',
    description:
      'Versatile percentage calculation suite. Solve what is X% of Y, find what percentage X is of Y, calculate percentage increases or decreases, and determine percentage differences.',
    category: 'math-calculators',
    icon: 'Percent',
    keywords: ['percentage calculator', 'calculate percent', 'percentage increase', 'percent decrease', 'percent difference'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online Percentage Calculator — Quick Math Utility',
      description:
        'Fast and simple percentage calculator for increases, decreases, fractions, and percentage differences.',
      keywords: ['percentage calculator', 'percent increase calculator', 'percent change', 'math tools'],
    },
    features: [
      'What is X% of Y calculation',
      'X is what percent of Y calculation',
      'Percentage change (increase / decrease) calculation',
      'Percentage difference between two quantities',
      'Live calculation as you type with one-click copy',
    ],
    faqs: [
      {
        question: 'What is 15% of 2,000?',
        answer: '15% of 2,000 is 300. Calculation: 2000 × (15/100) = 300.',
      },
      {
        question: 'How do I calculate a percentage increase?',
        answer:
          'Percentage increase = ((New Value − Old Value) / Old Value) × 100. For example, a price rising from ₹500 to ₹600 is a 20% increase.',
      },
      {
        question: 'What is the difference between percentage change and percentage difference?',
        answer:
          'Percentage change has a clear before and after (direction matters). Percentage difference compares two values symmetrically — it has no direction.',
      },
    ],
    content: {
      intro:
        'This calculator covers the four most common percentage problems: finding a percentage of a number, finding what percentage one number is of another, calculating percentage change, and comparing percentage difference.',
      howToUse: [
        { step: 1, title: 'Choose the calculation type', description: 'Select the tab that matches your question (e.g., "What is X% of Y?").' },
        { step: 2, title: 'Enter the values', description: 'Fill in the known numbers.' },
        { step: 3, title: 'Read the result', description: 'The answer updates immediately.' },
      ],
      examples: [
        {
          title: 'Calculate a discount',
          description: 'A product costs ₹2,000 and is discounted by 15%. Enter 15 and 2000 in the "X% of Y" tab. Result: ₹300 discount, ₹1,700 sale price.',
        },
        {
          title: 'Calculate a percentage increase',
          description: 'Your salary was ₹50,000 and is now ₹58,000. Enter 50000 as old value and 58000 as new value. Result: 16% increase.',
        },
      ],
    },
    relatedToolSlugs: ['discount-calculator', 'average-calculator', 'emi-calculator'],
  },

  // 8. Average Calculator
  {
    id: 'tool-average-calculator',
    slug: 'average-calculator',
    name: 'Average & Statistics Calculator',
    shortDescription: 'Calculate mean, median, sum, count, min, max, and range from numbers.',
    description:
      'Enter numbers separated by commas, spaces, or lines to instantly calculate average (mean), median, total sum, minimum, maximum, count, and mathematical range.',
    category: 'math-calculators',
    icon: 'Calculator',
    keywords: ['average calculator', 'mean calculator', 'median', 'statistics calculator', 'sum calculator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Average & Median Calculator — Instant Statistics',
      description:
        'Calculate mean, median, sum, min, max, and range from any list of numbers. Fast, private, and flexible formatting.',
      keywords: ['average calculator', 'mean median calculator', 'calculate average', 'math statistics'],
    },
    features: [
      'Computes Mean (Arithmetic Average) and Median',
      'Calculates Sum, Count, Minimum, Maximum, and Range',
      'Accepts commas, newlines, tabs, and spaces as separators',
      'Supports negative values and floating-point decimals',
      'Flags non-numeric tokens without interrupting calculations',
    ],
    faqs: [
      {
        question: 'What is the difference between mean and median?',
        answer:
          'The mean is the sum of all values divided by the count. The median is the middle value when values are sorted. Median is less affected by outliers — for example, a salary dataset with one very high earner will have a much higher mean than median.',
      },
    ],
    content: {
      intro:
        'Enter a list of numbers separated by commas or newlines and get the mean, median, sum, min, max, and range instantly.',
      examples: [
        {
          title: 'Calculate test score average',
          input: '72, 85, 91, 68, 79',
          description: 'Five test scores. Mean = (72+85+91+68+79) / 5 = 79. Median = 79 (middle value when sorted: 68, 72, 79, 85, 91).',
        },
      ],
    },
    relatedToolSlugs: ['percentage-calculator', 'ratio-calculator', 'compound-interest-calculator'],
  },

  // 9. Ratio Calculator
  {
    id: 'tool-ratio-calculator',
    slug: 'ratio-calculator',
    name: 'Ratio & Proportion Calculator',
    shortDescription: 'Simplify ratios using GCD and solve proportions (A : B = C : D).',
    description:
      'Simplify ratios to their lowest terms using the greatest common divisor (GCD) and solve equivalent proportions (A:B = C:D) by finding missing values.',
    category: 'math-calculators',
    icon: 'Scale',
    keywords: ['ratio calculator', 'simplify ratio', 'proportion calculator', 'solve ratio', 'equivalent ratio'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Ratio & Proportion Calculator',
      description:
        'Simplify ratios and solve proportion equations (A:B = C:D) instantly with step-by-step results.',
      keywords: ['ratio calculator', 'simplify ratio', 'solve proportion', 'aspect ratio calculator'],
    },
    features: [
      'Simplify ratios A:B to irreducible lowest terms',
      'Computes Greatest Common Divisor (GCD) and decimal ratio',
      'Solves proportion A:B = C:D for any missing term',
      'Handles integers and floating-point decimals',
    ],
    content: {
      intro: 'Simplify a ratio to its lowest terms, or solve a proportion equation where one value is unknown.',
      examples: [
        {
          title: 'Simplify a screen resolution ratio',
          description: '1920:1080 simplifies to 16:9 (GCD is 120). Useful for determining aspect ratios.',
        },
        {
          title: 'Solve a scaling proportion',
          description: 'A recipe calls for 2:3 of flour to sugar for 4 cups of flour. How much sugar? Solve 2:3 = 4:X → X = 6 cups.',
        },
      ],
    },
    relatedToolSlugs: ['percentage-calculator', 'average-calculator', 'discount-calculator'],
  },

  // 10. Discount Calculator
  {
    id: 'tool-discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount & Sale Calculator',
    shortDescription: 'Calculate discounted price, total savings, and post-discount sales tax.',
    description:
      'Easily calculate sale prices and dollar savings with percentage discounts. Includes optional sales tax addition and quick preset discount buttons.',
    category: 'finance',
    icon: 'Tag',
    keywords: ['discount calculator', 'sale calculator', 'percent off', 'shopping calculator', 'savings calculator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Discount & Sale Calculator — Savings & Tax',
      description:
        'Calculate sale prices, percentage discounts, and final totals with tax. Quick presets for instant shopping math.',
      keywords: ['discount calculator', 'percent off calculator', 'sale price calculator'],
    },
    features: [
      'Calculates final discounted price and exact dollar savings',
      'Optional sales tax calculation applied after discount',
      'Quick discount presets (10%, 20%, 25%, 50%, etc.)',
      'Clear breakdown of pre-tax and total amounts',
    ],
    faqs: [
      {
        question: 'Does tax apply before or after the discount?',
        answer:
          'Tax is applied to the price after the discount. So a ₹1,000 item with 10% off and 18% tax: discounted price = ₹900, tax = ₹162, total = ₹1,062.',
      },
    ],
    content: {
      intro: 'Calculate the final price after a percentage discount, with optional tax included in the total.',
      examples: [
        {
          title: 'Product discount with tax',
          description: 'A jacket costs ₹3,500 and is 20% off. Discount = ₹700. Sale price = ₹2,800. With 18% GST, total = ₹3,304.',
        },
      ],
    },
    relatedToolSlugs: ['percentage-calculator', 'emi-calculator', 'compound-interest-calculator'],
  },

  // 11. Case Converter
  {
    id: 'tool-case-converter',
    slug: 'case-converter',
    name: 'Text Case Converter',
    shortDescription: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    description:
      'Transform text instantly into 9 standard capitalization formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.',
    category: 'text-content',
    icon: 'Type',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake case', 'kebab case'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Case Converter — UPPERCASE, camelCase, snake_case',
      description:
        'Convert text to uppercase, lowercase, title case, camelCase, snake_case, and kebab-case. Fast and 100% private.',
      keywords: ['case converter', 'camelcase converter', 'title case online', 'snake case converter'],
    },
    features: [
      'Supports 9 standard programming and typography cases',
      'Preserves Unicode and multilingual characters',
      'Live character and word counts',
      'One-click copy of transformed text',
    ],
    faqs: [
      {
        question: 'What is the difference between camelCase and PascalCase?',
        answer:
          'camelCase starts with a lowercase letter (e.g., myVariableName). PascalCase starts every word with uppercase (e.g., MyVariableName). PascalCase is standard for class names; camelCase is common for variable and function names.',
      },
      {
        question: 'When would I use kebab-case?',
        answer:
          'kebab-case (words joined by hyphens) is the standard for CSS class names, HTML attributes, and URL slugs.',
      },
    ],
    content: {
      intro: 'Paste any text and convert it to the case format you need — instantly, without installing anything.',
      examples: [
        {
          title: 'Convert a title to a URL slug',
          input: 'How to Use the JSON Formatter',
          output: 'how-to-use-the-json-formatter',
          description: 'Title text converted to kebab-case is ready to use as a URL slug.',
        },
      ],
    },
    relatedToolSlugs: ['word-counter', 'duplicate-line-remover', 'text-diff'],
  },

  // 12. Duplicate Line Remover
  {
    id: 'tool-duplicate-line-remover',
    slug: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    shortDescription: 'Remove duplicate lines from text lists while preserving original order.',
    description:
      'Clean text lists, log outputs, and data files by eliminating duplicate lines. Features case-sensitivity options, whitespace trimming, and removed count statistics.',
    category: 'text-content',
    icon: 'ListFilter',
    keywords: ['duplicate line remover', 'remove duplicates', 'dedupe lines', 'unique lines', 'clean text'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Duplicate Line Remover — Fast & Private Text Deduplicator',
      description:
        'Remove duplicate lines from text files and lists. Preserves initial order with optional case sensitivity and trimming.',
      keywords: ['duplicate line remover', 'remove duplicate lines', 'deduplicate list online'],
    },
    features: [
      'Preserves initial line occurrence ordering',
      'Case-sensitive or case-insensitive matching toggle',
      'Optional whitespace trimming before comparison',
      'Removes empty lines automatically if enabled',
      'Live comparison metrics: original, unique, and removed count',
    ],
    content: {
      intro: 'Paste a list with repeated lines and get a clean, deduplicated version with original order preserved.',
      examples: [
        {
          title: 'Deduplicate a list of email addresses',
          description: 'Copy a mailing list with duplicates, paste it, and download a clean unique list in seconds.',
        },
      ],
    },
    relatedToolSlugs: ['word-counter', 'case-converter', 'text-diff'],
  },

  // 13. Text Diff
  {
    id: 'tool-text-diff',
    slug: 'text-diff',
    name: 'Text Diff & Comparison Tool',
    shortDescription: 'Compare two text snippets and highlight line-by-line additions and deletions.',
    description:
      'Fast, client-side text diff utility. Compare original and modified text side-by-side with color-coded additions, deletions, and unchanged line highlights.',
    category: 'text-content',
    icon: 'GitCompare',
    keywords: ['text diff', 'compare text', 'diff tool', 'code diff', 'difference checker'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Online Text Diff Tool — Compare Text & Code Privately',
      description:
        'Compare two text documents or code snippets. Clean line-by-line diff highlights additions and deletions locally in browser.',
      keywords: ['text diff', 'compare text online', 'diff checker', 'code comparison'],
    },
    features: [
      'Line-by-line Longest Common Subsequence (LCS) algorithm',
      'Color-coded diff viewer (+ additions, - deletions)',
      'Accurate line numbering for both documents',
      'Summary metrics (+X additions, -Y deletions, Z unchanged)',
      'One-click copy of unified diff report',
    ],
    content: {
      intro: 'Paste two versions of a document — an original and an edited version — and see exactly which lines were added, removed, or unchanged.',
      howToUse: [
        { step: 1, title: 'Paste original', description: 'Enter the original text in the left panel.' },
        { step: 2, title: 'Paste modified', description: 'Enter the updated version in the right panel.' },
        { step: 3, title: 'Compare', description: 'The diff appears below. Green lines were added, red lines were removed.' },
      ],
    },
    relatedToolSlugs: ['word-counter', 'duplicate-line-remover', 'json-formatter'],
  },

  // 14. Image Compressor
  {
    id: 'tool-image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Compress JPEG, PNG, and WebP images locally without uploading them.',
    description:
      'Reduce image file sizes directly in your browser while keeping full control over quality and output format. Images never leave your device.',
    category: 'image',
    icon: 'Sliders',
    keywords: ['image compressor', 'compress image', 'compress png', 'compress jpeg', 'webp converter', 'shrink image'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free In-Browser Image Compressor — Zero Server Uploads',
      description:
        'Compress JPEG, PNG, and WebP images directly in your browser. Fast, private, with adjustable quality and instant preview.',
      keywords: ['image compressor', 'compress images online', 'client side image optimizer', 'compress webp'],
    },
    features: [
      '100% in-browser processing via HTML5 Canvas',
      'Supports JPEG, PNG, and WebP with custom quality control',
      'Proportional dimension resizing to reduce high-res photo sizes',
      'Side-by-side Before/After preview with exact byte reduction stats',
      'One-click download of optimized image files',
    ],
    faqs: [
      {
        question: 'Are my images uploaded to any server?',
        answer:
          'No. All compression and format conversion occurs 100% inside your browser memory using HTML Canvas APIs. Zero bytes are uploaded.',
      },
      {
        question: 'Which image formats are supported?',
        answer: 'You can upload and compress JPEG, PNG, and WebP files, and choose your preferred output format.',
      },
      {
        question: 'What quality setting should I use?',
        answer:
          'For most web images, 75–85% quality provides a good balance between file size and visual fidelity. Drop to 60% for heavy optimization when visual quality is less critical.',
      },
    ],
    content: {
      intro: 'Reduce image file size by adjusting quality and dimensions — all processing happens inside your browser so the image never leaves your device.',
      howToUse: [
        { step: 1, title: 'Select image', description: 'Click to pick a JPEG, PNG, or WebP file from your device.' },
        { step: 2, title: 'Adjust quality', description: 'Use the quality slider (0–100) to set the compression level.' },
        { step: 3, title: 'Download', description: 'Review the before/after sizes, then download the compressed file.' },
      ],
      notes: [
        'PNG uses lossless compression. Quality slider affects JPEG and WebP; PNG files will be re-encoded but not quality-reduced.',
        'Very large images (over 20 MP) may be slow to process in the browser.',
      ],
    },
    relatedToolSlugs: ['svg-optimizer', 'color-converter', 'color-palette-generator'],
    relatedGuideSlug: 'how-image-compression-works',
  },

  // 15. SVG Optimizer / Viewer
  {
    id: 'tool-svg-optimizer',
    slug: 'svg-optimizer',
    name: 'SVG Optimizer & Viewer',
    shortDescription: 'Sanitize, minify, and format SVG markup with safe sandbox preview.',
    description:
      'Clean and optimize SVG vector files by removing editor metadata, comments, and empty attributes. Includes XSS sanitization and sandboxed rendering.',
    category: 'image',
    icon: 'Sparkles',
    keywords: ['svg optimizer', 'svg viewer', 'minify svg', 'clean svg', 'sanitize svg', 'svg formatter'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free SVG Optimizer & Viewer — Sanitize & Minify Vector Code',
      description:
        'Minify, format, and sanitize SVG markup with real-time size reduction stats and safe sandboxed vector preview.',
      keywords: ['svg optimizer', 'minify svg online', 'svg viewer', 'clean svg code'],
    },
    features: [
      'Strips XML prologs, DOCTYPEs, comments, and editor namespaces',
      'Automatic XSS sanitization removing malicious scripts and event handlers',
      'Safe isolated preview rendered in a sandboxed iframe',
      'Format/beautify mode with 2-space indentation',
      'Real-time byte reduction metrics and one-click download',
    ],
    content: {
      intro: 'SVG files exported from design tools (Illustrator, Figma, Inkscape) often include metadata, comments, and namespace declarations you do not need on the web. This tool strips that overhead and previews the clean result.',
      notes: [
        'SVG sanitization removes event handlers (onload, onclick) and script tags — these are vectors for XSS attacks when rendering user-supplied SVG.',
      ],
    },
    relatedToolSlugs: ['image-compressor', 'color-converter', 'color-palette-generator'],
  },

  // 16. Color Converter
  {
    id: 'tool-color-converter',
    slug: 'color-converter',
    name: 'Color Converter',
    shortDescription: 'Convert colors between HEX, RGB, HSL, and OKLCH with live preview.',
    description:
      'Enter any color in HEX, RGB, HSL, or OKLCH and get synchronized values across all formats. Features alpha transparency and WCAG contrast check.',
    category: 'developer',
    icon: 'Pipette',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'oklch converter', 'color picker'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Online Color Converter — HEX, RGB, HSL & OKLCH',
      description:
        'Convert colors instantly between HEX, RGB, HSL, and modern OKLCH color spaces. Accurate CSS Color Module 4 math.',
      keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'oklch to hex', 'css color converter'],
    },
    features: [
      'Bidirectional conversion between HEX, RGB, HSL, and OKLCH',
      'Supports 3, 4, 6, and 8-digit HEX with alpha channels',
      'Accurate CIE XYZ D65 and Oklab matrix calculations',
      'WCAG 2.1 relative luminance and contrast text suggestion',
      'One-click copy for all CSS color strings',
    ],
    faqs: [
      {
        question: 'When should I use HSL instead of HEX?',
        answer:
          'HSL (Hue, Saturation, Lightness) is easier to manipulate programmatically. Adjusting the L value makes a color lighter or darker without changing the hue — useful for hover states and tints.',
      },
      {
        question: 'What is OKLCH?',
        answer:
          'OKLCH is a perceptually uniform color space introduced in CSS Color Module 4. Changing the lightness in OKLCH keeps perceived brightness consistent across hues, unlike HSL.',
      },
    ],
    content: {
      intro: 'Enter a color in any format — HEX, RGB, HSL, or OKLCH — and get the equivalent values for all other formats instantly.',
      examples: [
        {
          title: 'Convert a brand color to all CSS formats',
          input: '#2563EB',
          description: 'The Electric Blue from OmniTools\'s design system: RGB(37, 99, 235), HSL(221°, 83%, 53%), OKLCH(56%, 0.23, 264°).',
        },
      ],
    },
    relatedToolSlugs: ['color-palette-generator', 'image-compressor', 'svg-optimizer'],
    relatedGuideSlug: 'hex-rgb-hsl-explained',
  },

  // 17. Color Palette Generator
  {
    id: 'tool-color-palette-generator',
    slug: 'color-palette-generator',
    name: 'Color Palette Generator',
    shortDescription: 'Generate harmonious color palettes using classic color theory rules.',
    description:
      'Create deterministic color schemes from any base color: complementary, analogous, split-complementary, triadic, and tints & shades.',
    category: 'developer',
    icon: 'Palette',
    keywords: ['color palette generator', 'color schemes', 'complementary colors', 'analogous colors', 'triadic palette'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Color Palette Generator — Harmonies, Tints & Shades',
      description:
        'Generate design palettes using color theory: complementary, analogous, triadic, and monochromatic shades. Copy single colors or full palette.',
      keywords: ['color palette generator', 'color harmony tool', 'palette creator', 'tints and shades'],
    },
    features: [
      'Deterministic color harmonies: Complementary, Analogous, Split-Comp, Triadic',
      'Lightness gradient tints and shades generator',
      'Light vs Dark background preview toggle',
      'Individual HEX/RGB/HSL copy and bulk palette export',
      'Random color generator and quick starting presets',
    ],
    content: {
      intro: 'Pick a base color and generate a complete color palette based on color theory — complementary, analogous, triadic, or monochromatic tints and shades.',
    },
    relatedToolSlugs: ['color-converter', 'image-compressor', 'svg-optimizer'],
    relatedGuideSlug: 'hex-rgb-hsl-explained',
  },

  // 18. EMI & Loan Calculator
  {
    id: 'tool-emi-calculator',
    slug: 'emi-calculator',
    name: 'EMI & Loan Amortization Calculator',
    shortDescription: 'Calculate monthly loan installments, total interest, and amortization schedule.',
    description:
      'Estimate monthly payments for home, auto, or personal loans. Visual breakdown of principal vs interest, optional prepayment savings, and month-by-month schedule.',
    category: 'finance',
    icon: 'PiggyBank',
    keywords: ['emi calculator', 'loan calculator', 'amortization schedule', 'mortgage calculator', 'loan repayment'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Loan & EMI Calculator — Monthly Amortization Schedule',
      description:
        'Calculate monthly EMI payments, total interest payable, and full loan amortization schedule. Includes prepayment simulator.',
      keywords: ['emi calculator', 'loan amortization calculator', 'monthly loan payment', 'mortgage payment calculator'],
    },
    features: [
      'Accurate standard compound loan amortization math',
      'Handles zero-interest promotional loans cleanly',
      'Prepayment simulator showing total interest saved and reduced tenure',
      'Visual proportional breakdown bar (Principal vs Interest)',
      'Paginated month-by-month balance and payment schedule',
    ],
    faqs: [
      {
        question: 'Does this calculator include processing fees or insurance?',
        answer:
          'No. It calculates the standard EMI from principal, interest rate, and tenure only. Processing fees, insurance, and prepayment charges are set by your lender and are not included.',
      },
      {
        question: 'What loan types can this calculate?',
        answer:
          'Any loan that uses standard reducing-balance EMI: home loans, car loans, personal loans, and education loans. It does not model flat-rate interest or step-up EMI products.',
      },
      {
        question: 'How accurate is the calculator?',
        answer:
          'The math is precise — it uses the standard amortization formula. However, actual loan terms depend on your lender\'s rounding, fees, and specific agreement.',
      },
      {
        question: 'What is a prepayment and how does it reduce EMI?',
        answer:
          'A prepayment is an extra lump-sum payment made towards the principal. It reduces the outstanding balance, which in turn reduces the total interest paid and either lowers the remaining tenure or the monthly EMI.',
      },
    ],
    content: {
      intro:
        'Calculate the monthly payment for any loan using the standard EMI formula. Enter the loan amount, interest rate, and tenure to see the full payment schedule.',
      formula: 'EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)',
      formulaVars: [
        { variable: 'P', meaning: 'Principal loan amount' },
        { variable: 'r', meaning: 'Monthly interest rate (annual rate ÷ 12 ÷ 100)' },
        { variable: 'n', meaning: 'Total number of monthly installments (years × 12)' },
      ],
      howToUse: [
        { step: 1, title: 'Enter loan amount', description: 'The total amount you are borrowing.' },
        { step: 2, title: 'Enter annual interest rate', description: 'The rate quoted by your lender per year (e.g., 8.5).' },
        { step: 3, title: 'Enter tenure', description: 'Loan duration in years or months.' },
        { step: 4, title: 'View results', description: 'See the monthly EMI, total amount payable, and total interest. Scroll down for the full month-by-month schedule.' },
      ],
      examples: [
        {
          title: 'Home loan estimate',
          description: 'Loan: ₹40,00,000 at 8.5% p.a. for 20 years. Monthly EMI: ₹34,729. Total interest: ₹43,34,960. Total payable: ₹83,34,960.',
        },
        {
          title: 'Car loan estimate',
          description: 'Loan: ₹8,00,000 at 9% p.a. for 5 years. Monthly EMI: ₹16,607. Total interest: ₹1,96,420. Total payable: ₹9,96,420.',
        },
      ],
      notes: [
        'This is a planning estimate. Actual EMI from your lender may differ due to rounding, processing fees, or different calculation conventions.',
        'The calculator assumes a fixed interest rate throughout the tenure. Variable-rate loans will have different actual payment schedules.',
      ],
      limitations: [
        'Does not model balloon payments, step-up EMIs, or moratorium periods.',
        'Interest calculations use reducing-balance method only.',
        'This calculator provides estimates for general planning. It does not constitute financial advice.',
      ],
    },
    relatedToolSlugs: ['compound-interest-calculator', 'percentage-calculator', 'discount-calculator'],
    relatedGuideSlug: 'how-emi-is-calculated',
  },

  // 19. Compound Interest Calculator
  {
    id: 'tool-compound-interest-calculator',
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    shortDescription: 'Project investment growth with compounding frequencies and regular deposits.',
    description:
      'Forecast long-term savings with daily, monthly, quarterly, or annual compounding. See the impact of recurring deposits on total future balance.',
    category: 'finance',
    icon: 'TrendingUp',
    keywords: ['compound interest calculator', 'investment calculator', 'savings calculator', 'interest calculator', 'wealth growth'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Compound Interest Calculator — Investment Growth Forecast',
      description:
        'Calculate compound interest on savings and investments. Supports annual, monthly, and daily compounding plus recurring contributions.',
      keywords: ['compound interest calculator', 'investment return calculator', 'savings growth calculator'],
    },
    features: [
      'Supports 5 compounding frequencies: annually, semi-annually, quarterly, monthly, daily',
      'Monthly and annual recurring deposit simulations',
      'Visual breakdown of initial principal, total contributions, and interest earned',
      'Year-by-year accumulation and growth table',
      'Zero-interest baseline resilience',
    ],
    faqs: [
      {
        question: 'What is the difference between simple and compound interest?',
        answer:
          'Simple interest is calculated on the principal only. Compound interest is calculated on the principal plus previously accumulated interest — so interest earns interest. Over long periods, the difference is significant.',
      },
      {
        question: 'Does compounding frequency matter?',
        answer:
          'Yes, but less than most people expect. Daily compounding yields slightly more than monthly, which yields slightly more than annually — but the rate itself has a far larger effect than frequency.',
      },
    ],
    content: {
      intro: 'See how an initial investment grows over time when interest compounds on top of itself, and optionally with regular deposits added each period.',
      formula: 'A = P × (1 + r/n)^(n×t)',
      formulaVars: [
        { variable: 'A', meaning: 'Final amount (principal + interest)' },
        { variable: 'P', meaning: 'Principal (initial investment)' },
        { variable: 'r', meaning: 'Annual interest rate (as a decimal, e.g., 0.08 for 8%)' },
        { variable: 'n', meaning: 'Number of compounding periods per year' },
        { variable: 't', meaning: 'Time in years' },
      ],
      examples: [
        {
          title: 'Long-term savings example',
          description: '₹1,00,000 invested at 8% p.a. compounded annually for 20 years grows to ₹4,66,096. The ₹3,66,096 gain is entirely from compound interest — no additional deposits.',
        },
        {
          title: 'Regular SIP-style deposits',
          description: '₹5,000 deposited monthly at 8% p.a. compounded monthly for 15 years: total invested ₹9,00,000, final balance ≈ ₹17,40,000 (estimate).',
        },
      ],
      notes: [
        'Results assume a constant interest rate throughout the investment period. Actual returns from market instruments will vary.',
        'This calculator does not account for taxes on interest income.',
      ],
      limitations: [
        'This calculator provides estimates for general planning purposes. Actual returns depend on the investment product, taxes, fees, and market conditions.',
        'It does not constitute financial advice or a guarantee of returns.',
      ],
    },
    relatedToolSlugs: ['emi-calculator', 'percentage-calculator', 'discount-calculator'],
  },

  // 20. YAML to JSON
  {
    id: 'tool-yaml-to-json',
    slug: 'yaml-to-json',
    name: 'YAML to JSON Converter',
    shortDescription: 'Convert YAML configuration documents into formatted JSON syntax.',
    description:
      'Safely parse and convert YAML documents into structured JSON with adjustable indentation, syntax error detection, and file download.',
    category: 'developer',
    icon: 'Code2',
    keywords: ['yaml to json', 'convert yaml to json', 'yaml parser', 'yaml converter'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free YAML to JSON Converter — Fast & Private In-Browser Tool',
      description:
        'Convert YAML to formatted JSON directly in your browser. Real-time syntax validation, customizable indentation, and one-click download.',
      keywords: ['yaml to json', 'convert yaml to json online', 'yaml json converter'],
    },
    features: [
      'Strict YAML 1.2 parsing via standard YAML engine',
      'Detailed syntax error reporting with line and column indicators',
      'Adjustable JSON indentation (2 spaces or 4 spaces)',
      'One-click copy and .json file export',
      'Completely client-side; your configuration files are never sent to a server',
    ],
    content: {
      intro: 'Paste a YAML document — a Kubernetes manifest, GitHub Actions workflow, or application config — and convert it to formatted JSON.',
    },
    relatedToolSlugs: ['json-to-yaml', 'json-formatter', 'sql-formatter'],
  },

  // 21. JSON to YAML
  {
    id: 'tool-json-to-yaml',
    slug: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    shortDescription: 'Convert JSON data structures into clean YAML documents.',
    description:
      'Transform JSON objects and arrays into clean, human-readable YAML documents. Features instant error pinpointing, copy, and download.',
    category: 'developer',
    icon: 'Code2',
    keywords: ['json to yaml', 'convert json to yaml', 'json converter', 'json to yml'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free JSON to YAML Converter — Fast & Private In-Browser Tool',
      description:
        'Convert JSON data into clean YAML documents in your browser. Syntax error detection, copy to clipboard, and instant download.',
      keywords: ['json to yaml', 'convert json to yaml online', 'json yaml converter'],
    },
    features: [
      'Standard JSON parsing with error position pointers',
      'Outputs clean, indented YAML 1.2 format',
      'Sample JSON loader for instant evaluation',
      'One-click copy and .yaml file download',
      '100% private in-browser memory execution',
    ],
    content: {
      intro: 'Paste a JSON object and get a clean YAML document ready for use in configuration files.',
    },
    relatedToolSlugs: ['yaml-to-json', 'json-formatter', 'sql-formatter'],
  },

  // 22. SQL Query Formatter
  {
    id: 'tool-sql-formatter',
    slug: 'sql-formatter',
    name: 'SQL Query Formatter',
    shortDescription: 'Format and beautify SQL queries with standard indentation and uppercase keywords.',
    description:
      'Make complex SQL queries readable. Formats SELECT, JOIN, WHERE, GROUP BY, subqueries, and statements with clean indentation, or minify into a single line.',
    category: 'developer',
    icon: 'Database',
    keywords: ['sql formatter', 'format sql', 'beautify sql', 'sql minifier', 'sql query formatter', 'clean sql'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free SQL Query Formatter & Minifier — Clean, Private SQL Beautifier',
      description:
        'Format and beautify SQL queries with consistent indentation and uppercase keywords. Client-side processing with zero database connection.',
      keywords: ['sql formatter', 'format sql online', 'beautify sql', 'sql query cleaner'],
    },
    features: [
      'Standardized keyword capitalization (SELECT, FROM, WHERE, JOIN, GROUP BY...)',
      'Subquery indentation and nested parentheses alignment',
      'Single-line minification mode that strips comments and collapses whitespace',
      'Live character and line counter metrics',
      'Strictly inert client-side text processing with zero database execution',
    ],
    faqs: [
      {
        question: 'Does this tool connect to a database?',
        answer:
          'No. This is a text formatter — it processes the SQL string only. No database connection is made. Your queries are not executed.',
      },
      {
        question: 'What SQL dialects are supported?',
        answer:
          'The formatter handles standard SQL keywords (SELECT, INSERT, UPDATE, DELETE, JOIN, etc.) and works with most relational databases. Dialect-specific functions (e.g., ISNULL vs COALESCE) are preserved as-is.',
      },
    ],
    content: {
      intro: 'Paste a SQL query and format it with consistent indentation, uppercase keywords, and readable line breaks — or compact it to a single line.',
      examples: [
        {
          title: 'Format a multi-join query',
          description: 'A dense one-liner SELECT with three JOINs and a WHERE clause becomes clearly indented with each clause on its own line.',
        },
      ],
    },
    relatedToolSlugs: ['json-formatter', 'yaml-to-json', 'json-to-yaml'],
  },
];
