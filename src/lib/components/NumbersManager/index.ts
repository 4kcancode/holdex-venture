import numeral from 'numeral';

function formatNumber(number: any, format: string) {
	return numeral(number).format(format);
}

export { formatNumber, numeral };
