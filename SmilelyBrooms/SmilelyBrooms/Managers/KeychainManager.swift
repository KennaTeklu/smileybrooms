import Foundation
import Security

class KeychainManager {
    static let shared = KeychainManager()
    
    private init() {}
    
    func saveUserData(_ userData: UserProfile) -> Bool {
        guard let data = try? JSONEncoder().encode(userData) else {
            return false
        }
        
        return saveData(data, forKey: "userData")
    }
    
    func loadUserData() -> UserProfile? {
        guard let data = loadData(forKey: "userData") else {
            return nil
        }
        
        return try? JSONDecoder().decode(UserProfile.self, from: data)
    }
    
    func saveToken(_ token: String) -> Bool {
        guard let data = token.data(using: .utf8) else {
            return false
        }
        
        return saveData(data, forKey: "authToken")
    }
    
    func loadToken() -> String? {
        guard let data = loadData(forKey: "authToken") else {
            return nil
        }
        
        return String(data: data, encoding: .utf8)
    }
    
    func clearUserData() {
        deleteData(forKey: "userData")
        deleteData(forKey: "authToken")
    }
    
    // MARK: - Private Methods
    
    private func saveData(_ data: Data, forKey key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlocked
        ]
        
        // Delete any existing data
        SecItemDelete(query as CFDictionary)
        
        // Add the new data
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    private func loadData(forKey key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        return status == errSecSuccess ? result as? Data : nil
    }
    
    private func deleteData(forKey key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        
        SecItemDelete(query as CFDictionary)
    }
}
