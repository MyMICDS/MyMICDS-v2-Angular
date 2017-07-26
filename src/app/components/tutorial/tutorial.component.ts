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
                              "../../../assets/help/portal-url/step-1.png",
                              "../../../assets/help/portal-url/step-2.png",
                              "../../../assets/help/portal-url/step-3.png",
                              "../../../assets/help/portal-url/step-4.png",
                              "../../../assets/help/portal-url/step-5.png",
                              "../../../assets/help/canvas-url/step-1.png",
                              "../../../assets/help/canvas-url/step-2.png",
                              "../../../assets/help/canvas-url/step-3.png",
                              "../../../assets/help/canvas-url/step-4.png",
                              "../../../assets/help/canvas-url/step-5.png"
                    ]
          }
          
          annotation: string;
          
          explanation : string;
          
          currentImage;
          
          // visibilities
          masterVis = "visible";
          doneVis = "hidden";
          
          // pointer positions
          ptop = "40%";
          pleft = "40%";
          
          constructor() { }

          async ngOnInit() {
                    this.currentImage = this.imgPaths.slideshow[0];
                    
                    for (var i = 0; i < this.imgPaths.slideshow.length; i++) {
                              switch (i) {
                                        case 0:
                                                  /* Initial slide is manually selected */
                                                  this.explanation = "How to use the MICDS Calendar Tool";
                                                  this.annotation = "Navigate to the MICDS Portal and log in";
                                                  break;
                                        case 1 :
                                                  await this.wait();
                                                  this.slide(1, "Click on the Calendar tab");
                                                  break;
                                        case 2 :
                                                  await this.wait();
                                                  this.slide(2, "Click on the RSS Feed button in the top corner or the calendar.");
                                                  break;
                                        case 3 :
                                                  await this.wait();
                                                  this.ptop = "35%";
                                                  this.slide(3, "To the left of Entire Calendar:, right click on the My Calendars link and click Copy Link Location. (Note that the exact text may differ per browser.)");
                                                  break;
                                        case 4 :
                                                  await this.wait();
                                                  this.ptop = "40%";
                                                  this.slide(4, "Navigate to the MyMICDS Settings Page and paste the URL under Portal URL and click save!");
                                                  break;
                                        // canvas
                                        case 5 :
                                                  await this.wait();
                                                  this.explanation = "How to use the MICDS Canvas Tool";
                                                  this.slide(5, "Navigate to the MICDS Canvas and log in");
                                                  break;
                                        case 6 :
                                                  await this.wait();
                                                  this.slide(6, "Click on the Calendar tab");
                                                  break;
                                        case 7 :
                                                  await this.wait();
                                                  this.slide(7, "Click on the Calendar Feed button in the bottom right corner in the sidebar");
                                                  break;
                                        case 8 :
                                                  await this.wait();
                                                  this.slide(8, "Select the URL in the text box and simply copy it");
                                                  break;
                                        case 9 :
                                                  await this.wait();
                                                  this.slide(9, "Navigate to the MyMICDS Settings Page and paste the URL under Canvas URL and click save!");
                                                  break;
                              }
                    }
                    
                    console.log("Slideshow Complete");
                    this.masterVis = "hidden";
                    this.doneVis = "visible";
          }
          
          slide(position, text : string) {
                    this.currentImage = this.imgPaths.slideshow[position];
                    this.annotation = text;
                    console.log("Slide change");
          }
          
          async wait() {
                    return new Promise(resolve => setTimeout(resolve, this.config.timeout));
          }
}