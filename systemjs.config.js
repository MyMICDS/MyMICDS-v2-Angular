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
	'ng2-charts':                 'node_modules/ng2-charts',
	'angular2-fontawesome':       'node_modules/angular2-fontawesome',
	'prisma':                     'node_modules/prisma/lib',
	'angular2-jwt':               'node_modules/angular2-jwt',
	'h5webstorage':               'node_modules/h5webstorage'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
	'app':                        { main: 'main.js',  defaultExtension: 'js' },
	'rxjs':                       { defaultExtension: 'js' },
	'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
	'ng2-charts':                 { defaultExtension: 'js' },
	'angular2-fontawesome':       { defaultExtension: 'js' },
	'prisma':                     { main: 'index.js', defaultExtention: 'js' },
	'angular2-jwt':               { main: 'angular2-jwt', defaultExtention: 'js' },
	'h5webstorage':               { main: 'index.js', defaultExtention: 'js' }
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
