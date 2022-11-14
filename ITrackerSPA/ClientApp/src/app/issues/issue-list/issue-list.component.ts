import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../projects/shared/project.service';
import { Issue } from '../shared/issue';
import { IssueService } from '../shared/issue.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  errorMessage: string = "";
  filter1 = -1;
  filter2 = -1;
  filter3 = -1;
  searchText = "";
  currentProject = "";


  constructor(
    private issueService: IssueService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute  ) { }

  ngOnInit(): void {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    if (!id) {
      this.issueService.getIssues()
        .subscribe(result => this.issues = result, error => this.errorMessage = error);
    }
    else {
      this.projectService.getProject(id)
        .subscribe(result => this.currentProject = result.name);

      this.issueService.getIssuesByProject(id)
        .subscribe(result => this.issues = result, error => this.errorMessage = error);
    }
  }

  deleteIssue(issue: Issue): void {
    if (confirm("Are you sure you want to delete this issue?")) {
      this.issueService.deleteIssue(issue.issueId!).subscribe(() => {
        var index = this.issues.indexOf(issue);
        if (index > -1) {
          this.issues.splice(index, 1);
        }
      }, error => this.errorMessage = error);
    }
  }

  priorityToClass(priority: number) {
    switch (priority) {
      case 0:
        return 'text-success';
      case 2:
        return 'text-danger';
      default:
        return 'text-primary';
    }
  }

  priorityToText(priority: number) {
    switch (priority) {
      case 0:
        return 'Low';
      case 2:
        return 'High';
      default:
        return 'Normal';
    }
  }

  statusTypeToClass(statusType: number) {
    switch (statusType) {
      case 0:
        return 'badge rounded-pill bg-primary';
      case 1:
        return 'badge rounded-pill bg-warning';
      case 2:
        return 'badge rounded-pill bg-success';
      case 3:
        return 'badge rounded-pill bg-primary';
      case 4:
        return 'badge rounded-pill bg-danger';
      default:
        return 'badge rounded-pill bg-default';
    }
  }

  statusTypeToText(statusType: number) {
    switch (statusType) {
      case 0:
        return 'Open';
      case 1:
        return 'In Progress';
      case 2:
        return 'Resolved';
      case 3:
        return 'Reopened';
      case 4:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  getIssueTypeText(val: number) {
    switch (val) {
      case 0:
        return 'Bug';
      case 1:
        return 'Task';
      case 2:
        return 'Change';
      case 3:
        return 'Enhancement';
      default:
        return 'Unknown';
    }
  }

}
