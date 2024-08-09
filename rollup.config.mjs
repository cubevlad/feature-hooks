import { createRequire } from 'node:module'

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import dts from 'rollup-plugin-dts'

const nodeRequire = createRequire(import.meta.url)
const packageJson = nodeRequire('./package.json')

const extensions = ['.js', '.jsx', '.ts', '.tsx']

console.log(packageJson)

const config = [
  {
     input: 'index.ts',
     output: [
      {
        file: packageJson.module,
        format: 'esm',
        name: packageJson.name,
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions, preferBuiltins: false }),
      typescript({
        emitDeclarationOnly: true,
        exclude: ['node_modules'],
        tsconfig: './tsconfig.json',
      }),
    ],
     strictDeprecations: true,
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  }
]

export default config