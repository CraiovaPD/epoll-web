import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SharedModule } from '../shared.module';
import { UtilModule } from '../util/util.module';
import { CoreModule } from '../core/core.module';
import { CommonModule } from './common/common.module';

// services
import { AuthGuard } from './common/auth.guard';

// pages
import { NotFoundPageComponent } from './not-found/page.component';
import { HomePageComponent } from './home/page.component';
import { HomePageResolver } from './home/page.resolver';
import { DebateDetailsPageComponent } from './debate-details/page.component';
import { DebatePageResolver } from './debate-details/page.resolver';
import { LoginPageComponent } from './login/page.component';
import { UserProfilePageComponent } from './user-profile/page.component';
import { UserProfilePageResolver } from './user-profile/page.resolver';
import { EditDebatePageComponent } from './edit-debate/page.component';
import { EditDebatePageResolver } from './edit-debate/page.resolver';
import { AddNewDebatePageComponent } from './add-new-debate/page.component';

export const ROUTES: Route[] = [{
  path: '', component: HomePageComponent,
  resolve: {pageData: HomePageResolver}
}, {
  path: '404', component: NotFoundPageComponent
}, {
  path: 'login', component: LoginPageComponent
}, {
  path: 'u/:id', component: UserProfilePageComponent,
  resolve: {pageData: UserProfilePageResolver}
}, {
  path: 'debates/add', component: AddNewDebatePageComponent
}, {
  path: 'debates/:id', component: DebateDetailsPageComponent,
  resolve: {pageData: DebatePageResolver}
}, {
  path: 'debates/:id/edit', component: EditDebatePageComponent
}, {
  path: '**', redirectTo: '404'
}];

@NgModule({
  imports: [
    RouterModule,

    SharedModule,
    UtilModule,
    CoreModule,
    CommonModule
  ],
  providers: [
    HomePageResolver,
    AuthGuard,
    DebatePageResolver,
    UserProfilePageResolver,
    EditDebatePageResolver
  ],
  declarations: [
    // pages
    NotFoundPageComponent,
    HomePageComponent,
    DebateDetailsPageComponent,
    LoginPageComponent,
    UserProfilePageComponent,
    EditDebatePageComponent,
    AddNewDebatePageComponent
  ],
  exports: [

  ],
  entryComponents: [
  ]
})
export class PagesModule { }
