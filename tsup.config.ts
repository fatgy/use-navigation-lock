import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['source/index.ts'],
	splitting: false,
	sourceMap: false,
	clean: true,
	format: ['esm'],
	minify: false,
	treeshake: true,
	dts: true,
});
