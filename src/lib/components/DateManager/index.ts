import moment from 'moment';
import type { unitOfTime, Moment } from 'moment';

moment.updateLocale('en', {
	relativeTime: {
		s: 'a few seconds',
		ss: '%d seconds',
		m: '1 minute',
		h: '1 hour',
		d: '1 day',
		M: '1 month',
		y: '1 year',
	},
});


const howFarFromNow = (endsAt:Date) => moment(endsAt).toNow();

const timeFormat = (time: number | string, format = 'DD MMM YYYY') => moment(time).format(format);

const extendedTimeFormat = (time: number | string) => timeFormat(time, 'MMM DD, YYYY HH:mm A Z');

const customFormat = (time: any, format = '--') => {
	switch (true) {
		case Math.floor(time / 31536000) >= 1:
			return `${Math.floor(time / 31536000)} years`;
		case Math.floor(time / 2592000) >= 1:
			return `${Math.floor(time / 2592000)} months`;
		case Math.floor(time / 86400) >= 1:
			return `${Math.floor(time / 86400)} days`;
		case Math.floor(time / 3600) >= 1:
			return `${Math.floor(time / 3600)} hours`;
		case Math.floor(time / 60) >= 1:
			return `${Math.floor(time / 60)} min`;
		case time < 60 && time > 0:
			return `${Math.floor(time)}s`;
		default:
			return format;
	}
};

const durationOf = (time: number | string) => {
	if (time === '0') {
		return 'NA';
	}
	return moment.duration(Number(time), 'seconds').humanize();
};

export type { unitOfTime, Moment }
export { howFarFromNow, timeFormat, moment, customFormat, durationOf, extendedTimeFormat }
