import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    
    var body: some View {
        TabView {
            Text("Home View")
                .tabItem {
                    Label("Home", systemImage: "house")
                }
            
            Text("Services View")
                .tabItem {
                    Label("Services", systemImage: "list.bullet")
                }
            
            Text("Bookings View")
                .tabItem {
                    Label("Bookings", systemImage: "calendar")
                }
            
            Text("Profile View")
                .tabItem {
                    Label("Profile", systemImage: "person")
                }
        }
        .frame(minWidth: 800, minHeight: 600)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppState())
    }
}
