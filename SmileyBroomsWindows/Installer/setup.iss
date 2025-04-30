; Inno Setup Script for SmileyBrooms Windows Application
; This creates a signed, professional installer that reduces Windows Defender warnings

#define MyAppName "Smiley Brooms"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Smiley Brooms Cleaning Services"
#define MyAppURL "https://www.smileybrooms.com/"
#define MyAppExeName "SmileyBroomsWindows.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
AppId={{A28B5D24-7A12-4F3F-8B1A-C4E84F5B2D7C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=Output
OutputBaseFilename=SmileyBrooms_Setup
SetupIconFile=..\Assets\app_icon.ico
Compression=lzma
SolidCompression=yes
; Sign the installer - this requires a valid code signing certificate
SignTool=signtool sign /f "$qcertificate.pfx$q" /p "password" /tr "http://timestamp.digicert.com" /td sha256 /fd sha256 $f
; Request admin privileges for installation
PrivilegesRequired=admin
; Windows 10 and 11 compatibility
MinVersion=10.0.17763
; Add metadata to help with Windows SmartScreen
AppCopyright=Copyright © 2023 {#MyAppPublisher}
VersionInfoCompany={#MyAppPublisher}
VersionInfoCopyright=Copyright © 2023 {#MyAppPublisher}
VersionInfoDescription={#MyAppName} Installer
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}
UninstallDisplayIcon={app}\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
Source: "..\bin\Release\net6.0-windows\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion signonce
Source: "..\bin\Release\net6.0-windows\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; Add additional files as needed

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
// Add custom code for checking .NET Framework, etc.
function IsDotNetDetected(): boolean;
var
    success: boolean;
    install: cardinal;
    release: cardinal;
    key: string;
begin
    // Check for .NET 6.0
    key := 'SOFTWARE\Microsoft\NET Core\Setup\InstalledVersions\x64\sharedhost';
    success := RegQueryDWordValue(HKLM, key, 'Version', release);
    if success then begin
        Result := true;
    end else begin
        Result := false;
    end;
end;

procedure InitializeWizard;
begin
    if not IsDotNetDetected() then begin
        MsgBox('.NET 6.0 Runtime is required to run this application. Please install it from https://dotnet.microsoft.com/download/dotnet/6.0', mbInformation, MB_OK);
    end;
end;
