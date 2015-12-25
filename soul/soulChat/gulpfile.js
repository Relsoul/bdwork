/**
 * Created by soul on 2015/12/22.
 */
var gulp=require("gulp");
var p=require("gulp-load-plugins")();

var cssPath={
    dev:"dev/css/*.scss",
    build:"public/css"
}
var jsPath={
    dev:"dev/js/*.js",
    build:"public/js"
}


var reloadMain="app.js"

gulp.task("default",["sass:watch","autoReload","concat:watch","htmlReload:watch"]);

gulp.task("htmlReload:watch",function(){
    p.livereload.listen()
    gulp.watch("app/views/*.html",function(file){
        gulp.src(file.path)
            .pipe(p.livereload())

    })
})

gulp.task("sass:watch",function(){
    p.livereload.listen()
    gulp.watch(cssPath.dev,["sass:compile"])
})

gulp.task("sass:compile",function(){
    p.rubySass(cssPath.dev)
        .on("error",function(err){console.log(err)})
        .pipe(gulp.dest(cssPath.build))
        .pipe(p.livereload())
})

gulp.task("autoReload",function(){
    p.nodemon({
        script:reloadMain,
        ext:"js html",
        env:{"NODE_ENV":"development"},
    })
})

gulp.task("concat:watch",function(){
    gulp.watch(jsPath.dev,["concat:concat"])
})

gulp.task("concat:concat",function(){
    gulp.src(jsPath.dev)
        .pipe(p.concat("soulChat.js"))
        .pipe(gulp.dest(jsPath.build))
})