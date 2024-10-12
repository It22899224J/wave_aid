export interface Bus {
    totalSeats: number;
    seats: any;
    id: string;
    seatsPerRow: number;
    rows: number;
    busName: string;
    eventID: string | null;
    contactNumber: number;
    pickupLocation: string;
    departureTime: string;
    imageUrl: string;
    pickupLocationName: string
}