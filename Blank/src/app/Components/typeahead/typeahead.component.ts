import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { OnInit } from '@angular/core';
import { Country } from 'src/app/model/Country.model';

@Component({
  selector: 'app-typeahead',
  templateUrl: 'typeahead.component.html',
})
export class TypeaheadComponent implements OnInit {
  @Input() items: Country[] = [];
  @Input() selectedItems!: Country;
  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Country>();

  filteredItems: Country[] = [];
  workingSelectedValues!: Country;

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = this.selectedItems;
  }

  trackItems(index: number, item: Country) {
    return item.name;;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item: Country) => {
        return item.name.toLowerCase().includes(normalizedQuery.toLowerCase());
      });
    }
  }
}
