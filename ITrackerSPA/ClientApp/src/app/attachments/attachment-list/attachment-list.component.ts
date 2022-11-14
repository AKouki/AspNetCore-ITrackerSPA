import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Attachment } from '../shared/attachment';
import { AttachmentService } from '../shared/attachment.service';

@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.css']
})
export class AttachmentListComponent implements OnInit {
  attachments: Attachment[] = [];
  errorMessage: string = "";
  searchText = "";

  constructor(
    private attachmentService: AttachmentService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
    if (!id) {
      this.attachmentService.getAttachments()
        .subscribe(attachments => this.attachments = attachments, error => this.errorMessage = error);
    }
    else {
      this.attachmentService.getAttachmentsByIssue(id)
        .subscribe(attachments => this.attachments = attachments, error => this.errorMessage = error);
    }
  }

  deleteAttachment(attachment: Attachment) {
    if (confirm("Are you sure you want to delete this attachment?")) {
      this.attachmentService.deleteAttachment(attachment.attachmentId).subscribe(() => {
        var index = this.attachments.indexOf(attachment);
        if (index > -1)
          this.attachments.splice(index, 1);
      },
        error => {
          this.errorMessage = error;
        }
      );
    }
  }

  fileTypeToText(val: number) {
    switch (val) {
      case 0:
        return 'Image';
      case 1:
        return 'Document';
      default:
        return 'Unknown';
    }
  }

}
