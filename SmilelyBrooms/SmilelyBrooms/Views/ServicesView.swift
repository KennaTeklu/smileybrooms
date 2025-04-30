import SwiftUI

struct ServicesView: View {
    @State private var showBookingSheet = false
    @State private var selectedService: HomeView.ServiceType?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 30) {
                Text("Our Services")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 40)
                
                Text("Professional cleaning services tailored to your needs")
                    .font(.title3)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                LazyVGrid(columns: [
                    GridItem(.adaptive(minimum: 300, maximum: 400), spacing: 20)
                ], spacing: 20) {
                    ForEach(HomeView.ServiceType.allCases) { service in
                        serviceDetailCard(service)
                    }
                }
                .padding(.horizontal)
                .padding(.top, 20)
            }
            .padding(.bottom, 40)
        }
        .sheet(isPresented: $showBookingSheet) {
            if let service = selectedService {
                BookingFormView(preselectedService: service)
            }
        }
    }
    
    func serviceDetailCard(_ service: HomeView.ServiceType) -> some View {
        VStack(alignment: .leading, spacing: 15) {
            HStack {
                Image(systemName: service.icon)
                    .font(.system(size: 24))
                    .foregroundColor(.white)
                    .frame(width: 50, height: 50)
                    .background(service.color)
                    .cornerRadius(12)
                
                Spacer()
                
                Text(service.price)
                    .font(.title2)
                    .fontWeight(.bold)
                    .padding(8)
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(8)
            }
            
            Text(service.rawValue)
                .font(.title2)
                .fontWeight(.semibold)
            
            Text(service.description)
                .foregroundColor(.secondary)
                .padding(.bottom, 10)
            
            // Service features
            VStack(alignment: .leading, spacing: 10) {
                serviceFeature(icon: "checkmark.circle.fill", text: "Professional cleaners")
                serviceFeature(icon: "checkmark.circle.fill", text: "Eco-friendly products")
                serviceFeature(icon: "checkmark.circle.fill", text: "Satisfaction guaranteed")
                serviceFeature(icon: "checkmark.circle.fill", text: "Flexible scheduling")
            }
            
            Spacer()
            
            Button("Book This Service") {
                selectedService = service
                showBookingSheet = true
            }
            .buttonStyle(.borderedProminent)
            .tint(service.color)
            .controlSize(.large)
        }
        .padding()
        .frame(height: 350)
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    func serviceFeature(icon: String, text: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .foregroundColor(.green)
            
            Text(text)
                .foregroundColor(.secondary)
        }
    }
}
