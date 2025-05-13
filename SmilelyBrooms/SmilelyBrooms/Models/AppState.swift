import SwiftUI

class AppState: ObservableObject {
    @Published var currentTab: Tab = .home
    
    enum Tab {
        case home, services, booking, profile
    }
    
    // Basic app state properties
    @Published var isDarkMode = false
    @Published var selectedService: String?
    @Published var showNewBookingSheet = false
    
    @Published var isLoggedIn: Bool = false
    @Published var showLoginSheet: Bool = false
    @Published var userProfile: UserProfile?
    @Published var notificationsEnabled: Bool = true
    @Published var darkModeEnabled: Bool = false
    
    struct UserProfile {
        let id: String
        let name: String
        let email: String
        let memberSince: String
    }
    
    func checkLoginStatus() {
        // In a real app, this would check for stored credentials
        // For demo purposes, we'll just set a mock user
        if let savedUser = UserDefaults.standard.string(forKey: "userId") {
            // Mock user data
            self.userProfile = UserProfile(
                id: savedUser,
                name: "John Doe",
                email: "john.doe@example.com",
                memberSince: "January 2023"
            )
            self.isLoggedIn = true
        } else {
            self.isLoggedIn = false
            self.userProfile = nil
        }
    }
    
    func signIn(email: String, password: String, completion: @escaping (Bool) -> Void) {
        // Mock sign in process
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            // For demo, accept any non-empty credentials
            if !email.isEmpty && !password.isEmpty {
                // Save user ID
                UserDefaults.standard.set("user123", forKey: "userId")
                
                // Set user profile
                self.userProfile = UserProfile(
                    id: "user123",
                    name: "John Doe",
                    email: email,
                    memberSince: "January 2023"
                )
                
                self.isLoggedIn = true
                self.showLoginSheet = false
                completion(true)
            } else {
                completion(false)
            }
        }
    }
    
    func signOut() {
        // Clear stored credentials
        UserDefaults.standard.removeObject(forKey: "userId")
        
        // Update state
        self.isLoggedIn = false
        self.userProfile = nil
    }
}
