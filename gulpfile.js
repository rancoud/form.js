"use strict";
// region init variables for all
const fs = require('fs');
const path = require('path');
const { src, dest, series } = require('gulp');
const concat = require('gulp-concat');
// endregion

// region init variables for js
const uglify = require('gulp-uglify');
const stripDebug = require('gulp-strip-debug');
const rmLines = require('gulp-rm-lines');
// endregion

// region tasks functions
function js(cb) {
    src(filesJs())
        .pipe(rmLines({
            'filters': [
                /GULP REMOVE LINE/i,
            ]
        }))
        .pipe(concat('form.js'))
        .pipe(dest('./dist/'));

    src(filesJs())
        .pipe(rmLines({
            'filters': [
                /GULP REMOVE LINE/i,
            ]
        }))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('form.min.js'))
        .pipe(dest('./dist/'));

    cb();
}

function clean(cb) {
    fs.stat('./dist', (err, stat) => {
        if (err) {
            cb();
        } else {
            deleteFilesInDir('./dist', cb);
        }
    });
}
// endregion

// region helpers functions
function filesJs() {
    return [
        './src/form.js',
    ];
}

function deleteFilesInDir(directory, cb) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        let pending = files.length;
        if (!pending) { cb(); }

        files.forEach(function(file) {
            const filepath = path.join(directory, file);
            fs.stat(filepath, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    deleteFilesInDir(filepath, () => {
                        fs.rmdir(filepath, err => {
                            if (err) throw err;

                            if (!--pending) {
                                cb();
                            }
                        });
                    });
                } else {
                    fs.unlink(filepath, err => {
                        if (err) throw err;

                        if (!--pending) {
                            cb();
                        }
                    });
                }
            })
        });
    });
}
// endregion

exports.default = series(
    clean,
    js,
);