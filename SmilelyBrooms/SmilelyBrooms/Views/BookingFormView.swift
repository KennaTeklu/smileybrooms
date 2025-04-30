import SwiftUI

struct BookingFormView: View {
    var preselectedService: HomeView.ServiceType
    
    @State private var selectedDate = Date()
    @State private var selectedTime = Date()
    @State private var name = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var address = ""
    @State private var specialInstructions = ""
    @State private var isSubmitting = false
    @State private var showConfirmation = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack {
            // Header
            Text("Book \(preselectedService.rawValue)")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Service info
                    HStack {
                        Image(systemName: preselectedService.icon)
                            .font(.system(size: 24))
                            .foregroundColor(.white)
                            .frame(width: 50, height: 50)
                            .background(preselectedService.color)
                            .cornerRadius(12)
                        
                        VStack(alignment: .leading) {
                            Text(preselectedService.rawValue)
                                .font(.headline)
                            
                            Text(preselectedService.description)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        Text(preselectedService.price)
                            .font(.title3)
                            .fontWeight(.bold)
                    }
                    .padding()
                    .background(Color(.windowBackgroundColor).opacity(0.5))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
                    
                    // Date and time selection
                    VStack(alignment: .leading) {
                        Text("When would you like us to clean?")
                            .font(.headline)
                            .padding(.bottom, 5)
                        
                        HStack(spacing: 20) {
                            VStack(alignment: .leading) {
                                Text("Date")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                DatePicker(
                                    "",
                                    selection: $selectedDate,
                                    displayedComponents: .date
                                )
                                .labelsHidden()
                            }
                            .frame(maxWidth: .infinity)
                            
                            VStack(alignment: .leading) {
                                Text("Time")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                DatePicker(
                                    "",
                                    selection: $selectedTime,
                                    displayedComponents: .hourAndMinute
                                )
                                .labelsHidden()
                            }
                            .frame(maxWidth: .infinity)
                        }
                    }
                    .padding()
                    .background(Color(.windowBackgroundColor).opacity(0.5))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
                    
                    // Contact information
                    VStack(alignment: .leading) {
                        Text("Your Information")
                            .font(.headline)
                            .padding(.bottom, 5)
                        
                        TextField("Full Name", text: $name)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Email", text: $email)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Phone", text: $phone)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Address", text: $address)
                            .textFieldStyle(.roundedBorder)
                        
                        Text("Special Instructions")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .padding(.top, 5)
                        
                        TextEditor(text: $specialInstructions)
                            .frame(height: 100)
                            .overlay(
                                RoundedRectangle(cornerRadius: 5)
                                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                            )
                    }
                    .padding()
                    .background(Color(.windowBackgroundColor).opacity(0.5))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                    )
                }
                .padding()
            }
            
            // Submit button
            Button(action: {
                submitBooking()
            }) {
                if isSubmitting {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                } else {
                    Text("Book Now")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .padding()
            .disabled(isSubmitting || name.isEmpty || email.isEmpty || phone.isEmpty || address.isEmpty)
        }
        .frame(width: 600, height: 700)
        .alert("Booking Confirmed", isPresented: $showConfirmation) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("Your booking for \(preselectedService.rawValue) has been confirmed for \(formattedDateTime()). We'll send you a confirmation email shortly.")
        }
    }
    
    private func submitBooking() {
        isSubmitting = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isSubmitting = false
            showConfirmation = true
        }
    }
    
    private func formattedDateTime() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .medium
        
        let timeFormatter = DateFormatter()
        timeFormatter.timeStyle = .short
        
        return "\(dateFormatter.string(from: selectedDate)) at \(timeFormatter.string(from: selectedTime))"
    }
}
