// ---------------------------------------------------------------------------------------------------------------------
// This script is intended to contain all actions pertaining to code style checking, linting and normalisation.
//
// 1. The script executes linting routines on specific folders.
// ---------------------------------------------------------------------------------------------------------------------

require('shelljs/global');
require('colors');

var async = require('async'),
    ESLintCLIEngine = require('eslint').CLIEngine,

    INFO_MESSAGE = 'Linting files using ESLint...'.yellow.bold,
    LINT_SOURCE_DIRS = [
        './test',
        './index.js',
        './lib',
        './npm/*.js'
    ];

module.exports = function (done) {
    // banner line
    console.log(INFO_MESSAGE);

    async.waterfall([
        // execute the CLI engine
        function (next) {
            next(null, (new ESLintCLIEngine()).executeOnFiles(LINT_SOURCE_DIRS));
        },

        // output results
        function (report, next) {
            var errorReport = ESLintCLIEngine.getErrorResults(report.results);
            // log the result to CLI
            console.log(ESLintCLIEngine.getFormatter()(report.results));
            // log the success of the parser if it has no errors
            (errorReport && !errorReport.length) && console.log('ESLint ok!'.green);
            // ensure that the exit code is non zero in case there was an error
            next(Number(errorReport && errorReport.length) || 0);
        }
    ], done);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);
