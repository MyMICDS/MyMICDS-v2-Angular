/*
 * Modified version of Hemn Chawroka's Confetti Animation
 * http://codepen.io/iprodev/full/azpWBr
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

// Math constants
const PI = Math.PI;
const sqrt = Math.sqrt;
const round = Math.round;
const random = Math.random;
const cos = Math.cos;
const sin = Math.sin;

const DEG_TO_RAD = PI / 180;

let retina = window.devicePixelRatio;

const colors = [
	['#df0049', '#660671'],
	['#00e857', '#005291'],
	['#2bebbc', '#05798a'],
	['#ffd200', '#b06c00']
];


@Component({
	selector: 'mymicds-confetti',
	templateUrl: './confetti.component.html',
	styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {

	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	@ViewChild('confetti', { static: true }) canvas: ElementRef;
	confetti: ConfettiContext;

	constructor() { }

	ngOnInit() {
		this.confetti = new ConfettiContext(this.canvas.nativeElement);
		this.confetti.start();
		// tslint:disable-next-line:no-unused-expression
		new ResizeSensor(this.moduleContainer.nativeElement, () => this.confetti.resize());
	}

}

class Vector2 {

	static Lerp(_vec0: Vector2, _vec1: Vector2, _t: number) {
		return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
	}

	static Distance(_vec0: Vector2, _vec1: Vector2) {
		return sqrt(Vector2.SqrDistance(_vec0, _vec1));
	}

	static SqrDistance(_vec0: Vector2, _vec1: Vector2) {
		let x = _vec0.x - _vec1.x;
		let y = _vec0.y - _vec1.y;
		// return (x * x + y * y + z * z);
		return (x * x + y * y);
	}

	static Scale(_vec0: Vector2, _vec1: Vector2) {
		return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
	}

	static Min(_vec0: Vector2, _vec1: Vector2) {
		return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
	}

	static Max(_vec0: Vector2, _vec1: Vector2) {
		return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
	}

	static ClampMagnitude(_vec0: Vector2, _len: number) {
		let vecNorm = _vec0.Normalized();
		return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
	}

	static Sub(_vec0: Vector2, _vec1: Vector2) {
		// return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
		return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y);
	}

	constructor(public x: number, public y: number) { }

	Length() {
		return sqrt(this.SqrLength());
	}

	SqrLength() {
		return this.x * this.x + this.y * this.y;
	}

	Add(_vec: Vector2) {
		this.x += _vec.x;
		this.y += _vec.y;
	}

	Sub(_vec: Vector2) {
		this.x -= _vec.x;
		this.y -= _vec.y;
	}

	Div(_f: number) {
		this.x /= _f;
		this.y /= _f;
	}

	Mul(_f: number) {
		this.x *= _f;
		this.y *= _f;
	}

	Normalize() {
		let sqrLen = this.SqrLength();
		if (sqrLen !== 0) {
			let factor = 1.0 / sqrt(sqrLen);
			this.x *= factor;
			this.y *= factor;
		}
	}

	Normalized() {
		let sqrLen = this.SqrLength();
		if (sqrLen !== 0) {
			let factor = 1.0 / sqrt(sqrLen);
			return new Vector2(this.x * factor, this.y * factor);
		}
		return new Vector2(0, 0);
	}
}

class EulerMass {

	position: Vector2;
	force = new Vector2(0, 0);
	velocity = new Vector2(0, 0);

	constructor(x: number, y: number, private mass: number, private drag: number) {
		this.position = new Vector2(x, y);
	}

	AddForce(_f: Vector2) {
		this.force.Add(_f);
	}

	Integrate(_dt: number) {
		let acc = this.CurrentForce(this.position);
		acc.Div(this.mass);
		let posDelta = new Vector2(this.velocity.x, this.velocity.y);
		posDelta.Mul(_dt);
		this.position.Add(posDelta);
		acc.Mul(_dt);
		this.velocity.Add(acc);
		this.force = new Vector2(0, 0);
	}

	CurrentForce(_pos: Vector2) {
		let totalForce = new Vector2(this.force.x, this.force.y);
		let speed = this.velocity.Length();
		let dragVel = new Vector2(this.velocity.x, this.velocity.y);
		dragVel.Mul(this.drag * this.mass * speed);
		totalForce.Sub(dragVel);
		return totalForce;
	}

}

class ConfettiPaper {

	static bounds = new Vector2(0, 0);

	pos: Vector2;
	rotationSpeed = (random() * 600 + 800);
	angle = DEG_TO_RAD * random() * 360;
	rotation = DEG_TO_RAD * random() * 360;
	cosA = 1.0;
	size = 5.0;
	oscillationSpeed = (random() * 1.5 + 0.5);
	xSpeed = 40.0;
	ySpeed = (random() * 60 + 50.0);
	corners = new Array();
	time = random();
	frontColor: string;
	backColor: string;

	constructor(x: number, y: number) {
		this.pos = new Vector2(x, y);

		const ci = round(random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];

		for (let i = 0; i < 4; i++) {
			let dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
			let dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
			this.corners[i] = new Vector2(dx, dy);
		}
	}

	Update(_dt: number) {
		this.time += _dt;
		this.rotation += this.rotationSpeed * _dt;
		this.cosA = cos(DEG_TO_RAD * this.rotation);
		this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt;
		this.pos.y += this.ySpeed * _dt;
		if (this.pos.y > ConfettiPaper.bounds.y) {
			this.pos.x = random() * ConfettiPaper.bounds.x;
			this.pos.y = 0;
		}
	}

	Draw(_g: CanvasRenderingContext2D) {
		if (this.cosA > 0) {
			_g.fillStyle = this.frontColor;
		} else {
			_g.fillStyle = this.backColor;
		}
		_g.beginPath();
		_g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
		for (let i = 1; i < 4; i++) {
			_g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
		}
		_g.closePath();
		_g.fill();
	}

}

class ConfettiRibbon {

	static bounds = new Vector2(0, 0);

	particles: EulerMass[] = [];
	frontColor: string;
	backColor: string;
	xOff: number;
	yOff: number;
	position: Vector2;
	prevPosition: Vector2;
	velocityInherit = (random() * 2 + 4);
	time = random() * 100;
	oscillationSpeed = (random() * 2 + 2);
	oscillationDistance = (random() * 40 + 40);
	ySpeed = (random() * 40 + 80);

	constructor(
		x: number,
		y: number,
		private particleCount: number,
		private particleDist: number,
		thickness: number,
		angle: number,
		private particleMass: number,
		private particleDrag: number
	) {
		const ci = round(random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];

		this.xOff = (cos(DEG_TO_RAD * angle) * thickness);
		this.yOff = (sin(DEG_TO_RAD * angle) * thickness);

		this.position = new Vector2(x, y);
		this.prevPosition = new Vector2(x, y);

		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new EulerMass(x, y - i * this.particleDist, this.particleMass, this.particleDrag);
		}
	}

	Update(_dt: number) {
		let i = 0;
		this.time += _dt * this.oscillationSpeed;
		this.position.y += this.ySpeed * _dt;
		this.position.x += cos(this.time) * this.oscillationDistance * _dt;
		this.particles[0].position = this.position;
		let dX = this.prevPosition.x - this.position.x;
		let dY = this.prevPosition.y - this.position.y;
		let delta = sqrt(dX * dX + dY * dY);
		this.prevPosition = new Vector2(this.position.x, this.position.y);
		for (i = 1; i < this.particleCount; i++) {
			let dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
			dirP.Normalize();
			dirP.Mul((delta / _dt) * this.velocityInherit);
			this.particles[i].AddForce(dirP);
		}
		for (i = 1; i < this.particleCount; i++) {
			this.particles[i].Integrate(_dt);
		}
		for (i = 1; i < this.particleCount; i++) {
			let rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
			rp2.Sub(this.particles[i - 1].position);
			rp2.Normalize();
			rp2.Mul(this.particleDist);
			rp2.Add(this.particles[i - 1].position);
			this.particles[i].position = rp2;
		}
		if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
			this.Reset();
		}
	}

	Reset() {
		this.position.y = -random() * ConfettiRibbon.bounds.y;
		this.position.x = random() * ConfettiRibbon.bounds.x;
		this.prevPosition = new Vector2(this.position.x, this.position.y);
		this.velocityInherit = random() * 2 + 4;
		this.time = random() * 100;
		this.oscillationSpeed = random() * 2.0 + 1.5;
		this.oscillationDistance = (random() * 40 + 40);
		this.ySpeed = random() * 40 + 80;
		let ci = round(random() * (colors.length - 1));
		this.frontColor = colors[ci][0];
		this.backColor = colors[ci][1];
		this.particles = new Array();
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
		}
	}

	Draw(_g: CanvasRenderingContext2D) {
		for (let i = 0; i < this.particleCount - 1; i++) {
			let p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
			let p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
			if (
				this.Side(
					this.particles[i].position.x,
					this.particles[i].position.y,
					this.particles[i + 1].position.x,
					this.particles[i + 1].position.y, p1.x, p1.y
				) < 0
			) {
				_g.fillStyle = this.frontColor;
				_g.strokeStyle = this.frontColor;
			} else {
				_g.fillStyle = this.backColor;
				_g.strokeStyle = this.backColor;
			}
			if (i === 0) {
				_g.beginPath();
				_g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
				_g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
				_g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
				_g.closePath();
				_g.stroke();
				_g.fill();
				_g.beginPath();
				_g.moveTo(p1.x * retina, p1.y * retina);
				_g.lineTo(p0.x * retina, p0.y * retina);
				_g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
				_g.closePath();
				_g.stroke();
				_g.fill();
			} else if (i === this.particleCount - 2) {
				_g.beginPath();
				_g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
				_g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
				_g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
				_g.closePath();
				_g.stroke();
				_g.fill();
				_g.beginPath();
				_g.moveTo(p1.x * retina, p1.y * retina);
				_g.lineTo(p0.x * retina, p0.y * retina);
				_g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
				_g.closePath();
				_g.stroke();
				_g.fill();
			} else {
				_g.beginPath();
				_g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
				_g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
				_g.lineTo(p1.x * retina, p1.y * retina);
				_g.lineTo(p0.x * retina, p0.y * retina);
				_g.closePath();
				_g.stroke();
				_g.fill();
			}
		}
	}

	Side(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
		return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
	}
}

class ConfettiContext {

	canvasParent: HTMLElement;
	context: CanvasRenderingContext2D;
	interval: number;

	canvasWidth: number;
	canvasHeight: number;

	duration: number;

	confettiRibbons: ConfettiRibbon[] = [];
	confettiPapers: ConfettiPaper[] = [];

	constructor(
		private canvas: HTMLCanvasElement,
		private speed = 50,
		private confettiRibbonCount = 11,
		private ribbonPaperCount = 30,
		private ribbonPaperDist = 8,
		private ribbonPaperThick = 8,
		private confettiPaperCount = 95
	) {
		this.duration = (1 / this.speed);
		this.canvasParent = canvas.parentNode as HTMLElement;
		this.canvasWidth = this.canvasParent.offsetWidth;
		this.canvasHeight = this.canvasParent.offsetHeight;
		this.canvas.width = this.canvasWidth * retina;
		this.canvas.height = this.canvasHeight * retina;
		this.context = canvas.getContext('2d')!;

		ConfettiRibbon.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
		for (let i = 0; i < confettiRibbonCount; i++) {
			this.confettiRibbons[i] =
				new ConfettiRibbon(
					random() * this.canvasWidth,
					-random() * this.canvasHeight * 2,
					ribbonPaperCount,
					ribbonPaperDist,
					ribbonPaperThick,
					45,
					1,
					0.05
				);
		}

		ConfettiPaper.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
		for (let i = 0; i < confettiPaperCount; i++) {
			this.confettiPapers[i] = new ConfettiPaper(random() * this.canvasWidth, random() * this.canvasHeight);
		}
	}

	resize() {
		this.canvasWidth = this.canvasParent.offsetWidth;
		this.canvasHeight = this.canvasParent.offsetHeight;
		this.canvas.width = this.canvasWidth * retina;
		this.canvas.height = this.canvasHeight * retina;
		ConfettiPaper.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
		ConfettiRibbon.bounds = new Vector2(this.canvasWidth, this.canvasHeight);
	}

	start() {
		this.stop();
		this.update();
	}

	stop() {
		cancelAnimationFrame(this.interval);
	}

	update() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < this.confettiPaperCount; i++) {
			this.confettiPapers[i].Update(this.duration);
			this.confettiPapers[i].Draw(this.context);
		}
		for (let i = 0; i < this.confettiRibbonCount; i++) {
			this.confettiRibbons[i].Update(this.duration);
			this.confettiRibbons[i].Draw(this.context);
		}
		this.interval = requestAnimationFrame(() => {
			this.update();
		});
	}

}
