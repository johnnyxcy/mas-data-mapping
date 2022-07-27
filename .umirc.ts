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
  favicon: '/mas-data-mapping/assets/icon.png',
  logo: '/mas-data-mapping/assets/icon.png',
  description: '@Chongyi Xu, 2022',
  outputPath: 'docs-dist',
  base: '/mas-data-mapping',
  publicPath: '/mas-data-mapping/',
  // more config: https://d.umijs.org/config
  alias: {
    '@data-mapping': path.resolve(__dirname, 'src/mas-data-mapping'),
  },
  ...ghPagesPlugin,
});
