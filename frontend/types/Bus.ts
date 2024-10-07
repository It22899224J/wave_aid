export interface Bus {
    id: string;
    rows: number;
    busName: string;
    eventID: string | null;
    contactNumber: number;
    pickupLocation: string;
    departureTime: string;
    imageUrl: string;
}