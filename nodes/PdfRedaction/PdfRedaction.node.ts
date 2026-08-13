import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { anonymizeProperties, executeAnonymize } from './operations/anonymize';
import {
	anonymizeCustomPromptProperties,
	executeAnonymizeCustomPrompt,
} from './operations/anonymizeCustomPrompt';
import { detectPiiProperties, executeDetectPii } from './operations/detectPii';

export class PdfRedaction implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDF Redaction',
		name: 'pdfRedaction',
		icon: 'file:../../icons/pdf-redaction.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Detect and redact PII in PDF documents using the PDF Redaction API',
		defaults: {
			name: 'PDF Redaction',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'pdfRedactionApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Anonymize',
						value: 'anonymize',
						description: 'Redact PII in a PDF using a set of PII tags',
						action: 'Anonymize a PDF using tags',
					},
					{
						name: 'Anonymize with Custom Prompt',
						value: 'anonymizeCustomPrompt',
						description: 'Redact information in a PDF described by a free-text prompt',
						action: 'Anonymize a PDF using a custom prompt',
					},
					{
						name: 'Detect PII',
						value: 'detectPii',
						description: 'Detect PII in a PDF without redacting it',
						action: 'Detect PII in a PDF',
					},
				],
				default: 'anonymize',
			},
			...anonymizeProperties,
			...anonymizeCustomPromptProperties,
			...detectPiiProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let executionData: INodeExecutionData;

				if (operation === 'anonymize') {
					executionData = await executeAnonymize.call(this, i);
				} else if (operation === 'anonymizeCustomPrompt') {
					executionData = await executeAnonymizeCustomPrompt.call(this, i);
				} else if (operation === 'detectPii') {
					executionData = await executeDetectPii.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
				}

				returnData.push(executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
