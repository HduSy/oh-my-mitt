import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript'; // 支持打包 ts 文件类型
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        file: './lib/index.esm.js',
        format: 'es',
      },
      {
        file: './lib/index.cjs.js',
        format: 'cjs'
      },
      {
        file: './lib/index.umd.js',
        format: 'umd',
        name: 'OhMyEmitter'
      },
      {
        file: './lib/index.min.js',
        format: 'iife',
        plugins: [terser()]
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),
    ]
  },
  {
    input: './src/index.ts',
    output: {
      file: 'lib/types/index.d.ts',
      format: 'esm',
    },
    plugins: [ typescript({
        tsconfig: './tsconfig.json'
      }), dts() ]
  }
])