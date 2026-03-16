export const tokens = {
	color: {
		bg: '#08090b',
		bgElev: '#12151a',
		text: '#f0e8da',
		textSoft: '#d8cdb9',
		muted: '#a79d8b',
		mutedStrong: '#7e7568',
		accent: '#c79c57',
		accentStrong: '#e2ba74',
		signal: '#79a6a3',
		statusOk: '#79a6a3',
		statusPend: '#8b8476',
		statusWarn: '#c79c57',
		statusFail: '#b66a48'
	},
	font: {
		body: "'ET Book', 'Iowan Old Style', 'Palatino Linotype', serif",
		mono: "'IBM Plex Mono', 'Menlo', 'Consolas', monospace"
	},
	transition: {
		smooth: '0.35s cubic-bezier(0.22, 1, 0.36, 1)',
		fast: '0.16s cubic-bezier(0.4, 0, 0.2, 1)'
	}
} as const;
