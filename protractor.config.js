/*
*
*   !!! posible phantomJS problems with Protractor: !!!
*   github.com/angular/protractor/labels/browser%3A%20phantomjs
*
*/

exports.config = {
    directConnect: false,

    capabilities: {
        'browserName': 'phantomjs',

        /*
        * Can be used to specify the phantomjs binary path.
        * This can generally be ommitted if you installed phantomjs globally.
        */
        'phantomjs.binary.path': require('phantomjs').path,

        /*
        * Command line args to pass to ghostdriver, phantomjs's browser driver.
        * See https://github.com/detro/ghostdriver#faq
        */
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
    },

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['./test/protractor/*.js'],

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose: true
    },
    beforeLaunch: function() {
    }
};
