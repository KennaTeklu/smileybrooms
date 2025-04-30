import SwiftUI

struct BookingsView: View {
    @EnvironmentObject private var appState: AppState
    
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Text("Your Bookings")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: { appState.showNewBookingSheet = true }) {
                    Label("New Booking", systemImage: "plus")
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            
            if appState.bookings.isEmpty {
                emptyBookingsView
            } else {
                bookingsList
            }
        }
        .padding()
    }
    
    var emptyBookingsView: some View {
        VStack(spacing: 20) {
            Spacer()
            
            Image(systemName: "calendar.badge.clock")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("No Bookings Yet")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Schedule your first cleaning service")
                .foregroundColor(.secondary)
            
            Button(action: { appState.showNewBookingSheet = true }) {
                Text("Book Now")
                    .fontWeight(.semibold)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            .padding(.top, 10)
            
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }
    
    var bookingsList: some View {
        List {
            ForEach(appState.bookings) { booking in
                BookingRow(booking: booking)
            }
        }
        .listStyle(InsetListStyle())
    }
}

struct BookingRow: View {
    let booking: Booking
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(booking.serviceType)
                    .font(.headline)
                
                Text(formatDate(booking.date))
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                if !booking.notes.isEmpty {
                    Text(booking.notes)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
            }
            
            Spacer()
            
            statusBadge
        }
        .padding(.vertical, 8)
    }
    
    var statusBadge: some View {
        Text(booking.status.rawValue)
            .font(.caption)
            .fontWeight(.semibold)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(statusColor.opacity(0.2))
            .foregroundColor(statusColor)
            .cornerRadius(20)
    }
    
    var statusColor: Color {
        switch booking.status {
        case .pending: return .orange
        case .confirmed: return .blue
        case .completed: return .green
        case .cancelled: return .red
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

struct BookingFormView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.presentationMode) private var presentationMode
    
    @State private var selectedService = "Regular Cleaning"
    @State private var bookingDate = Date()
    @State private var notes = ""
    
    private let services = [
        "Regular Cleaning",
        "Deep Cleaning",
        "Move In/Out Cleaning",
        "Office Cleaning",
        "Carpet Cleaning",
        "Window Cleaning"
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Text("New Booking")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: { presentationMode.wrappedValue.dismiss() }) {
                    Image(systemName: "xmark")
                        .foregroundColor(.secondary)
                }
                .buttonStyle(PlainButtonStyle())
            }
            
            Form {
                Section(header: Text("Service Type")) {
                    Picker("Select a service", selection: $selectedService) {
                        ForEach(services, id: \.self) { service in
                            Text(service).tag(service)
                        }
                    }
                }
                
                Section(header: Text("Date and Time")) {
                    DatePicker("Select date and time", selection: $bookingDate, in: Date()...)
                }
                
                Section(header: Text("Additional Notes")) {
                    TextEditor(text: $notes)
                        .frame(height: 100)
                }
            }
            .formStyle(GroupedFormStyle())
            
            HStack {
                Button(action: { presentationMode.wrappedValue.dismiss() }) {
                    Text("Cancel")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(BorderedButtonStyle())
                
                Button(action: createBooking) {
                    Text("Book Now")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(BorderedProminentButtonStyle())
                .disabled(appState.isLoading)
            }
        }
        .padding()
        .overlay(
            Group {
                if appState.isLoading {
                    Color.black.opacity(0.2)
                        .edgesIgnoringSafeArea(.all)
                    
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(1.5)
                }
            }
        )
    }
    
    private func createBooking() {
        appState.createBooking(serviceType: selectedService, date: bookingDate, notes: notes)
    }
}
