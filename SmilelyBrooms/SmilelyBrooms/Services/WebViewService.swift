import Foundation
import WebKit
import Combine

class WebViewService: NSObject, ObservableObject {
    @Published var isLoading: Bool = true
    @Published var isConnected: Bool = true
    @Published var errorMessage: String? = nil
    @Published var canGoBack: Bool = false
    @Published var canGoForward: Bool = false
    @Published var currentURL: URL? = nil
    
    private var webView: WKWebView?
    private var cancellables = Set<AnyCancellable>()
    private let baseURL = URL(string: "https://smileybrooms.com")!
    
    // Network monitor to check connectivity
    private let networkMonitor = NetworkMonitor()
    
    override init() {
        super.init()
        setupNetworkMonitoring()
    }
    
    func setupWebView() -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // Enable JavaScript
        configuration.preferences.javaScriptEnabled = true
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        
        // Set up user script to inject custom CSS/JS
        let userScript = WKUserScript(
            source: setupInjectedScript(),
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )
        
        configuration.userContentController.addUserScript(userScript)
        
        // Create cookies for authentication if needed
        if let authCookie = createAuthCookie() {
            configuration.websiteDataStore.httpCookieStore.setCookie(authCookie)
        }
        
        // Create the web view
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.customUserAgent = "SmilelyBrooms-macOS/1.0"
        webView.navigationDelegate = self
        webView.uiDelegate = self
        
        // Store reference
        self.webView = webView
        
        // Load initial URL
        loadBaseURL()
        
