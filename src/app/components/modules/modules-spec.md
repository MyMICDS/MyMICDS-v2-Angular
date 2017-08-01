# MyMICDS Modules Spec

This file outlines the specifications that all MyMICDS Modules (black squares on the home page) should conform to.

## What is a module?

The home page of MyMICDS is composed of different 'modules.' These modules can be moved, resized, and configured to the user's liking. Within the MyMICDS Angular codebase, there's is an internal API to make it easy to create another module.

## Creation

All modules should be created in the `/src/app/components/modules` directory. There is no specific naming convention for modules.

### MyMICDS Module Decorator

**All modules should contain the `@MyMICDSModule` decorator below the `@Component` decorator.** You can look for specifics about the `@MyMICDSModule` decorator in `/src/app/components/modules/modules-main.ts`.

Here is an example usage of the module decorator:

```javascript
// Standard Angular component decorator
@Component({
	selector: 'mymicds-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
// MyMICDS Module decorator required to be recognized as a module
@MyMICDSModule({
	name: 'weather',
	icon: 'fa-cloud',
	defaultHeight: 1,
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
})
export class WeatherComponent implements OnInit, OnDestroy {
	// One instance variable required for every option! Make sure to add `@Input()` and its default value specified in the decorator!
	@Input() location = 'MICDS';
	@Input() metric = false;
	@Input() decimalPrecision = 2;
	...
}
```

#### Options

##### `name`: string

Name of the module (use spaces, no dashes or camel case)

#### `icon`: string

Font Awesome icon name used to represent the module

#### `defaultHeight`: string

Initial height when module created in the drag-and-drop

#### `defaultWidth`: string

Initial width when module created in the drag-and-drop interface

#### `options`?: { [option: string]: { label: string, type: string, value: 'boolean' | 'number' | 'string' }}

Optional. This is where a module's options are declared. **Each key must correlate to a component instance variable with the `@Input` decorator! Make sure the default value in the decorator matches the default instance variable value.** These values are used to generate a form to configure the module's options. **Make sure the option types are also documented in the back-end!**

## Design

Modules should be enforced with a consistent design spec for a uniform experience no matter what modules the user configured.

### Responsiveness

Modules should be responsive on any dimensions **as small as 250px wide and 250px high**, and **up to 1250px wide and 1250px height** and every combination in between. Module content should not overflow these bounds.
