import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attachment } from './attachment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getAttachments(): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(this.baseUrl + 'api/Attachments');
  }

  getAttachmentsByIssue(issueId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(this.baseUrl + 'api/Issues/' + issueId + '/Attachments');
  }

  deleteAttachment(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/Attachments/' + id);
  }
}
