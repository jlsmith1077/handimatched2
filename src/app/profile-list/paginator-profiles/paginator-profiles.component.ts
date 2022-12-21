import {Component, Injectable, NgModule, OnInit} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { ɵ$localize } from '@angular/localize';
import {Subject} from 'rxjs';

@Component({
  selector: 'paginator-profiles',
  templateUrl: './paginator-profiles.component.html',
  styleUrls: ['./paginator-profiles.component.css']
})
export class PaginatorProfilesComponent extends MatPaginatorIntl  {

  constructor() { 
    super()
  }

  override changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  override firstPageLabel = ɵ$localize `First page`;
  override itemsPerPageLabel = ɵ$localize`Profile per page`;
  override lastPageLabel = ɵ$localize`Last page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  override nextPageLabel = 'Next page';
  override previousPageLabel = 'Previous page';

  
}
