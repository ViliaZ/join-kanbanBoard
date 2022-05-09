import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  @Input() show: boolean = false
  @Input() text: any;

  constructor() { }

  ngOnInit(): void {
  }

}
