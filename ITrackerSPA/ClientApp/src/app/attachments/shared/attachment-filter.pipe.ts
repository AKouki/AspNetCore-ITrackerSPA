import { Pipe, PipeTransform } from '@angular/core';
import { Attachment } from './attachment';

@Pipe({
  name: 'attachmentFilter'
})
export class AttachmentFilterPipe implements PipeTransform {

  transform(value: Attachment[], filterBy: string): Attachment[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy ? value.filter((issue: Attachment) =>
      issue.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
