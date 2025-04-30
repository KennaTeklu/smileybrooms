import Foundation
import Combine

enum ServiceType: String, CaseIterable {
    case regularCleaning
    case deepCleaning
    case moveInOut
    case officeCleaning
    case carpetCleaning
    
    var id: String {
        return self.rawValue
    }
    
    var displayName: String {
        switch self {
        case .regularCleaning: return "Regular Cleaning"
        case .deepCleaning: return "Deep Cleaning"
        case .moveInOut: return "Move In/Out Cleaning"
        case .officeCleaning: return "Office Cleaning"
        case .carpetCleaning: return "Carpet Cleaning"
        }
    }
    
    var description: String {
        switch self {
        case .regularCleaning:
            return "Standard cleaning service for maintaining a tidy home on a regular basis."
        case .deepCleaning:
            return "Thorough cleaning that reaches deep into the corners and crevices of your home."
        case .moveInOut:
            return "Comprehensive cleaning service for when you're moving in or out of a property."
        case .officeCleaning:
            return "Professional cleaning services tailored for office spaces and commercial environments."
        case .carpetCleaning:
            return "Specialized cleaning for carpets to remove stains, dirt, and allergens."
        }
    }
    
    var basePrice: Decimal {
        switch self {
        case .regularCleaning: return 120
        case .deepCleaning: return 200
        case .moveInOut: return 250
        case .officeCleaning: return 180
        case .carpetCleaning: return 150
        }
    }
    
    var icon: String {
        switch self {
        case .regularCleaning: return "sparkles"
        case .deepCleaning: return "sparkles.rectangle.stack"
        case .moveInOut: return "building.2"
        case .officeCleaning: return "building"
        case .carpetCleaning: return "square.grid.3x3.square"
        }
    }
}

enum BookingStatus: String, Codable {
    case pending
    case confirmed
    case inProgress
    case completed
    case cancelled
    
    var displayName: String {
        switch self {
        case .pending: return "Pending"
        case .confirmed: return "Confirmed"
        case .inProgress: return "In Progress"
        case .completed: return "Completed"
        case .cancelled: return "Cancelled"
        }
    }
    
    var color: String {
        switch self {
        case .pending: return "yellow"
        case .confirmed: return "blue"
        case .inProgress: return "purple"
        case .completed: return "green"
        case .cancelled: return "red"
        }
    }
}

struct Booking: Identifiable, Codable {
    var id: String
    var serviceType: String
    var date: Date
    var duration: Int // in minutes
    var address: Address
    var status: BookingStatus
    var notes: String?
    var price: Decimal
    var createdAt: Date
    var updatedAt: Date
}

