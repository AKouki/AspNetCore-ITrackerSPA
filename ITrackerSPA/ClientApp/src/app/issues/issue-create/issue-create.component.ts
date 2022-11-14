import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../projects/shared/project';
import { ProjectService } from '../../projects/shared/project.service';
import { Issue } from '../shared/issue';
import { IssueService } from '../shared/issue.service';

@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {
  issue: Issue = {} as Issue;
  projects: Project[] = [];
  errorMessage: string = "";
  fileToUpload: any;

  constructor(private issueService: IssueService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    // Default - empty issue
    this.issue = {
      issueId: -1,
      title: "",
      description: "",
      issueType: 0,
      priority: 1,
      statusType: 0
    };

    this.projectService.getProjects()
      .subscribe(result => this.projects = result, error => console.error(error));
  }

  onSubmit(form: NgForm) {
    // Any file to upload?
    this.issueService.createIssue(this.issue).subscribe(result => {
      if (result.issueId > -1) {
        this.uploadFile(result.issueId);
      }
      else
        this.errorMessage = "Invalid Request. Check your values!";
    },
      error => {
        this.errorMessage = error;
        console.log(error);
      }
    );
  }

  uploadFile(issueId: any) {
    if (this.fileToUpload != null) {
      this.issueService.uploadFile(issueId, this.fileToUpload).subscribe(
        data => {
          console.log('File uploaded!');
        },
        error => {
          console.error('File not uploaded!');
        },
        () => {
          this.router.navigate(['/Issues']);
        }
      );
    }
    else {
      this.router.navigate(['/Issues']);
    }
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileToUpload = fileList[0];
    }
  }
}
