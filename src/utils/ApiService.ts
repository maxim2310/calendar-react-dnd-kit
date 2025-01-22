import { PublicHoliday } from "../models/PublicHoliday";

class ApiService {
  private BASE_URL = 'https://date.nager.at/api/v3/';

  public async getPublicHolidays(year: number): Promise<PublicHoliday[]> {
    const response = await fetch(`${this.BASE_URL}PublicHolidays/${year}/us`);

    if (!response.ok) {
      throw new Error(`Failed to fetch public holidays: ${response.statusText}`);
    }
  
    const data: PublicHoliday[] = await response.json();
    return data;
  }
}

export const apiService = new ApiService();
