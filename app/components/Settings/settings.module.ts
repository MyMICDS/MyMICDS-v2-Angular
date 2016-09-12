import {NgModule} from '@angular/core';
import {SettingsComponent} from './settings.component';
import {CommonModule} from '@angular/common';
import {ColorPickerService, ColorPickerModule} from 'angular2-color-picker';
import {SharedModule} from '../../shared.module';
import {routing} from '../../app.routing';

@NgModule({
    imports: [CommonModule, ColorPickerModule, SharedModule, routing],
    declarations: [SettingsComponent],
    providers: [ColorPickerService]
})
export class SettingsModule {}