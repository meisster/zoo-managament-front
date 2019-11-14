export class DatabaseData {
  public static displayColumnNames: { [endpoint: string]: string[] } = {
    animals: ['ID', 'Name', 'Species name', 'Room ID'],
    space: ['ID', 'Localization', 'Locators left', 'Surface']
  };

  public static displayColumnKeys: { [endpoint: string]: string[] } = {
    animals: ['id', 'name', 'species'],
    rooms: ['boought', 'localization', 'price', 'surface']
  };

  public static cardLabels: { [endpoint: string]: string[] } = {
    animals: ['My animals', 'Species to buy'],
    space: ['Rooms', 'Enclosure']
  };

  public static modifyItemKeys: { [endpoint: string]: string[] } = {
    animals: ['name', 'roomId']
  };

  public static modifyItemLabels: { [endpoint: string]: string[] } = {
    animals: ['Name', 'Room ID'],
    rooms: ['Name', 'Surface', 'Price']
  };
  public static animalsColumnKeys: string[] = ['id', 'name', 'species'];
  public static animalsColumnNames: string[] = ['ID', 'Name', 'Species'];
  public static speciesColumnKeys: string[] = ['name', 'prestige', 'price'];
  public static speciesColumnNames: string[] = ['Name', 'Prestige Points', 'Price'];
  public static roomsColumnKeys: string[] = ['id', 'localization', 'locatorsMaxNumber', 'surface'];
  public static roomsColumnNames: string[] = ['ID', 'Localization', 'Space left', 'Surface'];

  public static dialogData(data): { [endpoint: string]: { [method: string]: { [key: string]: string } } } {
    return {
      animals: {
        modify: {
          title: 'Modify animal',
          // tslint:disable-next-line:object-literal-sort-keys
          animal: data,
          endpoint: 'animals',
        },
        sell: {
          title: 'Sell animal',
          id: data.id,
          content: 'Are you sure you want to sell animal ' + data.name + ' for ' + data.price / 2 + '$ ?',
          okClick: 'Yes',
          noClick: 'No'
        },
        buy: {
          title: 'Buy animal',
          animal: data,
          endpoint: 'animals',
        }
      }
    };
  }
}

