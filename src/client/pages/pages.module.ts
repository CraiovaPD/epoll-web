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
import { EditPollDebatePageComponent } from './edit-poll/page.component';
import { EditDebatePageResolver } from './edit-poll/page.resolver';
import { AddNewPollPageComponent } from './add-new-poll/page.component';
import { UserRoleGuard } from './common/role.guard';
import { UserRole } from '../types/users/IUser';
import { AnouncementsListPageComponent } from './anouncements-list/page.component';
import { AddNewAnouncementPageComponent } from './add-new-anouncement/page.component';

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
  path: 'polls/add', component: AddNewPollPageComponent,
  canActivate: [AuthGuard, UserRoleGuard],
  data: {roles: [UserRole.root, UserRole.admin]}
}, {
  path: 'anouncements', component: AnouncementsListPageComponent
}, {
  path: 'anouncements/add', component: AddNewAnouncementPageComponent,
  canActivate: [AuthGuard, UserRoleGuard],
  data: {roles: [UserRole.root, UserRole.admin]}
}, {
  path: 'debates/:id', component: DebateDetailsPageComponent,
  resolve: {pageData: DebatePageResolver}
}, {
  path: 'debates/:id/edit', component: EditPollDebatePageComponent,
  canActivate: [AuthGuard, UserRoleGuard],
  data: {roles: [UserRole.root, UserRole.admin, UserRole.moderator]},
  resolve: {pageData: EditDebatePageResolver}
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
    UserRoleGuard,
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
    EditPollDebatePageComponent,
    AddNewPollPageComponent,
    AddNewAnouncementPageComponent,
    AnouncementsListPageComponent
  ],
  exports: [

  ],
  entryComponents: [
  ]
})
export class PagesModule { }
