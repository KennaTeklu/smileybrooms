import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var appState: AppState
    @State private var email = ""
    @State private var password = ""
    @State private var rememberMe = false
    
    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            
            Image(systemName: "person.circle")
                .font(.system(size: 70))
                .foregroundColor(.blue)
            
            Text("Sign In")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            VStack(spacing: 15) {
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                HStack {
                    Toggle("Remember me", isOn: $rememberMe)
                        .toggleStyle(SwitchToggleStyle(tint: .blue))
                    
                    Spacer()
                    
                    Button("Forgot Password?") {
                        // Handle forgot password
                    }
                    .buttonStyle(PlainButtonStyle())
                    .foregroundColor(.blue)
                }
                .font(.callout)
            }
            .padding(.horizontal, 40)
            
            Button(action: login) {
                if appState.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(0.8)
                } else {
                    Text("Sign In")
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(10)
            .padding(.horizontal, 40)
            .disabled(email.isEmpty || password.isEmpty || appState.isLoading)
            
            HStack {
                Text("Don't have an account?")
                    .foregroundColor(.secondary)
                
                Button("Sign Up") {
                    // Handle sign up
                }
                .buttonStyle(PlainButtonStyle())
                .foregroundColor(.blue)
            }
            .font(.callout)
            
            Spacer()
        }
        .padding()
    }
    
    private func login() {
        appState.login(email: email, password: password)
    }
}

struct ProfileView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isEditMode = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                HStack {
                    Text("Your Profile")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Spacer()
                    
                    Button(action: { isEditMode.toggle() }) {
                        Text(isEditMode ? "Done" : "Edit")
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }
                }
                
                profileHeader
                
                Divider()
                
                profileDetails
                
                Divider()
                
                Text("Recent Bookings")
                    .font(.headline)
                    .padding(.top, 10)
                
                if appState.bookings.isEmpty {
                    Text("No recent bookings")
                        .foregroundColor(.secondary)
                        .padding()
                } else {
                    ForEach(appState.bookings.prefix(3)) { booking in
                        BookingRow(booking: booking)
                            .padding(.vertical, 5)
                    }
                    
                    Button("View All Bookings") {
                        appState.currentTab = .booking
                    }
                    .buttonStyle(PlainButtonStyle())
                    .foregroundColor(.blue)
                    .padding(.top, 5)
                }
            }
            .padding()
        }
    }
    
    var profileHeader: some View {
        HStack(spacing: 20) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.2))
                    .frame(width: 100, height: 100)
                
                Text(String(appState.userProfile?.name.prefix(1) ?? "U"))
                    .font(.system(size: 40, weight: .bold))
                    .foregroundColor(.blue)
            }
            
            VStack(alignment: .leading, spacing: 5) {
                Text(appState.userProfile?.name ?? "User")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text(appState.userProfile?.email ?? "")
                    .foregroundColor(.secondary)
                
                Text("Member since \(formattedJoinDate)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 10)
    }
    
    var profileDetails: some View {
        VStack(alignment: .leading, spacing: 15) {
            detailRow(title: "Name", value: appState.userProfile?.name ?? "", isEditable: isEditMode)
            detailRow(title: "Email", value: appState.userProfile?.email ?? "", isEditable: isEditMode)
            detailRow(title: "Phone", value: appState.userProfile?.phone ?? "", isEditable: isEditMode)
            detailRow(title: "Address", value: appState.userProfile?.address ?? "Add your address", isEditable: isEditMode)
        }
    }
    
    func detailRow(title: String, value: String, isEditable: Bool) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            
            if isEditable {
                TextField(title, text: .constant(value))
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            } else {
                Text(value)
                    .font(.body)
            }
        }
        .padding(.vertical, 5)
    }
    
    var formattedJoinDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .none
        return formatter.string(from: Date().addingTimeInterval(-86400 * 30)) // Simulated join date (30 days ago)
    }
}
