
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				surana: {
					50: '#f8f5f2',
					100: '#f0ebe3',
					200: '#e1d3c5',
					300: '#d2b9a5',
					400: '#bd9c84',
					500: '#a07e63',
					600: '#8c6950',
					700: '#755442',
					800: '#634739',
					900: '#503a2f',
					950: '#2c1f19',
				},
				sage: {
					50: '#f5f7f5',
					100: '#dfe8e0',
					200: '#c0d1c2',
					300: '#9bb49e',
					400: '#769479',
					500: '#5c7a5f',
					600: '#46624a',
					700: '#384e3b',
					800: '#2d3e31',
					900: '#243227',
					950: '#131c16',
				},
				terracotta: {
					50: '#fbf4f2',
					100: '#f8e7e2',
					200: '#f2cfc5',
					300: '#e9b0a0',
					400: '#de886d',
					500: '#d56f4e',
					600: '#c65436',
					700: '#a6442d',
					800: '#893a2b',
					900: '#713329',
					950: '#3d1915',
				}
			},
			fontFamily: {
				sans: ['DM Sans', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				fadeIn: 'fadeIn 0.5s ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
