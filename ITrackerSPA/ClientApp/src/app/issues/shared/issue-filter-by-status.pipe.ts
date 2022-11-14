import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from './issue';

@Pipe({
  name: 'issueFilterByStatus'
})
export class IssueFilterByStatusPipe implements PipeTransform {

  transform(value: Issue[], filter: number): Issue[] {
    filter = filter > -1 ? filter : 0;
    return filter ? value.filter((product: Issue) =>
      product.statusType == filter) : value;
  }

}
