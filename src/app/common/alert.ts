export class Alert {
	id = Symbol();
	title: string;
	repeat = 1;
	timeout?: NodeJS.Timer;

	constructor(public type: AlertType, public content: string, public expiresIn = -1) {
		this.title = defaultTitles[type];
	}

	equals(another: Alert) {
		return this.type === another.type
			&& this.title === another.title
			&& this.content === another.content;
	}
}

export enum AlertType {
	Error = 'danger',
	Warning = 'warning',
	Success = 'success',
	Info = 'info'
}

export const defaultTitles = {
	[AlertType.Error]: 'Error!',
	[AlertType.Warning]: 'Warning!',
	[AlertType.Success]: 'Success!',
	[AlertType.Info]: 'Announcement!'
};
