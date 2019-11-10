export class DatabaseData {
  public static displayColumnNames: { [endpoint: string]: string[] } = {
    animals: ['ID', 'Name', 'Species name', 'Room ID'],
    rooms: ['Name', 'Surface', 'Price']
  };

  public static displayColumnKeys: { [endpoint: string]: string[] } = {
    animals: ['id', 'name', 'species']
  };

  public static cardLabels: { [endpoint: string]: string[] } = {
    animals: ['My animals', 'Species to buy']
  };

  public static modifyItemKeys: { [endpoint: string]: string[] } = {
    animals: ['name', 'roomId']
  };

  public static modifyItemLabels: { [endpoint: string]: string[] } = {
    animals: ['Name', 'Room ID'],
    rooms: ['Name', 'Surface', 'Price']
  };

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
          content: 'Are you sure you want to sell animal ' + data.name + ' for ' + data.price / 2 + '$ ?',
          okClick: 'Yes',
          noClick: 'No'
        }
      }
    };
  }
}

