/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
	'app':                        'dist/app',
	'@angular':                   'node_modules/@angular',
	'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
	'rxjs':                       'node_modules/rxjs',

	'angular2-fontawesome':       'node_modules/angular2-fontawesome',
	'angular2-jwt':               'node_modules/angular2-jwt',
	'angular2-uuid':              'node_modules/angular2-uuid',
	'chart-js':                   'node_modules/chart.js/dist/Chart.min.js',
	'h5webstorage':               'node_modules/h5webstorage',
	'moment':                     'node_modules/moment/moment.js',
	'ng2-bootstrap':              'node_modules/ng2-bootstrap',
	'prisma':                     'node_modules/prisma/lib/index.js'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
	'app':                        { main: 'main.js',  defaultExtension: 'js' },
	'rxjs':                       { defaultExtension: 'js' },
	'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },

	'angular2-fontawesome':       { defaultExtension: 'js' },
	'angular2-jwt':               { main: 'angular2-jwt', defaultExtention: 'js' },
	'angular2-uuid':              { main: 'index.js', defaultExtention: 'js' },
	'h5webstorage':               { main: 'index.js', defaultExtention: 'js' },
	'ng2-bootstrap':              { defaultExtention: 'js' }
  };
  var ngPackageNames = [
	'common',
	'compiler',
	'core',
	'forms',
	'http',
	'platform-browser',
	'platform-browser-dynamic',
	'router',
	'router-deprecated',
	'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
	packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
	packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
	map: map,
	packages: packages
  };
  System.config(config);
})(this);
