import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolbarStateService {

  currentlyActive = 0;

  constructor() {
  }

  changeCurrentlyActive(curr: number) {
    this.currentlyActive = curr;
  }
}
