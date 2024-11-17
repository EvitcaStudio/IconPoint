import babel from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace';
import terser from '@rollup/plugin-terser';
import { cleandir } from 'rollup-plugin-cleandir';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';

import packageJson from './package.json' assert { type: 'json' };

const fileName = packageJson.name;

// Add a banner at the top of the minified code
const banner = [
  `/*!`,
  ` * ${packageJson.name}@${packageJson.version} ${packageJson.repository.url}`,
  ` * Compiled ${new Date().toUTCString().replace(/GMT/g, 'UTC')}`,
  ` *`,
  ` * ${packageJson.name} is licensed under the MIT License.`,
  ` * http://www.opensource.org/licenses/mit-license`,
  ` */`,
].join('\n');

/**
 * Generates output configurations for Rollup.
 * @param {boolean} pMinify - Whether to generate minified configurations.
 * @returns {Object[]} An array of output configurations.
 */
const generateOutputConfigs = (pMinify) => {
  const outputFormats = ['iife', 'es'];

  return outputFormats.map((pFormat) => {
    const isMinified = pMinify ? '.min' : '';
    const fileExtension = pFormat === 'es' ? 'mjs' : 'js';
    // Uppercase library name for global IIFE representing this bundle. [LibraryNameBundle].bundleInstance.foo
    const iifeName = pFormat === 'iife' ? `IconPointBundle` : undefined;

    return {
      file: `dist/${pFormat}/${fileName}${isMinified}.${fileExtension}`,
      format: pFormat,
      name: pFormat === 'iife' ? iifeName : undefined,
      sourcemap: true,
      banner: pMinify ? undefined : banner,
      plugins: pMinify
        ? [
            terser({
              mangle: {
                reserved: iifeName ? [iifeName] : [],  // Preserve the IIFE name during minification
              },
              module: iifeName ? false : true,
              toplevel: iifeName ? false : true,
              keep_classnames: iifeName ? false : true,
              format: {
                comments: 'some',
                preamble: banner,
              },
            }),
          ]
        : [],
    };
  });
};

const config = {
  input: `src/${fileName}.ts`,
  output: [
    // Regular build
    ...generateOutputConfigs(false),
    // Minified build
    ...generateOutputConfigs(true),
  ],
  plugins: [
    // Clean the dist folder before building
    cleandir('./dist'),
    
    // Handle TypeScript files
    typescript({
      tsconfig: './tsconfig.json',  // Ensure using the proper tsconfig file
      useTsconfigDeclarationDir: true, // Output declarations in the correct folder
    }),

    // Replace version placeholder with actual version from package.json
    replace({ 'VERSION_REPLACE_ME': packageJson.version }),

    // Ensure Rollup can resolve node modules and TypeScript files
    resolve({
      extensions: ['.ts', '.js', '.mjs'],
    }),

    // Transpile code with Babel (but exclude TypeScript files)
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js'],
      exclude: 'node_modules/**',  // Exclude node_modules from Babel transpilation
    }),
  ],
};

export default [config];
