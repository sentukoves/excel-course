const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin =require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



const jsLoaders = () =>{
    const loaders =[
     {   
        loader: 'babel-loader',
        options:{
            presets:[
                '@babel/preset-env']
            }
        }
    ]
    if(isDev){
        loaders.push('eslint-loader')
    }
    return loaders
}

//process.env.NODE_ENV работает в связке с cross-env описанной в файле packed.json
// необходима для того чтобы определить в каком режиме запушена система


const isProd = process.env.NODE_ENV === 'production'

// Запонить фишку
const isDev= !isProd




//Экспорт модулей настройки 
module.exports = {

    //Исходная папка откуда забирать файлы для компиляции
    context:path.resolve(__dirname , 'src'),
    //режим компиляции и название проекта
    mode:'development',
    // Указывает с какого файла необходимо начать компиляцию (app main)  и babel/polyfill убирает ошибку в консоле браузера
    entry:['@babel/polyfill', "./index.js"],

    //Куда компилировать проект
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname , 'dist')
    },

    resolve:{
        // Непонятно 
        extensions:['.js'],
        //alias сокрашает пути в файлах например ../../../core/component до @core/component
        alias:{

            '@': path.resolve(__dirname , 'src'),
            '@core': path.resolve(__dirname , 'src/core'),
        }
    },

    //настройка дев сервера вебпака поменять в натсройка пакета с webpack  webpack-dev-server
    devServer :{
        port:3000,
        hot: isDev
    },
    //настройка плагинов
    plugins:[

        new CleanWebpackPlugin(),

        //Данный плагин дописывает в входной html стили и js файлы с хэшами при компиляции
        new HTMLWebpackPlugin({
            //файл в котором необходимо прописывать компиляционные хэш файлы
            template:'index.html',
            minify:{
                //Удаление коментариев и удаление пробелов в html  в продуктиве
                removeComments:isProd,
                collapseWhitespace:isProd,
            }
        }) ,
        // на данном примере он производит перенос для компиляции файлов а иммено ico
        new CopyPlugin({
            patterns: [
              { from: path.resolve(__dirname , 'src/favicon.ico'), 
                to: path.resolve(__dirname , 'dist') }
            ],
          }),
          //плагин компиляции css
        new MiniCssExtractPlugin({
            filename:'bundle.css'
        })
    ], 

//loder это файлы пропускающие через себя код и что то сними делающиеся например babel
//Babel.JS – это транспайлер, переписывающий код на ES6 (ES-2015) в код на предыдущем стандарте ES5.

    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [     
                //настройка css loader например убирающий переменные из scss
              {
                  loader:MiniCssExtractPlugin.loader,
                  options:{
                      hmr:isDev,
                      reloadAll:true,
                  }
              },                       
              'css-loader',
              'sass-loader',
            ],
          },

          //Настройка бабла 
            {    
                test:/\.js$/ ,
                 exclude:/node_modules/ , 
                 use:jsLoaders()
                
            },

        ],
      },

    


}
//hash добавляет при билдинге хэш чтобы браузер скачивал актуальную версию