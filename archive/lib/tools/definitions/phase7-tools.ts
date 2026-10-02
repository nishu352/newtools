import { ToolDefinition } from '../types';

export const PHASE7_TOOLS: ToolDefinition[] = [
  // ==========================================
  // TEXT TOOLS
  // ==========================================
  {
    id: 'tool-sort-lines',
    slug: 'sort-lines',
    name: 'Sort Lines',
    shortDescription: 'Sort lists and text lines alphabetically (A-Z, Z-A) or by string length directly in your browser.',
    description:
      'Fast client-side line sorting tool. Sort text alphabetically, numerically, in reverse order, or by line length with case-sensitivity options.',
    category: 'text-content',
    icon: 'ListFilter',
    keywords: ['sort lines', 'alphabetize text', 'sort text a to z', 'line sorter', 'text order'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Line Sorter — Sort Text Alphabetically or by Length',
      description: 'Sort text lines A to Z, Z to A, by length, or natural order in your browser. 100% private with zero server uploads.',
      keywords: ['sort lines', 'alphabetize lines', 'sort list online', 'free text sorter'],
    },
    features: [
      'Alphabetical (A-Z and Z-A) sorting',
      'Sort by line length (shortest to longest and vice versa)',
      'Optional case-sensitive sorting',
      'Instant client-side processing with one-click copy',
    ],
    faqs: [
      {
        question: 'Does this tool upload my text to a server?',
        answer: 'No. Sorting is performed entirely in your browser using pure JavaScript.',
      },
      {
        question: 'Can I sort lines by their character length?',
        answer: 'Yes, select the "By Length" option in the sort menu.',
      },
    ],
    content: {
      intro: 'Quickly organize messy lists and text files into ordered alphabetical or length-based lines.',
      useCases: 'Ideal for organizing CSV lists, keywords, names, code imports, and inventory lists.',
      howToUse: [
        { step: 1, title: 'Enter Text', description: 'Paste or type lines of text into the input field.' },
        { step: 2, title: 'Choose Order', description: 'Select A-Z, Z-A, or Length-based sorting.' },
        { step: 3, title: 'Copy Result', description: 'Copy the sorted text to your clipboard.' },
      ],
      notes: ['Empty lines will be placed according to standard sort orders.'],
      limitations: ['Extremely large text files exceeding 20MB may take a fraction of a second to render.'],
    },
    relatedToolSlugs: ['duplicate-line-remover', 'case-converter', 'word-counter'],
  },
  {
    id: 'tool-reverse-text',
    slug: 'reverse-text',
    name: 'Reverse Text & Lines',
    shortDescription: 'Reverse entire text strings character-by-character or flip lines upside down.',
    description:
      'Easily flip text backwards or reverse line ordering. Great for debugging, linguistic analysis, palindromes, and text manipulation.',
    category: 'text-content',
    icon: 'RotateCw',
    keywords: ['reverse text', 'backwards text', 'flip lines', 'reverse string online', 'mirror text'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Reverse Text & Lines Online — Free String Reverser',
      description: 'Reverse text characters or reverse line order in real-time. Fast, free, and completely client-side.',
      keywords: ['reverse text', 'reverse lines', 'flip text', 'text flipper'],
    },
    features: [
      'Reverse characters inside each word or string',
      'Flip line order from bottom to top',
      'Preserves unicode characters and accents',
      'Zero server retention',
    ],
    faqs: [
      {
        question: 'What is the difference between reversing text and reversing lines?',
        answer: 'Reversing text mirrors each character ("abc" becomes "cba"), while reversing lines flips the vertical order of lines.',
      },
    ],
    content: {
      intro: 'Reverse string characters or invert line order instantly in your browser.',
      useCases: 'Useful for palindrome testing, backwards text generation, and log analysis.',
      howToUse: [
        { step: 1, title: 'Paste Text', description: 'Paste text into the input box.' },
        { step: 2, title: 'Select Mode', description: 'Click Reverse Characters or Reverse Lines.' },
        { step: 3, title: 'Copy', description: 'Copy the mirrored output.' },
      ],
      notes: ['Supports multi-line documents and emojis.'],
      limitations: ['Grapheme clusters with complex combining marks may reverse combining marks.'],
    },
    relatedToolSlugs: ['sort-lines', 'case-converter'],
  },
  {
    id: 'tool-whitespace-cleaner',
    slug: 'whitespace-cleaner',
    name: 'Whitespace Cleaner & Trimmer',
    shortDescription: 'Strip extra spaces, remove empty lines, and trim leading/trailing whitespace.',
    description:
      'Clean up formatted text by stripping redundant whitespace, collapsing multiple consecutive spaces into one, and deleting blank lines.',
    category: 'text-content',
    icon: 'FileText',
    keywords: ['whitespace cleaner', 'remove extra spaces', 'trim text', 'remove blank lines', 'clean text'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Whitespace Cleaner — Remove Extra Spaces & Empty Lines',
      description: 'Clean messy text by stripping duplicate spaces, trailing whitespace, and blank lines in your browser.',
      keywords: ['whitespace cleaner', 'remove blank lines', 'trim lines', 'clean whitespace'],
    },
    features: [
      'Trim leading and trailing line whitespace',
      'Delete empty and whitespace-only lines',
      'Collapse multiple spaces into single space',
      'Real-time line and character difference preview',
    ],
    faqs: [
      {
        question: 'Does this affect tabs and special indentation?',
        answer: 'Trimming removes tabs at line edges, while collapsing spaces converts multiple whitespace into single spaces.',
      },
    ],
    content: {
      intro: 'Clean and standardize messy copied text, email quotes, and formatted documents.',
      useCases: 'Format dirty text pasted from PDFs, spreadsheets, or web pages.',
      howToUse: [
        { step: 1, title: 'Input Text', description: 'Paste unformatted text into the editor.' },
        { step: 2, title: 'Select Cleaners', description: 'Choose Trim, Remove Empty Lines, or Collapse Spaces.' },
        { step: 3, title: 'Copy', description: 'Copy clean, normalized text.' },
      ],
      notes: ['Does not alter the actual character encoding.'],
      limitations: ['Single spaces between words are preserved.'],
    },
    relatedToolSlugs: ['duplicate-line-remover', 'word-counter', 'sort-lines'],
  },
  {
    id: 'tool-line-numbers',
    slug: 'line-numbers',
    name: 'Add / Remove Line Numbers',
    shortDescription: 'Add sequential line numbers with custom prefixes or strip existing line numbers from text.',
    description:
      'Quickly prefix text lines with numbered counters (e.g. 1., 01., #1) or strip line numbers from copied code blocks.',
    category: 'text-content',
    icon: 'ListFilter',
    keywords: ['add line numbers', 'remove line numbers', 'number lines', 'line numbering tool'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Add or Remove Line Numbers Online — Free Text Numbering',
      description: 'Add numbered prefixes or strip line numbers from code snippets and text. 100% private client-side processing.',
      keywords: ['add line numbers', 'remove line numbers', 'line counter', 'number text'],
    },
    features: [
      'Add sequential numbers with custom separators (e.g. 1. or 1:)',
      'Strip leading numbers and dots from copied code snippets',
      'Zero-padding options (01, 02...)',
      'Client-side execution with instantaneous results',
    ],
    faqs: [
      {
        question: 'Can this remove line numbers from copied GitHub code?',
        answer: 'Yes! The "Remove Line Numbers" button detects leading numbers and strips them automatically.',
      },
    ],
    content: {
      intro: 'Easily number lines for legal, academic, or code citations, or strip line numbers from copied code.',
      useCases: 'Adding line references to poems or transcripts, or cleaning code copied from tutorials.',
      howToUse: [
        { step: 1, title: 'Enter Text', description: 'Paste lines of text or code.' },
        { step: 2, title: 'Toggle Mode', description: 'Click Add Line Numbers or Remove Line Numbers.' },
        { step: 3, title: 'Copy', description: 'Copy the transformed text.' },
      ],
      notes: ['Leading whitespace is handled cleanly.'],
      limitations: ['Numbers inside sentences are not affected.'],
    },
    relatedToolSlugs: ['sort-lines', 'whitespace-cleaner'],
  },
  {
    id: 'tool-text-extractor',
    slug: 'text-extractor',
    name: 'Extract Emails, URLs & Numbers',
    shortDescription: 'Instantly extract email addresses, web links, numbers, hashtags, and mentions from text.',
    description:
      'Extract specific entities from unformatted text documents. Parse all email addresses, URLs, phone/decimal numbers, hashtags, and social mentions in one click.',
    category: 'text-content',
    icon: 'Sparkles',
    keywords: ['extract emails', 'extract urls', 'extract numbers', 'regex text extractor', 'email harvester'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Text Entity Extractor — Extract Emails, URLs & Numbers',
      description: 'Extract email addresses, URLs, numbers, hashtags, and @mentions from raw text. Fast and 100% private in-browser tool.',
      keywords: ['extract emails from text', 'extract urls', 'find links in text', 'text extractor'],
    },
    features: [
      'Extract all valid email addresses',
      'Extract HTTP/HTTPS and www URLs',
      'Extract numbers and decimals',
      'Extract #hashtags and @mentions',
      'De-duplicate and copy extracted lists',
    ],
    faqs: [
      {
        question: 'Is my extracted contact or email data stored anywhere?',
        answer: 'Never. OmniTools operates under a strict zero-retention policy. Extraction is computed locally in your browser memory.',
      },
    ],
    content: {
      intro: 'Extract actionable data from messy text dumps, server logs, emails, or social media transcripts.',
      useCases: 'Extracting contact emails from scraped lists, gathering research links, or parsing numeric data.',
      howToUse: [
        { step: 1, title: 'Paste Content', description: 'Paste raw text or log content.' },
        { step: 2, title: 'View Entities', description: 'The tool automatically detects emails, links, and numbers.' },
        { step: 3, title: 'Export', description: 'Click Copy to export the extracted list.' },
      ],
      notes: ['Duplicate entities can be automatically merged.'],
      limitations: ['Obfuscated emails like "user [at] example [dot] com" need manual de-obfuscation.'],
    },
    relatedToolSlugs: ['word-counter', 'duplicate-line-remover', 'sort-lines'],
  },
  {
    id: 'tool-slug-generator',
    slug: 'slug-generator',
    name: 'URL Slug Generator',
    shortDescription: 'Convert article titles and headlines into clean, SEO-friendly URL slugs.',
    description:
      'Generate clean, web-safe URL slugs from headlines, titles, or product names. Removes special characters, converts accents, and handles custom separators.',
    category: 'text-content',
    icon: 'Link',
    keywords: ['slug generator', 'url slug maker', 'seo slug generator', 'string to slug', 'permalink generator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free URL Slug Generator — Create SEO-Friendly Slugs',
      description: 'Convert titles and phrases into clean URL slugs with custom separators. Free, instant, and private.',
      keywords: ['slug generator', 'create url slug', 'seo friendly url generator', 'slugify text'],
    },
    features: [
      'Standard hyphen (-) or underscore (_) separators',
      'Accent and diacritic transliteration (e.g. é → e)',
      'Automatic special character removal',
      'Strict lowercase conversion for URL best practices',
    ],
    faqs: [
      {
        question: 'Why should URL slugs be lowercase?',
        answer: 'Web servers and search engines handle lowercase URLs consistently, preventing duplicate content issues and broken links.',
      },
    ],
    content: {
      intro: 'Create SEO-optimized, human-readable URL slugs for blog posts, documentation, and web pages.',
      useCases: 'Setting up permalinks in WordPress, Next.js, Ghost, or static site generators.',
      howToUse: [
        { step: 1, title: 'Type Title', description: 'Type or paste the article title.' },
        { step: 2, title: 'Configure', description: 'Choose hyphen or underscore separators.' },
        { step: 3, title: 'Copy Slug', description: 'Copy the ready-to-use URL slug.' },
      ],
      notes: ['Trailing and consecutive hyphens are automatically cleaned.'],
      limitations: ['Non-Latin alphabets are transliterated or stripped depending on character set.'],
    },
    relatedToolSlugs: ['case-converter', 'url-encoder-decoder'],
  },
  {
    id: 'tool-lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    shortDescription: 'Generate placeholder dummy text in paragraphs, sentences, or word counts.',
    description:
      'Fast, customizable Lorem Ipsum placeholder text generator for web designers, developers, and graphic artists.',
    category: 'text-content',
    icon: 'Type',
    keywords: ['lorem ipsum generator', 'dummy text generator', 'placeholder text', 'lorem ipsum paragraphs'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Lorem Ipsum Generator — Generate Dummy Placeholder Text',
      description: 'Generate customizable Lorem Ipsum placeholder text by paragraphs, sentences, or word count. Copy in one click.',
      keywords: ['lorem ipsum generator', 'dummy text', 'placeholder generator', 'latin text generator'],
    },
    features: [
      'Generate by paragraphs, sentences, or words',
      'Option to start with standard "Lorem ipsum dolor sit amet..."',
      'Clean typography formatting',
      'One-click clipboard copy',
    ],
    faqs: [
      {
        question: 'What is Lorem Ipsum?',
        answer: 'Lorem Ipsum is standard dummy text used by the printing and typesetting industry since the 1500s.',
      },
    ],
    content: {
      intro: 'Generate realistic placeholder text to prototype layouts without distraction from readable content.',
      useCases: 'Designing mockups, testing font hierarchies, and prototyping UI designs.',
      howToUse: [
        { step: 1, title: 'Choose Quantity', description: 'Select the number of paragraphs or words needed.' },
        { step: 2, title: 'Generate', description: 'Click Generate Dummy Text.' },
        { step: 3, title: 'Copy', description: 'Paste into Figma, web designs, or documents.' },
      ],
      notes: ['No external network requests needed.'],
      limitations: ['Standard pseudo-Latin vocabulary only.'],
    },
    relatedToolSlugs: ['word-counter', 'slug-generator'],
  },

  // ==========================================
  // DEVELOPER TOOLS
  // ==========================================
  {
    id: 'tool-xml-formatter',
    slug: 'xml-formatter',
    name: 'XML Formatter & Validator',
    shortDescription: 'Format, beautify, minify, and validate XML documents in your browser.',
    description:
      'Clean up unformatted XML documents, pretty-print with consistent indentation, compress to single line, and detect syntax errors.',
    category: 'developer',
    icon: 'FileCode',
    keywords: ['xml formatter', 'xml beautifier', 'xml validator', 'format xml online', 'minify xml'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free XML Formatter & Validator — Beautify XML Online',
      description: 'Format, pretty-print, minify, and validate XML documents in real-time. Zero server uploads.',
      keywords: ['xml formatter', 'beautify xml', 'xml validator', 'format xml'],
    },
    features: [
      'Pretty-print XML with 2-space or 4-space indentation',
      'Minify XML into a single compact line',
      'Detect unclosed tags and XML syntax errors',
      'Private client-side processing',
    ],
    faqs: [
      {
        question: 'Does this tool validate XML syntax?',
        answer: 'Yes, it checks tag opening and closing hierarchy and reports parser syntax errors.',
      },
    ],
    content: {
      intro: 'Beautify messy XML payloads, SOAP responses, and configuration files.',
      useCases: 'Debugging API payloads, reading RSS feeds, and formatting XML sitemaps.',
      howToUse: [
        { step: 1, title: 'Paste XML', description: 'Paste unformatted XML into the editor.' },
        { step: 2, title: 'Format or Minify', description: 'Click Format to indent or Minify to compress.' },
        { step: 3, title: 'Copy', description: 'Copy the valid XML result.' },
      ],
      notes: ['Supports CDATA and XML namespaces.'],
      limitations: ['Does not perform external DTD or XSD schema validation over HTTP.'],
    },
    relatedToolSlugs: ['json-formatter', 'html-formatter', 'yaml-to-json'],
  },
  {
    id: 'tool-html-formatter',
    slug: 'html-formatter',
    name: 'HTML Formatter & Minifier',
    shortDescription: 'Beautify messy HTML markup or minify into compact production code.',
    description:
      'Indent, format, and minify HTML templates and snippets. Includes entity encoding and decoding utilities.',
    category: 'developer',
    icon: 'Code2',
    keywords: ['html formatter', 'html beautifier', 'html minifier', 'format html online', 'pretty print html'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free HTML Formatter & Minifier — Beautify HTML Markup',
      description: 'Format, pretty-print, and minify HTML code in your browser. Clean indentation and entity encoding.',
      keywords: ['html formatter', 'beautify html', 'minify html', 'clean html markup'],
    },
    features: [
      'Consistent tag indentation and hierarchy',
      'Minify HTML to remove excess whitespace and comments',
      'Built-in HTML entity encoder/decoder',
      'Completely private in-browser engine',
    ],
    faqs: [
      {
        question: 'Does minifying HTML remove comments?',
        answer: 'Yes, minification strips standard HTML comments (<!-- -->) and redundant whitespace.',
      },
    ],
    content: {
      intro: 'Format cluttered HTML source code into clean, readable markup or minify it for production.',
      useCases: 'Cleaning up scraped markup, formatting email templates, and inspecting page source.',
      howToUse: [
        { step: 1, title: 'Paste HTML', description: 'Paste markup into the editor.' },
        { step: 2, title: 'Format', description: 'Select Beautify or Minify.' },
        { step: 3, title: 'Copy', description: 'Copy the clean HTML.' },
      ],
      notes: ['Void elements like <img> and <br> are handled cleanly.'],
      limitations: ['Embedded complex JavaScript inside <script> tags is preserved as-is.'],
    },
    relatedToolSlugs: ['xml-formatter', 'json-formatter', 'markdown-preview'],
  },
  {
    id: 'tool-markdown-preview',
    slug: 'markdown-preview',
    name: 'Markdown Preview & Editor',
    shortDescription: 'Write and preview GitHub-flavored Markdown in real time with HTML export.',
    description:
      'Interactive Markdown editor with live side-by-side preview. Supports headings, bold, italic, code blocks, lists, blockquotes, and HTML export.',
    category: 'developer',
    icon: 'FileText',
    keywords: ['markdown preview', 'markdown editor', 'markdown to html', 'online markdown viewer'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Markdown Preview & Editor — Real-time Markdown to HTML',
      description: 'Edit and preview GitHub-flavored Markdown with live side-by-side rendering and HTML code export.',
      keywords: ['markdown editor', 'markdown preview online', 'markdown to html converter'],
    },
    features: [
      'Live synchronized side-by-side preview',
      'Supports headings, lists, tables, blockquotes, and code',
      'One-click HTML markup export',
      '100% private client-side rendering',
    ],
    faqs: [
      {
        question: 'Can I export the rendered output as HTML?',
        answer: 'Yes, click "Copy HTML" to get clean HTML markup ready for websites or blogs.',
      },
    ],
    content: {
      intro: 'Draft README files, blog posts, and documentation with instant visual feedback.',
      useCases: 'Testing Markdown syntax before committing to GitHub or publishing on static sites.',
      howToUse: [
        { step: 1, title: 'Type Markdown', description: 'Write Markdown syntax in the left panel.' },
        { step: 2, title: 'Inspect Preview', description: 'Review the rendered preview in the right panel.' },
        { step: 3, title: 'Export', description: 'Copy the Markdown source or generated HTML.' },
      ],
      notes: ['Safe sanitized HTML output prevents cross-site script execution.'],
      limitations: ['Does not evaluate dynamic server-side template tags.'],
    },
    relatedToolSlugs: ['html-formatter', 'text-diff'],
  },
  {
    id: 'tool-regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester & Debugger',
    shortDescription: 'Test and debug JavaScript regular expressions with match highlighting and flags.',
    description:
      'Fast, safe regex tester. Test patterns against sample text with real-time match highlighting, capture groups extraction, and flag toggles (g, i, m, s, u).',
    category: 'developer',
    icon: 'Code2',
    keywords: ['regex tester', 'regular expression tester', 'regex debugger', 'test regex online', 'regex matcher'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Regex Tester — Test Regular Expressions Online',
      description: 'Test JavaScript regular expressions with real-time matching, group extraction, and syntax error alerts.',
      keywords: ['regex tester', 'regular expressions', 'regex matcher', 'test regex javascript'],
    },
    features: [
      'Real-time pattern match counting and extraction',
      'Toggle flags: Global (g), Case-insensitive (i), Multiline (m)',
      'Capture group breakdown table',
      'Instant syntax validation and safe execution',
    ],
    faqs: [
      {
        question: 'Which regex dialect is supported?',
        answer: 'Standard ECMAScript / JavaScript regular expressions supported natively in modern browsers.',
      },
    ],
    content: {
      intro: 'Verify your regular expression patterns against multiple test strings before deploying to code.',
      useCases: 'Validating form inputs, testing log extraction patterns, and debugging search queries.',
      howToUse: [
        { step: 1, title: 'Enter Pattern', description: 'Enter your regular expression and toggle flags.' },
        { step: 2, title: 'Provide Text', description: 'Type or paste test strings in the test area.' },
        { step: 3, title: 'Inspect Matches', description: 'View full matches and capture group details.' },
      ],
      notes: ['Input sizes are capped to prevent catastrophic backtracking (ReDoS).'],
      limitations: ['Lookbehind assertions require modern browser support.'],
    },
    relatedToolSlugs: ['text-extractor', 'json-formatter'],
  },
  {
    id: 'tool-cron-expression',
    slug: 'cron-expression',
    name: 'Cron Expression Generator & Explainer',
    shortDescription: 'Generate standard 5-part cron schedules and translate cron expressions into plain English.',
    description:
      'Build cron schedules with presets or translate complex cron expressions into human-readable English descriptions.',
    category: 'developer',
    icon: 'Clock',
    keywords: ['cron generator', 'cron explainer', 'cron expression helper', 'crontab generator', 'cron schedule'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Cron Expression Generator & Explainer — Human-Readable Crontab',
      description: 'Translate cron expressions into plain English and generate cron schedules for jobs and crontabs.',
      keywords: ['cron generator', 'cron expression', 'crontab explainer', 'cron schedule online'],
    },
    features: [
      'Translates 5-part cron expressions into plain English',
      'Quick presets (Every 5 minutes, Hourly, Daily at midnight, Weekly, Monthly)',
      'Syntax validation with error indicators',
      'One-click crontab copy',
    ],
    faqs: [
      {
        question: 'What do the 5 fields of a standard cron expression represent?',
        answer: 'Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-6).',
      },
    ],
    content: {
      intro: 'Generate and decode cron syntax for Linux crontab, GitHub Actions, AWS EventBridge, and serverless jobs.',
      useCases: 'Setting up automated backup schedules, email dispatch triggers, and recurring background tasks.',
      howToUse: [
        { step: 1, title: 'Select Preset or Type', description: 'Choose a common interval or enter a cron string.' },
        { step: 2, title: 'Read Explanation', description: 'Read the plain-English translation.' },
        { step: 3, title: 'Copy', description: 'Copy the expression into your scheduler or configuration.' },
      ],
      notes: ['Standard 5-part POSIX crontab format.'],
      limitations: ['Special non-standard descriptors like @reboot require custom host support.'],
    },
    relatedToolSlugs: ['unix-timestamp-converter', 'json-formatter'],
  },
  {
    id: 'tool-jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Token Decoder',
    shortDescription: 'Decode JSON Web Token (JWT) headers and payloads with expiration status.',
    description:
      'Inspect JSON Web Tokens (JWT) client-side. Decodes the header, claims payload, algorithm, and calculates expiration status without transmitting tokens.',
    category: 'developer',
    icon: 'Lock',
    keywords: ['jwt decoder', 'decode jwt', 'jwt viewer', 'jwt expiry checker', 'json web token decoder'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free JWT Decoder — Inspect JSON Web Tokens Client-Side',
      description: 'Decode and inspect JWT headers, payload claims, and token expiration safely in your browser. Zero server uploads.',
      keywords: ['jwt decoder', 'decode jwt token', 'jwt payload viewer', 'inspect jwt'],
    },
    features: [
      'Decodes standard Base64Url JWT headers and payloads',
      'Real-time expiration countdown and validity status',
      'Formatted JSON view with syntax highlighting',
      '100% private: tokens never leave your browser',
    ],
    faqs: [
      {
        question: 'Does decoding a JWT verify its cryptographic signature?',
        answer: 'No. Decoding only reads the encoded JSON header and payload claims. Cryptographic verification requires the secret key.',
      },
      {
        question: 'Is it safe to paste production tokens here?',
        answer: 'Yes. OmniTools runs completely client-side in your browser. Tokens are never transmitted to any server.',
      },
    ],
    content: {
      intro: 'Quickly inspect authentication tokens, user claims, roles, and expiration times.',
      useCases: 'Debugging OAuth/OpenID flows, checking token expiration, and verifying payload permissions.',
      howToUse: [
        { step: 1, title: 'Paste Token', description: 'Paste an encoded JWT string (header.payload.signature).' },
        { step: 2, title: 'Inspect Claims', description: 'Review the formatted header and payload JSON.' },
        { step: 3, title: 'Check Expiry', description: 'Verify whether the token is currently active or expired.' },
      ],
      notes: ['Signature segment is displayed but not mathematically verified without secret keys.'],
      limitations: ['Encrypted JWTs (JWE) must be decrypted with a private key before viewing.'],
    },
    relatedToolSlugs: ['base64-converter', 'json-formatter', 'hash-generator'],
  },
  {
    id: 'tool-user-agent-parser',
    slug: 'user-agent-parser',
    name: 'User-Agent Parser & Device Inspector',
    shortDescription: 'Parse User-Agent strings to detect browser, operating system, rendering engine, and device type.',
    description:
      'Inspect any User-Agent header or analyze your current browser environment in real time with client-side detection.',
    category: 'developer',
    icon: 'Globe',
    keywords: ['user agent parser', 'parse user agent', 'ua lookup', 'browser detector', 'device inspector'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free User-Agent Parser — Detect Browser, OS & Device',
      description: 'Parse User-Agent strings into browser name, version, operating system, and hardware architecture.',
      keywords: ['user agent parser', 'ua parser online', 'detect browser from user agent'],
    },
    features: [
      'Detects Chrome, Firefox, Safari, Edge, and mobile browsers',
      'Identifies Windows, macOS, Linux, iOS, and Android platforms',
      'One-click detection of your current device User-Agent',
      'Clean tabular summary of all client attributes',
    ],
    faqs: [
      {
        question: 'What is a User-Agent string?',
        answer: 'A User-Agent is an HTTP request header that identifies your browser, operating system, and rendering engine to servers.',
      },
    ],
    content: {
      intro: 'Analyze web analytics logs, inspect crawler bots, and test responsive client identification.',
      useCases: 'Debugging server access logs, verifying bot crawlers, and diagnosing client browser issues.',
      howToUse: [
        { step: 1, title: 'Paste or Use Current', description: 'Click "Use Current Browser" or paste a User-Agent string.' },
        { step: 2, title: 'Inspect Specs', description: 'Review browser family, version, and OS platform.' },
        { step: 3, title: 'Copy Details', description: 'Copy the parsed metadata for reports or tickets.' },
      ],
      notes: ['Modern browsers may freeze parts of the User-Agent for privacy (Client Hints).'],
      limitations: ['Spoofed User-Agent headers cannot be authenticated without TLS fingerprinting.'],
    },
    relatedToolSlugs: ['http-status-codes', 'url-parser-builder'],
  },
  {
    id: 'tool-http-status-codes',
    slug: 'http-status-codes',
    name: 'HTTP Status Code Reference',
    shortDescription: 'Search and inspect all standard HTTP status codes (1xx, 2xx, 3xx, 4xx, 5xx) with RFC specifications.',
    description:
      'Comprehensive, searchable reference directory for all standard HTTP status codes with practical explanations and RFC references.',
    category: 'developer',
    icon: 'Globe',
    keywords: ['http status codes', 'http status lookup', '404 not found', '500 internal server error', 'http codes list'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'HTTP Status Code Reference & Lookup — Complete List',
      description: 'Search and look up HTTP status codes (1xx to 5xx) with clear explanations, RFC definitions, and debugging tips.',
      keywords: ['http status codes', 'http response codes', 'rest api status codes'],
    },
    features: [
      'Instant search by status code number or name',
      'Filter by category (Informational, Success, Redirection, Client Error, Server Error)',
      'Clear explanations of when to use each code in REST APIs',
      'Mobile-friendly quick lookup cards',
    ],
    faqs: [
      {
        question: 'What is the difference between 401 Unauthorized and 403 Forbidden?',
        answer: '401 Unauthorized means authentication is missing or invalid. 403 Forbidden means the identity is known, but access is refused.',
      },
    ],
    content: {
      intro: 'A quick developer cheat sheet for standard HTTP response status codes.',
      useCases: 'Designing RESTful APIs, diagnosing web application errors, and configuring reverse proxies.',
      howToUse: [
        { step: 1, title: 'Search or Filter', description: 'Type a number (e.g. 404) or select a category badge.' },
        { step: 2, title: 'Read Details', description: 'View code meaning, common causes, and specifications.' },
      ],
      notes: ['Includes standard IETF RFC 9110 HTTP Semantics specifications.'],
      limitations: ['Non-standard proprietary vendor codes are not cataloged.'],
    },
    relatedToolSlugs: ['user-agent-parser', 'url-parser-builder'],
  },

  // ==========================================
  // DATA TOOLS
  // ==========================================
  {
    id: 'tool-json-diff',
    slug: 'json-diff',
    name: 'JSON Diff & Comparator',
    shortDescription: 'Compare two JSON objects side-by-side to highlight added, removed, and modified keys.',
    description:
      'Deep visual JSON comparison tool. Compare two JSON payloads side-by-side with color-coded additions, deletions, and value modifications.',
    category: 'data',
    icon: 'GitCompare',
    keywords: ['json diff', 'compare json', 'json comparator', 'json differences', 'json diff online'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free JSON Diff Tool — Compare Two JSON Objects Side-by-Side',
      description: 'Deep visual JSON diff tool. Highlight added, removed, and changed keys in real-time with zero server uploads.',
      keywords: ['json diff', 'compare json online', 'diff two json files', 'json comparator'],
    },
    features: [
      'Deep recursive property inspection',
      'Highlights additions in green, deletions in red, and modifications in amber',
      'Summary badge counters for all changes',
      'Client-side evaluation with zero data transfer',
    ],
    faqs: [
      {
        question: 'Does key ordering affect the diff?',
        answer: 'No. JSON objects are compared by key names and values regardless of property serialization order.',
      },
    ],
    content: {
      intro: 'Compare API responses, configuration snapshots, or database records to isolate exact data changes.',
      useCases: 'Regression testing REST APIs, tracking configuration drift, and debugging state updates.',
      howToUse: [
        { step: 1, title: 'Paste JSON Left', description: 'Paste the original or expected JSON object.' },
        { step: 2, title: 'Paste JSON Right', description: 'Paste the modified or actual JSON object.' },
        { step: 3, title: 'Inspect Diff', description: 'Review categorized additions, removals, and changes.' },
      ],
      notes: ['Both inputs must be valid JSON syntax.'],
      limitations: ['Large JSON objects over 10MB may take a second to calculate recursively.'],
    },
    relatedToolSlugs: ['json-formatter', 'text-diff', 'json-flattener'],
  },
  {
    id: 'tool-json-flattener',
    slug: 'json-flattener',
    name: 'JSON Flattener & Key Sorter',
    shortDescription: 'Flatten nested JSON into dot-notation paths and recursively sort keys alphabetically.',
    description:
      'Transform complex nested JSON trees into flat single-level key-value objects using dot notation (e.g. user.address.city), unflatten back, or sort keys alphabetically.',
    category: 'data',
    icon: 'Boxes',
    keywords: ['flatten json', 'unflatten json', 'json flattener', 'sort json keys', 'dot notation json'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'JSON Flattener & Key Sorter — Flatten Nested JSON Online',
      description: 'Convert nested JSON into dot-notation key paths, unflatten, or sort keys alphabetically. 100% private in-browser tool.',
      keywords: ['flatten json', 'unflatten json', 'sort json keys', 'dot notation converter'],
    },
    features: [
      'Flatten deep JSON structures into dot-notation paths',
      'Unflatten dot-notation objects back into nested trees',
      'Sort keys alphabetically recursively',
      'One-click formatted copy',
    ],
    faqs: [
      {
        question: 'Why flatten a JSON structure?',
        answer: 'Flattened JSON is much easier to export to flat CSV tables, ingest into analytics databases, or query with simple keys.',
      },
    ],
    content: {
      intro: 'Simplify nested data structures for spreadsheets, relational databases, or configuration management.',
      useCases: 'Preparing JSON data for CSV export, normalizing translation files, and sorting configuration keys.',
      howToUse: [
        { step: 1, title: 'Input JSON', description: 'Paste any nested or flat JSON payload.' },
        { step: 2, title: 'Select Action', description: 'Click Flatten to Dot-Notation, Unflatten, or Sort Keys.' },
        { step: 3, title: 'Copy Result', description: 'Copy the transformed JSON.' },
      ],
      notes: ['Handles arrays by indexing elements with dot notation (e.g. items.0.name).'],
      limitations: ['Circular references cannot be flattened.'],
    },
    relatedToolSlugs: ['json-diff', 'json-formatter', 'spreadsheet-to-json'],
  },
  {
    id: 'tool-data-uri',
    slug: 'data-uri',
    name: 'Data URI Generator & Decoder',
    shortDescription: 'Convert images, text, and files into Base64 Data URIs or decode Data URIs back to text.',
    description:
      'Create standard RFC 2397 Data URIs (data:mime;base64,...) from local files or raw text, and decode Data URI strings back into human-readable content.',
    category: 'data',
    icon: 'FileCode',
    keywords: ['data uri generator', 'data url maker', 'data uri decoder', 'base64 data uri', 'inline image data uri'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Data URI Generator & Decoder — Inline Base64 Data URLs',
      description: 'Convert images, SVG, CSS, and text into Base64 Data URIs or decode Data URLs. 100% private in-browser.',
      keywords: ['data uri generator', 'data uri decoder', 'inline image generator', 'base64 url'],
    },
    features: [
      'Drag and drop files to generate Data URIs',
      'Convert raw text with custom MIME type to Data URI',
      'Decode Data URI strings to extract plain text and MIME metadata',
      'Client-side zero-upload processing',
    ],
    faqs: [
      {
        question: 'When should I use a Data URI?',
        answer: 'Data URIs are ideal for embedding small icons, SVG graphics, or CSS directly into HTML to reduce HTTP requests.',
      },
    ],
    content: {
      intro: 'Embed small assets directly inside HTML, CSS, or JSON documents without hosting separate files.',
      useCases: 'Inlining small SVG icons in CSS, embedding logos in emails, and embedding images in single-file HTML reports.',
      howToUse: [
        { step: 1, title: 'Select File or Enter Text', description: 'Upload a local file or type text.' },
        { step: 2, title: 'Generate', description: 'The tool generates the RFC 2397 Data URI string.' },
        { step: 3, title: 'Copy', description: 'Copy into your HTML <img> tag or CSS background-image.' },
      ],
      notes: ['Data URIs increase file size by roughly 33% due to Base64 encoding.'],
      limitations: ['Not recommended for multi-megabyte media files.'],
    },
    relatedToolSlugs: ['base64-converter', 'image-converter'],
  },

  // ==========================================
  // ENCODING & SECURITY TOOLS
  // ==========================================
  {
    id: 'tool-multi-hash-hmac',
    slug: 'multi-hash-hmac',
    name: 'Hash & HMAC Generator',
    shortDescription: 'Compute SHA-1, SHA-256, SHA-384, SHA-512, and HMAC signatures using native Web Crypto.',
    description:
      'High-performance cryptographic hash and HMAC generator. Calculate SHA-1, SHA-256, SHA-384, SHA-512 hashes and keyed HMAC signatures directly in browser memory.',
    category: 'security',
    icon: 'ShieldCheck',
    keywords: ['sha256 generator', 'hmac generator', 'sha512 online', 'crypto hash', 'message digest'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free SHA & HMAC Hash Generator — SHA-256, SHA-512 & HMAC',
      description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512, and HMAC signatures client-side using browser Web Crypto APIs.',
      keywords: ['sha256 hash generator', 'hmac generator', 'sha512 online', 'web crypto hash'],
    },
    features: [
      'Multi-algorithm computation: SHA-1, SHA-256, SHA-384, SHA-512',
      'Keyed HMAC-SHA256 signature generator',
      'Hardware-accelerated native Web Crypto API',
      'Zero server transmission: 100% private',
    ],
    faqs: [
      {
        question: 'Is hashing the same as encryption?',
        answer: 'No. Hashing is a one-way mathematical function. A hash cannot be decrypted back into original plaintext.',
      },
      {
        question: 'Are SHA-1 and MD5 secure for passwords?',
        answer: 'No. SHA-1 and MD5 are cryptographically broken for security applications. Use SHA-256/SHA-512 or modern password hashes.',
      },
    ],
    content: {
      intro: 'Verify data integrity, check checksums, and compute cryptographic HMAC signatures.',
      useCases: 'Validating software downloads, checking webhook authentication tokens, and generating API signatures.',
      howToUse: [
        { step: 1, title: 'Enter Text', description: 'Type or paste input message string.' },
        { step: 2, title: 'Optional Secret', description: 'Enter an HMAC secret key if generating an HMAC signature.' },
        { step: 3, title: 'Copy Hash', description: 'Copy the hexadecimal digest value.' },
      ],
      notes: ['Uses the standard browser SubtleCrypto implementation.'],
      limitations: ['Only suitable for text payloads; large binary files can use dedicated file hash tools.'],
    },
    relatedToolSlugs: ['hash-generator', 'base64-converter', 'jwt-decoder'],
  },
  {
    id: 'tool-binary-hex-converter',
    slug: 'binary-hex-converter',
    name: 'Binary & Hexadecimal Converter',
    shortDescription: 'Convert text to binary (01), hexadecimal (0-9A-F), and decode back to plain text.',
    description:
      'Convert strings between plain ASCII/UTF-8 text, 8-bit space-separated binary code, and clean hexadecimal strings.',
    category: 'security',
    icon: 'Binary',
    keywords: ['text to binary', 'binary to text', 'text to hex', 'hex to text', 'binary decoder'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Text to Binary & Hex Converter — Encode & Decode',
      description: 'Convert text to binary numbers and hexadecimal strings or decode binary/hex back to readable text in real-time.',
      keywords: ['text to binary converter', 'binary to english', 'text to hex', 'hexadecimal converter'],
    },
    features: [
      'Text to 8-bit space-separated binary digits',
      'Binary code to readable UTF-8 text',
      'Text to uppercase/lowercase hexadecimal strings',
      'Hexadecimal to plain text decoder',
    ],
    faqs: [
      {
        question: 'How does text to binary conversion work?',
        answer: 'Each character is represented by its UTF-8 byte code point, formatted as an 8-bit binary string (e.g. "A" = 01000001).',
      },
    ],
    content: {
      intro: 'Translate text into machine-level binary and hex bytes for educational, networking, and debugging purposes.',
      useCases: 'Inspecting byte encodings, computer science education, and debugging low-level protocols.',
      howToUse: [
        { step: 1, title: 'Select Direction', description: 'Choose Text to Binary/Hex or Binary/Hex to Text.' },
        { step: 2, title: 'Enter Data', description: 'Type characters or binary digits.' },
        { step: 3, title: 'Copy Output', description: 'Copy the converted byte sequence.' },
      ],
      notes: ['Invalid binary or hex sequences display clear validation alerts.'],
      limitations: ['Binary inputs must be formatted as 8-bit bytes.'],
    },
    relatedToolSlugs: ['base64-converter', 'url-encoder-decoder', 'rot13-cipher'],
  },
  {
    id: 'tool-rot13-cipher',
    slug: 'rot13-cipher',
    name: 'ROT13 & ROT47 Cipher',
    shortDescription: 'Obfuscate and decode text using ROT13 and ROT47 Caesar substitution ciphers.',
    description:
      'Apply ROT13 (rotate 13 letters) and ROT47 (rotate 47 ASCII characters) reciprocal substitution ciphers to hide spoilers and obscure text.',
    category: 'security',
    icon: 'Lock',
    keywords: ['rot13 cipher', 'rot13 decoder', 'rot47 cipher', 'caesar cipher', 'text obfuscator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free ROT13 & ROT47 Cipher — Encode and Decode Online',
      description: 'Obfuscate text or decode spoilers using reciprocal ROT13 and ROT47 ciphers. Instant client-side conversion.',
      keywords: ['rot13 decoder', 'rot13 encoder', 'rot47 cipher', 'caesar cipher online'],
    },
    features: [
      'Standard ROT13 alphabet rotation for hiding spoilers and puzzle solutions',
      'ROT47 extended ASCII rotation for numbers and punctuation',
      'Reciprocal cipher: applying twice restores original text',
      'Instant interactive typing',
    ],
    faqs: [
      {
        question: 'Is ROT13 secure encryption?',
        answer: 'No. ROT13 is an obfuscation cipher used for hiding spoilers, not for securing confidential information.',
      },
    ],
    content: {
      intro: 'Conceal forum spoilers, puzzle solutions, and casual text without cryptographic complexity.',
      useCases: 'Obfuscating puzzle hints, caching spoiler text, and computer science cipher demonstrations.',
      howToUse: [
        { step: 1, title: 'Type Message', description: 'Enter text into the editor.' },
        { step: 2, title: 'Select Cipher', description: 'Choose ROT13 (letters only) or ROT47 (full ASCII).' },
        { step: 3, title: 'Copy', description: 'Copy the obfuscated result.' },
      ],
      notes: ['Applying ROT13 to encoded text automatically decodes it.'],
      limitations: ['ROT13 only rotates English alphabet letters A-Z and a-z.'],
    },
    relatedToolSlugs: ['base64-converter', 'binary-hex-converter'],
  },

  // ==========================================
  // MATH TOOLS
  // ==========================================
  {
    id: 'tool-gcd-lcm-prime',
    slug: 'gcd-lcm-prime',
    name: 'GCD, LCM & Prime Factorization',
    shortDescription: 'Calculate Greatest Common Divisor (GCD), Least Common Multiple (LCM), and prime factorizations.',
    description:
      'Fast mathematical calculator for Greatest Common Divisor (GCD/GCF), Least Common Multiple (LCM), prime testing, and integer prime factorization.',
    category: 'math-calculators',
    icon: 'Calculator',
    keywords: ['gcd calculator', 'lcm calculator', 'prime factorization', 'greatest common divisor', 'least common multiple'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'GCD, LCM & Prime Factorization Calculator — Free Online Math Tool',
      description: 'Calculate GCD, LCM, check prime numbers, and find prime factors for integers instantly in your browser.',
      keywords: ['gcd calculator', 'lcm calculator', 'prime number checker', 'prime factor calculator'],
    },
    features: [
      'Calculates GCD (Euclidean algorithm) and LCM for two integers',
      'Instant prime number testing',
      'Step-by-step prime factor decomposition',
      'Formula display and step breakdowns',
    ],
    faqs: [
      {
        question: 'What is the relationship between GCD and LCM?',
        answer: 'For any two positive integers A and B, GCD(A, B) × LCM(A, B) = A × B.',
      },
    ],
    content: {
      intro: 'Solve integer factorization, common divisor, and fraction denominator problems.',
      useCases: 'Simplifying fractions, scheduling recurring cycles, and solving algebra problems.',
      howToUse: [
        { step: 1, title: 'Enter Numbers', description: 'Enter integer values A and B.' },
        { step: 2, title: 'View Calculations', description: 'Inspect GCD, LCM, and prime factor breakdowns.' },
      ],
      notes: ['Supports standard JavaScript safe integers up to 9,007,199,254,740,991.'],
      limitations: ['Extremely large numbers beyond 16 digits may lose integer precision.'],
    },
    relatedToolSlugs: ['fraction-calculator', 'percentage-calculator', 'ratio-calculator'],
  },
  {
    id: 'tool-fraction-calculator',
    slug: 'fraction-calculator',
    name: 'Fraction Calculator & Simplifier',
    shortDescription: 'Add, subtract, multiply, divide, simplify fractions, and convert decimals to fractions.',
    description:
      'Perform exact fractional arithmetic (+, -, ×, ÷), reduce fractions to lowest terms, and convert floating-point decimals into exact fractions.',
    category: 'math-calculators',
    icon: 'Divide',
    keywords: ['fraction calculator', 'simplify fraction', 'decimal to fraction', 'fraction to decimal', 'add fractions'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Fraction Calculator & Simplifier — Math Fraction Solver',
      description: 'Add, subtract, multiply, divide, simplify fractions, and convert decimals to exact fractions online.',
      keywords: ['fraction calculator', 'fraction simplifier', 'decimal to fraction converter'],
    },
    features: [
      'Exact addition, subtraction, multiplication, and division of fractions',
      'Automatic reduction to lowest terms using GCD',
      'Decimal to exact fraction converter (e.g. 0.75 → 3/4)',
      'Mixed number and improper fraction representations',
    ],
    faqs: [
      {
        question: 'How do you simplify a fraction to lowest terms?',
        answer: 'Divide both numerator and denominator by their Greatest Common Divisor (GCD).',
      },
    ],
    content: {
      intro: 'Solve fraction arithmetic without manual common denominator calculations.',
      useCases: 'Cooking recipe adjustments, woodworking measurements, and school math assignments.',
      howToUse: [
        { step: 1, title: 'Enter Fractions', description: 'Type numerators and denominators for Fraction 1 and 2.' },
        { step: 2, title: 'Select Operator', description: 'Choose +, -, ×, or ÷.' },
        { step: 3, title: 'View Answer', description: 'View simplified fraction, mixed number, and decimal equivalent.' },
      ],
      notes: ['Denominator cannot be zero.'],
      limitations: ['Recurring irrational decimals can only be approximated.'],
    },
    relatedToolSlugs: ['gcd-lcm-prime', 'ratio-calculator', 'percentage-calculator'],
  },
  {
    id: 'tool-geometry-calculator',
    slug: 'geometry-calculator',
    name: 'Geometry Area & Volume Calculator',
    shortDescription: 'Calculate area, perimeter, surface area, and volume for 2D and 3D geometric shapes.',
    description:
      'Interactive geometry calculator for Circles, Rectangles, Triangles, Spheres, Cylinders, and Cones with exact formulas and dimensions.',
    category: 'math-calculators',
    icon: 'Boxes',
    keywords: ['area calculator', 'volume calculator', 'circle area', 'geometry calculator', 'surface area'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Geometry Calculator — Area, Perimeter & Volume Solver',
      description: 'Calculate area, perimeter, circumference, and volume for 2D and 3D shapes with exact mathematical formulas.',
      keywords: ['geometry calculator', 'area calculator', 'volume calculator', 'circle area calculator'],
    },
    features: [
      '2D Shapes: Circle, Rectangle, Triangle (Area and Perimeter)',
      '3D Shapes: Sphere, Cylinder, Cone (Volume and Surface Area)',
      'Displays the exact mathematical formula for every calculation',
      'Real-time calculation updates as you type',
    ],
    faqs: [
      {
        question: 'What value of Pi (π) is used in calculations?',
        answer: 'Calculations use standard high-precision Math.PI (3.141592653589793).',
      },
    ],
    content: {
      intro: 'Quickly solve geometric measurements for engineering, home improvement, and education.',
      useCases: 'Calculating paint coverage, storage tank volumes, and material requirements.',
      howToUse: [
        { step: 1, title: 'Select Shape', description: 'Choose Circle, Rectangle, Triangle, Sphere, or Cylinder.' },
        { step: 2, title: 'Input Dimensions', description: 'Enter radius, length, width, or height.' },
        { step: 3, title: 'Read Results', description: 'View computed area, perimeter, or volume.' },
      ],
      notes: ['All dimensions must use the same units for consistent outputs.'],
      limitations: ['Negative dimension inputs are prevented.'],
    },
    relatedToolSlugs: ['scientific-calculator', 'fraction-calculator'],
  },
  {
    id: 'tool-scientific-calculator',
    slug: 'scientific-calculator',
    name: 'Scientific Math Calculator',
    shortDescription: 'Calculate factorials, powers, roots, logarithms, and trigonometric functions.',
    description:
      'Pure client-side scientific calculator. Compute factorials (n!), powers (xʸ), square roots, cube roots, natural logs (ln), log10, and sine/cosine/tangent.',
    category: 'math-calculators',
    icon: 'Calculator',
    keywords: ['scientific calculator', 'factorial calculator', 'power calculator', 'square root', 'log calculator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Scientific Math Calculator — Powers, Roots & Factorials',
      description: 'Calculate factorials, square roots, exponents, logarithms, and trigonometry online. Instant client-side results.',
      keywords: ['scientific calculator online', 'factorial calculator', 'square root calculator', 'math solver'],
    },
    features: [
      'Factorials (n!) with large number protection',
      'Square roots (√x) and cube roots (∛x)',
      'Powers and exponents (xʸ)',
      'Logarithms (ln, log10) and basic trigonometry (sin, cos, tan)',
    ],
    faqs: [
      {
        question: 'What is 0 factorial (0!)?',
        answer: 'By mathematical definition, 0! equals 1.',
      },
    ],
    content: {
      intro: 'Perform advanced mathematical operations with clear formula explanations.',
      useCases: 'Evaluating formulas, statistical calculations, and engineering calculations.',
      howToUse: [
        { step: 1, title: 'Select Function', description: 'Choose Factorial, Power, Square Root, or Logarithm.' },
        { step: 2, title: 'Enter Values', description: 'Provide the required operands.' },
        { step: 3, title: 'Inspect Answer', description: 'Copy the high-precision numerical result.' },
      ],
      notes: ['Calculations use 64-bit IEEE floating point math.'],
      limitations: ['Factorials above 170 exceed JavaScript maximum floating-point representation (Infinity).'],
    },
    relatedToolSlugs: ['geometry-calculator', 'percentage-calculator', 'average-calculator'],
  },

  // ==========================================
  // FINANCE TOOLS
  // ==========================================
  {
    id: 'tool-simple-interest-calculator',
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    shortDescription: 'Calculate simple interest, total repayment, and breakdown by principal and rate.',
    description:
      'Quick simple interest calculator using the standard formula I = P × r × t. View total interest earned, total repayment amount, and annual breakdown.',
    category: 'finance',
    icon: 'Coins',
    keywords: ['simple interest calculator', 'interest calculator', 'loan interest', 'calculate simple interest'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Simple Interest Calculator — Calculate Interest & Maturity',
      description: 'Calculate simple interest, total balance, and interest breakdown over time with clear formulas.',
      keywords: ['simple interest calculator', 'calculate interest', 'simple loan calculator'],
    },
    features: [
      'Computes interest using standard formula (I = P × R × T / 100)',
      'Total repayment and maturity value display',
      'Visual breakdown between principal and accrued interest',
      'Zero server tracking',
    ],
    faqs: [
      {
        question: 'How does simple interest differ from compound interest?',
        answer: 'Simple interest is calculated only on the initial principal, whereas compound interest calculates interest on principal plus accumulated interest.',
      },
    ],
    content: {
      intro: 'Calculate loan interest, bond yields, and short-term debt repayments.',
      useCases: 'Estimating short-term personal loans, auto notes, and simple promissory contracts.',
      howToUse: [
        { step: 1, title: 'Enter Principal', description: 'Enter the initial loan or investment amount.' },
        { step: 2, title: 'Enter Rate & Time', description: 'Enter annual interest rate (%) and duration in years.' },
        { step: 3, title: 'Review Breakdown', description: 'Inspect total interest and final maturity sum.' },
      ],
      notes: ['For financial planning purposes only; does not constitute professional investment advice.'],
      limitations: ['Assumes fixed interest rate throughout the duration.'],
    },
    relatedToolSlugs: ['compound-interest-calculator', 'emi-calculator', 'cagr-calculator'],
  },
  {
    id: 'tool-cagr-calculator',
    slug: 'cagr-calculator',
    name: 'CAGR Calculator (Compound Growth)',
    shortDescription: 'Calculate Compound Annual Growth Rate (CAGR) and multi-year investment returns.',
    description:
      'Determine the annualized growth rate of investments, business revenue, or portfolios between initial and final values over time.',
    category: 'finance',
    icon: 'TrendingUp',
    keywords: ['cagr calculator', 'compound annual growth rate', 'calculate cagr', 'investment growth rate', 'annualized return'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free CAGR Calculator — Compound Annual Growth Rate',
      description: 'Calculate Compound Annual Growth Rate (CAGR) and annualized investment returns online in your browser.',
      keywords: ['cagr calculator', 'compound annual growth rate', 'annual return calculator', 'portfolio cagr'],
    },
    features: [
      'Calculates CAGR using standard formula: (Ending / Beginning)^(1/n) - 1',
      'Total percentage gain calculation',
      'Displays year-by-year projected growth trajectory',
      'Instant private computation',
    ],
    faqs: [
      {
        question: 'What is CAGR?',
        answer: 'Compound Annual Growth Rate (CAGR) measures the geometric mean return of an investment over multiple annual periods.',
      },
    ],
    content: {
      intro: 'Measure the true annualized performance of stocks, real estate, and business metrics over time.',
      useCases: 'Comparing multi-year mutual fund performance, company revenue growth, and startup metrics.',
      howToUse: [
        { step: 1, title: 'Enter Values', description: 'Enter beginning investment value and ending value.' },
        { step: 2, title: 'Enter Duration', description: 'Enter total time elapsed in years.' },
        { step: 3, title: 'View CAGR', description: 'Inspect annualized CAGR percentage and total return.' },
      ],
      notes: ['CAGR smooths out year-to-year volatility into a constant geometric rate.'],
      limitations: ['Does not account for interim capital infusions or withdrawals.'],
    },
    relatedToolSlugs: ['compound-interest-calculator', 'simple-interest-calculator', 'discount-calculator'],
  },
  {
    id: 'tool-tax-margin-calculator',
    slug: 'tax-margin-calculator',
    name: 'Tax, Tip & Margin Calculator',
    shortDescription: 'Calculate sales tax, restaurant tip splits, and business profit margins & markups.',
    description:
      'Multi-purpose business and retail calculator. Calculate tax-exclusive and tax-inclusive prices, bill tip splits, and cost markups vs profit margins.',
    category: 'finance',
    icon: 'Percent',
    keywords: ['tax calculator', 'tip calculator', 'profit margin calculator', 'markup calculator', 'bill split'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Sales Tax, Tip & Profit Margin Calculator — Free Finance Tool',
      description: 'Calculate sales tax (inclusive/exclusive), restaurant tip splits per person, and gross margin vs markup.',
      keywords: ['sales tax calculator', 'tip calculator', 'profit margin calculator', 'markup vs margin'],
    },
    features: [
      'Sales Tax: Compute pre-tax and post-tax prices with tax amount',
      'Tip Calculator: Calculate tip amount and split evenly across N people',
      'Profit Margin & Markup: Compare markup percentage vs gross profit margin',
      'Instant interactive sliders and inputs',
    ],
    faqs: [
      {
        question: 'What is the difference between markup and margin?',
        answer: 'Markup is the percentage added to cost to reach selling price. Margin is the percentage of selling price that represents profit.',
      },
    ],
    content: {
      intro: 'Solve everyday retail tax calculations, group dinner bill splits, and product pricing models.',
      useCases: 'Pricing e-commerce products, splitting restaurant tabs, and verifying tax invoices.',
      howToUse: [
        { step: 1, title: 'Select Tab', description: 'Choose Sales Tax, Tip Split, or Margin & Markup.' },
        { step: 2, title: 'Enter Amounts', description: 'Enter cost or bill amounts and percentages.' },
        { step: 3, title: 'Inspect Summary', description: 'View net total, tax breakdown, or split per person.' },
      ],
      notes: ['Supports any currency denomination.'],
      limitations: ['Does not calculate tiered progressive income tax brackets.'],
    },
    relatedToolSlugs: ['discount-calculator', 'percentage-calculator', 'simple-interest-calculator'],
  },

  // ==========================================
  // DATE & TIME TOOLS
  // ==========================================
  {
    id: 'tool-unix-timestamp-converter',
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    shortDescription: 'Convert Unix epoch timestamps to human-readable dates and generate timestamps in seconds/milliseconds.',
    description:
      'Live Unix timestamp converter. Convert between seconds/milliseconds epoch timestamps and ISO/UTC/local dates with live ticker.',
    category: 'date-time',
    icon: 'Clock',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'date to timestamp', 'unix time online'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Unix Timestamp Converter — Epoch to Date & Live Clock',
      description: 'Convert Unix epoch timestamps to human-readable dates, UTC, ISO 8601, and generate timestamps in real time.',
      keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'current epoch time'],
    },
    features: [
      'Live ticking current Unix timestamp in seconds and milliseconds',
      'Bidirectional conversion: Timestamp to Date and Date to Timestamp',
      'Outputs in ISO 8601, UTC string, and local client timezone',
      'Human-readable relative time (e.g. "3 hours ago")',
    ],
    faqs: [
      {
        question: 'What is a Unix epoch timestamp?',
        answer: 'Unix epoch time is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC (not counting leap seconds).',
      },
    ],
    content: {
      intro: 'Convert backend database timestamps, API tokens, and log timestamps into human-readable dates.',
      useCases: 'Debugging server logs, verifying JWT exp/iat claims, and scheduling database records.',
      howToUse: [
        { step: 1, title: 'Enter Timestamp or Date', description: 'Type a timestamp (e.g. 1700000000) or select a date/time.' },
        { step: 2, title: 'Inspect Dates', description: 'Review UTC, Local, and ISO representations.' },
        { step: 3, title: 'Copy', description: 'Copy timestamp or ISO string in one click.' },
      ],
      notes: ['Automatically detects whether input is in seconds (10 digits) or milliseconds (13 digits).'],
      limitations: ['Timestamps prior to 1970 use negative numbers.'],
    },
    relatedToolSlugs: ['date-difference-calculator', 'timezone-converter', 'cron-expression'],
  },
  {
    id: 'tool-date-difference-calculator',
    slug: 'date-difference-calculator',
    name: 'Date Difference & Business Days',
    shortDescription: 'Calculate exact days, weeks, months, and business working days between two dates.',
    description:
      'Accurately calculate duration between two dates. Computes calendar days, total weeks, full months, and working business days (excluding weekends).',
    category: 'date-time',
    icon: 'Clock',
    keywords: ['date difference', 'days between dates', 'business days calculator', 'work days calculator', 'calculate age'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Date Difference & Business Days Calculator',
      description: 'Calculate total days, weeks, months, and business working days between any two calendar dates.',
      keywords: ['days between dates', 'date difference calculator', 'business days calculator', 'work days online'],
    },
    features: [
      'Calculates total calendar days, weeks, and month differences',
      'Business days calculator (filters out Saturdays and Sundays)',
      'Add or subtract days from a specific date',
      'Day of week detection (e.g. Monday, Friday)',
    ],
    faqs: [
      {
        question: 'Does the business days calculation exclude national public holidays?',
        answer: 'It excludes Saturdays and Sundays by default since public holidays vary widely by country and state.',
      },
    ],
    content: {
      intro: 'Measure project timelines, contractual deadlines, and work durations accurately.',
      useCases: 'Project sprint planning, calculating invoice due dates, and estimating work delivery times.',
      howToUse: [
        { step: 1, title: 'Select Start Date', description: 'Choose the beginning date from the calendar.' },
        { step: 2, title: 'Select End Date', description: 'Choose the target end date.' },
        { step: 3, title: 'View Summary', description: 'Review total days and business days breakdown.' },
      ],
      notes: ['Supports leap years and daylight saving transitions correctly.'],
      limitations: ['Regional public holidays must be adjusted manually.'],
    },
    relatedToolSlugs: ['unix-timestamp-converter', 'timezone-converter', 'pomodoro-timer'],
  },
  {
    id: 'tool-timezone-converter',
    slug: 'timezone-converter',
    name: 'Time Zone Converter & World Clock',
    shortDescription: 'Convert meeting times and dates across international time zones with daylight saving support.',
    description:
      'Compare local times across global timezones. Converts dates between New York, London, Tokyo, Sydney, UTC, and custom IANA timezones using browser Intl APIs.',
    category: 'date-time',
    icon: 'Globe',
    keywords: ['timezone converter', 'world clock', 'convert time zones', 'utc converter', 'meeting planner'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Time Zone Converter & World Clock — Compare Times Online',
      description: 'Convert times across global cities and IANA time zones with daylight saving time handled accurately.',
      keywords: ['timezone converter', 'world time converter', 'convert time to utc', 'meeting time converter'],
    },
    features: [
      'Built-in standard IANA timezones (America, Europe, Asia, Australia, UTC)',
      'Handles Daylight Saving Time (DST) automatically using native browser Intl',
      'Compare source and target date/time side-by-side',
      '100% client-side calculation with zero latency',
    ],
    faqs: [
      {
        question: 'How are daylight saving time changes handled?',
        answer: 'Calculations use standard browser Intl.DateTimeFormat with IANA timezone database rules, automatically reflecting DST.',
      },
    ],
    content: {
      intro: 'Schedule international webinars, remote standups, and global product releases without timezone mistakes.',
      useCases: 'Coordinating remote team meetings across continents and verifying server UTC timestamps.',
      howToUse: [
        { step: 1, title: 'Pick Date & Time', description: 'Select the meeting time in your local timezone.' },
        { step: 2, title: 'Select Target Timezone', description: 'Choose destination city or timezone.' },
        { step: 3, title: 'Inspect Converted Time', description: 'View the exact local time and date offset.' },
      ],
      notes: ['No hardcoded offsets that break during DST transitions.'],
      limitations: ['Requires modern browser with standard Intl.DateTimeFormat support.'],
    },
    relatedToolSlugs: ['unix-timestamp-converter', 'date-difference-calculator'],
  },

  // ==========================================
  // URL & WEB TOOLS
  // ==========================================
  {
    id: 'tool-url-parser-builder',
    slug: 'url-parser-builder',
    name: 'URL Parser & UTM Builder',
    shortDescription: 'Decompose URLs into protocol, host, path, and query params, or generate tracked UTM marketing links.',
    description:
      'Parse complex URLs into protocol, hostname, port, pathname, hash, and individual query parameters, or build marketing URLs with standard UTM tags.',
    category: 'web-seo',
    icon: 'Globe',
    keywords: ['url parser', 'utm builder', 'parse url', 'utm generator', 'query string builder'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free URL Parser & UTM Campaign Builder — Web Link Inspector',
      description: 'Parse URLs into components and query parameters, or generate clean Google Analytics UTM tracking links.',
      keywords: ['url parser', 'utm builder', 'utm campaign generator', 'parse query parameters'],
    },
    features: [
      'Decomposes URLs into Protocol, Host, Port, Path, and Hash',
      'Interactive query parameter table with one-click key-value editing',
      'UTM Campaign Builder (utm_source, utm_medium, utm_campaign, utm_term, utm_content)',
      'One-click clean URL copy',
    ],
    faqs: [
      {
        question: 'What are UTM parameters used for?',
        answer: 'UTM tags are custom URL parameters used by Google Analytics and marketing platforms to track traffic source and campaigns.',
      },
    ],
    content: {
      intro: 'Inspect URL components or construct error-free marketing links with campaign attribution tags.',
      useCases: 'Creating social media campaign links, newsletter tracking, and debugging redirect links.',
      howToUse: [
        { step: 1, title: 'Paste or Build', description: 'Paste a URL to parse or enter a base URL to add UTM tags.' },
        { step: 2, title: 'Edit Parameters', description: 'Configure campaign source, medium, and campaign name.' },
        { step: 3, title: 'Copy Link', description: 'Copy the valid, encoded URL.' },
      ],
      notes: ['Query values are safely URL-encoded.'],
      limitations: ['Malformed protocols without http/https will trigger validation warnings.'],
    },
    relatedToolSlugs: ['url-encoder-decoder', 'slug-generator', 'html-entity-encoder'],
  },
  {
    id: 'tool-html-entity-encoder',
    slug: 'html-entity-encoder',
    name: 'HTML Entity Encoder & Decoder',
    shortDescription: 'Convert special characters to HTML entities (&amp;, &lt;, &gt;) and decode entity strings.',
    description:
      'Encode special characters (<, >, &, ", \') into safe HTML named and numeric entities to prevent XSS and formatting issues, or decode entities back to plain text.',
    category: 'web-seo',
    icon: 'Code2',
    keywords: ['html entity encoder', 'html entity decoder', 'html escape', 'html unescape', 'encode html entities'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free HTML Entity Encoder & Decoder — Escape HTML Online',
      description: 'Encode special characters into safe HTML entities or decode entities to text in your browser. 100% private.',
      keywords: ['html entity encoder', 'html entity decoder', 'escape html online', 'html character codes'],
    },
    features: [
      'Encodes critical characters: <, >, &, ", \', and non-ASCII glyphs',
      'Decodes named (&copy;, &euro;) and numeric entities (&#38;) back to text',
      'Live bidirectional transformation',
      'One-click copy to clipboard',
    ],
    faqs: [
      {
        question: 'Why should special characters be escaped in HTML?',
        answer: 'Characters like < and > can be misinterpreted as HTML tags, potentially breaking layout or introducing security vulnerabilities.',
      },
    ],
    content: {
      intro: 'Safely display code snippets, quotes, and mathematical symbols in HTML pages.',
      useCases: 'Escaping user inputs for template rendering, debugging CMS entity bugs, and preparing documentation.',
      howToUse: [
        { step: 1, title: 'Paste Content', description: 'Paste raw text or HTML entity markup.' },
        { step: 2, title: 'Select Action', description: 'Click Encode to HTML Entities or Decode to Text.' },
        { step: 3, title: 'Copy', description: 'Copy the safe escaped markup.' },
      ],
      notes: ['Safe DOM-based parsing ensures compliance with HTML5 entity standards.'],
      limitations: ['Does not validate full HTML tag hierarchy.'],
    },
    relatedToolSlugs: ['html-formatter', 'url-encoder-decoder', 'xml-formatter'],
  },

  // ==========================================
  // GENERATORS
  // ==========================================
  {
    id: 'tool-random-string-nanoid',
    slug: 'random-string-nanoid',
    name: 'Random String & NanoID Generator',
    shortDescription: 'Generate cryptographically secure NanoIDs, random passwords, and alphanumeric tokens.',
    description:
      'Generate URL-friendly, cryptographically secure NanoIDs and customizable random strings using Web Crypto APIs.',
    category: 'generators',
    icon: 'KeyRound',
    keywords: ['nanoid generator', 'random string generator', 'secure token generator', 'generate random string', 'api key generator'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free NanoID & Random String Generator — Cryptographically Secure',
      description: 'Generate secure NanoIDs, API tokens, and random alphanumeric strings using hardware-random Web Crypto.',
      keywords: ['nanoid generator', 'random string generator', 'secure random string', 'token generator online'],
    },
    features: [
      'Generates compact, URL-friendly NanoIDs (default 21 chars)',
      'Custom character sets: uppercase, lowercase, numbers, and symbols',
      'Batch generation of up to 50 unique strings at once',
      'Cryptographically secure via window.crypto.getRandomValues',
    ],
    faqs: [
      {
        question: 'What is NanoID?',
        answer: 'NanoID is a tiny, secure, URL-friendly unique string ID generator that is more compact and faster than standard UUIDs.',
      },
    ],
    content: {
      intro: 'Generate unique database keys, secret tokens, test passwords, and mock identifiers.',
      useCases: 'Generating database primary keys, testing authentication tokens, and creating random salt strings.',
      howToUse: [
        { step: 1, title: 'Configure Length & Count', description: 'Choose string length and number of items.' },
        { step: 2, title: 'Select Characters', description: 'Toggle uppercase, lowercase, numbers, or symbols.' },
        { step: 3, title: 'Generate & Copy', description: 'Generate and copy individual or all strings.' },
      ],
      notes: ['Generated locally using your computer cryptographic entropy.'],
      limitations: ['Generated keys should be stored securely and never shared publicly.'],
    },
    relatedToolSlugs: ['uuid-generator', 'random-number-generator', 'multi-hash-hmac'],
  },
  {
    id: 'tool-random-number-generator',
    slug: 'random-number-generator',
    name: 'Random Number & Sequence Generator',
    shortDescription: 'Generate random numbers, lottery sequences, and non-repeating unique integer sets.',
    description:
      'Generate truly random numbers within any minimum and maximum range. Supports unique non-repeating sets, sorting, and batch generation.',
    category: 'generators',
    icon: 'Hash',
    keywords: ['random number generator', 'rng', 'random integer', 'pick random number', 'lottery number generator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free Random Number Generator — Pick Random Integers Online',
      description: 'Generate customizable random numbers and unique non-repeating sequences in your browser.',
      keywords: ['random number generator', 'rng online', 'random integer generator', 'pick a number'],
    },
    features: [
      'Custom Min and Max range constraints',
      'Toggle unique (non-repeating) numbers vs duplicates allowed',
      'Optional ascending sort for lottery drawings and lucky picks',
      'Batch generation of up to 100 random numbers at once',
    ],
    faqs: [
      {
        question: 'Are the generated numbers truly random?',
        answer: 'Numbers are generated using hardware-based pseudorandom number generators in your browser.',
      },
    ],
    content: {
      intro: 'Pick lucky numbers, randomize raffle winners, and generate random test datasets.',
      useCases: 'Contests, board games, scientific sampling, and test data generation.',
      howToUse: [
        { step: 1, title: 'Set Range', description: 'Enter Minimum and Maximum bounds.' },
        { step: 2, title: 'Set Quantity', description: 'Enter how many numbers to pick.' },
        { step: 3, title: 'Generate', description: 'Click Generate to view results.' },
      ],
      notes: ['Range must be at least as large as quantity if unique is selected.'],
      limitations: ['Restricted to integer numbers within safe numerical bounds.'],
    },
    relatedToolSlugs: ['random-string-nanoid', 'uuid-generator', 'random-picker'],
  },

  // ==========================================
  // CSS & DESIGN TOOLS
  // ==========================================
  {
    id: 'tool-css-gradient-generator',
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    shortDescription: 'Design smooth linear and radial CSS gradients with live preview and copyable code.',
    description:
      'Interactive visual CSS gradient designer. Create linear and radial gradients with customizable color stops, angles, and one-click CSS export.',
    category: 'css-design',
    icon: 'Palette',
    keywords: ['css gradient generator', 'css gradient maker', 'linear gradient', 'radial gradient', 'gradient css online'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free CSS Gradient Generator — Create Linear & Radial Gradients',
      description: 'Create beautiful CSS gradients visually with custom color stops, angles, and export copyable CSS code.',
      keywords: ['css gradient generator', 'gradient maker', 'linear gradient css', 'radial gradient css'],
    },
    features: [
      'Linear gradients with 360-degree angle rotation',
      'Radial gradients with centered spread',
      'Up to 6 customizable color stops with color pickers',
      'Instant live preview and clean copyable CSS output',
    ],
    faqs: [
      {
        question: 'Is the generated gradient CSS compatible with all modern browsers?',
        answer: 'Yes! Standard CSS linear-gradient and radial-gradient syntax is supported by 100% of modern browsers.',
      },
    ],
    content: {
      intro: 'Design modern background gradients for hero sections, buttons, and UI components.',
      useCases: 'Designing web banners, landing page backgrounds, and card accents.',
      howToUse: [
        { step: 1, title: 'Choose Style', description: 'Select Linear or Radial gradient mode.' },
        { step: 2, title: 'Adjust Colors & Angle', description: 'Add or adjust color stops and angle slider.' },
        { step: 3, title: 'Copy CSS', description: 'Click Copy CSS to paste directly into your stylesheet.' },
      ],
      notes: ['Colors can be entered as hex or picked via the native picker.'],
      limitations: ['Conic gradients are not included in the standard generator.'],
    },
    relatedToolSlugs: ['color-palette-generator', 'color-converter', 'css-box-shadow-generator'],
  },
  {
    id: 'tool-css-box-shadow-generator',
    slug: 'css-box-shadow-generator',
    name: 'CSS Box Shadow Generator',
    shortDescription: 'Generate layered, modern CSS box shadows with live interactive preview.',
    description:
      'Design soft, modern box-shadow effects with multiple customizable layers, blur radius, spread, offsets, and inset shadows.',
    category: 'css-design',
    icon: 'Layers',
    keywords: ['css box shadow generator', 'box shadow maker', 'css shadow online', 'drop shadow generator', 'layered shadows'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free CSS Box Shadow Generator — Create Modern Layered Shadows',
      description: 'Design multi-layer CSS box shadows with live preview. Adjust blur, spread, offsets, and copy clean CSS code.',
      keywords: ['css box shadow generator', 'box shadow maker', 'layered box shadow', 'css drop shadow'],
    },
    features: [
      'Multi-layer shadow stacking for ultra-realistic soft elevation',
      'Customizable X/Y offsets, blur radius, and spread distance',
      'Inset shadow toggle for pressed or debossed UI elements',
      'One-click CSS code copy',
    ],
    faqs: [
      {
        question: 'Why use multiple shadow layers?',
        answer: 'Stacking 2 or more subtle shadow layers creates much smoother, realistic depth than a single harsh shadow.',
      },
    ],
    content: {
      intro: 'Create smooth elevation and depth for modern cards, modals, and buttons.',
      useCases: 'Designing UI design systems, Tailwind custom elevation tokens, and web components.',
      howToUse: [
        { step: 1, title: 'Adjust Sliders', description: 'Tune X, Y, Blur, and Spread for each layer.' },
        { step: 2, title: 'Add Layers', description: 'Add secondary layers for realistic ambient lighting.' },
        { step: 3, title: 'Copy Code', description: 'Copy the complete box-shadow rule.' },
      ],
      notes: ['Preview adapts to light and dark theme background contrast.'],
      limitations: ['Filter drop-shadow syntax for non-rectangular PNGs is not covered.'],
    },
    relatedToolSlugs: ['css-gradient-generator', 'css-unit-converter', 'color-converter'],
  },
  {
    id: 'tool-css-unit-converter',
    slug: 'css-unit-converter',
    name: 'PX to REM, EM & VW Converter',
    shortDescription: 'Convert pixel values to REM, EM, and Viewport Width (VW) with custom base font sizes.',
    description:
      'Instantly convert between CSS pixels (px), root-relative units (rem), element-relative units (em), and viewport width units (vw).',
    category: 'css-design',
    icon: 'Scale',
    keywords: ['px to rem', 'rem to px', 'css unit converter', 'px to em', 'px to vw calculator'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'PX to REM & EM Converter — Free CSS Unit Calculator',
      description: 'Convert pixels (px) to REM, EM, and VW units with customizable base font size and viewport dimensions.',
      keywords: ['px to rem converter', 'rem to px', 'css unit converter', 'px to em calculator'],
    },
    features: [
      'Instant conversion between px, rem, em, and vw',
      'Customizable root base font size (default 16px)',
      'Customizable reference viewport width (default 1920px)',
      'One-click copy for each unit',
    ],
    faqs: [
      {
        question: 'Why should I use REM instead of PX in modern web design?',
        answer: 'REM units respect user browser accessibility zoom and text sizing preferences, making websites more accessible.',
      },
    ],
    content: {
      intro: 'Convert design mockup pixel measurements into responsive, accessible CSS units.',
      useCases: 'Translating Figma pixel values into Tailwind/CSS REM units for typography and layouts.',
      howToUse: [
        { step: 1, title: 'Enter Value', description: 'Type the number and select your source unit (px, rem, em, vw).' },
        { step: 2, title: 'Configure Base', description: 'Adjust the root base font size if your project uses non-16px.' },
        { step: 3, title: 'Copy Unit', description: 'Copy the calculated REM or PX value.' },
      ],
      notes: ['Formula: REM = Pixels / Base Font Size.'],
      limitations: ['EM calculations assume the parent element inherits root font size.'],
    },
    relatedToolSlugs: ['css-gradient-generator', 'css-box-shadow-generator'],
  },

  // ==========================================
  // PRODUCTIVITY TOOLS
  // ==========================================
  {
    id: 'tool-pomodoro-timer',
    slug: 'pomodoro-timer',
    name: 'Pomodoro Focus Timer',
    shortDescription: 'Boost productivity with a clean 25-minute Pomodoro focus timer with short and long breaks.',
    description:
      'Minimalist, distraction-free Pomodoro timer. Includes standard 25-minute work focus sessions, 5-minute short breaks, 15-minute long breaks, and session counters.',
    category: 'productivity',
    icon: 'Clock',
    keywords: ['pomodoro timer', 'focus timer', 'online pomodoro', 'study timer', 'work timer'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Pomodoro Focus Timer — Online Study & Work Timer',
      description: 'Boost deep work and study productivity with a distraction-free Pomodoro focus timer and session tracker.',
      keywords: ['pomodoro timer', 'focus timer online', 'productivity timer', 'study timer'],
    },
    features: [
      '25-minute focus, 5-minute short break, and 15-minute long break intervals',
      'Visual progress ring and session counter',
      'Pause, resume, and instant reset controls',
      'Runs locally in browser tab with zero tracking',
    ],
    faqs: [
      {
        question: 'What is the Pomodoro technique?',
        answer: 'The Pomodoro technique breaks work into 25-minute focused intervals separated by 5-minute breaks, taking a longer break every 4 cycles.',
      },
    ],
    content: {
      intro: 'Overcome procrastination and maintain sustained focus during deep work sessions.',
      useCases: 'Studying for exams, writing software code, content drafting, and task management.',
      howToUse: [
        { step: 1, title: 'Select Interval', description: 'Click Focus (25m), Short Break (5m), or Long Break (15m).' },
        { step: 2, title: 'Start', description: 'Click Start to begin your countdown.' },
        { step: 3, title: 'Track Rounds', description: 'Complete 4 sessions to earn a long restorative break.' },
      ],
      notes: ['Keep the browser tab open to ensure uninterrupted countdown.'],
      limitations: ['Audio alerts depend on browser autoplay permissions.'],
    },
    relatedToolSlugs: ['random-picker', 'date-difference-calculator'],
  },
  {
    id: 'tool-random-picker',
    slug: 'random-picker',
    name: 'Random Item Picker & Team Divider',
    shortDescription: 'Pick random winners from a list, shuffle ordering, or divide participants into balanced teams.',
    description:
      'Versatile list randomizer. Pick one or multiple random winners, randomize entire list sequences, or divide names into balanced teams.',
    category: 'productivity',
    icon: 'CheckSquare',
    keywords: ['random picker', 'name picker', 'random choice', 'shuffle list', 'team generator'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free Random Item Picker & Team Divider — Shuffle & Pick Winners',
      description: 'Pick random names from a list, shuffle orders, and divide participants into balanced groups online.',
      keywords: ['random picker', 'random name picker', 'shuffle list online', 'random team generator'],
    },
    features: [
      'Pick N unique random winners from any list',
      'Shuffle entire list order in one click',
      'Divide names or tasks into N balanced groups or teams',
      'Instant copy of all generated selections',
    ],
    faqs: [
      {
        question: 'Are selections truly unbiased?',
        answer: 'Yes, items are selected using unbiased uniform distribution algorithms.',
      },
    ],
    content: {
      intro: 'Make fair, unbiased random selections for contests, standup speaking orders, and team assignments.',
      useCases: 'Classroom student callouts, giveaway drawings, scrum speaking order, and sport team divisions.',
      howToUse: [
        { step: 1, title: 'Enter Items', description: 'Type or paste names or options, one per line.' },
        { step: 2, title: 'Choose Mode', description: 'Click Pick Random Winner(s), Shuffle, or Split Teams.' },
        { step: 3, title: 'Copy Result', description: 'Copy the selected winners or group lists.' },
      ],
      notes: ['Blank lines are automatically filtered out.'],
      limitations: ['Very large lists with over 50,000 items may slow initial rendering.'],
    },
    relatedToolSlugs: ['random-number-generator', 'random-string-nanoid', 'pomodoro-timer'],
  },

  // ==========================================
  // QR & BARCODE TOOLS
  // ==========================================
  {
    id: 'tool-qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create custom QR codes for URLs, text, Wi-Fi networks, vCards, emails, and phone numbers.',
    description:
      'Free, high-resolution QR code generator. Generate QR codes for websites, plain text, Wi-Fi passwords, contact cards, emails, and phone numbers. Download in SVG or high-res PNG.',
    category: 'qr-barcode',
    icon: 'QrCode',
    keywords: ['qr code generator', 'make qr code', 'wifi qr code', 'vcard qr code', 'custom qr code', 'free qr code maker'],
    executionMode: 'client',
    status: 'active',
    isFeatured: true,
    seo: {
      title: 'Free QR Code Generator — URL, Wi-Fi, vCard & Text QR Codes',
      description: 'Generate high-resolution QR codes for websites, Wi-Fi networks, vCards, and emails. Download as SVG or PNG.',
      keywords: ['qr code generator', 'create qr code', 'free qr code maker', 'wifi qr code generator'],
    },
    features: [
      'Templates for URL, Plain Text, Wi-Fi Network, vCard Contact, Email, and Phone',
      'High-resolution vector SVG and 512px PNG image downloads',
      'Custom foreground and background color pickers',
      '100% client-side: QR codes never expire and have no tracking redirects',
    ],
    faqs: [
      {
        question: 'Do these QR codes ever expire?',
        answer: 'No! These are static QR codes that encode your data directly. They work forever without any third-party redirection or subscription.',
      },
      {
        question: 'Can I use the generated QR codes commercially on printed materials?',
        answer: 'Yes, all generated SVG and PNG QR codes are 100% free for personal and commercial print and digital use.',
      },
    ],
    content: {
      intro: 'Create instant, permanent QR codes for marketing flyers, restaurant menus, product packaging, and Wi-Fi access.',
      useCases: 'Sharing guest Wi-Fi networks without typing passwords, printing business cards with vCards, and linking posters to websites.',
      howToUse: [
        { step: 1, title: 'Choose Type', description: 'Select URL, Text, Wi-Fi, vCard, Email, or Phone.' },
        { step: 2, title: 'Enter Info', description: 'Fill in your web address, network credentials, or contact details.' },
        { step: 3, title: 'Download', description: 'Download crisp vector SVG or high-resolution PNG.' },
      ],
      notes: ['Ensure adequate contrast between foreground and background colors for reliable camera scanning.'],
      limitations: ['Extremely long text content creates denser QR patterns that require larger print sizes to scan.'],
    },
    relatedToolSlugs: ['qr-code-reader', 'url-encoder-decoder', 'favicon-generator'],
  },
  {
    id: 'tool-qr-code-reader',
    slug: 'qr-code-reader',
    name: 'QR Code Reader & Scanner',
    shortDescription: 'Scan and decode QR codes from image files directly in your browser.',
    description:
      'Private client-side QR code scanner. Upload any PNG, JPG, WebP, or SVG QR code image to instantly decode and inspect embedded URLs or text.',
    category: 'qr-barcode',
    icon: 'QrCode',
    keywords: ['qr code reader', 'scan qr code', 'qr decoder', 'read qr online', 'qr code scanner'],
    executionMode: 'client',
    status: 'active',
    seo: {
      title: 'Free QR Code Reader & Scanner — Decode QR Images Online',
      description: 'Decode and read QR codes from image files directly in your browser. 100% private with zero server uploads.',
      keywords: ['qr code reader', 'scan qr code online', 'qr code scanner', 'read qr image'],
    },
    features: [
      'Upload images from desktop or mobile devices',
      'Extracts URLs, credentials, and raw text payload',
      'Hardware-accelerated native BarcodeDetector support',
      'Zero server upload: images remain private on your device',
    ],
    faqs: [
      {
        question: 'Is my scanned QR code image sent to a server?',
        answer: 'No. The image is processed entirely inside your local browser memory.',
      },
    ],
    content: {
      intro: 'Safely inspect QR code destinations on your computer without using a phone camera.',
      useCases: 'Checking suspicious QR code links before visiting, extracting Wi-Fi credentials from photos, and verifying printed proofs.',
      howToUse: [
        { step: 1, title: 'Upload Image', description: 'Upload a screenshot or photo containing a QR code.' },
        { step: 2, title: 'View Decoded Text', description: 'Inspect the decoded web link or message.' },
        { step: 3, title: 'Copy', description: 'Copy the decoded content.' },
      ],
      notes: ['Images should have clear contrast and minimal skew for best detection.'],
      limitations: ['Requires clear lighting and unobstructed QR finder patterns.'],
    },
    relatedToolSlugs: ['qr-code-generator', 'url-parser-builder'],
  },
];