        return webView
    }
    
    func loadBaseURL() {
        guard let webView = webView else { return }
        
        // Check network connectivity first
        if networkMonitor.isConnected {
            isConnected = true
            errorMessage = nil
            
            let request = URLRequest(url: baseURL, cachePolicy: .reloadRevalidatingCacheData)
            webView.load(request)
        } else {
            isConnected = false
            errorMessage = "No internet connection. Please check your network settings."
            loadOfflineFallback()
        }
    }
    
    func reload() {
        webView?.reload()
    }
    
    func goBack() {
        webView?.goBack()
    }
    
    func goForward() {
        webView?.goForward()
    }
    
    private func setupNetworkMonitoring() {
        networkMonitor.startMonitoring()
        
        networkMonitor.$isConnected
            .dropFirst()
            .sink { [weak self] isConnected in
                DispatchQueue.main.async {
                    self?.isConnected = isConnected
                    
                    if isConnected {
                        // Reconnected - reload
                        self?.errorMessage = nil
                        self?.reload()
                    } else {
                        // Lost connection
                        self?.errorMessage = "No internet connection. Please check your network settings."
                        self?.loadOfflineFallback()
                    }
                }
            }
            .store(in: &cancellables)
    }
    
    private func loadOfflineFallback() {
        // Load cached content or offline page
        if let cachedHTML = CacheService.shared.getCachedHomepage() {
            webView?.loadHTMLString(cachedHTML, baseURL: baseURL)
        } else {
            let offlineHTML = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Smiley Brooms - Offline</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; text-align: center; }
                    .container { max-width: 500px; margin: 0 auto; }
                    .logo { width: 120px; height: 120px; margin: 20px auto; background-color: #f0f0f0; border-radius: 60px; display: flex; align-items: center; justify-content: center; }
                    h1 { color: #333; }
                    p { color: #666; line-height: 1.5; }
                    button { background-color: #0071e3; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; }
                    button:hover { background-color: #0077ED; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0071e3" stroke-width="2"/>
                            <path d="M8 13L10 15L16 9" stroke="#0071e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h1>You're offline</h1>
                    <p>It looks like you're not connected to the internet. Please check your connection and try again.</p>
                    <p>You can still view your upcoming bookings and create new bookings that will sync when you're back online.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                </div>
            </body>
            </html>
            """
            webView?.loadHTMLString(offlineHTML, baseURL: baseURL)
        }
    }
    
    private func setupInjectedScript() -> String {
        // This script will be injected into the webpage to customize it for the app
        return """
        // Add custom CSS
        var style = document.createElement('style');
        style.innerHTML = `
            /* Hide website elements that don't make sense in the app */
            .mobile-nav, 
            .site-footer, 
            .download-app-section { 
                display: none !important; 
            }
            
            /* Add padding for native app UI */
            body { 
                padding-top: 0; 
            }
            
            /* Show app-specific content */
            .app-specific-content { 
                display: block !important; 
            }
            
            /* Adjust responsive design for app */
            @media (max-width: 768px) {
                .container {
                    padding-left: 16px;
                    padding-right: 16px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Intercept form submissions to handle in native app
        document.addEventListener('DOMContentLoaded', function() {
            // Find booking forms
            var bookingForms = document.querySelectorAll('form[data-form-type="booking"]');
            bookingForms.forEach(function(form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Collect form data
                    var formData = new FormData(form);
                    var bookingData = {};
                    formData.forEach(function(value, key) {
                        bookingData[key] = value;
                    });
                    
                    // Send message to native app
                    window.webkit.messageHandlers.bookingFormSubmitted.postMessage(bookingData);
                });
            });
            
            // Find login forms
            var loginForms = document.querySelectorAll('form[data-form-type="login"]');
            loginForms.forEach(function(form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Collect form data
                    var formData = new FormData(form);
                    var loginData = {};
                    formData.forEach(function(value, key) {
                        loginData[key] = value;
                    });
                    
                    // Send message to native app
                    window.webkit.messageHandlers.loginFormSubmitted.postMessage(loginData);
                });
            });
            
            // Add native app integration buttons
            var bookingButtons = document.querySelectorAll('.booking-button');
            bookingButtons.forEach(function(button) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    var serviceType = button.getAttribute('data-service-type');
                    window.webkit.messageHandlers.openNativeBooking.postMessage({
                        serviceType: serviceType
                    });
                });
            });
        });
        
        // Function to notify app when page is fully loaded
        window.addEventListener('load', function() {
            window.webkit.messageHandlers.pageLoaded.postMessage({
                title: document.title,
                url: window.location.href
            });
        });
        """
    }
    
    private func createAuthCookie() -> HTTPCookie? {
        // Create authentication cookie if user is logged in
        guard let token = KeychainManager.shared.getAuthToken() else {
            return nil
        }
        
        let cookieProperties: [HTTPCookiePropertyKey: Any] = [
            .domain: "smileybrooms.com",
            .path: "/",
            .name: "auth_token",
            .value: token,
            .secure: true,
            .expires: Date().addingTimeInterval(86400) // 24 hours
        ]
        
        return HTTPCookie(properties: cookieProperties)
    }
}

// MARK: - WKNavigationDelegate
extension WebViewService: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        isLoading = true
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        isLoading = false
        canGoBack = webView.canGoBack
        canGoForward = webView.canGoForward
        currentURL = webView.url
        
        // Cache the page for offline use if it's the homepage
        if webView.url?.path == "/" || webView.url?.path == "/index.html" {
            webView.evaluateJavaScript("document.documentElement.outerHTML") { result, error in
                if let html = result as? String {
                    CacheService.shared.cacheHomepage(html: html)
                }
            }
        }
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        isLoading = false
        handleNavigationError(error)
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        isLoading = false
        handleNavigationError(error)
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Handle external links
        if let url = navigationAction.request.url {
            // If it's an external link, open in default browser
            if !url.host?.contains("smileybrooms.com") ?? true && navigationAction.targetFrame == nil {
                NSWorkspace.shared.open(url)
                decisionHandler(.cancel)
                return
            }
            
            // Handle special app URLs
            if url.scheme == "smileybrooms" {
                handleAppURL(url)
                decisionHandler(.cancel)
                return
            }
        }
        
        decisionHandler(.allow)
    }
    
    private func handleNavigationError(_ error: Error) {
        let nsError = error as NSError
        
        // Don't show error for cancelled requests
        if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
            return
        }
        
        // Check if it's a connectivity issue
        if nsError.domain == NSURLErrorDomain && 
           (nsError.code == NSURLErrorNotConnectedToInternet || 
            nsError.code == NSURLErrorNetworkConnectionLost) {
            isConnected = false
            errorMessage = "No internet connection. Please check your network settings."
            loadOfflineFallback()
        } else {
            errorMessage = "Failed to load page: \(error.localizedDescription)"
        }
    }
    
    private func handleAppURL(_ url: URL) {
        // Handle custom URL scheme for deep linking
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true) else {
            return
        }
        
        switch components.host {
        case "booking":
            // Extract service type from path or query parameters
            let serviceType = components.queryItems?.first(where: { $0.name == "type" })?.value ?? "regular"
            NotificationCenter.default.post(name: .openBooking, object: nil, userInfo: ["serviceType": serviceType])
            
        case "profile":
            NotificationCenter.default.post(name: .openProfile, object: nil)
            
        case "services":
            let serviceId = components.queryItems?.first(where: { $0.name == "id" })?.value
            NotificationCenter.default.post(name: .openServices, object: nil, userInfo: ["serviceId": serviceId as Any])
            
        default:
            break
        }
    }
}

// MARK: - WKUIDelegate
extension WebViewService: WKUIDelegate {
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        // Handle target="_blank" links
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
    
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = NSAlert()
        alert.messageText = "Alert"
        alert.informativeText = message
        alert.addButton(withTitle: "OK")
        alert.runModal()
        completionHandler()
    }
    
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = NSAlert()
        alert.messageText = "Confirm"
        alert.informativeText = message
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")
        let response = alert.runModal()
        completionHandler(response == .alertFirstButtonReturn)
    }
}

// MARK: - Notification Names
extension Notification.Name {
    static let openBooking = Notification.Name("openBooking")
    static let openProfile = Notification.Name("openProfile")
    static let openServices = Notification.Name("openServices")
}
