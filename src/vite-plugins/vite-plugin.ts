import type { Plugin } from "vite";

const plugin = ({ port }: { port: number }): Plugin => {
  return {
    name: "test-plugin",
    // config(config, env) {
    //   console.log('--config--', config);
    //   console.log('--env--',env)
    // },
    async configResolved(config) {
      config.server.port = port
    },
    transformIndexHtml(html) {
      // 采用正则匹配修改
      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>林三心的页面</title>`
      );
    },
  };
};

export default plugin;
