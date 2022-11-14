import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl + 'api/Projects');
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(this.baseUrl + 'api/Projects/' + id);
  }

  createProject(project: Project): Observable<any> {
    return this.http.post(this.baseUrl + 'api/Projects', project);
  }

  updateProject(project: Project): Observable<any> {
    return this.http.put(this.baseUrl + 'api/Projects/' + project.projectId, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/Projects/' + id);
  }
}
