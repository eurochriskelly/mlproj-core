#!/usr/bin/env node

"use strict";

// TODO: This script is duplicated in mlproj, do we want to change that?

var chproc = require('child_process');
var proc   = require('process');

function run(tests, callback)
{
    if ( ! tests.length ) {
        // nothing else to do
    }
    else if ( tests[0].msg ) {
        let test = tests.shift();
        console.log();
        console.log(test.msg);
        proc.chdir(test.cwd);
        run(tests);
    }
    else {
        let test    = tests.shift();
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;
        var process = chproc.fork(test.script);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function () {
            if ( invoked ) {
                return;
            }
            invoked = true;
            throw new Error(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if ( invoked ) {
                return;
            }
            invoked = true;
            if ( code ) {
                throw new Error('exit code ' + code);
            }
            run(tests);
        });
    }
}

// first go to test dir
proc.chdir('./test/');

run([
    { msg: 'Run unit tests', cwd: './unit/' },
    { script: './parse/parse-simple-ape.js'      },
    { script: './parse/parse-simple-bear.js'     },
    { script: './parse/parse-simple-cat.js'      },
    { script: './parse/parse-simple-dog.js'      },
    { script: './parse/parse-simple-elephant.js' },
    { script: './parse/parse-simple-frog.js'     },
    { script: './parse/parse-simple-goat.js'     },
    { script: './parse/parse-simple-hen.js'      },
    { script: './parse/parse-simple-impala.js'   },
    { script: './parse/parse-simple-jaguar.js'   },
    { script: './parse/parse-simple-achel.js'    },
    { msg: 'Run test scenarii', cwd: '../scenarii/' },
    { script: './run-scenario.js' }
]);
