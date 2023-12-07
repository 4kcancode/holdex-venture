/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,svelte,ts,sass,scss,pug}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    borderRadius: {
      ...defaultTheme.borderRadius,
      '2sm': '4px',
      '2lg': '10px',
      'base-radius': '20px',
      underbase: '11px',
    },
    screens: {
      // 'rwd' (now 'up') means "Responsive Web Design". And these breakpoints follow/match the breakpoints in the actual Figma while adhering to the Mobile-first RWD principle.
      'xs-up': '375px',
      'sm-up': '480px',
      'md-up': '768px',
      'lg-up': '992px',
      'xl-up': '1200px',
      '2xl-up': '1440px',
      xl: {
        min: '1680px',
        limit: '1920px',
      },
      lg: {
        min: '1440px',
        max: '1679px',
      },
      md: {
        min: '1200px',
        max: '1439px',
      },
      tb: {
        min: '992px',
        max: '1199px',
      },
      sm: {
        min: '768px',
        max: '991px',
      },
      xs: {
        min: '320px',
        max: '767px',
      },
      xxs: {
        min: '320px',
        max: '374px',
      },
      mobile: {
        min: '320px',
        max: '479px',
      },
      tbDown: {
        raw: '(max-width: 1199px)',
      },
      smDown: {
        raw: '(max-width: 991px)',
      },
    },
    colors: {
      white: 'white',
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      l1: 'rgb(var(--l1) / <alpha-value>)',
      l2: 'rgb(var(--l2) / <alpha-value>)',
      l3: 'rgb(var(--l3) / <alpha-value>)',
      l4: 'rgb(var(--l4) / <alpha-value>)',
      l5: 'rgb(var(--l5) / <alpha-value>)',
      l6: 'rgb(var(--l6) / <alpha-value>)',
      t1: 'rgb(var(--t1) / <alpha-value>)',
      t2: 'rgb(var(--t2) / <alpha-value>)',
      t3: 'rgb(var(--t3) / <alpha-value>)',
      t4: 'rgb(var(--t4) / <alpha-value>)',

      'accent1-default': 'rgb(var(--accent1-default) / <alpha-value>)',
      'accent1-active': 'rgb(var(--accent1-active) / <alpha-value>)',
      'accent2-default': 'rgb(var(--accent2-default) / <alpha-value>)',
      'accent2-active': 'rgb(var(--accent2-active) / <alpha-value>)',
      'accent3-default': 'rgb(var(--accent3-default) / <alpha-value>)',
      'accent3-active': 'rgb(var(--accent3-active) / <alpha-value>)',

      'rating-a': 'rgb(var(--rating-a) / <alpha-value>)',
      'rating-b': 'rgb(var(--rating-b) / <alpha-value>)',
      'rating-c': 'rgb(var(--rating-c) / <alpha-value>)',

      'tw-colors-blue': 'rgb(var(--colors-blue) / <alpha-value>)',
      'tw-colors-purple': 'rgb(var(--colors-purple) / <alpha-value>)',
      'tw-accents-1': 'rgb(var(--accents-1) / <alpha-value>)',
      'tw-accents-2': 'rgb(var(--accents-2) / <alpha-value>)',
      'tw-accents-3': 'rgb(var(--accents-3) / <alpha-value>)',
      'tw-accents-4': 'rgb(var(--accents-4) / <alpha-value>)',
      'tw-accents-5': 'rgb(var(--accents-5) / <alpha-value>)',
      'tw-bg-color': 'rgb(var(--bg-color) / <alpha-value>)',
      'tw-link-color': 'rgb(var(--link-color) / <alpha-value>)',
      'tw-poll-bar-color': 'rgb(var(--poll-bar-color) / <alpha-value>)',
      'tw-inline-code-color': 'rgb(var(--inline-code-color) / <alpha-value>)',
      'tw-code-color': 'rgb(var(--code-color) / <alpha-value>)',
      'tw-code-bg-color': 'rgb(var(--code-bg-color) / <alpha-value>)',
      'tw-tweet-font-color': 'rgb(var(--tweet-font-color) / <alpha-value>)',
      'tw-tweet-bg-color': 'rgb(var(--tweet-bg-color) / <alpha-value>)',
      'tw-tweet-link-color': 'rgb(var(--tweet-link-color) / <alpha-value>)',
      'tw-tweet-link-color-hover': 'rgb(var(--tweet-link-color-hover) / <alpha-value>)',
      'tw-tweet-color-gray': 'rgb(var(--tweet-color-gray) / <alpha-value>)',
      'tw-tweet-color-red': 'rgb(var(--tweet-color-red) / <alpha-value>)',
      'tw-tweet-btn-color': 'rgb(var(--tweet-btn-color) / <alpha-value>)',
      'tw-tweet-border': 'rgb(var(--tweet-border) / <alpha-value>)',
      'tw-tweet-border-hover': 'rgb(var(--tweet-border-hover) / <alpha-value>)',
      'tw-tweet-avatar-border': 'rgb(var(--tweet-avatar-border) / <alpha-value>)',
      'tw-tweet-btn-border': 'rgb(var(--tweet-btn-border) / <alpha-value>)',
    },
    fontSize: {
      ...defaultTheme.fontSize,
      'title-l': [
        '56px',
        {
          lineHeight: '64px',
          fontWeight: '900',
        },
      ],
      'title-s': [
        '48px',
        {
          lineHeight: '48px',
          fontWeight: '900',
        },
      ],
      'subtitle-l': [
        '20px',
        {
          lineHeight: '32px',
          fontWeight: '500',
        },
      ],
      'subtitle-xl': [
        '24px',
        {
          lineHeight: '32px',
          fontWeight: '500',
        },
      ],
      'subtitle-s': [
        '18px',
        {
          lineHeight: '32px',
          fontWeight: '500',
        },
      ],
      'h1-l': [
        '48px',
        {
          lineHeight: '64px',
          fontWeight: '900',
        },
      ],
      'h1-s': [
        '42px',
        {
          lineHeight: '48px',
          fontWeight: '900',
        },
      ],
      'h2-l': [
        '32px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h2-s': [
        '28px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h3-l': [
        '28px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h3-s': [
        '24px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h4-l': [
        '24px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h4-s': [
        '20px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h5-l': [
        '20px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h5-s': [
        '18px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h6-l': [
        '18px',
        {
          lineHeight: '32px',
          fontWeight: '900',
        },
      ],
      'h6-s': [
        '16px',
        {
          lineHeight: '16px',
          fontWeight: '900',
        },
      ],
      'paragraph-l': [
        '18px',
        {
          lineHeight: '32px',
          fontWeight: '400',
        },
      ],
      'paragraph-s': [
        '16px',
        {
          lineHeight: '32px',
          fontWeight: '400',
        },
      ],
      cta: [
        '14px',
        {
          lineHeight: '32px',
          fontWeight: '700',
        },
      ],
      footnote: [
        '14px',
        {
          lineHeight: '20px',
          fontWeight: '500',
        },
      ],
      caption: [
        '12px',
        {
          lineHeight: '16px',
          fontWeight: '500',
        },
      ],
      code: [
        '14px',
        {
          lineHeight: '32px',
          fontWeight: '600',
        },
      ],
    },
    fontFamily: {
      inter: ['"Inter"'],
      satoshi: ['"Satoshi"'],
      mono: ['"JetBrains Mono"'],
    },
    extend: {
      spacing: {
        0.75: '0.1875rem',
        1.25: '0.3125rem',
        1.75: '0.4375rem',
        2.25: '0.5625rem',
        2.75: '0.6875rem',
        3.75: '0.9375rem',
        5.5: '1.375rem',
        5.75: '1.4375rem',
        6.5: '1.625rem',
        8.5: '2.125rem',
        '11/25': '44%',
        '1/2': '50%',
        19: '4.75rem',
        21: '5.438rem',
        23: '5.75rem',
        25: '6.25rem',
        30: '7.5rem',
        31: '7.75rem',
        37: '8.563rem',
        41: '10.563rem',
        54: '13.5rem',
        61: '15.25rem',
        578: '36.125rem',
        636: '39.75rem',
      },
      opacity: {
        15: '0.15',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        1: '1',
        9: '9',
      },
      backdropBlur: {
        overlay: '5px',
      },
      boxShadow: {
        ...defaultTheme.boxShadow,
        input:
          '0px 0px 0px 2px rgba(0, 0, 0, var(--shadow-button-ring-alpha)), 0px 4px 8px rgba(0, 0, 0, var(--shadow-input-alpha))',
        tag: '0px 4px 8px rgba(0, 0, 0, 0.16)',
        'tag-active':
          ' 0px 0px 0px 2px rgba(0, 204, 255, var(--shadow-button-ring-alpha)), 0px 4px 8px rgba(0, 0, 0, 0.16)',
        button:
          '0px 0px 0px 2px rgba(0, 0, 0, var(--shadow-button-ring-alpha)), 0px 4px 8px rgba(0, 0, 0, var(--shadow-input-alpha)), inset 0px 2px 0px rgba(255, 255, 255, 0.24)',
        'button-hover':
          '0px 0px 0px 2px rgba(0, 0, 0, var(--shadow-button-ring-alpha)), 0px 4px 12px rgba(0, 0, 0, 0.24), inset 0px 2px 0px rgba(255, 255, 255, 0.24)',
        'button-active':
          '0px 0px 0px 2px rgba(0, 204, 255, var(--shadow-button-ring-alpha)), 0px 4px 12px rgba(0, 0, 0, 0.24), inset 0px 2px 0px rgba(255, 255, 255, 0.24)',
        'secondary-button':
          '0px 0px 0px 2px rgba(0, 0, 0, var(--shadow-button-ring-alpha)), 0px 0px 8px rgba(0, 0, 0, var(--shadow-button-ring-alpha)), inset 0px 2px 0px rgba(255, 255, 255, 0.04)',
        'secondary-button-hover':
          '0px 0px 0px 2px rgba(0, 0, 0, var(--shadow-button-ring-alpha)), 0px 4px 12px rgba(0, 0, 0, 0.24), inset 0px 2px 0px rgba(255, 255, 255, 0.04)',
        'secondary-button-active':
          '0px 0px 0px 2px rgba(0, 204, 255, var(--shadow-button-ring-alpha)), 0px 4px 12px rgba(0, 0, 0, 0.24), inset 0px 2px 0px rgba(255, 255, 255, 0.04)',
      },
      minHeight: {
        32: '8rem',
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 10s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
