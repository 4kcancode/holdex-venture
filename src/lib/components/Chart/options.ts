import { timeFormat } from '$components/DateManager';
import { formatNumber } from '$components/NumbersManager';
import type { ApexOptions } from 'apexcharts';

const mockData = [
	{
		timestamp: 1681290123368,
		price: 0.035993319443246505,
	},
	{
		timestamp: 1681293721302,
		price: 0.035934707581765264,
	},
	{
		timestamp: 1681297308297,
		price: 0.03597092925983303,
	},
	{
		timestamp: 1681300920773,
		price: 0.035904999916302305,
	},
	{
		timestamp: 1681304473774,
		price: 0.03607720049708347,
	},
	{
		timestamp: 1681308111668,
		price: 0.03618959075666688,
	},
	{
		timestamp: 1681311720027,
		price: 0.0360164454659588,
	},
	{
		timestamp: 1681315317924,
		price: 0.0361003232640066,
	},
	{
		timestamp: 1681318872398,
		price: 0.036204064301809176,
	},
	{
		timestamp: 1681322463090,
		price: 0.03620974796989322,
	},
	{
		timestamp: 1681326106295,
		price: 0.03592156289123403,
	},
	{
		timestamp: 1681329722263,
		price: 0.03587027487240972,
	},
	{
		timestamp: 1681333318697,
		price: 0.03587050570983321,
	},
	{
		timestamp: 1681336907175,
		price: 0.03582623967900802,
	},
	{
		timestamp: 1681340470912,
		price: 0.035754151476982916,
	},
	{
		timestamp: 1681344074478,
		price: 0.03576484714528924,
	},
	{
		timestamp: 1681347674139,
		price: 0.03566404584840257,
	},
	{
		timestamp: 1681351316121,
		price: 0.03579528801169165,
	},
	{
		timestamp: 1681354875420,
		price: 0.035832417839273156,
	},
	{
		timestamp: 1681358520640,
		price: 0.035922165859558895,
	},
	{
		timestamp: 1681362110090,
		price: 0.03589814873006134,
	},
	{
		timestamp: 1681365724368,
		price: 0.03607679634636726,
	},
	{
		timestamp: 1681369275835,
		price: 0.03608639125916783,
	},
	{
		timestamp: 1681372883131,
		price: 0.036126450156720946,
	},
	{
		timestamp: 1681375060000,
		price: 0.036089062814708424,
	},
];

const bindFill = (isMock: boolean) => {
	if (isMock) {
		return {
			type: 'solid',
			colors: ['#252933'],
		};
	}
	return {
		type: 'gradient',
		gradient: {
			type: 'vertical',
			shadeIntensity: 1,
			opacityFrom: 0.8,
			opacityTo: 0,
			stops: [0, 100],
			gradientToColors: ['rgba(0, 170, 255, 0)'],
		},
	};
};

const generateOptions = (data: any[] | null, isMock: boolean): ApexOptions => {
	if (isMock) {
		data = mockData;
	}
	const pricesMap = data?.map((v) => v.price) || [];
	const datesMap = data?.map((v) => v.timestamp) || [];

	const min = Math.min(...pricesMap);
	const max = Math.max(...pricesMap);
	const step = (max - min) / 10;

	return {
		series: [
			{
				name: 'Price',
				data: pricesMap,
			},
		],
		labels: datesMap,
		chart: {
			type: 'area',
			height: '100%',
			width: '100%',
			zoom: {
				enabled: false,
			},
			redrawOnParentResize: true,
			redrawOnWindowResize: true,
			offsetX: 0,
			offsetY: -29,
			parentHeightOffset: 0,
			toolbar: {
				show: false,
			},
			sparkline: {
				enabled: true,
			},
			animations: {
				enabled: true,
				easing: 'easeinout',
				speed: 300,
				animateGradually: {
					enabled: true,
					delay: 150,
				},
				dynamicAnimation: {
					enabled: true,
					speed: 350,
				},
			},
		},
		fill: bindFill(isMock),
		stroke: {
			curve: 'smooth',
			width: 2,
			lineCap: 'butt',
			colors: [isMock ? 'rgb(57,61,71)' : 'rgb(0, 204, 255)'],
		},
		dataLabels: {
			enabled: false,
		},
		grid: {
			xaxis: {
				lines: {
					show: false,
				},
			},
			yaxis: {
				lines: {
					show: false,
				},
			},
			padding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
		},
		xaxis: {
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			crosshairs: {
				show: false,
			},
			tooltip: {
				enabled: false,
			},
		},
		yaxis: {
			show: false,
			max: max + step,
			min: min - step,
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			crosshairs: {
				show: false,
			},
			tooltip: {
				enabled: false,
			},
		},
		legend: {
			show: false,
			showForSingleSeries: false,
			showForNullSeries: false,
			showForZeroSeries: false,
			position: 'bottom',
		},
		tooltip: {
			followCursor: true,
			shared: false,
			custom: ({ dataPointIndex, series, seriesIndex }) => {
				const price = series[seriesIndex][dataPointIndex - 1];
				const time = datesMap[dataPointIndex - 1];
				return `
                    <span class="text-footnote mb-1 block">${timeFormat(
											time,
											'DD-MMM-YYYY, HH:mm'
										)}</span>
                    <span class="text-footnote text-t3">
                        Price: 
                        <span class="text-t1">$${formatNumber(price, '0,0[.]000000')}</span>
                    </span>`;
			},
			x: {
				show: false,
			},
			marker: {
				show: false,
			},
			style: {
				fontFamily: 'inherit',
			},
		},
	};
};

export { generateOptions };
