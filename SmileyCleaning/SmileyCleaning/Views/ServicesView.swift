import SwiftUI

struct ServicesView: View {
    @EnvironmentObject private var appState: AppState
    var selectedService: String?
    
    private let services = [
        Service(id: "regular-cleaning", name: "Regular Cleaning", icon: "sparkles", description: "Our standard cleaning service for homes and apartments.", price: "$120"),
        Service(id: "deep-cleaning", name: "Deep Cleaning", icon: "sparkles.rectangle.stack", description: "A thorough cleaning that reaches every corner of your home.", price: "$220"),
        Service(id: "move-in-out", name: "Move In/Out Cleaning", icon: "building.2", description: "Prepare your home for new tenants or get your deposit back.", price: "$280"),
        Service(id: "office-cleaning", name: "Office Cleaning", icon: "building", description: "Keep your workplace clean and professional.", price: "$180"),
        Service(id: "carpet-cleaning", name: "Carpet Cleaning", icon: "square.grid.3x3.square", description: "Deep clean your carpets to remove stains and odors.", price: "$150"),
        Service(id: "window-cleaning", name: "Window Cleaning", icon: "square.grid.3x2", description: "Crystal clear windows inside and out.", price: "$100")
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Our Services")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.bottom, 10)
                
                if let selectedService = selectedService,
                   let service = services.first(where: { $0.id == selectedService }) {
                    serviceDetailView(service)
                } else {
                    servicesGridView
                }
            }
            .padding()
        }
    }
    
    var servicesGridView: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 300))], spacing: 20) {
            ForEach(services) { service in
                ServiceCardView(service: service)
                    .onTapGesture {
                        appState.selectedService = service.id
                    }
            }
        }
    }
    
    func serviceDetailView(_ service: Service) -> some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Button(action: { appState.selectedService = nil }) {
                    Label("Back to Services", systemImage: "chevron.left")
                }
                .buttonStyle(PlainButtonStyle())
                
                Spacer()
            }
            .padding(.bottom, 10)
            
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Image(systemName: service.icon)
                            .font(.system(size: 36))
                            .foregroundColor(.blue)
                        
                        Text(service.name)
                            .font(.title)
                            .fontWeight(.bold)
                    }
                    
                    Text("Starting at \(service.price)")
                        .font(.title3)
                        .foregroundColor(.secondary)
                    
                    Text(service.description)
                        .font(.body)
                        .padding(.top, 5)
                    
                    Text("This comprehensive service includes:")
                        .font(.headline)
                        .padding(.top, 10)
                    
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(serviceFeatures(for: service.id), id: \.self) { feature in
                            HStack(alignment: .top) {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.green)
                                    .padding(.top, 2)
                                
                                Text(feature)
                            }
                        }
                    }
                    .padding(.leading, 5)
                    
                    Spacer()
                    
                    Button(action: {
                        appState.currentTab = .booking
                        appState.showNewBookingSheet = true
                    }) {
                        Text("Book This Service")
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    .padding(.top, 20)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                Spacer()
                
                // Placeholder for service image
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.2))
                    
                    Text("Service Image")
                        .foregroundColor(.secondary)
                }
                .frame(width: 300, height: 200)
            }
        }
    }
    
    func serviceFeatures(for serviceId: String) -> [String] {
        switch serviceId {
        case "regular-cleaning":
            return [
                "Dusting all accessible surfaces",
                "Vacuuming carpets and floors",
                "Mopping all floors",
                "Cleaning kitchen counters and appliances",
                "Cleaning and sanitizing bathrooms",
                "Emptying trash bins"
            ]
        case "deep-cleaning":
            return [
                "All regular cleaning services",
                "Cleaning inside ovens and refrigerators",
                "Washing baseboards and door frames",
                "Cleaning inside cabinets",
                "Washing windows inside",
                "Removing scale from shower heads and faucets"
            ]
        case "move-in-out":
            return [
                "All deep cleaning services",
                "Cleaning inside all cabinets and drawers",
                "Cleaning all appliances inside and out",
                "Cleaning all windows inside and out",
                "Cleaning all light fixtures",
                "Cleaning all vents and fans"
            ]
        case "office-cleaning":
            return [
                "Cleaning and sanitizing all desks and workstations",
                "Cleaning and sanitizing break rooms",
                "Cleaning and sanitizing bathrooms",
                "Vacuuming and mopping all floors",
                "Emptying all trash bins",
                "Cleaning glass doors and partitions"
            ]
        case "carpet-cleaning":
            return [
                "Pre-treatment of stains",
                "Hot water extraction cleaning",
                "Deodorizing treatment",
                "Quick-dry technology",
                "Spot treatment for tough stains",
                "Pet odor removal"
            ]
        case "window-cleaning":
            return [
                "Interior and exterior window cleaning",
                "Screen cleaning",
                "Window track cleaning",
                "Window sill cleaning",
                "Streak-free guarantee",
                "Up to 3 stories high"
            ]
        default:
            return []
        }
    }
}

struct Service: Identifiable {
    var id: String
    var name: String
    var icon: String
    var description: String
    var price: String
}

struct ServiceCardView: View {
    let service: Service
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: service.icon)
                    .font(.system(size: 24))
                    .foregroundColor(.blue)
                
                Text(service.name)
                    .font(.headline)
            }
            
            Text(service.description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            HStack {
                Text("Starting at \(service.price)")
                    .fontWeight(.semibold)
                
                Spacer()
                
                Text("View Details")
                    .font(.caption)
                    .foregroundColor(.blue)
            }
        }
        .padding()
        .background(Color(.windowBackgroundColor).opacity(0.5))
        .cornerRadius(10)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
}
