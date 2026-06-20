/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

	theme: {
		extend: {
			colors: {
				wise: {
					green: "#9fe870",
					active: "#cdffad",
					neutral: "#c5edab",
					pale: "#e2f6d5",

					canvas: "#ffffff",
					canvasSoft: "#e8ebe6",

					ink: "#0e0f0c",
					inkDeep: "#163300",
					body: "#454745",
					mute: "#868685",

					positive: "#2ead4b",
					positiveDeep: "#054d28",

					warning: "#ffd11a",
					warningDeep: "#b86700",
					warningContent: "#4a3b1c",

					negative: "#d03238",
					negativeDeep: "#a72027",
					negativeDarkest: "#a7000d",
					negativeBg: "#320707",

					orange: "#ffc091",
					cyan: "#38c8ff",
				},
			},

			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
			},

			fontSize: {
				"display-mega": ["126px", { lineHeight: "107.1px", fontWeight: "900" }],
				"display-xxl": ["96px", { lineHeight: "81.6px", fontWeight: "900" }],
				"display-xl": ["64px", { lineHeight: "54.4px", fontWeight: "900" }],
				"display-lg": ["47px", { lineHeight: "70.5px", fontWeight: "400" }],
				"display-md": ["40px", { lineHeight: "34px", fontWeight: "900" }],
				"display-sm": ["32px", { lineHeight: "38.4px", fontWeight: "600" }],
				"display-xs": ["24px", { lineHeight: "31.2px", fontWeight: "600" }],

				"body-lg": ["20px", { lineHeight: "30px", fontWeight: "400" }],
				"body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
				"body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
				caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
			},

			spacing: {
				xxs: "2px",
				xs: "4px",
				sm: "8px",
				md: "12px",
				lg: "16px",
				xl: "24px",
				"2xl": "32px",
				"3xl": "48px",
			},

			borderRadius: {
				wiseSm: "8px",
				wiseMd: "12px",
				wiseLg: "16px",
				wiseXl: "24px",
				wisePill: "9999px",
			},
		},
	},

	plugins: [],
};
