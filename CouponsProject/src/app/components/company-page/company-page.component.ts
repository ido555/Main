import { Component, OnInit } from '@angular/core';
import {ClientType} from '../../enums/client-type.enum';
import {CompanyControllerService} from '../../services/company-controller.service';
import {MatDialog} from '@angular/material/dialog';
import {GlobalService} from '../../services/global.service';
import {ErrorBoxComponent} from '../error-box/error-box.component';
import {ClientInfoPopupComponent} from '../client-info-popup/client-info-popup.component';
import {AdminControllerService} from '../../services/admin-controller.service';
import {ColumnMode, SelectionType} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  // logic stuff
  lastAction: ClientType;
  beforeSearch: any;
  token: string;
  // data table stuff
  columns: string | any[];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  selectedRow = [];
  custColNames = [{prop: 'customerId'}, {prop: 'firstName'}, {prop: 'lastName'}, {prop: 'email'}, {prop: 'password'}];
  compColNames = [{prop: 'companyId'}, {prop: 'name'}, {prop: 'email'}, {prop: 'password'}];
  rows;

  constructor(private cont: CompanyControllerService, private dialog: MatDialog, private glob: GlobalService) {
  }

  ngOnInit(): void {
    this.rows = [1]

  }

  errPopup(err: string) {
    this.dialog.open(ErrorBoxComponent,
      {
        minHeight: 200, minWidth: 200, disableClose: false,
        maxHeight: 400, maxWidth: 600,
        data: {err}
      });
  }

  // clientPopup() {
  //   const row = this.selectedRow;
  //   this.dialog.open(ClientInfoPopupComponent,
  //     {
  //       minHeight: 400, minWidth: 400, disableClose: false,
  //       data: row[0]
  //     });
  //
  //   this.dialog.afterAllClosed.subscribe(
  //     () => this.lastAction === ClientType.Customer ? this.getAllCustomers() : this.getAllCompanies()
  //   );
  // }

  resetTable() {
    if (this.beforeSearch == null) {
      return;
    }
    this.rows = this.beforeSearch;
    this.beforeSearch = null;
    this.selectedRow = [];
  }

  updateFilter(event) {
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.rows[0]);
    // assign filtered matches to the active datatable
    if (this.beforeSearch == null) {
      this.beforeSearch = this.rows;
    }
    this.rows = this.rows.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        if (item[keys[i]] == null) {
          return false;
        }
        // check for a match - how? magic!
        if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        }
      }
    });

  }

  updateTable(s: object) {
    this.rows = s;
    this.rows = [...this.rows];
    this.selectedRow = [];
  }


}
