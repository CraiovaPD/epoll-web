import { NgModule } from '@angular/core';
import { CopyrightFooterComponent } from './copyright-footer.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [],
  declarations: [
    CopyrightFooterComponent
  ],
  exports: [
    CopyrightFooterComponent
  ]
})
export class CommonModule { }
