import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../shared/project';
import { ProjectService } from '../shared/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  errorMessage: string = "";
  searchText = "";

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjects()
      .subscribe(result => this.projects = result, error => this.errorMessage = error);
  }

  updateProject(project: Project): void {
    // TODO
  }

  deleteProject(project: Project): void {
    if (confirm("Are you sure you want to delete this project?")) {
      this.projectService.deleteProject(project.projectId).subscribe(data => {
        var index = this.projects.indexOf(project);
        if (index > -1)
          this.projects.splice(index, 1);
      }, error => this.errorMessage = <any>error);
    }
  }

}
