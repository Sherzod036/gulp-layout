const gulp = require('gulp')
const extender = require('gulp-html-extend')
const sync = require('browser-sync').create()
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default

const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')

const del = require('del')

const app = 'app'
const build = 'build'

const serve = () => {
	sync.init({
		server: {
			baseDir: build
		},
		port: 9000,
		host: 'localhost',
		notify: false
	})
}

const clean = () => {
	return del(build)
}

const html = () => {
	return gulp
		.src(`${app}/*.html`)
		.pipe(
			extender({
				annotations: false
			})
		)
		.pipe(gulp.dest(build))
		.pipe(sync.reload({ stream: true }))
}

const bundle_css = () => {
	return gulp
		.src(['node_modules/bootstrap/dist/css/bootstrap-grid.css'])
		.pipe(concat('bundle.css'))
		.pipe(csso())
		.pipe(gulp.dest(`${build}/css`))
		.pipe(sync.reload({ stream: true }))
}

const bundle_js = () => {
	return gulp
		.src(['node_modules/gsap/dist/gsap.js'])
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest(`${build}/js`))
		.pipe(sync.reload({ stream: true }))
}

const styles = () => {
	return gulp
		.src(`${app}/sass/**/*.scss`)
		.pipe(sass())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 3 versions'],
				cascade: false
			})
		)
		.pipe(gulp.dest(`${build}/css`))
		.pipe(sync.reload({ stream: true }))
}

const scripts = () => {
	return gulp
		.src(`${app}/js/*.js`)
		.pipe(gulp.dest(`${build}/js`))
		.pipe(sync.reload({ stream: true }))
}

const images = () => {
	return gulp
		.src(`${app}/img/**/*.*`)
		.pipe(gulp.dest(`${build}/img`))
		.pipe(sync.reload({ stream: true }))
}

const fonts = () => {
	gulp
		.src(`${app}/fonts/**/*.*`)
		.pipe(ttf2woff())
		.pipe(gulp.dest(`${build}/fonts`))
	return gulp
		.src(`${app}/fonts/**/*.*`)
		.pipe(ttf2woff2())
		.pipe(gulp.dest(`${build}/fonts`))
		.pipe(sync.reload({ stream: true }))
}

const watcher = () => {
	gulp.watch(`${app}/**/*.html`, gulp.series(html))
	gulp.watch(`${app}/sass/**/*.scss`, gulp.series(styles))
	gulp.watch(`${app}/js/*.js`, gulp.series(scripts))
	gulp.watch(`${app}/img/**/*.*`, gulp.series(images))
	gulp.watch(`${app}/fonts/**/*.*`, gulp.series(fonts))
}

const init = gulp.series(
	clean,
	html,
	bundle_css,
	styles,
	bundle_js,
	scripts,
	images,
	fonts
)

exports.default = gulp.parallel(init, watcher, serve)
