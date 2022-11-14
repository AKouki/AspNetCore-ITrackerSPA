import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { IssueCreateComponent } from './issues/issue-create/issue-create.component';
import { IssueEditComponent } from './issues/issue-edit/issue-edit.component';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { AttachmentListComponent } from './attachments/attachment-list/attachment-list.component';
import { AttachmentFilterPipe } from './attachments/shared/attachment-filter.pipe';
import { IssueFilterPipe } from './issues/shared/issue-filter.pipe';
import { IssueFilterByPriorityPipe } from './issues/shared/issue-filter-by-priority.pipe';
import { IssueFilterByStatusPipe } from './issues/shared/issue-filter-by-status.pipe';
import { IssueFilterByTypePipe } from './issues/shared/issue-filter-by-type.pipe';
import { ProjectFilterPipe } from './projects/shared/project-filter.pipe';
import { AttachmentGuard } from './attachments/shared/attachment.guard';
import { IssueGuard } from './issues/shared/issue.guard';
import { ProjectGuard } from './projects/shared/project.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    IssueCreateComponent,
    IssueEditComponent,
    IssueListComponent,
    ProjectEditComponent,
    ProjectListComponent,
    AttachmentListComponent,
    AttachmentFilterPipe,
    IssueFilterPipe,
    IssueFilterByPriorityPipe,
    IssueFilterByStatusPipe,
    IssueFilterByTypePipe,
    ProjectFilterPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'Issues', component: IssueListComponent, canActivate: [AuthorizeGuard] },
      { path: 'Projects/:id/Issues', component: IssueListComponent, canActivate: [AuthorizeGuard, IssueGuard], pathMatch: 'full' },
      { path: 'Issues/Create', component: IssueCreateComponent, canActivate: [AuthorizeGuard] },
      { path: 'Issues/:id/Edit', component: IssueEditComponent, canActivate: [AuthorizeGuard, IssueGuard] },
      { path: 'Projects', component: ProjectListComponent, canActivate: [AuthorizeGuard] },
      { path: 'Projects/Create', component: ProjectEditComponent, canActivate: [AuthorizeGuard] },
      { path: 'Projects/:id/Edit', component: ProjectEditComponent, canActivate: [AuthorizeGuard, ProjectGuard] },
      { path: 'Attachments', component: AttachmentListComponent, canActivate: [AuthorizeGuard] },
      { path: 'Issues/:id/Attachments', component: AttachmentListComponent, canActivate: [AuthorizeGuard, AttachmentGuard] },
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
