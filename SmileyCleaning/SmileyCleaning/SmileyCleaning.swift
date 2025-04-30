import SwiftUI

@main
struct SmileyCleaning: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .frame(minWidth: 800, minHeight: 600)
        }
        .commands {
            SidebarCommands()
            
            CommandGroup(replacing: .newItem) {
                Button("New Booking") {
                    appState.currentTab = .booking
                    appState.showNewBookingSheet = true
                }
                .keyboardShortcut("n", modifiers: .command)
            }
            
            CommandMenu("Services") {
                Button("Regular Cleaning") {
                    appState.currentTab = .services
                    appState.selectedService = "regular-cleaning"
                }
                
                Button("Deep Cleaning") {
                    appState.currentTab = .services
                    appState.selectedService = "deep-cleaning"
                }
                
                Button("Move In/Out Cleaning") {
                    appState.currentTab = .services
                    appState.selectedService = "move-in-out"
                }
                
                Button("Office Cleaning") {
                    appState.currentTab = .services
                    appState.selectedService = "office-cleaning"
                }
            }
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Set up any app initialization here
    }
    
    func applicationWillTerminate(_ notification: Notification) {
        // Clean up before app termination
    }
}
