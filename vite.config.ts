// @ts-nocheck

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
// import myPlugin from './src/vite-plugins/vite-plugin'
import VitePluginVisualizer from "./src/vite-plugins/vite-plugin-visualizer/vite-plugin-visualizer";
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    VitePluginVisualizer()
    // myPlugin({
    //   port: 8080
    // })
    // Components({
    //   dts: true,
    //   // resolvers: [AntDesignVueResolver({ importStyle: false })],
    //   resolvers: [
    //     (componentName) => {
    //       if (componentName.indexOf("A") === 0)
    //         return { name: componentName.slice(1), from: "ant-design-vue" };
    //     },
    //   ],
    // }),
  ],
});
