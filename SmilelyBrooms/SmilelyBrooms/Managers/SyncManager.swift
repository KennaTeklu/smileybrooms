import Foundation
import Combine

class SyncManager: ObservableObject {
    @Published var isSyncing: Bool = false
    @Published var lastSyncDate: Date?
    @Published var syncStatus: SyncStatus = .idle
    @Published var offlineChanges: Int = 0
    
    private var cancellables = Set<AnyCancellable>()
    private let syncQueue = DispatchQueue(label: "com.smileybrooms.syncQueue", qos: .utility)
    
    enum SyncStatus {
        case idle
        case syncing
        case success
        case error(String)
        
        var description: String {
            switch self {
            case .idle:
                return "Idle"
            case .syncing:
                return "Syncing..."
            case .success:
                return "Sync completed"
            case .error(let message):
                return "Error: \(message)"
            }
        }
    }
    
    init() {
        loadLastSyncDate()
        setupPeriodicSync()
        countOfflineChanges()
    }
    
    func startInitialSync() {
        // Check if we need to sync on app launch
        if shouldSyncOnLaunch() {
            syncData()
        }
    }
    
    func syncData() {
        guard !isSyncing else { return }
        
        isSyncing = true
        syncStatus = .syncing
        
        // In a real app, this would sync with a server
        syncQueue.asyncAfter(deadline: .now() + 2) {
            // Simulate sync process
            let success = Bool.random()
            
            DispatchQueue.main.async {
                if success {
                    self.lastSyncDate = Date()
                    self.saveLastSyncDate()
                    self.syncStatus = .success
                    self.offlineChanges = 0
                } else {
                    self.syncStatus = .error("Network error")
                }
                self.isSyncing = false
            }
        }
    }
    
    func shouldSyncOnLaunch() -> Bool {
        guard let lastSync = lastSyncDate else {
            return true // First launch, should sync
        }
        
        // Sync if it's been more than 1 hour
        return Date().timeIntervalSince(lastSync) > 3600
    }
    
    private func setupPeriodicSync() {
        // Set up timer for periodic sync
        Timer.publish(every: 3600, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.syncData()
            }
            .store(in: &cancellables)
    }
    
    private func loadLastSyncDate() {
        if let timestamp = UserDefaults.standard.double(forKey: "lastSyncTimestamp"),
           timestamp > 0 {
            lastSyncDate = Date(timeIntervalSince1970: timestamp)
        }
    }
    
    private func saveLastSyncDate() {
        if let date = lastSyncDate {
            UserDefaults.standard.set(date.timeIntervalSince1970, forKey: "lastSyncTimestamp")
        }
    }
    
    private func countOfflineChanges() {
        // In a real app, this would count pending changes in the local database
        offlineChanges = Int.random(in: 0...5)
    }
    
    func clearOfflineData() {
        // Clear cached data
        // In a real app, this would clear the local database
        offlineChanges = 0
    }
}
