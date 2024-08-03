import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: 'development',
  entry: './public/script/script.js',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map', 
  devServer: {
    contentBase: './dist',
    hot: true, 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
