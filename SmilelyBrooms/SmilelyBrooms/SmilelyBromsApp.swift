import SwiftUI
import UserNotifications
import WidgetKit

@main
struct SmilelyBromsApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var appState = AppState()
    @StateObject private var bookingManager = BookingManager()
    @StateObject private var notificationManager = NotificationManager()
    @StateObject private var syncManager = SyncManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .frame(minWidth: 800, minHeight: 600)
        }
        .windowStyle(.hiddenTitleBar)
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("New Booking") {
                    // Handle new booking action
                }
                .keyboardShortcut("n", modifiers: .command)
            }
            
            CommandMenu("Bookings") {
                Button("View All Bookings") {
                    // Handle view bookings action
                }
                
                Button("Schedule Cleaning") {
                    // Handle schedule action
                }
                
                Divider()
                
                Button("Contact Support") {
                    // Handle support action
                }
            }
        }
        Settings {
            SettingsView()
                .environmentObject(appState)
                .environmentObject(notificationManager)
                .environmentObject(syncManager)
        }
        
        MenuBarExtra("Smiley Brooms", systemImage: "sparkles.rectangle.stack") {
            MenuBarView()
                .environmentObject(appState)
                .environmentObject(bookingManager)
        }
        .menuBarExtraStyle(.window)
    }
}

class AppDelegate: NSObject, NSApplicationDelegate, UNUserNotificationCenterDelegate {
    var statusItem: NSStatusItem?
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Set up notification delegate
        UNUserNotificationCenter.current().delegate = self
        
        // Register for remote notifications
        NSApplication.shared.registerForRemoteNotifications()
        
        // Set up menu bar item if not using MenuBarExtra
        // setupMenuBarItem()
        
        // Set up keyboard shortcuts
        setupGlobalKeyboardShortcuts()
        
        // Check for updates
        checkForUpdates()
    }
    
    func applicationWillTerminate(_ notification: Notification) {
        // Perform cleanup before app termination
        saveAppState()
    }
    
    func application(_ application: NSApplication, didReceiveRemoteNotification userInfo: [String: Any]) {
        // Handle push notifications
        handlePushNotification(userInfo)
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // Handle notification response
        handleNotificationResponse(response)
        completionHandler()
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        // Show notification even when app is in foreground
        completionHandler([.banner, .sound, .badge])
    }
    
    private func setupGlobalKeyboardShortcuts() {
        // Set up global keyboard shortcuts for quick actions
    }
    
    private func checkForUpdates() {
        // Check for app updates
    }
    
    private func saveAppState() {
        // Save app state before termination
    }
    
    private func handlePushNotification(_ userInfo: [String: Any]) {
        // Process push notification data
    }
    
    private func handleNotificationResponse(_ response: UNNotificationResponse) {
        // Handle user's interaction with notification
    }
}
