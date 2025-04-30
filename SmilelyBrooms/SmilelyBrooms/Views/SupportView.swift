import SwiftUI

struct SupportView: View {
    @State private var name = ""
    @State private var email = ""
    @State private var subject = ""
    @State private var message = ""
    @State private var isSubmitting = false
    @State private var showConfirmation = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack {
            // Header
            Text("Contact Support")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Contact form
                    VStack(alignment: .leading) {
                        Text("How can we help you?")
                            .font(.headline)
                            .padding(.bottom, 5)
                        
                        TextField("Full Name", text: $name)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Email", text: $email)
                            .textFieldStyle(.roundedBorder)
                        
                        TextField("Subject", text: $subject)
                            .textFieldStyle(.roundedBorder)
                        
                        Text("Message")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .padding(.top, 5)
                        
                        TextEditor(text: $message)
                            .frame(height: 150)
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
                    
                    // FAQ section
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Frequently Asked Questions")
                            .font(.headline)
                            .padding(.bottom, 5)
                        
                        faqItem(
                            question: "How do I reschedule a booking?",
                            answer: "You can reschedule a booking by going to the Bookings tab and selecting the booking you want to reschedule. Then click the 'Reschedule' button."
                        )
                        
                        faqItem(
                            question: "What is your cancellation policy?",
                            answer: "You can cancel a booking at least 24 hours before the scheduled time without any fees. Cancellations made less than 24 hours in advance may incur a fee."
                        )
                        
                        faqItem(
                            question: "How do I update my payment information?",
                            answer: "You can update your payment information by going to the Profile tab and selecting 'Payment Methods'."
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
                submitSupportRequest()
            }) {
                if isSubmitting {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                } else {
                    Text("Submit")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .padding()
            .disabled(isSubmitting || name.isEmpty || email.isEmpty || subject.isEmpty || message.isEmpty)
        }
        .frame(width: 600, height: 700)
        .alert("Message Sent", isPresented: $showConfirmation) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("Thank you for contacting us. We'll get back to you as soon as possible.")
        }
    }
    
    func faqItem(question: String, answer: String) -> some View {
        DisclosureGroup(
            content: {
                Text(answer)
                    .padding(.vertical, 10)
                    .foregroundColor(.secondary)
            },
            label: {
                Text(question)
                    .font(.headline)
            }
        )
    }
    
    private func submitSupportRequest() {
        isSubmitting = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isSubmitting = false
            showConfirmation = true
        }
    }
}

struct SupportView_Previews: PreviewProvider {
    static var previews: some View {
        SupportView()
    }
}
