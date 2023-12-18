import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['source/index.ts'],
	target: 'node18',
	platform: 'browser',
	splitting: false,
	sourcemap: false,
	clean: true,
	format: 'esm',
	minify: false,
	treeshake: true,
	dts: true,
});
