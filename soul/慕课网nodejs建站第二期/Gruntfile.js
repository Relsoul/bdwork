/**
 * Created by soul on 15-12-6.
 */
module.exports=function(grunt){

    grunt.initConfig({
        watch:{
            jade:{
                files:["views/**"], //监听views下的所有文件夹,所有文件
                options:{
                    livereload:true
                }
            },
            js:{
                files:["public/js/**","models/**/*.js","schemas/**/*.js"],
                //tasks:["jshint"],
                options:{
                    livereload:true
                }
            }
        },

        nodemon:{
            dev:{//开发环境
                script:'app.js',
                options:{
                    args:[],
                    nodeArgs:["--debug"],
                    ignoredFIles:["README.md","node_modules/**",".DS_Store"],
                    ext:"js",
                    watch:["./"],
                    delayTIme:1,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname
                }
            }
        },

        concurrent:{
            tasks:["nodemon","watch"],//会重新跑这两个任务
            options:{
                logConcurrentOutput:true
            }
        }
    })



    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.option("force",true); //避免警告中断grunt服务

    grunt.registerTask("default",["concurrent"])
};