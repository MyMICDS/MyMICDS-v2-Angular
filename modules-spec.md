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
	optionTypes: {
		location: 'string',
		metric: 'boolean',
		decimalPrecision: 'number'
	},
	defaultOptions: {
		location: 'MICDS',
		metric: false,
		decimalPrecision: 2
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

#### `optionTypes`?: { [option: string]: 'boolean' | 'number' | 'string' }

Optional. This is where the module's options and their types are defined. Options are sent to the component via changing its instance variables, so you **must** have one instance variable for each option with its documented default option.

#### `defaultOptions`?: { [option: string]: boolean | number | string }

Should only be defined if `optionTypes` is defined. Default module options upon creation. **This should correlate with the component's instance variable of the same option name! Make sure to add the `@Input` decorator to each option variable!**

## Design

Modules should be enforced with a consistent design spec for a uniform experience no matter what modules the user configured.

### Responsiveness

Modules should be responsive on any dimensions **as small as 250px wide and 250px high**, and **up to 1250px wide and 1250px height** and every combination in between. Module content should not overflow these bounds.