class BookingManager: ObservableObject {
    @Published var upcomingBookings: [Booking] = []
    @Published var pastBookings: [Booking] = []
    @Published var isLoading: Bool = false
    @Published var error: Error?
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        loadBookings()
    }
    
    func loadBookings() {
        isLoading = true
        
        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.upcomingBookings = self.generateMockUpcomingBookings()
            self.pastBookings = self.generateMockPastBookings()
            self.isLoading = false
        }
    }
    
    func createBooking(serviceType: ServiceType, date: Date, duration: Int, address: Address, notes: String?) -> AnyPublisher<Booking, Error> {
        // In a real app, this would call an API
        return Future<Booking, Error> { promise in
            // Simulate network delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                let newBooking = Booking(
                    id: UUID().uuidString,
                    serviceType: serviceType.rawValue,
                    date: date,
                    duration: duration,
                    address: address,
                    status: .pending,
                    notes: notes,
                    price: serviceType.basePrice * Decimal(duration / 60),
                    createdAt: Date(),
                    updatedAt: Date()
                )
                
                self.upcomingBookings.append(newBooking)
                promise(.success(newBooking))
            }
        }.eraseToAnyPublisher()
    }
    
    func cancelBooking(id: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { promise in
            if let index = self.upcomingBookings.firstIndex(where: { $0.id == id }) {
                var booking = self.upcomingBookings[index]
                booking.status = .cancelled
                booking.updatedAt = Date()
                self.upcomingBookings[index] = booking
                
                // In a real app, this would call an API
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    promise(.success(true))
                }
            } else {
                promise(.failure(BookingError.bookingNotFound))
            }
        }.eraseToAnyPublisher()
    }
    
    func rescheduleBooking(id: String, newDate: Date) -> AnyPublisher<Booking, Error> {
        return Future<Booking, Error> { promise in
            if let index = self.upcomingBookings.firstIndex(where: { $0.id == id }) {
                var booking = self.upcomingBookings[index]
                booking.date = newDate
                booking.updatedAt = Date()
                self.upcomingBookings[index] = booking
                
                // In a real app, this would call an API
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    promise(.success(booking))
                }
            } else {
                promise(.failure(BookingError.bookingNotFound))
            }
        }.eraseToAnyPublisher()
    }
    
    func calculatePrice(serviceType: ServiceType, squareFootage: Int, extras: [String]) -> Decimal {
        var price = serviceType.basePrice
        
        // Adjust for square footage
        let sizeFactor = Decimal(squareFootage) / 1000
        price += serviceType.basePrice * sizeFactor * Decimal(0.5)
        
        // Add extras
        for extra in extras {
            switch extra {
            case "windows":
                price += 30
            case "fridge":
                price += 25
            case "oven":
                price += 35
            case "laundry":
                price += 20
            default:
                break
            }
        }
        
        return price
    }
    
    // Mock data generators
    private func generateMockUpcomingBookings() -> [Booking] {
        let address1 = Address(
            id: "addr1",
            name: "Home",
            street: "123 Main St",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            isDefault: true
        )
        
        let address2 = Address(
            id: "addr2",
            name: "Office",
            street: "456 Market St",
            city: "San Francisco",
            state: "CA",
            zipCode: "94103",
            isDefault: false
        )
        
        return [
            Booking(
                id: "booking1",
                serviceType: ServiceType.regularCleaning.rawValue,
                date: Calendar.current.date(byAdding: .day, value: 3, to: Date())!,
                duration: 120,
                address: address1,
                status: .confirmed,
                notes: "Please focus on the kitchen",
                price: 120,
                createdAt: Date(),
                updatedAt: Date()
            ),
            Booking(
                id: "booking2",
                serviceType: ServiceType.deepCleaning.rawValue,
                date: Calendar.current.date(byAdding: .day, value: 10, to: Date())!,
                duration: 240,
                address: address1,
                status: .pending,
                notes: nil,
                price: 200,
                createdAt: Date(),
                updatedAt: Date()
            ),
            Booking(
                id: "booking3",
                serviceType: ServiceType.officeCleaning.rawValue,
                date: Calendar.current.date(byAdding: .day, value: 5, to: Date())!,
                duration: 180,
                address: address2,
                status: .confirmed,
                notes: "After business hours only",
                price: 180,
                createdAt: Date(),
                updatedAt: Date()
            )
        ]
    }
    
    private func generateMockPastBookings() -> [Booking] {
        let address1 = Address(
            id: "addr1",
            name: "Home",
            street: "123 Main St",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            isDefault: true
        )
        
        return [
            Booking(
                id: "booking4",
                serviceType: ServiceType.regularCleaning.rawValue,
                date: Calendar.current.date(byAdding: .day, value: -7, to: Date())!,
                duration: 120,
                address: address1,
                status: .completed,
                notes: nil,
                price: 120,
                createdAt: Date(),
                updatedAt: Date()
            ),
            Booking(
                id: "booking5",
                serviceType: ServiceType.carpetCleaning.rawValue,
                date: Calendar.current.date(byAdding: .day, value: -14, to: Date())!,
                duration: 90,
                address: address1,
                status: .completed,
                notes: "Living room and hallway only",
                price: 150,
                createdAt: Date(),
                updatedAt: Date()
            ),
            Booking(
                id: "booking6",
                serviceType: ServiceType.regularCleaning.rawValue,
                date: Calendar.current.date(byAdding: .day, value: -21, to: Date())!,
                duration: 120,
                address: address1,
                status: .cancelled,
                notes: nil,
                price: 120,
                createdAt: Date(),
                updatedAt: Date()
            )
        ]
    }
}

enum BookingError: Error {
    case bookingNotFound
    case networkError
    case invalidData
}
