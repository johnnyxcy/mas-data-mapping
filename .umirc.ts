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
  title: 'mas-data-mapping',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  publicPath:
    process.env.NODE_ENV === 'production' ? '/mas-data-mapping/' : '/',
  // more config: https://d.umijs.org/config
  alias: {
    '@data-mapping': path.resolve(__dirname, 'src/mas-data-mapping'),
  },
  ...ghPagesPlugin,
});
