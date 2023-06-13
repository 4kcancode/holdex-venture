import numeral from 'numeral';

const formatNumber = (number: any, format: string) => numeral(number).format(format);

export { formatNumber, numeral };
