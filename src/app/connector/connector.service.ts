import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {logger} from 'codelyzer/util/logger';

@Injectable()
export class ConnectorService {
  private readonly SERVICE_URL = 'http://localhost:8080/';

  constructor(private http: HttpClient, private ngZone: NgZone) {
  }

  public get(endpoint: string): Observable<object> {
    logger.debug('Calling ', this.SERVICE_URL + endpoint);
    return this.http.get(this.SERVICE_URL + endpoint);
  }

  public retrieveData(endpoint: string, data) {
    switch (endpoint) {
      case 'animals':
        return this.retrieveAnimals(data);
      case 'rooms':
        return this.retrieveRooms(data);
    }
  }

  public retrieveAnimals(data) {
    return data.map(value => {
      return {
        id: value.id,
        name: value.name,
        species: value.species.name,
        // tslint:disable-next-line:object-literal-sort-keys
        roomId: value.room.id,
        description: value.species.description,
        photoUrl: value.species.photoUrl,
        price: value.species.price
      };
    });
  }

  private retrieveRooms(data) {

  }

  sellAnimal(id: string) {
    console.log(this.SERVICE_URL + 'animals/' + id);
    this.ngZone.run(() => this.http.delete(this.SERVICE_URL + 'animals/' + id).subscribe(next => console.log(next)));
  }

  getRoomsBySpecies(species: string): Observable<object> {
    return this.http.get(this.SERVICE_URL + 'rooms/available/' + species);
  }
}
