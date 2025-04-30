import SwiftUI

struct BookingsView: View {
    @EnvironmentObject private var appState: AppState
    @State private var upcomingBookings: [Booking] = []
    @State private var pastBookings: [Booking] = []
    @State private var isLoading = true
    
    struct Booking: Identifiable {
        let id = UUID()
        let serviceType: String
        let date: Date
        let address: String
        let status: BookingStatus
        
        enum BookingStatus: String {
            case confirmed = "Confirmed"
            case completed = "Completed"
            case cancelled = "Cancelled"
            
            var color: Color {
                switch self {
                case .confirmed: return .blue
                case .completed: return .green
                case .cancelled: return .red
                }
            }
        }
    }
    
    var body: some View {
        VStack {
            if appState.isLoggedIn {
                if isLoading {
                    ProgressView("Loading your bookings...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if upcomingBookings.isEmpty && pastBookings.isEmpty {
                    emptyBookingsView
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 30) {
                            if !upcomingBookings.isEmpty {
                                Text("Upcoming Bookings")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .padding(.horizontal)
                                
                                ForEach(upcomingBookings) { booking in
                                    bookingCard(booking)
                                }
                            }
                            
                            if !pastBookings.isEmpty {
                                Text("Past Bookings")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .padding(.top, 20)
                                    .padding(.horizontal)
                                
                                ForEach(pastBookings) { booking in
                                    bookingCard(booking)
                                }
                            }
                        }
                        .padding(.vertical)
                    }
                }
            } else {
                VStack(spacing: 20) {
                    Text("Please sign in to view your bookings")
                        .font(.title2)
                    
                    Button("Sign In") {
                        appState.showLoginSheet = true
                    }
                    .buttonStyle(.borderedProminent)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .navigationTitle("My Bookings")
        .onAppear {
            if appState.isLoggedIn {
                loadBookings()
            } else {
                isLoading = false
            }
        }
    }
    
    var emptyBookingsView: some View {
        VStack(spacing: 20) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.system(size: 60))
                .foregroundColor(.secondary)
            
            Text("No Bookings Found")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("You don't have any bookings yet. Book a cleaning service to get started.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
                .padding(.horizontal)
            
            Button("Book a Service") {
                // Navigate to services or home tab
            }
            .buttonStyle(.borderedProminent)
            .padding(.top, 10)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    func bookingCard(_ booking: Booking) -> some View {
        VStack(alignment: .leading, spacing: 15) {
            HStack {
                Text(booking.serviceType)
                    .font(.headline)
                
                Spacer()
                
                Text(booking.status.rawValue)
                    .font(.subheadline)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(booking.status.color.opacity(0.1))
                    .foregroundColor(booking.status.color)
                    .cornerRadius(20)
            }
            
            Divider()
            
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 8) {
                    Label {
                        Text(formatDate(booking.date))
                    } icon: {
                        Image(systemName: "calendar")
                            .foregroundColor(.blue)
                    }
                    
                    Label {
                        Text(formatTime(booking.date))
                    } icon: {
                        Image(systemName: "clock")
                            .foregroundColor(.blue)
                    }
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 8) {
                    Label {
                        Text(booking.address)
                            .multilineTextAlignment(.trailing)
                    } icon: {
                        Image(systemName: "location")
                            .foregroundColor(.blue)
                    }
                }
            }
            
            if booking.status == .confirmed {
                HStack {
                    Button("Reschedule") {
                        // Reschedule action
                    }
                    .buttonStyle(.bordered)
                    
                    Spacer()
                    
                    Button("Cancel") {
                        // Cancel action
                    }
                    .buttonStyle(.bordered)
                    .foregroundColor(.red)
                }
                .padding(.top, 10)
            }
        }
        .padding()
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
        .padding(.horizontal)
    }
    
    private func loadBookings() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            // Mock data
            let calendar = Calendar.current
            let now = Date()
            
            // Upcoming bookings
            self.upcomingBookings = [
                Booking(
                    serviceType: "Regular Cleaning",
                    date: calendar.date(byAdding: .day, value: 3, to: now)!,
                    address: "123 Main St, Apt 4B",
                    status: .confirmed
                ),
                Booking(
                    serviceType: "Deep Cleaning",
                    date: calendar.date(byAdding: .day, value: 10, to: now)!,
                    address: "123 Main St, Apt 4B",
                    status: .confirmed
                )
            ]
            
            // Past bookings
            self.pastBookings = [
                Booking(
                    serviceType: "Regular Cleaning",
                    date: calendar.date(byAdding: .day, value: -14, to: now)!,
                    address: "123 Main St, Apt 4B",
                    status: .completed
                ),
                Booking(
                    serviceType: "Move In/Out Cleaning",
                    date: calendar.date(byAdding: .day, value: -30, to: now)!,
                    address: "456 Park Ave, Suite 2C",
                    status: .completed
                ),
                Booking(
                    serviceType: "Regular Cleaning",
                    date: calendar.date(byAdding: .day, value: -45, to: now)!,
                    address: "123 Main St, Apt 4B",
                    status: .cancelled
                )
            ]
            
            self.isLoading = false
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
    
    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

struct BookingsView_Previews: PreviewProvider {
    static var previews: some View {
        BookingsView()
            .environmentObject(AppState())
    }
}
