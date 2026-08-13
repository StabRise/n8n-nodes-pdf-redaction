import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';

import { LANG_OPTIONS, TAG_OPTIONS } from '../shared/descriptions';
import { pdfRedactionApiRequest } from '../shared/transport';

export const anonymizeProperties: INodeProperties[] = [
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property containing the PDF to anonymize',
		displayOptions: {
			show: {
				operation: ['anonymize'],
			},
		},
	},
	{
		displayName: 'Output Binary Field',
		name: 'outputBinaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property to write the anonymized PDF to',
		displayOptions: {
			show: {
				operation: ['anonymize'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['anonymize'],
			},
		},
		options: [
			{
				displayName: 'Custom Tags',
				name: 'customTags',
				type: 'string',
				default: '',
				placeholder: 'PROJECT_CODE, INTERNAL_ID',
				description: 'Comma-separated list of extra tag names to detect and redact, appended to the standard tags',
			},
			{
				displayName: 'Force OCR',
				name: 'forceOcr',
				type: 'boolean',
				default: false,
				description: 'Whether to force OCR processing even if text is extractable from the PDF',
			},
			{
				displayName: 'Min Chunk Size',
				name: 'minChunkSize',
				type: 'number',
				default: 0,
				description: 'Minimum chunk size used to control text segmentation for NER processing',
			},
			{
				displayName: 'OCR Languages',
				name: 'ocrLangs',
				type: 'multiOptions',
				options: LANG_OPTIONS,
				default: ['eng'],
				description: 'Languages to use for OCR text recognition',
			},
			{
				displayName: 'Redact Text',
				name: 'redactText',
				type: 'boolean',
				default: true,
				description: 'Whether to redact detected PII entities using NER-based text redaction',
			},
			{
				displayName: 'Rotated Text',
				name: 'rotatedText',
				type: 'boolean',
				default: false,
				description: 'Whether to enable detection and recognition of rotated text',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'multiOptions',
				options: TAG_OPTIONS,
				default: [],
				description: 'PII types to detect and redact. If none are selected, all tags are used.',
			},
		],
	},
];

export async function executeAnonymize(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const outputBinaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

	const body: IDataObject = {
		pdf: buffer.toString('base64'),
	};

	if (additionalFields.tags) {
		body.tags = additionalFields.tags;
	}
	if (additionalFields.customTags) {
		body.custom_tags = (additionalFields.customTags as string)
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);
	}
	if (additionalFields.forceOcr !== undefined) {
		body.force_ocr = additionalFields.forceOcr;
	}
	if (additionalFields.ocrLangs) {
		body.ocr_langs = additionalFields.ocrLangs;
	}
	if (additionalFields.rotatedText !== undefined) {
		body.rotated_text = additionalFields.rotatedText;
	}
	if (additionalFields.redactText !== undefined) {
		body.redact_text = additionalFields.redactText;
	}
	if (additionalFields.minChunkSize !== undefined) {
		body.min_chunk_size = additionalFields.minChunkSize;
	}

	const response = await pdfRedactionApiRequest.call(this, 'POST', '/anonymize/pdf', body);

	const binaryData = await this.helpers.prepareBinaryData(
		Buffer.from(response.pdf as string, 'base64'),
		'redacted.pdf',
		'application/pdf',
	);

	return {
		json: {
			detected_pii: response.detected_pii,
			processing_time: response.processing_time,
		},
		binary: {
			[outputBinaryPropertyName]: binaryData,
		},
		pairedItem: { item: i },
	};
}
