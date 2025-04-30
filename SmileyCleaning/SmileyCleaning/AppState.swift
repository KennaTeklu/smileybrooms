import SwiftUI
import Combine

class AppState: ObservableObject {
    @Published var currentTab: Tab = .home
    @Published var isLoggedIn: Bool = false
    @Published var userProfile: UserProfile? = nil
    @Published var showNewBookingSheet: Bool = false
    @Published var selectedService: String? = nil
    @Published var bookings: [Booking] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        // Check for saved login credentials
        checkSavedCredentials()
        
        // Load any cached bookings
        loadCachedBookings()
    }
    
    func checkSavedCredentials() {
        // In a real app, you would check for saved credentials in the keychain
        // For now, we'll just simulate this
    }
    
    func loadCachedBookings() {
        // In a real app, you would load cached bookings from UserDefaults or a database
        // For now, we'll just simulate this with sample data
        self.bookings = [
            Booking(id: "1", serviceType: "Regular Cleaning", date: Date(), status: .confirmed),
            Booking(id: "2", serviceType: "Deep Cleaning", date: Date().addingTimeInterval(86400 * 7), status: .pending)
        ]
    }
    
    func login(email: String, password: String) {
        isLoading = true
        
        // Simulate network request
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.isLoading = false
            
            // Simple validation for demo purposes
            if email.contains("@") && password.count >= 6 {
                self.isLoggedIn = true
                self.userProfile = UserProfile(name: "John Doe", email: email, phone: "555-123-4567")
            } else {
                self.errorMessage = "Invalid email or password"
            }
        }
    }
    
    func logout() {
        isLoggedIn = false
        userProfile = nil
    }
    
    func createBooking(serviceType: String, date: Date, notes: String) {
        isLoading = true
        
        // Simulate network request
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.isLoading = false
            
            let newBooking = Booking(
                id: UUID().uuidString,
                serviceType: serviceType,
                date: date,
                notes: notes,
                status: .pending
            )
            
            self.bookings.append(newBooking)
            self.showNewBookingSheet = false
            
            // Show notification
            self.showNotification(title: "Booking Created", body: "Your \(serviceType) has been scheduled for \(self.formatDate(date))")
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    func showNotification(title: String, body: String) {
        let notification = NSUserNotification()
        notification.title = title
        notification.informativeText = body
        notification.soundName = NSUserNotificationDefaultSoundName
        
        NSUserNotificationCenter.default.deliver(notification)
    }
}

enum Tab: String, CaseIterable {
    case home = "Home"
    case services = "Services"
    case booking = "Booking"
    case profile = "Profile"
}

struct UserProfile {
    var name: String
    var email: String
    var phone: String
    var address: String = ""
}

struct Booking: Identifiable {
    var id: String
    var serviceType: String
    var date: Date
    var notes: String = ""
    var status: BookingStatus
}

enum BookingStatus: String {
    case pending = "Pending"
    case confirmed = "Confirmed"
    case completed = "Completed"
    case cancelled = "Cancelled"
}
