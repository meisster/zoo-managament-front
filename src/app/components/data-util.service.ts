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

  public parseSingleData(data) {
    if (!!data) {
      const res: { [key: string]: string } = {};
      Object.keys(data).forEach(key => {
        res[key] = String(data[key]);
      });
      return res;
    }
  }
}
