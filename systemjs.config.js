(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'node_modules/@angular/*': 'node_modules/@angular/*/bundles'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'dist/app',
			'@angular': 'node_modules/@angular',

      // angular bundles
      // '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      // '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      // '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      // '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      // '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      // '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      // '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      // '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs': 'node_modules/rxjs',
			'angular2-fontawesome':       'node_modules/angular2-fontawesome',
			'angular2-jwt':               'node_modules/angular2-jwt',
			'angular2-uuid':              'node_modules/angular2-uuid',
			'chart-js':                   'node_modules/chart.js/dist/Chart.min.js',
			'moment':                     'node_modules/moment/moment.js',
			'ng2-bootstrap':              'node_modules/ng2-bootstrap',
			'prisma':                     'node_modules/prisma/lib/index.js',
			'angular2-color-picker':   		'angular2-color-picker',
			'socket.io-client':           'node_modules/socket.io-client/socket.io.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: { main: './main.js', defaultExtension: 'js' },
			'@angular/core': { main: 'core.umd.js', defaultExtension: 'js' },
      '@angular/common': { main: 'common.umd.js', defaultExtension: 'js' },
      '@angular/compiler': { main: 'compiler.umd.js', defaultExtension: 'js' },
      '@angular/platform-browser': { main: 'platform-browser.umd.js', defaultExtension: 'js' },
      '@angular/platform-browser-dynamic': { main: 'platform-browser-dynamic.umd.js', defaultExtension: 'js' },
      '@angular/http': { main: 'http.umd.js', defaultExtension: 'js' },
      '@angular/router': { main: 'router.umd.js', defaultExtension: 'js' },
      '@angular/forms': { main: 'forms.umd.js', defaultExtension: 'js' },
      rxjs: { defaultExtension: 'js' },
			'angular2-fontawesome':       { defaultExtension: 'js' },
			'angular2-jwt':               { main: 'angular2-jwt.js', defaultExtension: 'js' },
			'angular2-uuid':              { main: 'index.js', defaultExtension: 'js' },
			'ng2-bootstrap':              { defaultExtension: 'js' },
			'angular2-color-picker':   		{ main: 'index.js', defaultExtension: 'js' },
			'socket.io-client':           { defaultExtension: 'js'}
    }
  });
})(this);