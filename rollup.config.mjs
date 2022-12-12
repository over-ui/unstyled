import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const extensions = ["js", "jsx", "ts", ".tsx"];

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/esm/index.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "./dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  watch: {
    exclude: "node_modules/**",
    include: "./src/*",
  },
  plugins: [
    peerDepsExternal(),
    commonJs(),
    resolve({
      extensions,
    }),
    babel({
      presets: [
        "@babel/env",
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript",
      ],
      plugins: ["@babel/plugin-transform-runtime"],
      babelHelpers: "runtime",
      exclude: ["node_modules/**", "dist"],
      extensions,
    }),
  ],
};
