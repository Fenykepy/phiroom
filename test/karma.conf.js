module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'statics/bower_components/angular/angular.js',
      'statics/bower_components/angular-animate/angular-animate.js',
      'statics/bower_components/angular-mocks/angular-mocks.js',
      'statics/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'statics/bower_components/angular-resource/angular-resource.js',
      'statics/bower_components/angular-sanitize/angular-sanitize.js',
      'statics/js/phiroomApp.js',
      'statics/js/mainCtrl.js',
      'statics/js/weblog/controllers/weblogListCtrl.js',
      'statics/js/weblog/controllers/weblogDetailCtrl.js',
      'statics/js/librairy/controllers/librairyCtrl.js',
      'statics/js/librairy/controllers/librairyGridCtrl.js',
      'statics/js/librairy/controllers/librairySingleCtrl.js',
      'statics/js/librairy/services/phUtils.js',
      'statics/js/librairy/services/phListPictures.js',
      'statics/js/librairy/services/phFolder.js',
      'statics/js/librairy/services/phPatcher.js',
      'statics/js/librairy/services/phSelection.js',
      'statics/js/librairy/services/phRate.js',
      'statics/js/librairy/directives/phDrag.js',
      'statics/js/librairy/directives/phDrop.js',
      'statics/js/librairy/filters/phRange.js',
      'statics/js/librairy/animations/toogleAnimation.js',
      'statics/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
