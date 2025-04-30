import SwiftUI

struct ScheduleView: View {
    @State private var selectedDate = Date()
    @State private var events: [CalendarEvent] = []
    @State private var isLoading = true
    
    struct CalendarEvent: Identifiable {
        let id = UUID()
        let title: String
        let date: Date
        let duration: TimeInterval
        let color: Color
    }
    
    var body: some View {
        VStack {
            // Calendar view
            VStack {
                DatePicker(
                    "Select Date",
                    selection: $selectedDate,
                    displayedComponents: [.date]
                )
                .datePickerStyle(.graphical)
                .padding()
                .onChange(of: selectedDate) { _ in
                    loadEvents()
                }
                
                if isLoading {
                    ProgressView("Loading schedule...")
                        .padding()
                } else {
                    // Events for selected date
                    VStack(alignment: .leading) {
                        Text("Schedule for \(formatDate(selectedDate))")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        if eventsForSelectedDate.isEmpty {
                            Text("No events scheduled for this day")
                                .foregroundColor(.secondary)
                                .padding()
                                .frame(maxWidth: .infinity, alignment: .center)
                        } else {
                            List(eventsForSelectedDate) { event in
                                HStack {
                                    Rectangle()
                                        .fill(event.color)
                                        .frame(width: 4)
                                        .cornerRadius(2)
                                    
                                    VStack(alignment: .leading) {
                                        Text(event.title)
                                            .font(.headline)
                                        
                                        Text("\(formatTime(event.date)) - \(formatTime(event.date.addingTimeInterval(event.duration)))")
                                            .font(.subheadline)
                                            .foregroundColor(.secondary)
                                    }
                                    .padding(.leading, 8)
                                }
                                .padding(.vertical, 4)
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle("Schedule")
        .onAppear {
            loadEvents()
        }
    }
    
    var eventsForSelectedDate: [CalendarEvent] {
        let calendar = Calendar.current
        return events.filter { event in
            calendar.isDate(event.date, inSameDayAs: selectedDate)
        }
    }
    
    private func loadEvents() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            // Generate mock events
            self.generateMockEvents()
            self.isLoading = false
        }
    }
    
    private func generateMockEvents() {
        let calendar = Calendar.current
        events = []
        
        // Generate events for the current month
        let startDate = calendar.date(from: calendar.dateComponents([.year, .month], from: selectedDate))!
        let range = calendar.range(of: .day, in: .month, for: startDate)!
        
        for day in range {
            // Add random events for some days
            if Int.random(in: 1...3) == 1 {
                let eventDate = calendar.date(byAdding: .day, value: day - 1, to: startDate)!
                
                // Add 1-3 events for this day
                for _ in 0..<Int.random(in: 1...3) {
                    // Random hour between 8 AM and 6 PM
                    let hour = Int.random(in: 8...18)
                    let minute = [0, 15, 30, 45][Int.random(in: 0...3)]
                    
                    var components = calendar.dateComponents([.year, .month, .day], from: eventDate)
                    components.hour = hour
                    components.minute = minute
                    
                    let eventDateTime = calendar.date(from: components)!
                    
                    // Random event type
                    let eventTypes = [
                        ("Regular Cleaning", Color.blue, TimeInterval(2 * 60 * 60)),
                        ("Deep Cleaning", Color.purple, TimeInterval(4 * 60 * 60)),
                        ("Move In/Out Cleaning", Color.green, TimeInterval(5 * 60 * 60)),
                        ("Office Cleaning", Color.orange, TimeInterval(3 * 60 * 60))
                    ]
                    
                    let eventType = eventTypes[Int.random(in: 0..<eventTypes.count)]
                    
                    events.append(CalendarEvent(
                        title: eventType.0,
                        date: eventDateTime,
                        duration: eventType.2,
                        color: eventType.1
                    ))
                }
            }
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

struct ScheduleView_Previews: PreviewProvider {
    static var previews: some View {
        ScheduleView()
    }
}
