# End-to-end tutorial: redact a PDF fetched over HTTP

This tutorial builds a complete, runnable n8n workflow that:

1. Fetches a real PDF over HTTP with the **HTTP Request** node.
2. Redacts the faces in it with the **PDF Redaction** node.
3. Shows the redacted file and detection results in the output panel.

It uses a public sample file from the [pdf-redaction-api](https://github.com/StabRise/pdf-redaction-api) repository — [`SampleWithFace.pdf`](https://github.com/StabRise/pdf-redaction-api/blob/main/examples/pdfs/SampleWithFace.pdf) — so you can reproduce every step with no files of your own.

For the general setup/configuration walkthrough, see [install.md](install.md) first. This guide assumes the node is installed and you have a **PDF Redaction API** credential already.

## 1. Trigger + HTTP Request

Start with a **Manual Trigger**, then add an **HTTP Request** node with:

- **Method**: `GET`
- **URL**: `https://raw.githubusercontent.com/StabRise/pdf-redaction-api/main/examples/pdfs/SampleWithFace.pdf`
- **Options → Response → Response Format**: `File`

Execute the node. The response comes back as binary data in the `data` field:

![HTTP Request node output showing the fetched SampleWithFace.pdf binary data](images/10-e2e-http-request-fetch.jpg)

## 2. PDF Redaction — Anonymize the "Face" tag

Add a **PDF Redaction** node after the HTTP Request node. It picks up the `data` binary field automatically (both **Input Binary Field** and **Output Binary Field** default to `data`, matching what HTTP Request produced).

Set:

- **Credential**: your **PDF Redaction API** credential
- **Operation**: `Anonymize`
- **Additional Fields → Tags**: `Face`

![PDF Redaction node configured with the Anonymize operation and Face tag, reading input from the HTTP Request node](images/11-e2e-pdf-redaction-configured.jpg)

## 3. Execute and inspect the output

Click **Execute step**. The node calls the PDF Redaction API and returns:

- A redacted PDF (`redacted.pdf`) in the output binary field, with the face blacked out.
- A JSON payload with `detected_pii` (entities found, here two `FACE` entries with bounding boxes) and a `processing_time` breakdown per pipeline stage.

**JSON output:**

![Output JSON panel showing detected_pii FACE entities with bounding boxes and processing_time for the anonymize run](images/12-e2e-output-json.jpg)

**Binary output:**

![Output Binary panel showing the redacted.pdf file, 377 kB](images/13-e2e-output-binary.jpg)

The original file was 823 kB; the redacted output is 377 kB, since the API flattens the processed page(s) to a compact PDF.

## 4. The processed PDF

Opening the downloaded `redacted.pdf` confirms both faces on the page are blacked out:

![Rendered page of the redacted PDF, showing both faces blacked out](images/15-e2e-redacted-pdf-content.jpg)

## 5. The complete workflow

All three nodes wired together, each showing a successful execution (green checkmarks):

![Complete workflow: Manual Trigger → HTTP Request → PDF Redaction, all executed successfully](images/14-e2e-full-workflow.jpg)

## Adapting this to your own files

Swap the HTTP Request node for whatever produces your PDF as binary data — a webhook payload, a **Read/Write File from Disk** node, an email attachment (via an email trigger), or a file from cloud storage (S3, Google Drive, etc.). As long as the upstream node writes binary data to a field, and the PDF Redaction node's **Input Binary Field** matches that field name, this same pattern applies.
