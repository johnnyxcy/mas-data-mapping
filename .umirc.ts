import { defineConfig } from 'dumi';
import path from 'path';

const ghPagesPlugin =
  process.env.NODE_ENV === 'production'
    ? {
        ghPages: {
          useCDN: true,
        },
      }
    : {};

export default defineConfig({
  title: 'MaSDataMapping',
  favicon:
    'https://raw.githubusercontent.com/Johnnyxcy/mas-data-mapping/main/public/assets/icon.png',
  logo: 'https://raw.githubusercontent.com/Johnnyxcy/mas-data-mapping/main/public/assets/icon.png',
  description: '@Chongyi Xu, 2022',
  outputPath: 'docs-dist',
  base: process.env.NODE_ENV === 'production' ? '/mas-data-mapping' : '/',
  publicPath:
    process.env.NODE_ENV === 'production' ? '/mas-data-mapping/' : '/',
  // more config: https://d.umijs.org/config
  alias: {
    '@data-mapping': path.resolve(__dirname, 'src/mas-data-mapping'),
  },
  ...ghPagesPlugin,
});
