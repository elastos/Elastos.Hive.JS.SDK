import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import size from 'rollup-plugin-size';
import eslint from '@rollup/plugin-eslint';

const production = !process.env.ROLLUP_WATCH;

export function emitModulePackageFile() {
	return {
		name: 'emit-module-package-file',
		generateBundle() {
			this.emitFile({ type: 'asset', fileName: 'package.json', source: `{"type":"module"}` });
		}
	};
}

// export default {
// 	input: 'src/index.ts',
// 	output: [
//         {
//             sourcemap: true,
//             format: 'cjs',
//             file: 'dist/index.js'
//         },
//         {
//             sourcemap: true,
//             format: 'esm',
//             file: 'dist.esm/index.js'
//         }
//     ],
// 	plugins: [
// 		postcss({
//             extract: 'bundle.css'
//         }),
// 		json(),

// 		// If you have external dependencies installed from
// 		// npm, you'll most likely need these plugins. In
// 		// some cases you'll need additional configuration -
// 		// consult the documentation for details:
// 		// https://github.com/rollup/plugins/tree/master/packages/commonjs
// 		resolve({
// 			browser: true,
// 			dedupe: ['svelte'],
// 			preferBuiltins: true
// 		}),
// 		commonjs(),
//         typescript({
//             sourceMap: true,
//             inlineSources: !production
//         }),

// 		// If we're building for production (npm run build
// 		// instead of npm run dev), minify
// 		production && terser(),

//         /*analyze({
//             limit: 10
//         })*/
// 	],
// 	watch: {
// 		clearScreen: true
// 	}
// };


// const commitHash = (function () {
//     try {
//         return fs.readFileSync('.commithash', 'utf-8');
//     } catch (err) {
//         return 'unknown';
//     }
// })();

const prodBuild = process.env.prodbuild || false;
// console.log("Prod build: ", prodBuild);

// const now = new Date(
//     process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
// ).toUTCString();

// const banner = `/*
//   @license
//     DID.js v${pkg.version}
//     ${now} - commit ${commitHash}

//     Released under the MIT License.
// */`;

const onwarn = warning => {
    // eslint-disable-next-line no-console
    if (warning.code && warning.code === "CIRCULAR_DEPENDENCY" && warning.importer.indexOf('node_modules') < 0 && warning.importer.indexOf("internals.ts") >= 0)
        return; // TMP: don't get flooded by our "internals" circular dependencies for now

    if (warning.code && warning.code === "THIS_IS_UNDEFINED")
        return; // TMP: don't get flooded by this for now

    if (warning.code && warning.code === "EVAL")
        return; // TMP: don't get flooded by this for now

    console.warn("Rollup build warning:", warning);
};

const treeshake = {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
};

const nodePlugins = [
    resolve({
        preferBuiltins: true
    }),
    json({}),
    replace({
        delimiters: ['', ''],
        preventAssignment: true,
        exclude: [
            '/node_modules/rollup-plugin-node-polyfills/**/*.js',
            '/node_modules/rollup-plugin-polyfill-node/**/*.js',
        ],
        values: {
            // Replace readable-stream with stream (polyfilled) because it uses dynamic requires and this doesn't work well at runtime
            // even if trying to add "readable-stream" to "dynamicRequireTargets" in commonJs().
            // https://github.com/rollup/rollup/issues/1507#issuecomment-340550539
            'require(\'readable-stream\')': 'require(\'stream\')',
            'require("readable-stream")': 'require("stream")',
            'require(\'readable-stream/writable\')': 'require(\'stream\').Writable',
            'require("readable-stream/writable")': 'require("stream").Writable',
            'require(\'readable-stream/readable\')': 'require(\'stream\').Readable',
            'require("readable-stream/readable")': 'require("stream").Readable',
            'LegacyTransportStream = require(\'./legacy\')': 'LegacyTransportStream = null',
            'LegacyTransportStream = require(\'winston-transport/legacy\')': 'LegacyTransportStream = null'
        }
    }),
    commonjs({}),
    typescript({
        exclude: "*.browser.ts"
    }),
    size()
];

export default command => {
    //const { collectLicenses, writeLicense } = getLicenseHandler();
    const commonJSBuild = {
        input: {
            'hive.js': 'src/index.ts'
        },
        onwarn,
        plugins: [
            ...nodePlugins,
            //!command.configTest && collectLicenses()
            eslint()
        ],
        // fsevents is a dependency of chokidar that cannot be bundled as it contains binary code
        external: [
            'assert',
            'axios',
            'crypto',
            'events',
            'fs',
            'fsevents',
            'module',
            'path',
            'os',
            'stream',
            'url',
            'util'
        ],
        treeshake,
        strictDeprecations: true,
        output: {
            //banner,
            chunkFileNames: 'shared/[name].js',
            dir: 'dist',
            entryFileNames: '[name]',
            externalLiveBindings: false,
            format: 'cjs',
            freeze: false,
            // TODO: delete occurences of fsevents - not used in did sdk
            interop: id => {
                if (id === 'fsevents') {
                    return 'defaultOnly';
                }
                return 'default';
            },
            manualChunks: { did: ['src/index.ts'] },
            sourcemap: !prodBuild
        }
    };

    if (command.configTest) {
        return commonJSBuild;
    }

    const esmBuild = {
        ...commonJSBuild,
        input: { 'hive.js': 'src/index.ts' },
        plugins: [
            ...nodePlugins,
            emitModulePackageFile(),
            //collectLicenses()
        ],
        output: {
            ...commonJSBuild.output,
            dir: 'dist/es',
            format: 'es',
            sourcemap: !prodBuild,
            minifyInternalExports: false
        }
    };

    

    return [ commonJSBuild, esmBuild];
};