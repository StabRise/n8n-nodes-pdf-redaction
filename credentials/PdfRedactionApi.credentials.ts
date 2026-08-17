import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PdfRedactionApi implements ICredentialType {
	name = 'pdfRedactionApi';

	displayName = 'PDF Redaction API';

	icon: Icon = 'file:../icons/pdf-redaction.svg';

	documentationUrl = 'https://pdf-redaction.com/apikeys/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Log in and generate a free API key at https://pdf-redaction.com/apikeys/ (free limit: 100 pages/month)',
			hint: 'Log in and generate a free API key at https://pdf-redaction.com/apikeys/. Free limit is 100 pages per month.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.pdf-redaction.com/api',
			url: '/auth/whoami',
			method: 'GET',
		},
	};
}
