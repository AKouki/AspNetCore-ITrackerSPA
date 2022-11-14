import { Pipe, PipeTransform } from '@angular/core';
import { Project } from './project';

@Pipe({
  name: 'projectFilter'
})
export class ProjectFilterPipe implements PipeTransform {

  transform(value: Project[], filterBy: string): Project[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy ? value.filter((issue: Project) =>
      issue.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
