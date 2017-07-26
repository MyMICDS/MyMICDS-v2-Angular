import { Component, OnInit } from '@angular/core';

@Component({
          selector: 'mymicds-tutorial',
          templateUrl: './tutorial.component.html',
          styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent implements OnInit {          
          config = {
                    "timeout": 5000
          }
          
          imgPaths = {
                    "slideshow": [
                              "../../../assets/tutorial/1.png",
                              "../../../assets/tutorial/2.png"
                    ],
                    "annotations": [
                              "This is slide one",
                              "This is slide two"
                    ]
          }
          
          annotation: string = this.imgPaths.annotations[0];
          
          currentImage;
          
          constructor() { }

          ngOnInit() {
                    this.currentImage = this.imgPaths.slideshow[0];
                    
                    for (var i = 0; i < this.imgPaths.slideshow.length; i++) {
                              this.slide(i);
                    }
                    
                    console.log("Slideshow Complete");
          }
          
          slide(position) {
                    setTimeout(e => {
                              this.currentImage = this.imgPaths.slideshow[position];
                              this.annotation = this.imgPaths.annotations[position];
                              console.log("Slide change");
                    }, this.config.timeout);
          }
}