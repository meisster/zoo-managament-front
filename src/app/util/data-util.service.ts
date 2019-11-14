import {Injectable} from '@angular/core';

@Injectable()
export class DataUtilService {
  public parseData(data) {
    if (data) {
      const res: { [key: string]: string[] } = {};
      Object.keys(data[0]).forEach(key => {
        res[key] = data.map(el => String(el[key]));
      });
      return res;
    }
  }
}
