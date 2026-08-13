import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';

import { pdfRedactionApiRequest } from '../shared/transport';

export const anonymizeCustomPromptProperties: INodeProperties[] = [
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property containing the PDF to anonymize',
		displayOptions: {
			show: {
				operation: ['anonymizeCustomPrompt'],
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
				operation: ['anonymizeCustomPrompt'],
			},
		},
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		placeholder: 'Redact all dates, names, and email addresses',
		description: 'Free-text prompt describing what information should be detected and redacted',
		displayOptions: {
			show: {
				operation: ['anonymizeCustomPrompt'],
			},
		},
	},
];

export async function executeAnonymizeCustomPrompt(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const outputBinaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', i) as string;
	const prompt = this.getNodeParameter('prompt', i) as string;

	const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

	const body: IDataObject = {
		pdf: buffer.toString('base64'),
		prompt,
	};

	const response = await pdfRedactionApiRequest.call(this, 'POST', '/anonymize/custom/pdf', body);

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
