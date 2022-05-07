import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss']
})
export class ValidatorComponent implements OnInit {

  @Input() text: string = ''; 
  @Input() alignTop: boolean = false; 
  
  constructor() { }

  ngOnInit(): void {
  }

}
