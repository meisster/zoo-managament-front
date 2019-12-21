import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class ConnectorService {

  private readonly SERVICE_URL = 'http://localhost:8080/';

  constructor(private http: HttpClient, private ngZone: NgZone) {
  }

  public get(endpoint: string): Observable<object> {
    console.info('Calling GET', this.SERVICE_URL + endpoint);
    return this.http.get(this.SERVICE_URL + endpoint);
  }

  public post(endpoint: string, body: {}): Observable<object> {
    console.info('Calling POST', this.SERVICE_URL + endpoint);
    return this.http.post(this.SERVICE_URL + endpoint, body);
  }

  public patch(endpoint: any, body: {}): Observable<object> {
    console.info('Calling PATCH', this.SERVICE_URL + endpoint);
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
      case 'enclosures':
        return this.retrieveEnclosures(data);
    }
  }

  public retrieveAnimals(data) {
    return data.map(animal => {
      return {
        id: animal.id,
        name: animal.name,
        species: animal.species.name,
        // tslint:disable-next-line:object-literal-sort-keys
        roomId: animal.room.id,
        description: animal.species.description,
        photoUrl: animal.species.photoUrl,
        price: animal.species.price
      };
    });
  }

  private retrieveRooms(data) {
    return data.map(room => {
      return {
        id: room.id,
        localization: room.localization,
        locatorsMaxNumber: room.locatorsMaxNumber,
        surface: room.surface,
        price: room.price,
        bought: room.bought,
        species: room.species,
        caretakerId: room.caretakerId,
        enclosureId: room.enclosureId
      };
    });
  }

  private retrieveSpecies(data) {
    return data.map(species => {
      return {
        name: species.name,
        prestige: species.prestigePoints,
        description: species.description,
        photoUrl: species.photoUrl,
        naturalHabitat: species.naturalHabitat,
        food: species.food,
        price: species.price
      };
    });
  }

  private retrieveEnclosures(data: any) {
    return data.map(enclosure => {
      return {
        id: enclosure.id,
        bought: enclosure.bought,
        localization: enclosure.localization,
        price: enclosure.price + '$',
        surface: enclosure.surface,
        habitat: enclosure.habitat.name,
      };
    });
  }

  sellAnimal(id: string) {
    return this.http.delete(this.SERVICE_URL + 'animals/' + id);
  }

  deleteRooms(id: string) {
    return this.http.patch(this.SERVICE_URL + 'rooms/' + id + '/destroy', {});
  }

  getRoomsBySpecies(species: string): Observable<object> {
    return this.http.get(this.SERVICE_URL + 'rooms/available/' + species);
  }

  updateCaretaker(roomId: number, caretakerId: number): Observable<object> {
    return this.http.patch(this.SERVICE_URL + 'rooms/' + roomId + '/caretaker', {caretakerId});
  }

  updateEnclosure(roomId: number, enclosureId: number): Observable<object> {
    return this.http.patch(this.SERVICE_URL + 'rooms/' + enclosureId + '/enclosure', {enclosureId});
  }

}
