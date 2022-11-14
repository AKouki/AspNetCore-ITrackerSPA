import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../shared/issue';
import { IssueService } from '../shared/issue.service';

@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css']
})
export class IssueEditComponent implements OnInit {
  issue: Issue = {} as Issue;
  errorMessage: string = "";

  constructor(private issueService: IssueService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    if (id >= 0) {
      this.issueService.getIssue(id)
        .subscribe(result => this.issue = result, error => this.errorMessage = error);
    }
  }

  onSubmit(form: NgForm) {
    this.issueService.updateIssue(this.issue).subscribe(result => {
      this.router.navigate(['/Issues']);
    }, error => this.errorMessage = error);
  }
}
