import { MyMICDS, JWT } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-campus',
	templateUrl: './campus.component.html',
	styleUrls: ['./campus.component.scss']
})
export class CampusComponent extends SubscriptionsComponent implements OnInit {
	imageUrls: (string)[]= [
		{url: 'images/img1.png', caption: 'yeet'},
		{url: 'images/img2.png', caption: 'yeet (but cooler)'}
	]
}
