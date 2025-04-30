import SwiftUI
import WebKit

struct HomeView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isWebViewLoading = true
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Smiley Brooms Cleaning")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
                
                if isWebViewLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(0.8)
                        .padding(.trailing, 10)
                }
                
                Button(action: {
                    appState.currentTab = .booking
                    appState.showNewBookingSheet = true
                }) {
                    Text("Book Now")
                        .fontWeight(.semibold)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            .padding()
            .background(Color(.windowBackgroundColor))
            
            // Web content
            WebView(url: URL(string: "https://smileybrooms.com")!, isLoading: $isWebViewLoading)
        }
    }
}

struct WebView: NSViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    
    func makeNSView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }
    
    func updateNSView(_ webView: WKWebView, context: Context) {
        // Update the view if needed
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebView
        
        init(_ parent: WebView) {
            self.parent = parent
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
        }
    }
}
