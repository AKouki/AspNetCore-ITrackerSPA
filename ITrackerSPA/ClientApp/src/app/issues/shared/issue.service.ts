import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from './issue';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.baseUrl + 'api/Issues');
  }

  getIssue(id: number): Observable<Issue> {
    return this.http.get<Issue>(this.baseUrl + 'api/Issues/' + id);
  }

  getIssuesByProject(projectId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.baseUrl + 'api/Projects/' + projectId + '/Issues');
  }

  createIssue(issue: Issue): Observable<any> {
    return this.http.post(this.baseUrl + 'api/Issues', issue);
  }

  updateIssue(issue: Issue): Observable<any> {
    return this.http.put(this.baseUrl + 'api/Issues/' + issue.issueId, issue);
  }

  deleteIssue(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/Issues/' + id);
  }

  uploadFile(issueId: any, file: any): Observable<any> {
    let input = new FormData();
    input.append("file", file);

    return this.http.put(this.baseUrl + 'api/Attachments/Upload/' + issueId, input);
  }
}
