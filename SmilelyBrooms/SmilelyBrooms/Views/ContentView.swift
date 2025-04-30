import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
                .tag(0)
            
            ServicesView()
                .tabItem {
                    Label("Services", systemImage: "list.bullet")
                }
                .tag(1)
            
            BookingsView()
                .tabItem {
                    Label("Bookings", systemImage: "calendar")
                }
                .tag(2)
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person")
                }
                .tag(3)
        }
        .frame(minWidth: 800, minHeight: 600)
        .onAppear {
            // Check if user is logged in
            appState.checkLoginStatus()
        }
        .sheet(isPresented: $appState.showLoginSheet) {
            LoginView()
        }
    }
}

struct ProfileView: View {
    @EnvironmentObject private var appState: AppState
    
    var body: some View {
        VStack {
            if appState.isLoggedIn, let profile = appState.userProfile {
                Text("Welcome, \(profile.name)")
                    .font(.title)
                
                // User profile details
                List {
                    Section("Account Information") {
                        LabeledContent("Name", value: profile.name)
                        LabeledContent("Email", value: profile.email)
                        LabeledContent("Member Since", value: profile.memberSince)
                    }
                    
                    Section("Preferences") {
                        Toggle("Receive Notifications", isOn: $appState.notificationsEnabled)
                        Toggle("Dark Mode", isOn: $appState.darkModeEnabled)
                    }
                    
                    Section {
                        Button("Sign Out") {
                            appState.signOut()
                        }
                        .foregroundColor(.red)
                    }
                }
            } else {
                VStack(spacing: 20) {
                    Text("Please sign in to view your profile")
                        .font(.title2)
                    
                    Button("Sign In") {
                        appState.showLoginSheet = true
                    }
                    .buttonStyle(.borderedProminent)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("Profile")
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppState())
    }
}
