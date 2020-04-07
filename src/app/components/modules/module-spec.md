# MyMICDS Modules Spec

This file outlines the specifications that all MyMICDS Modules (black squares on the home page) should conform to.

## What is a module?

The home page of MyMICDS is composed of different 'modules.' These modules can be moved, resized, and configured to the user's liking. Within the MyMICDS Angular codebase, there's is an internal API to make it easy to create another module.

## Creation

All modules should be created in the `/src/app/components/modules` directory. Apart from standard naming of file directory/classes, there is no specific naming convention for modules.

## MyMICDS Module Config

**All homepage modules should be inserted into the modules config.**

### Front-End
Here is an example module in `module-config.ts`:

```javascript

export const moduleComponents: any[] = [
	...
	WeatherComponent // Put in alphabetical order!
	...
];

export const config: Config = {
	...
	// Again, put the modules in alphabetical order
	// (Same order as in the `moduleComponents` array)
	weather: {
		displayName: 'Weather',
		// Look at font-awesome icons for icon names.
		// If the icon does not come from the Solid-Icon pack,
		// you'll need to do some tinkering like the twitter icon
		icon: 'cloud',
		component: WeatherComponent,
		defaultHeight: 2,
		defaultWidth: 2,
		options: {
			metric: {
				label: 'Metric Units',
				type: 'boolean',
				default: false
			},
			location: {
				label: 'Location',
				type: 'string',
				default: 'MICDS'
			},
			decimalPrecision: {
				label: 'Decimal Precision',
				type: 'number',
				default: 2
			}
		}
	}
	...
};
```

Within the `WeatherComponent` itself:

```javascript
export class WeatherComponent implements OnInit, OnDestroy {
	// One instance variable required for every option!
	// Make sure to add `@Input()` and its default value specified in the decorator!
	@Input() location = 'MICDS';
	@Input() metric = false;
	@Input() decimalPrecision = 2;
	...
}
```

### Back-End
Finally, **each module type and it's possible options must be inserted in the back-end in [`/src/libs/modules.js`](https://github.com/MyMICDS/MyMICDS-v2/blob/master/src/libs/modules.js) for server-side validation.**

In the back-end in `modules.js`:

```javascript
const moduleList = [ ... 'weather',  ... ]; // As always, put in alphabetical order

const modulesConfig = {
	...
	// What order should it be in?
	// Trick question. Alphabetical.
	weather: {
		// Each option key should correspond with the option key in the front-end config
		metric: {
			// `Label` property is not needed unlike the front-end config
			type: 'boolean',
			default: false
		},
		location: {
			type: 'string',
			default: 'MICDS'
		},
		decimalPrecision: {
			type: 'number',
			default: 2
		}
	}
	...
};

```

Note that if a module does not have any options, **no entry is needed in the `modulesConfig` object**. The module id should still be in the `modulesList` array.

## Module Config Properties

### Key of Config

Id of the module. No spaces or dashes. Should be camel case.

### `displayName`: string

Name of the module (use spaces, no dashes or camel case)

### `icon`: string

Font Awesome icon name used to represent the module

### `defaultHeight`: string

Initial grid height when module created in the drag-and-drop

### `defaultWidth`: string

Initial grid width when module created in the drag-and-drop interface

### `options`?: { [option: string]: { label: string, type: string, value: 'boolean' | 'number' | 'string' }}

Optional. This is where a module's options are declared. **Each key must correlate to a component instance variable with the `@Input` decorator! Make sure the default value in the decorator matches the default instance variable value.** These values are used to generate a form to configure the module's options. **Make sure the option types are also documented in the back-end!**

## Design

Modules should be enforced with a consistent design spec for a uniform experience no matter what modules the user configured.

### Responsiveness

Modules should be responsive on any dimensions **as small as 250px wide and 250px high**, and **up to 1250px wide and 1250px height** and every combination in between. Module content should not overflow these bounds.
