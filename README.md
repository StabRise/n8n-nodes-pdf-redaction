<p align="center">
  <img src="https://pdf-redaction.com/images/pdf-redaction-logo.svg" alt="PDF Redaction" width="345" height="84">
</p>

# n8n-nodes-pdf-redaction

This is an n8n community node. It lets you detect and redact PII (Personally Identifiable Information) in PDF documents using the [PDF Redaction API](https://pdf-redaction.com/) in your n8n workflows.

[PDF Redaction](https://pdf-redaction.com/) is an AI-powered service that automatically finds and redacts sensitive information in PDFs — both digital and scanned (image-based) documents. See the [pdf-redaction-api](https://pdf-redaction.com/docs/api/) documentation for the underlying REST API, and example notebooks.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Anonymize** — redact PII in a PDF, choosing which PII types (tags) to detect and redact (dates, names, emails, addresses, credit cards, etc.)
- **Anonymize with Custom Prompt** — redact information described by a free-text prompt instead of predefined tags (e.g. "Redact all dates, names, and email addresses")
- **Detect PII** — scan a PDF for PII and return the detected entities without redacting the document

All operations read the input PDF from a binary property on the input item and, for the anonymize operations, write the redacted PDF back to a binary property on the output item. Every operation also returns `detected_pii` (entities with bounding boxes) and `processing_time` metrics in the output JSON.

### What it can detect and redact

Dates, person names, organizations, locations, emails, phone numbers, IDs, account numbers, zip codes, addresses, IP addresses, URLs, SSNs, driver licenses, passports, passwords, ages, credit card numbers, money amounts, signatures, QR codes, and faces — plus your own custom tags. Detection works on both digital PDFs and scanned/image-based PDFs (via OCR, with support for multiple languages), including rotated text.

### Limits

Only the first 10 pages of a document are processed per request, and free-tier accounts are additionally capped (at the time of writing: 10 pages/request, 100 requests/month, 5 requests/minute) — check your plan at [pdf-redaction.com/apikeys](https://pdf-redaction.com/apikeys/) for current limits.

## Credentials

This node uses an API key credential (**PDF Redaction API**):

1. Go to [pdf-redaction.com/apikeys](https://pdf-redaction.com/apikeys/) and generate an API key.
2. In n8n, create a new **PDF Redaction API** credential and paste the key into the **API Key** field.

<p align="center">
  <img src="docs/images/20-api-keys.jpg" alt="PDF Redaction API Keys page" width="700">
</p>

## Compatibility

Compatible with n8n@1.60.0 or later

## Usage

Track how much of your plan's quota you've used on the [API Usage](https://pdf-redaction.com/apikeys/usage/) page — it shows your current usage against your plan limit and a daily breakdown chart.

<p align="center">
  <img src="docs/images/19-api-usage.jpg" alt="PDF Redaction API Usage page" width="700">
</p>

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [PDF Redaction website](https://pdf-redaction.com/)
* [PDF Redaction API docs (Swagger)](https://api.pdf-redaction.com/api/docs)
* [PDF Redaction API key management](https://pdf-redaction.com/apikeys/)
* [pdf-redaction-api](https://github.com/StabRise/pdf-redaction-api) — Python client, example notebooks, and self-hosting instructions for the underlying API
