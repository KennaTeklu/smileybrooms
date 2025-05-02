using System;

namespace SmileyBroomsWindows.Models
{
    public class UpdateInfo
    {
        public string Version { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public string ReleaseNotes { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public bool IsMandatory { get; set; }
        public long FileSize { get; set; }
        public string Checksum { get; set; } = string.Empty;
    }
}
