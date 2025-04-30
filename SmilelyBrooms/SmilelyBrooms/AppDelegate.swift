import AppKit
import UserNotifications
import SwiftUI

class AppDelegate: NSObject, NSApplicationDelegate, UNUserNotificationCenterDelegate {
    var statusItem: NSStatusItem?
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Set up notification delegate
        UNUserNotificationCenter.current().delegate = self
        
        // Register for remote notifications
        NSApplication.shared.registerForRemoteNotifications()
        
        // Set up keyboard shortcuts
        setupGlobalKeyboardShortcuts()
        
        // Check for updates
        checkForUpdates()
        
        // Initialize services
        initializeServices()
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
        DispatchQueue.global().async {
            // Simulate update check
            let currentVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
            
            // In a real app, this would check with a server
            let updateURL = URL(string: "https://smileybrooms.com/api/app-version")!
            
            do {
                let data = try Data(contentsOf: updateURL)
                // Process update data
            } catch {
                print("Update check failed: \(error)")
            }
        }
    }
    
    private func saveAppState() {
        // Save important app state before termination
        UserDefaults.standard.synchronize()
        
        // Notify any observers that the app is terminating
        NotificationCenter.default.post(name: .appWillTerminate, object: nil)
    }
    
    private func handlePushNotification(_ userInfo: [String: Any]) {
        // Process push notification data
        guard let notificationType = userInfo["type"] as? String else {
            return
        }
        
        switch notificationType {
        case "booking_confirmation":
            if let bookingId = userInfo["booking_id"] as? String {
                // Handle booking confirmation
                NotificationCenter.default.post(
                    name: .bookingConfirmed,
                    object: nil,
                    userInfo: ["bookingId": bookingId]
                )
            }
            
        case "booking_reminder":
            if let bookingId = userInfo["booking_id"] as? String,
               let timeString = userInfo["time"] as? String {
                // Handle booking reminder
                NotificationCenter.default.post(
                    name: .bookingReminder,
                    object: nil,
                    userInfo: [
                        "bookingId": bookingId,
                        "time": timeString
                    ]
                )
            }
            
        case "app_update":
            // Handle app update notification
            if let versionString = userInfo["version"] as? String {
                NotificationCenter.default.post(
                    name: .appUpdateAvailable,
                    object: nil,
                    userInfo: ["version": versionString]
                )
            }
            
        default:
            break
        }
    }
    
    private func handleNotificationResponse(_ response: UNNotificationResponse) {
        // Handle user's interaction with notification
        let userInfo = response.notification.request.content.userInfo
        
        guard let notificationType = userInfo["type"] as? String else {
            return
        }
        
        switch notificationType {
        case "booking_confirmation", "booking_reminder":
            if let bookingId = userInfo["booking_id"] as? String {
                // Open booking details
                NotificationCenter.default.post(
                    name: .openBookingDetails,
                    object: nil,
                    userInfo: ["bookingId": bookingId]
                )
            }
            
        case "app_update":
            // Open update screen
            NotificationCenter.default.post(name: .openAppUpdate, object: nil)
            
        default:
            break
        }
    }
    
    private func initializeServices() {
        // Initialize all required services at app launch
        
        // Set up logging
        setupLogging()
        
        // Initialize analytics
        initializeAnalytics()
        
        // Check connectivity
        checkInitialConnectivity()
    }
    
    private func setupLogging() {
        // Configure app logging
        #if DEBUG
        // More verbose logging in debug mode
        print("Debug logging enabled")
        #else
        // Production logging
        #endif
    }
    
    private func initializeAnalytics() {
        // Set up analytics
        #if !DEBUG
        // Only track analytics in production builds
        AnalyticsService.shared.initialize()
        AnalyticsService.shared.trackEvent("app_launched")
        #endif
    }
    
    private func checkInitialConnectivity() {
        // Check if we have internet connection
        let networkMonitor = NetworkMonitor()
        networkMonitor.startMonitoring()
        
        // We'll stop this monitor after initial check
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            let isConnected = networkMonitor.isConnected
            NotificationCenter.default.post(
                name: .initialConnectivityChecked,
                object: nil,
                userInfo: ["isConnected": isConnected]
            )
            networkMonitor.stopMonitoring()
        }
    }
}

// MARK: - Additional Notification Names
extension Notification.Name {
    static let appWillTerminate = Notification.Name("appWillTerminate")
    static let bookingConfirmed = Notification.Name("bookingConfirmed")
    static let bookingReminder = Notification.Name("bookingReminder")
    static let appUpdateAvailable = Notification.Name("appUpdateAvailable")
    static let openBookingDetails = Notification.Name("openBookingDetails")
    static let openAppUpdate = Notification.Name("openAppUpdate")
    static let initialConnectivityChecked = Notification.Name("initialConnectivityChecked")
}

// MARK: - Analytics Service
class AnalyticsService {
    static let shared = AnalyticsService()
    
    private init() {}
    
    func initialize() {
        // Initialize analytics SDK
    }
    
    func trackEvent(_ eventName: String, parameters: [String: Any]? = nil) {
        // Track analytics event
        print("Analytics: \(eventName) \(parameters ?? [:])")
    }
}
