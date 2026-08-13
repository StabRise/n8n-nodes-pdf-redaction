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
			description: 'Generate an API key at https://pdf-redaction.com/apikeys/',
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
