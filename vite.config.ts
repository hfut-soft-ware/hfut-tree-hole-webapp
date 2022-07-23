import { join } from 'path'
import { defineConfig } from 'vite'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import presetIcons from '@unocss/preset-icons'
import Unocss from 'unocss/vite'
import react from '@vitejs/plugin-react'
import { presetUno } from 'unocss'
import AutoImport from 'unplugin-auto-import/vite'
import presetAttributify from '@unocss/preset-attributify'
import transformerDirective from '@unocss/transformer-directives'
import { match } from 'assert'

function resolve(dir: string): string {
  return join(__dirname, dir)
}

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src/'),
    },
  },
  plugins: [
    react(),
    Unocss({
      shortcuts: [
        {
          'center': 'flex items-center justify-center',
          'x-center': 'flex justify-center',
          'y-center': 'flex items-center',
          'col': 'flex flex-col',
          'text-holder': 'text-gray-500/85',
          'j-between': 'flex justify-between',
        },
        [/wh([0-9]+)/, match => `w-[${match[1]}px] h-[${match[1]}px]`],
        [/(top|left|right|bottom)([0-9]+)/, match => `${match[1]}-[${match[2]}rem]`],
      ],
      presets: [
        presetUno(),
        presetIcons(),
        presetAttributify(),
        transformerDirective(),
        transformerVariantGroup(),
      ],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      imports: [
        'react',
      ],
      dirs: [
        './src',
      ],
    }),
  ],
})
