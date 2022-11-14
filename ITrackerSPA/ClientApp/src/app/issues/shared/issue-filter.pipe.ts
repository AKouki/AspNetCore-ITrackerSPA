import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from './issue';

@Pipe({
  name: 'issueFilter'
})
export class IssueFilterPipe implements PipeTransform {

  transform(value: Issue[], filterBy: string): Issue[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy ? value.filter((issue: Issue) =>
      issue.title.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
