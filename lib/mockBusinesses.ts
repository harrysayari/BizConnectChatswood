/** Google Places–aligned fields for council dashboard listings */
export type BusinessPlaceRow = {
  id: string;
  displayName: string;
  nationalPhoneNumber: string;
  formattedAddress: string;
  websiteUri: string;
};

export const mockBusinesses: BusinessPlaceRow[] = [
  {
    id: "1",
    displayName: "Chatswood Chase Pharmacy",
    nationalPhoneNumber: "+61 2 9419 8200",
    formattedAddress: "345 Victoria Ave, Chatswood NSW 2067, Australia",
    websiteUri: "https://example-pharmacy.example.com",
  },
  {
    id: "2",
    displayName: "The Rice Den",
    nationalPhoneNumber: "+61 2 9411 8850",
    formattedAddress: "Level 3/1-5 Railway St, Chatswood NSW 2067, Australia",
    websiteUri: "https://example-dining.example.com",
  },
  {
    id: "3",
    displayName: "Westfield Chatswood Florist",
    nationalPhoneNumber: "+61 2 9884 1200",
    formattedAddress: "1 Anderson St, Chatswood NSW 2067, Australia",
    websiteUri: "https://example-florist.example.com",
  },
  {
    id: "4",
    displayName: "Mandarin Centre Nail Studio",
    nationalPhoneNumber: "+61 2 9412 3344",
    formattedAddress: "61-65 Archer St, Chatswood NSW 2067, Australia",
    websiteUri: "",
  },
  {
    id: "5",
    displayName: "Victoria Ave Coffee Roasters",
    nationalPhoneNumber: "+61 2 9438 0091",
    formattedAddress: "428 Victoria Ave, Chatswood NSW 2067, Australia",
    websiteUri: "https://example-coffee.example.com",
  },
];
