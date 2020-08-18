let project_folder = 'dist';
let source_folder = 'app';

let path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    // '!' + source_folder + '/_*.html' - исключаем файлы, чтобы они не попадали в папку dist по отдельности
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/scss/main.scss',
    js: source_folder + '/js/scripts.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,ico,gif,webp}',
    fonts: source_folder + '/fonts/**/*.{ttf,eot,woff,woff2}',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,ico,gif,webp}',
  },
  clean: './' + project_folder + '/',
};

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  gcmq = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  uglify = require('gulp-uglify-es').default,
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  webpHtml = require('gulp-webp-html'),
  webpCss = require('gulp-webpcss'),
  // нужен python
  // ttf2woff = require('gulp-ttf2woff'),
  // ttf2woff2 = require('gulp-ttf2woff2'),
  // fonter = require('gulp-fonter'),
  svgSprite = require('gulp-svg-sprite');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html).pipe(fileinclude()).pipe(webpHtml()).pipe(dest(path.build.html)).pipe(browsersync.stream());
}
function css() {
  src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded',
      }).on('error', notify.onError())
    )
    .pipe(gcmq())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      })
    )
    .pipe(webpCss())
    .pipe(dest(path.build.css));

  return (
    src(['app/libs/fontAwesome/all.css', path.src.css])
      .pipe(
        scss({
          outputStyle: 'expanded',
        }).on('error', notify.onError())
      )
      .pipe(concat('main.min.css'))
      .pipe(cleanCSS())
      // .pipe(
      //   rename({
      //     extname: '.min.css',
      //   })
      // )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  );
}
function js() {
  src(path.src.js).pipe(fileinclude()).pipe(dest(path.build.js));

  return (
    src([
      'app/libs/jquery/dist/jquery.min.js',
      'app/libs/lodash.min.js',
      'app/libs/gsap.min.js',
      'app/libs/scrollMagic.js',
      'app/libs/scrollMagic-debug.addIndicators.min.js',
      'app/libs/scrollMagic-animation.gsap.min.js',
      path.src.js,
    ])
      .pipe(fileinclude())
      .pipe(uglify())
      // .pipe(
      //   rename({
      //     extname: '.min.js',
      //   })
      // )
      .pipe(concat('scripts.min.js'))
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
  );
}
function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 - 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  // src(path.src.fonts)
  //    .pipe(ttf2woff())
  //   .pipe(dest(path.build.fonts));
  return (
    src(path.src.fonts)
      // .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts))
  );
}

// task запускается отдельно в командной строке gulp svgSprite
gulp.task('svgSprite', function () {
  return gulp
    .src([source_folder + '/iconsprite/*.svg'])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg',
            // example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img));
});

// gulp.task('otf2ttf', function () {
//   return src([source_folder + '/fonts/*.otf'])
//     .pipe(
//       fonter({
//         formats: ['ttf'],
//       })
//     )
//     .pipe(dest(source_folder + '/fonts/'));
// });

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
