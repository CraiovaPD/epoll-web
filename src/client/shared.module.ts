import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

/**
 * Module used for encapsulating needed core modules
 * and exporting them.
 */
@NgModule({
  exports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
  ]
})
export class SharedModule {}
