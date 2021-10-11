const { src, dest, watch, series, parallel } = require('gulp')
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
	return src(`${app}/*.html`)
		.pipe(
			extender({
				annotations: false
			})
		)
		.pipe(dest(build))
		.pipe(sync.reload({ stream: true }))
}

const bundle_css = () => {
	return src(['node_modules/bootstrap/dist/css/bootstrap-grid.css'])
		.pipe(concat('bundle.css'))
		.pipe(csso())
		.pipe(dest(`${build}/css`))
		.pipe(sync.reload({ stream: true }))
}

const bundle_js = () => {
	return src(['node_modules/gsap/dist/gsap.js'])
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(dest(`${build}/js`))
		.pipe(sync.reload({ stream: true }))
}

const styles = () => {
	return src(`${app}/sass/**/*.scss`)
		.pipe(sass())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 3 versions'],
				cascade: false
			})
		)
		.pipe(dest(`${build}/css`))
		.pipe(sync.reload({ stream: true }))
}

const scripts = () => {
	return src(`${app}/js/*.js`)
		.pipe(dest(`${build}/js`))
		.pipe(sync.reload({ stream: true }))
}

const images = () => {
	return src(`${app}/img/**/*.*`)
		.pipe(dest(`${build}/img`))
		.pipe(sync.reload({ stream: true }))
}

const fonts = () => {
	src(`${app}/fonts/**/*.*`)
		.pipe(ttf2woff())
		.pipe(dest(`${build}/fonts`))
	return src(`${app}/fonts/**/*.*`)
		.pipe(ttf2woff2())
		.pipe(dest(`${build}/fonts`))
		.pipe(sync.reload({ stream: true }))
}

const watcher = () => {
	watch(`${app}/**/*.html`, html)
	watch(`${app}/sass/**/*.scss`, styles)
	watch(`${app}/js/*.js`, scripts)
	watch(`${app}/img/**/*.*`, images)
	watch(`${app}/fonts/**/*.*`, fonts)
}

const init = series(
	clean,
	html,
	bundle_css,
	styles,
	bundle_js,
	scripts,
	images,
	fonts
)

exports.default = parallel(init, watcher, serve)
