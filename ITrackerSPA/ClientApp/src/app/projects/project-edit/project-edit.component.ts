import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../shared/project';
import { ProjectService } from '../shared/project.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  project: Project = {} as Project;
  projectId: number = -1;
  errorMessage: string = "";

  constructor(private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    if (id > 0) {
      this.projectId = id;
      this.projectService.getProject(id)
        .subscribe(result => this.project = result, error => this.errorMessage = error);
    }
  }

  onSubmit(form: NgForm) {
    if (this.projectId >= 0) {
      this.projectService.updateProject(this.project).subscribe(data => {
        this.router.navigate(['/Projects']);
      }, error => this.errorMessage = <any>error);
    }
    else {
      this.projectService.createProject(this.project).subscribe(data => {
        this.router.navigate(['/Projects']);
      }, error => this.errorMessage = <any>error);
    }
  }

}
