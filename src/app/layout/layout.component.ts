import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sortOption: string = 'default';

  constructor() { }

  ngOnInit(): void { }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    // Logic to propagate the sorting to child components can go here
  }
}
