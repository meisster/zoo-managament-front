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

  public post(endpoint: string, body: {}): Observable<object> {
    logger.debug('Calling ', this.SERVICE_URL + endpoint);
    return this.http.post(this.SERVICE_URL + endpoint, body);
  }
  public patch(endpoint: any, body: {}): Observable<object> {
    logger.debug('Calling ', this.SERVICE_URL + endpoint);
    return this.http.patch(this.SERVICE_URL + endpoint, body);
  }

  public retrieveData(endpoint: string, data) {
    switch (endpoint) {
      case 'animals':
        return this.retrieveAnimals(data);
      case 'rooms':
        return this.retrieveRooms(data);
      case 'species':
        return this.retrieveSpecies(data);
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
    return data.map(value => {
      return {
        id: value.id,
        localization: value.localization,
        locatorsMaxNumber: value.locatorsMaxNumber,
        surface: value.surface,
        price: value.price,
        bought: value.bought,
        species: value.species,
        caretakerId: value.caretakerId,
        enclosureId: value.enclosureId
      };
    });
  }

  private retrieveSpecies(data) {
    return data.map(value => {
      return {
        name: value.name,
        prestige: value.prestigePoints,
        description: value.description,
        photoUrl: value.photoUrl,
        naturalHabitat: value.naturalHabitat,
        food: value.food,
        price: value.price
      };
    });
  }

  sellAnimal(id: string) {
    return this.http.delete(this.SERVICE_URL + 'animals/' + id);
  }

  getRoomsBySpecies(species: string): Observable<object> {
    return this.http.get(this.SERVICE_URL + 'rooms/available/' + species);
  }
}
