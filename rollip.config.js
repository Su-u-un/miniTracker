import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

export default [
    {
        input:"./src/core/index.ts",
        output:[
            {
                file:path.resolve(__distname,'./dis/index.esm.js'),
                format:'es'
            },
            {
                file:path.resolve(__distname,'./dis/index.cjs.js'),
                format:'cjs'
            },
            {
                file:path.resolve(__distname,'./dis/index.esm.js'),
                format:'umd',
                name:'tracker'
            }
        ],
        plugin:[
            ts()
        ]
    },
    // 输出声明文件
    {
        
        input:"./src/core/index.ts",
        output:{
            file:path.resolve(__distname,'./dist/index.d.ts'),
            format:'es'
        },
        plugin:[
            dts()
        ]
    }
]