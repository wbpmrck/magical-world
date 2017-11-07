
/* ------------------------------------------------------------------
    排除非构建资源 【可以自定义】
------------------------------------------------------------------*/

//有些资源不想被构建，通过以下方式排除
fis.set('project.ignore', [
    '_fis3_loader/**', //不要删除
    'fis-conf*.js',//不要删除
    'node_modules/**',//不要删除
    '.git/**',
    'dist/**',
    '*.sh',
    '.svn/**'
]);

fis.match(/^\/views\/(.*)$/i,{
        //追加id属性，id为【项目名/版本号/文件路径】
        // id : '${version.web}/$1',
        //追加isComponents标记属性
        // isComponents : true,
        //项目模块化目录没有版本号结构，用全局版本号控制发布结构
        release : '$0'
    }
);

fis.match(/^\/res\/(.*)$/i,{
        //追加id属性，id为【项目名/版本号/文件路径】
        // id : '${version.web}/$1',
        //追加isComponents标记属性
        // isComponents : true,
        //项目模块化目录没有版本号结构，用全局版本号控制发布结构
        release : '$0'
    }
);

fis.match(/^\/libs\/(.*)$/i,{
        //追加id属性，id为【项目名/版本号/文件路径】
        // id : '${version.web}/$1',
        //追加isComponents标记属性
        // isComponents : true,
        //项目模块化目录没有版本号结构，用全局版本号控制发布结构
        release : '$0'
    }
);
fis.match(/^\/framework\/(.*)$/i,{
        //追加id属性，id为【项目名/版本号/文件路径】
        // id : '${version.web}/$1',
        //追加isComponents标记属性
        // isComponents : true,
        //项目模块化目录没有版本号结构，用全局版本号控制发布结构
        release : '$0'
    }
);
fis.match(/^\/components\/(.*)$/i,{
        //追加id属性，id为【项目名/版本号/文件路径】
        // id : '${version.web}/$1',
        //追加isComponents标记属性
        // isComponents : true,
        //项目模块化目录没有版本号结构，用全局版本号控制发布结构
        release : '$0'
    }
);


