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

  public patch(endpoint: string, body: {}): Observable<object> {
    console.info('Calling PATCH', this.SERVICE_URL + endpoint);
    return this.http.patch(this.SERVICE_URL + endpoint, body);
  }

  public delete(endpoint: string): Observable<object> {
    console.info('Calling DELETE', this.SERVICE_URL + endpoint);
    return this.http.delete(this.SERVICE_URL + endpoint);
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
      case 'caretakers':
        return this.retrieveCaretakers(data);
      case 'entertainers':
        return this.retrieveEntertainers(data);
    }
  }

  public retrieveAnimals(data) {
    return data.map(animal => {
      return {
        id: animal.id,
        name: animal.name,
        species: animal.species.name,
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

  private retrieveCaretakers(data: any) {
    return data.map(caretaker => {
      return {
        id: caretaker.id,
        firstName: caretaker.firstName,
        lastName: caretaker.name,
        roomMaxNumber: caretaker.roomMaxNumber,
        contract: caretaker.contract,
        contractId: caretaker.contract.id
      };
    });
  }

  private retrieveEntertainers(data: any) {
    return data.map(entertainer => {
      return {
        id: entertainer.id,
        firstName: entertainer.firstName,
        lastName: entertainer.name,
        contract: entertainer.contract,
        contractId: entertainer.contract.id
      };
    });
  }

  sellAnimal(id: string) {
    const url = 'animals/' + id;
    return this.delete(url);
  }

  deleteRooms(id: string) {
    const url = 'rooms/' + id + '/destroy';
    return this.patch(url, {});
  }

  getRoomsBySpecies(species: string): Observable<object> {
    const url = 'rooms/available/' + species;
    return this.get(url);
  }

  updateCaretaker(roomId: number, caretakerId: number): Observable<object> {
    const url = 'rooms/' + roomId + '/caretaker';
    return this.patch(url, caretakerId);
  }

  updateEnclosure(roomId: number, enclosureId: number): Observable<object> {
    const url = 'rooms/' + enclosureId + '/enclosure';
    return this.patch(url, enclosureId);

  }

  createCaretaker(caretakerData: { [key: string]: string }) {
    const url = 'caretakers';
    return this.post(url, caretakerData);
  }

  fireCaretaker(id: number) {
    const url = 'caretakers/' + id;
    return this.delete(url);
  }

  createEntertainer(entertainerData: { [key: string]: string }) {
    const url = 'entertainers';
    return this.post(url, entertainerData);
  }

  fireEntertainer(id: number) {
    const url = 'entertainers/' + id;
    return this.delete(url);
  }

  nextRound(): Observable<any> {
    return this.post('next', {});
  }

  refresh(): Observable<any> {
    return this.get('budgets');
  }

  startNewGame(): Observable<any> {
    return this.get('newGame');
  }
}
