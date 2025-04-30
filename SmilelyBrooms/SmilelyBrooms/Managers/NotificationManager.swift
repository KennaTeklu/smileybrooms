import Foundation
import UserNotifications
import Combine

class NotificationManager: NSObject, ObservableObject, UNUserNotificationCenterDelegate {
    @Published var isAuthorized: Bool = false
    @Published var pendingNotifications: [UNNotificationRequest] = []
    
    override init() {
        super.init()
        checkAuthorizationStatus()
        UNUserNotificationCenter.current().delegate = self
    }
    
    func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            DispatchQueue.main.async {
                self.isAuthorized = granted
                if granted {
                    self.configureCategories()
                }
            }
        }
    }
    
    func checkAuthorizationStatus() {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            DispatchQueue.main.async {
                self.isAuthorized = settings.authorizationStatus == .authorized
            }
        }
    }
    
    func scheduleBookingReminder(for booking: Booking, timeInterval: TimeInterval = 86400) {
        guard isAuthorized else { return }
        
        let content = UNMutableNotificationContent()
        content.title = "Upcoming Cleaning Service"
        content.body = "Your \(booking.serviceType) service is scheduled for tomorrow at \(formatTime(booking.date))"
        content.sound = .default
        content.categoryIdentifier = "BOOKING_REMINDER"
        
        // Add booking details to the notification
        content.userInfo = [
            "bookingId": booking.id,
            "serviceType": booking.serviceType,
            "date": booking.date.timeIntervalSince1970
        ]
        
        // Schedule notification for 24 hours before the booking
        let reminderDate = booking.date.addingTimeInterval(-timeInterval)
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: reminderDate),
            repeats: false
        )
        
        let request = UNNotificationRequest(
            identifier: "booking-reminder-\(booking.id)",
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Error scheduling notification: \(error.localizedDescription)")
            }
        }
    }
    
    func scheduleBookingConfirmation(for booking: Booking) {
        guard isAuthorized else { return }
        
        let content = UNMutableNotificationContent()
        content.title = "Booking Confirmed"
        content.body = "Your \(booking.serviceType) service has been confirmed for \(formatDate(booking.date))"
        content.sound = .default
        content.categoryIdentifier = "BOOKING_CONFIRMATION"
        
        // Add booking details to the notification
        content.userInfo = [
            "bookingId": booking.id,
            "serviceType": booking.serviceType,
            "date": booking.date.timeIntervalSince1970
        ]
        
        // Schedule notification immediately
        let request = UNNotificationRequest(
            identifier: "booking-confirmation-\(booking.id)",
            content: content,
            trigger: nil
        )
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Error scheduling notification: \(error.localizedDescription)")
            }
        }
    }
    
    func cancelNotifications(for bookingId: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [
            "booking-reminder-\(bookingId)",
            "booking-confirmation-\(bookingId)"
        ])
    }
    
    func getPendingNotifications() {
        UNUserNotificationCenter.current().getPendingNotificationRequests { requests in
            DispatchQueue.main.async {
                self.pendingNotifications = requests
            }
        }
    }
    
    private func configureCategories() {
        // Configure notification categories and actions
        let viewAction = UNNotificationAction(
            identifier: "VIEW_BOOKING",
            title: "View Details",
            options: .foreground
        )
        
        let rescheduleAction = UNNotificationAction(
            identifier: "RESCHEDULE",
            title: "Reschedule",
            options: .foreground
        )
        
        let cancelAction = UNNotificationAction(
            identifier: "CANCEL_BOOKING",
            title: "Cancel",
            options: [.foreground, .destructive]
        )
        
        let reminderCategory = UNNotificationCategory(
            identifier: "BOOKING_REMINDER",
            actions: [viewAction, rescheduleAction, cancelAction],
            intentIdentifiers: [],
            options: []
        )
        
        let confirmationCategory = UNNotificationCategory(
            identifier: "BOOKING_CONFIRMATION",
            actions: [viewAction, rescheduleAction, cancelAction],
            intentIdentifiers: [],
            options: []
        )
        
        UNUserNotificationCenter.current().setNotificationCategories([reminderCategory, confirmationCategory])
    }
    
    // MARK: - UNUserNotificationCenterDelegate
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        
        switch response.actionIdentifier {
        case "VIEW_BOOKING":
            if let bookingId = userInfo["bookingId"] as? String {
                // Handle view booking action
                NotificationCenter.default.post(name: .viewBookingNotification, object: nil, userInfo: ["bookingId": bookingId])
            }
            
        case "RESCHEDULE":
            if let bookingId = userInfo["bookingId"] as? String {
                // Handle reschedule action
                NotificationCenter.default.post(name: .rescheduleBookingNotification, object: nil, userInfo: ["bookingId": bookingId])
            }
            
        case "CANCEL_BOOKING":
            if let bookingId = userInfo["bookingId"] as? String {
                // Handle cancel action
                NotificationCenter.default.post(name: .cancelBookingNotification, object: nil, userInfo: ["bookingId": bookingId])
            }
            
        default:
            break
        }
        
        completionHandler()
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        // Show notification even when app is in foreground
        completionHandler([.banner, .sound, .badge])
    }
}

// Helper functions
private func formatDate(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateStyle = .medium
    formatter.timeStyle = .none
    return formatter.string(from: date)
}

private func formatTime(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateStyle = .none
    formatter.timeStyle = .short
    return formatter.string(from: date)
}

// Notification names
extension Notification.Name {
    static let viewBookingNotification = Notification.Name("viewBookingNotification")
    static let rescheduleBookingNotification = Notification.Name("rescheduleBookingNotification")
    static let cancelBookingNotification = Notification.Name("cancelBookingNotification")
}
