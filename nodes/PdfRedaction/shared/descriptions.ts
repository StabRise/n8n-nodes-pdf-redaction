import type { INodePropertyOptions } from 'n8n-workflow';

export const TAG_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Account', value: 'ACCOUNT' },
	{ name: 'Address', value: 'ADDRESS' },
	{ name: 'Age', value: 'AGE' },
	{ name: 'Credit Card', value: 'CREDIT_CARD' },
	{ name: 'Date', value: 'DATE' },
	{ name: 'Driver License', value: 'DRIVER_LICENSE' },
	{ name: 'Email', value: 'EMAIL' },
	{ name: 'Face', value: 'FACE' },
	{ name: 'ID', value: 'ID' },
	{ name: 'IP Address', value: 'IP' },
	{ name: 'Location', value: 'LOCATION' },
	{ name: 'Money Amount', value: 'MONEY_AMOUNT' },
	{ name: 'Organization', value: 'ORGANIZATION' },
	{ name: 'Passport', value: 'PASSPORT' },
	{ name: 'Password', value: 'PASSWORD' },
	{ name: 'Person Name', value: 'PERSON_NAME' },
	{ name: 'Phone', value: 'PHONE' },
	{ name: 'QR Code', value: 'QR_CODE' },
	{ name: 'Signature', value: 'SIGNATURE' },
	{ name: 'SSN', value: 'SSN' },
	{ name: 'URL', value: 'URL' },
	{ name: 'Zip Code', value: 'ZIP_CODE' },
];

export const LANG_OPTIONS: INodePropertyOptions[] = [
	{ name: 'English', value: 'eng' },
	{ name: 'French', value: 'fra' },
	{ name: 'German', value: 'deu' },
	{ name: 'Italian', value: 'ita' },
	{ name: 'Portuguese', value: 'por' },
	{ name: 'Russian', value: 'rus' },
	{ name: 'Spanish', value: 'spa' },
];
