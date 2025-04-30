import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @State private var sidebarWidth: CGFloat = 250
    @Environment(\.colorScheme) private var colorScheme
    
    var body: some View {
        NavigationView {
            sidebar
            
            // Main content area
            mainContentView
        }
        .sheet(isPresented: $appState.showNewBookingSheet) {
            BookingFormView()
                .environmentObject(appState)
                .frame(width: 500, height: 600)
        }
        .alert(item: Binding<AlertItem?>(
            get: { appState.errorMessage != nil ? AlertItem(message: appState.errorMessage!) : nil },
            set: { _ in appState.errorMessage = nil }
        )) { alertItem in
            Alert(title: Text("Error"), message: Text(alertItem.message), dismissButton: .default(Text("OK")))
        }
    }
    
    var sidebar: some View {
        List {
            ForEach(Tab.allCases, id: \.self) { tab in
                NavigationLink(
                    destination: destinationView(for: tab),
                    tag: tab,
                    selection: $appState.currentTab
                ) {
                    Label(tab.rawValue, systemImage: iconName(for: tab))
                        .padding(.vertical, 4)
                }
            }
            
            Divider()
                .padding(.vertical, 8)
            
            if appState.isLoggedIn {
                Button(action: { appState.logout() }) {
                    Label("Logout", systemImage: "rectangle.portrait.and.arrow.right")
                        .foregroundColor(.red)
                }
                .buttonStyle(PlainButtonStyle())
                .padding(.vertical, 4)
            }
        }
        .listStyle(SidebarListStyle())
        .frame(minWidth: 200, idealWidth: sidebarWidth)
    }
    
    @ViewBuilder
    var mainContentView: some View {
        destinationView(for: appState.currentTab)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    @ViewBuilder
    func destinationView(for tab: Tab) -> some View {
        switch tab {
        case .home:
            HomeView()
                .environmentObject(appState)
        case .services:
            ServicesView(selectedService: appState.selectedService)
                .environmentObject(appState)
        case .booking:
            BookingsView()
                .environmentObject(appState)
        case .profile:
            if appState.isLoggedIn {
                ProfileView()
                    .environmentObject(appState)
            } else {
                LoginView()
                    .environmentObject(appState)
            }
        }
    }
    
    func iconName(for tab: Tab) -> String {
        switch tab {
        case .home: return "house"
        case .services: return "list.bullet"
        case .booking: return "calendar"
        case .profile: return "person"
        }
    }
}

struct AlertItem: Identifiable {
    var id = UUID()
    var message: String
}
