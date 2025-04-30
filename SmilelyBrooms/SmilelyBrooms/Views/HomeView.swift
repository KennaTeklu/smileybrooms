import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var appState: AppState
    @State private var selectedTab = 0
    @State private var showBookingSheet = false
    @State private var selectedService: ServiceType?
    
    enum ServiceType: String, CaseIterable, Identifiable {
        case regular = "Regular Cleaning"
        case deep = "Deep Cleaning"
        case move = "Move In/Out Cleaning"
        case office = "Office Cleaning"
        
        var id: String { self.rawValue }
        
        var description: String {
            switch self {
            case .regular:
                return "Our standard cleaning service for homes that need regular maintenance."
            case .deep:
                return "Thorough cleaning for homes that need extra attention to detail."
            case .move:
                return "Comprehensive cleaning for when you're moving in or out of a property."
            case .office:
                return "Professional cleaning services for office spaces and commercial properties."
            }
        }
        
        var icon: String {
            switch self {
            case .regular: return "sparkles"
            case .deep: return "sparkles.rectangle.stack"
            case .move: return "building.2"
            case .office: return "briefcase"
            }
        }
        
        var color: Color {
            switch self {
            case .regular: return .blue
            case .deep: return .purple
            case .move: return .green
            case .office: return .orange
            }
        }
        
        var price: String {
            switch self {
            case .regular: return "$120"
            case .deep: return "$220"
            case .move: return "$320"
            case .office: return "Custom"
            }
        }
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 40) {
                // Hero Section
                heroSection
                
                // Services Section
                servicesSection
                
                // How It Works Section
                howItWorksSection
                
                // Testimonials Section
                testimonialsSection
                
                // FAQ Section
                faqSection
                
                // Call to Action
                callToActionSection
            }
            .padding(.bottom, 40)
        }
        .sheet(isPresented: $showBookingSheet) {
            if let service = selectedService {
                BookingFormView(preselectedService: service)
            }
        }
    }
    
    // MARK: - Hero Section
    var heroSection: some View {
        VStack(spacing: 30) {
            // Company name is smaller now
            Text("Smiley Brooms")
                .font(.title2)
                .foregroundColor(.secondary)
            
            // Tagline is now the biggest element
            Text("You rest, we take care of the rest :)")
                .font(.system(size: 46, weight: .bold))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
                .foregroundStyle(
                    LinearGradient(
                        colors: [.blue, .purple],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
            
            // Service description is smaller
            Text("Professional Cleaning Services")
                .font(.title3)
                .foregroundColor(.secondary)
            
            HStack(spacing: 16) {
                Button("Book Now") {
                    showBookingSheet = true
                    selectedService = .regular
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                
                Button("View Services") {
                    // Scroll to services section
                    withAnimation {
                        // In a real app, we would scroll to the services section
                    }
                }
                .buttonStyle(.bordered)
                .controlSize(.large)
            }
            .padding(.top, 20)
            
            Image("cleaning-hero")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxWidth: 700)
                .cornerRadius(12)
                .shadow(radius: 10)
                .padding(.top, 20)
        }
        .padding(.top, 60)
        .padding(.horizontal)
    }
    
    // MARK: - Services Section
    var servicesSection: some View {
        VStack(spacing: 30) {
            Text("Our Services")
                .font(.system(size: 28, weight: .bold))
                .padding(.bottom, 10)
            
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: 250, maximum: 300), spacing: 20)
            ], spacing: 20) {
                ForEach(ServiceType.allCases) { service in
                    serviceCard(service)
                }
            }
            .padding(.horizontal)
        }
        .padding(.top, 20)
    }
    
    func serviceCard(_ service: ServiceType) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: service.icon)
                    .font(.system(size: 24))
                    .foregroundColor(.white)
                    .frame(width: 50, height: 50)
                    .background(service.color)
                    .cornerRadius(12)
                
                Spacer()
                
                Text(service.price)
                    .font(.headline)
                    .padding(8)
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(8)
            }
            
            Text(service.rawValue)
                .font(.title3)
                .fontWeight(.semibold)
            
            Text(service.description)
                .foregroundColor(.secondary)
                .lineLimit(3)
            
            Spacer()
            
            Button("Book Service") {
                selectedService = service
                showBookingSheet = true
            }
            .buttonStyle(.borderedProminent)
            .tint(service.color)
        }
        .padding()
        .frame(height: 200)
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    // MARK: - How It Works Section
    var howItWorksSection: some View {
        VStack(spacing: 30) {
            Text("How It Works")
                .font(.system(size: 28, weight: .bold))
                .padding(.bottom, 10)
            
            HStack(alignment: .top, spacing: 30) {
                stepCard(
                    number: 1,
                    title: "Book Online",
                    description: "Choose the service you need and select a convenient date and time.",
                    icon: "calendar.badge.plus"
                )
                
                stepCard(
                    number: 2,
                    title: "We Clean",
                    description: "Our professional team arrives and transforms your space.",
                    icon: "sparkles"
                )
                
                stepCard(
                    number: 3,
                    title: "Enjoy",
                    description: "Relax in your freshly cleaned space and enjoy the results.",
                    icon: "heart.fill"
                )
            }
            .padding(.horizontal)
        }
        .padding(.top, 40)
    }
    
    func stepCard(number: Int, title: String, description: String, icon: String) -> some View {
        VStack(spacing: 15) {
            ZStack {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 60, height: 60)
                
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(.white)
            }
            
            Text(title)
                .font(.title3)
                .fontWeight(.semibold)
            
            Text(description)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    // MARK: - Testimonials Section
    var testimonialsSection: some View {
        VStack(spacing: 30) {
            Text("What Our Customers Say")
                .font(.system(size: 28, weight: .bold))
                .padding(.bottom, 10)
            
            TabView(selection: $selectedTab) {
                testimonialCard(
                    name: "Sarah Johnson",
                    comment: "The team at Smiley Brooms did an amazing job with my house. Everything was spotless and they paid attention to every detail.",
                    rating: 5
                )
                .tag(0)
                
                testimonialCard(
                    name: "Michael Chen",
                    comment: "I've tried several cleaning services, but Smiley Brooms is by far the best. Professional, thorough, and friendly staff.",
                    rating: 5
                )
                .tag(1)
                
                testimonialCard(
                    name: "Emily Rodriguez",
                    comment: "I love coming home after Smiley Brooms has cleaned. It's like walking into a brand new house every time!",
                    rating: 5
                )
                .tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .always))
            .frame(height: 200)
            .padding(.horizontal)
        }
        .padding(.top, 40)
    }
    
    func testimonialCard(name: String, comment: String, rating: Int) -> some View {
        VStack(spacing: 15) {
            Text(""")
                .font(.system(size: 60))
                .foregroundColor(.blue.opacity(0.3))
                .padding(.bottom, -40)
            
            Text(comment)
                .font(.body)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            HStack {
                ForEach(0..<5) { index in
                    Image(systemName: index < rating ? "star.fill" : "star")
                        .foregroundColor(.yellow)
                }
            }
            
            Text("— \(name)")
                .font(.headline)
        }
        .padding()
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    // MARK: - FAQ Section
    var faqSection: some View {
        VStack(spacing: 30) {
            Text("Frequently Asked Questions")
                .font(.system(size: 28, weight: .bold))
                .padding(.bottom, 10)
            
            VStack(spacing: 15) {
                faqItem(
                    question: "How do I schedule a cleaning?",
                    answer: "You can schedule a cleaning directly through this app by selecting the service you need and choosing a convenient date and time."
                )
                
                faqItem(
                    question: "What cleaning supplies do you use?",
                    answer: "We use eco-friendly, high-quality cleaning products that are safe for your family and pets while still providing excellent cleaning results."
                )
                
                faqItem(
                    question: "How long does a typical cleaning take?",
                    answer: "A standard cleaning for a 2-bedroom home typically takes 2-3 hours. Deep cleanings and larger homes may take longer."
                )
                
                faqItem(
                    question: "Can I reschedule my appointment?",
                    answer: "Yes, you can reschedule through the app at least 24 hours before your scheduled appointment without any fees."
                )
            }
            .padding(.horizontal)
        }
        .padding(.top, 40)
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
        .padding()
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    // MARK: - Call to Action Section
    var callToActionSection: some View {
        VStack(spacing: 20) {
            Text("Ready for a Cleaner Home?")
                .font(.system(size: 28, weight: .bold))
            
            Text("Book your cleaning service today and experience the difference.")
                .font(.title3)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Button("Book Now") {
                showBookingSheet = true
                selectedService = .regular
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .padding(.top, 10)
        }
        .padding(40)
        .frame(maxWidth: .infinity)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.purple.opacity(0.1)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(20)
        .padding(.horizontal)
    }
}

// Preview for SwiftUI Canvas
struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
            .environmentObject(AppState())
    }
}
