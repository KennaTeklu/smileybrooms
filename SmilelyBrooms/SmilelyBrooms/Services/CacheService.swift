import Foundation

class CacheService {
    static let shared = CacheService()
    
    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    
    private init() {
        // Get the cache directory
        let urls = fileManager.urls(for: .cachesDirectory, in: .userDomainMask)
        cacheDirectory = urls[0].appendingPathComponent("WebCache")
        
        // Create cache directory if it doesn't exist
        if !fileManager.fileExists(atPath: cacheDirectory.path) {
            do {
                try fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
            } catch {
                print("Error creating cache directory: \(error)")
            }
        }
    }
    
    func cacheHomepage(html: String) {
        let fileURL = cacheDirectory.appendingPathComponent("homepage.html")
        
        do {
            try html.write(to: fileURL, atomically: true, encoding: .utf8)
        } catch {
            print("Error caching homepage: \(error)")
        }
    }
    
    func getCachedHomepage() -> String? {
        let fileURL = cacheDirectory.appendingPathComponent("homepage.html")
        
        if fileManager.fileExists(atPath: fileURL.path) {
            do {
                return try String(contentsOf: fileURL, encoding: .utf8)
            } catch {
                print("Error reading cached homepage: \(error)")
                return nil
            }
        }
        
        return nil
    }
    
    func clearCache() {
        do {
            let contents = try fileManager.contentsOfDirectory(at: cacheDirectory, includingPropertiesForKeys: nil)
            for fileURL in contents {
                try fileManager.removeItem(at: fileURL)
            }
        } catch {
            print("Error clearing cache: \(error)")
        }
    }
}
