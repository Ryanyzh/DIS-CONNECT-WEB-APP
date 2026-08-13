/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

	theme: {
		extend: {
			colors: {
				// Dis-Connect brand palette
				dc: {
					// Backgrounds
					bg:            "#F7F5FF",  // light page background
					surface:       "#FFFFFF",  // light card surface
					elevated:      "#F0EEFF",  // light elevated card
					"surface-dark":  "#170A75", // dark card surface
					"elevated-dark": "#21108A", // dark elevated card
					navy:          "#0F035C",  // dark page background / light main text

					// Brand
					primary:       "#742DF2",
					"primary-hover": "#9F31F7",
					secondary:     "#1C61F1",
					"secondary-hover": "#193CDE",
					accent:        "#4F34EE",

					// Text
					text:          "#0F035C",  // light main text
					"text-sub":    "#433878",  // light secondary text
					"text-muted":  "#847EAB",  // muted (same both modes)
					"text-subtle": "#C8C3E8",  // dark secondary text

					// Borders
					border:        "#DDD7FF",
					"border-dark": "#372098",

					// Semantic — light mode
					success:       "#0284C7",
					warning:       "#D97706",
					error:         "#DC2626",

					// Semantic — dark mode
					"success-dark": "#2DD4FF",
					"warning-dark": "#FBBF24",
					"error-dark":   "#F43F5E",
				},

				// Legacy wise tokens (kept for non-ticket pages)
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
				"display-xxl":  ["96px",  { lineHeight: "81.6px",  fontWeight: "900" }],
				"display-xl":   ["64px",  { lineHeight: "54.4px",  fontWeight: "900" }],
				"display-lg":   ["47px",  { lineHeight: "70.5px",  fontWeight: "400" }],
				"display-md":   ["40px",  { lineHeight: "34px",    fontWeight: "900" }],
				"display-sm":   ["32px",  { lineHeight: "38.4px",  fontWeight: "600" }],
				"display-xs":   ["24px",  { lineHeight: "31.2px",  fontWeight: "600" }],

				"body-lg": ["20px", { lineHeight: "30px", fontWeight: "400" }],
				"body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
				"body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
				caption:   ["12px", { lineHeight: "16px", fontWeight: "400" }],
			},

			spacing: {
				xxs: "2px",
				xs:  "4px",
				sm:  "8px",
				md:  "12px",
				lg:  "16px",
				xl:  "24px",
				"2xl": "32px",
				"3xl": "48px",
			},

			borderRadius: {
				wiseSm:   "8px",
				wiseMd:   "12px",
				wiseLg:   "16px",
				wiseXl:   "24px",
				wisePill: "9999px",
			},

			boxShadow: {
				"dc-sm": "0 1px 3px 0 rgb(15 3 92 / 0.08), 0 1px 2px -1px rgb(15 3 92 / 0.06)",
				"dc-md": "0 4px 6px -1px rgb(15 3 92 / 0.10), 0 2px 4px -2px rgb(15 3 92 / 0.08)",
			},
		},
	},

	plugins: [],
};
