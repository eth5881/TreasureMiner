var gulp = require('gulp'),

 rename = require('gulp-rename'),

 uglify = require('gulp-uglify'),

 babel = require('gulp-babel'),
 
 notify = require('gulp-notify'),
    
 eslint = require('gulp-eslint')

gulp.task( 'js', function() {

 gulp.src( './js/**.js' )

 .pipe( babel({ presets:['es2015'] }) )

 .pipe( uglify() )

 .pipe( 

 rename( function( path ) {

 path.basename += '.min'

 })

 )

 .pipe( gulp.dest('./dist') )
 
 .pipe(

 notify({ 

 message:'Build has been completed',

 onLast:true

 }) 

)

})


gulp.task( 'watch', function() {

 gulp.watch( './js/**.js', function() {

 gulp.run( 'js' )

 })

})

gulp.task('lint', function() {
  return gulp.src('lib/**').pipe(eslint({
    'rules':{
        'quotes': [1, 'single'],
        'semi': [1, 'always']
    }
  }))
  .pipe(eslint.format())
  // Brick on failure to be super strict
  .pipe(eslint.failOnError());
});