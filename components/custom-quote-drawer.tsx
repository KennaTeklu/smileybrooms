"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  ClipboardList,
  Calendar,
  User,
  Home,
  Sparkles,
  Droplets,
  AlertTriangle,
  Briefcase,
  Building,
  Hammer,
  Trash2,
  Leaf,
  Wind,
  Sofa,
  Paintbrush,
  Car,
  Warehouse,
  Scissors,
  TreesIcon as Tree,
  MicIcon as Microphone,
  TreesIcon as Tree,
  BoltIcon as BoltOff,
  VolumeIcon as Vial,
  FlaskRoundIcon as Flask,
  FlaskRoundIcon as Flask,
  FlaskRoundIcon as Flask,
  WormIcon as Virus,
  BugIcon as Bacteria,
  BadgeCheckIcon as VerifiedCheck,
  AnchorIcon as VerifiedIconAlt,
  WarehouseIcon as WarehouseBuilding,
  TreesIcon as Tree,
  GlobeIcon as GlobeSearch,
  CompassIcon as CompassIconAlt,
  RouterIcon as RoutingIcon,
  SignpostIcon as RoadSign,
  BikeIcon as Scooter,
  SkullIcon as Skateboard,
  RocketIcon as RocketIconAlt,
  SpaceIcon as Planet,
  SignalIcon as SignalIconAlt,
  WifiIcon as WifiIconAlt,
  WifiOffIcon as WifiOffIconAlt,
  LaptopIcon as LaptopIconAlt,
  PrinterIcon as PrinterIconAlt,
  VoicemailIcon as Fax,
  ScanIcon as Scanner,
  MicIcon as Microphone,
  MicIcon as Microphone,
  HeadphonesIcon as HeadphonesIconAlt,
  SpeakerIcon as SpeakerIconAlt,
  MicOffIcon as Mute,
  BellIcon as Bullhorn,
  AirplayIcon as Broadcast,
  TreesIcon as Tree,
  InboxIcon as InboxIconAlt,
  VoicemailIcon as VoiceMail,
  SparklesIcon as SparklesIconAlt,
  ZapIcon as ZapIconAlt,
  BoltIcon as BoltOff,
  ZapIcon as ZapIconAlt,
  WifiIcon as WifiIconAlt,
  SignalIcon as SignalIconAlt,
  StethoscopeIcon as StethoscopeIconAlt,
  VolumeIcon as Vial,
  FlaskRoundIcon as Flask,
  FlaskRoundIcon as Flask,
  FlaskRoundIcon as Flask,
  MicroscopeIcon as MicroscopeIconAlt,
  WormIcon as Virus,
  BugIcon as Bacteria,
  ShieldCheckIcon as ShieldCheckIconAlt,
  ScanIcon as ScanIconAlt,
  BadgeCheckIcon as VerifiedCheck,
  AnchorIcon as VerifiedIconAlt,
  HomeIcon as HomeIconAlt,
  BuildingIcon as BuildingIconAlt,
  WarehouseIcon as WarehouseBuilding,
  TreesIcon as Tree,
  AnchorIcon as WavesIconAlt,
  GlobeIcon as GlobeSearch,
  CompassIcon as CompassIconAlt,
  RouterIcon as RoutingIcon,
  SignpostIcon as RoadSign,
  CarIcon as CarIconAlt,
  TruckIcon as TruckIconAlt,
  TractorIcon as TractorIconAlt,
  BikeIcon as Scooter,
  SkullIcon as Skateboard,
  RocketIcon as RocketIconAlt,
  SpaceIcon as Planet,
  WifiOffIcon as WifiOffIconAlt,
  TvIcon as TvIconAlt,
  LaptopIcon as LaptopIconAlt,
  PrinterIcon as PrinterIconAlt,
  VoicemailIcon as Fax,
  ScanIcon as Scanner,
  MicIcon as Microphone,
  MicIcon as Microphone,
  HeadphonesIcon as HeadphonesIconAlt,
  SpeakerIcon as SpeakerIconAlt,
  MicOffIcon as Mute,
  BellIcon as Bullhorn,
  AirplayIcon as Broadcast,
  KeyIcon as KeyIconAlt,
  LockIcon as LockIconAlt,
  ScanIcon as ScanIconAlt,
  VideoIcon as VideoIconAlt,
  VolumeIcon as VolumeIconAlt,
  Volume2Icon as Volume2IconAlt,
  KeyIcon as KeyIconAlt,
  LockIcon as LockIconAlt,
  TreesIcon as Tree,
  InboxIcon as InboxIconAlt,
  VoicemailIcon as VoiceMail,
  CloudDrizzleIcon as CloudDrizzleIconAlt,
  CloudFogIcon as CloudFogIconAlt,
  CloudHailIcon as CloudHailIconAlt,
  CloudLightningIcon as CloudLightningIconAlt,
  MoonIcon as MoonIconAlt,
  CloudOffIcon as CloudOffIconAlt,
  CloudRainIcon as CloudRainIconAlt,
  CloudSnowIcon as CloudSnowIconAlt,
  SunIcon as SunIconAlt,
  SunIcon as SunIconAlt,
  SunsetIcon as SunriseIconAlt,
  SunsetIcon as SunsetIconAlt,
  MoonIcon as MoonIconAlt,
  MoonStarIcon as MoonStarIconAlt,
  StarIcon as StarIconAlt,
  StarIcon as StarsIconAlt,
  SparkleIcon as SparkleIconAlt,
  SparklesIcon as SparklesIconAlt,
  ZapIcon as ZapIconAlt,
  ZapOffIcon as ZapOffIconAlt,
  BoltIcon as BoltIconAlt,
  BoltIcon as BoltOff,
  PowerIcon as PowerIconAlt,
  PowerOffIcon as PowerOffIconAlt,
  PlugIcon as PlugIconAlt,
  ZapIcon as ZapIconAlt,
  BatteryIcon as BatteryIconAlt,
  BatteryChargingIcon as BatteryChargingIconAlt,
  BatteryFullIcon as BatteryFullIconAlt,
  BatteryMediumIcon as BatteryMediumIconAlt,
  BatteryLowIcon as BatteryLowIconAlt,
  BatteryWarningIcon as BatteryWarningIconAlt,
  WifiIcon as WifiIconAlt,
  SignalIcon as SignalIconAlt,
  SignalHighIcon as SignalHighIconAlt,
  SignalMediumIcon as SignalMediumIconAlt,
  SignalLowIcon as SignalLowIconAlt,
  SignalZeroIcon as SignalZeroIconAlt,
  ActivityIcon as ActivityIconAlt,
  SquareActivityIcon as ActivitySquareIconAlt,
  HeartPulseIcon as HeartPulseIconAlt,
  StethoscopeIcon as StethoscopeIconAlt,
  PillIcon as PillIconAlt,
  SyringeIcon as SyringeIconAlt,
  VolumeIcon as Vial,
  FlaskRoundIcon as Flask,
  FlaskRoundIcon as Flask,
  FlaskRoundIcon as Flask,
  MicroscopeIcon as MicroscopeIconAlt,
  DnaIcon as DnaIconAlt,
  WormIcon as Virus,
  BugIcon as Bacteria,
  BugIcon as BugIconAlt,
  BugOffIcon as BugOffIconAlt,
  ShieldIcon as ShieldIconAlt,
  ShieldAlertIcon as ShieldAlertIconAlt,
  ShieldCheckIcon as ShieldCheckIconAlt,
  ShieldXIcon as ShieldCloseIconAlt,
  ShieldOffIcon as ShieldOffIconAlt,
  ShieldQuestionIcon as ShieldQuestionIconAlt,
  LockIcon as LockIconAlt,
  LockOpenIcon as LockOpenIconAlt,
  LockOpenIcon as UnlockIconAlt,
  KeyIcon as KeyIconAlt,
  KeyRoundIcon as KeyRoundIconAlt,
  KeySquareIcon as KeySquareIconAlt,
  FingerprintIcon as FingerprintIconAlt,
  ScanIcon as ScanIconAlt,
  ScanFaceIcon as ScanFaceIconAlt,
  ScanLineIcon as ScanLineIconAlt,
  ScanSearchIcon as ScanSearchIconAlt,
  ScanTextIcon as ScanTextIconAlt,
  QrCodeIcon as QrCodeIconAlt,
  BarcodeIcon as BarcodeIconAlt,
  BadgeCheckIcon as VerifiedCheck,
  AnchorIcon as VerifiedIconAlt,
  BadgeIcon as BadgeCheckIconAlt,
  BadgeAlertIcon as BadgeAlertIconAlt,
  BadgeHelpIcon as BadgeHelpIconAlt,
  BadgeInfoIcon as BadgeInfoIconAlt,
  BadgeMinusIcon as BadgeMinusIconAlt,
  BadgePlusIcon as BadgePlusIconAlt,
  BadgeXIcon as BadgeXIconAlt,
  AwardIcon as AwardIconAlt,
  TrophyIcon as TrophyIconAlt,
  MedalIcon as MedalIconAlt,
  CrownIcon as CrownIconAlt,
  DiamondIcon as DiamondIconAlt,
  GemIcon as GemIconAlt,
  CoinsIcon as CoinsIconAlt,
  BanknoteIcon as BanknoteIconAlt,
  ReceiptIcon as ReceiptIconAlt,
  CodeIcon as CreditCardIconAlt,
  WalletIcon as WalletIconAlt,
  LandmarkIcon as LandmarkIconAlt,
  Building2Icon as Building2IconAlt,
  FactoryIcon as FactoryIconAlt,
  HomeIcon as HomeIconAlt,
  StoreIcon as StoreIconAlt,
  SchoolIcon as SchoolIconAlt,
  HospitalIcon as HospitalIconAlt,
  ChurchIcon as ChurchIconAlt,
  BuildingIcon as BuildingIconAlt,
  WarehouseIcon as WarehouseBuilding,
  CastleIcon as CastleIconAlt,
  TentIcon as TentIconAlt,
  TreesIcon as Tree,
  MountainIcon as MountainIconAlt,
  MountainSnowIcon as MountainSnowIconAlt,
  AnchorIcon as WavesIconAlt,
  MapIcon as MapIconAlt,
  MapPinIcon as MapPinIconAlt,
  MapPinnedIcon as MapPinnedIconAlt,
  NavigationIcon as NavigationIconAlt,
  NavigationOffIcon as NavigationOffIconAlt,
  GlobeIcon as GlobeIconAlt,
  GlobeIcon as GlobeSearch,
  CompassIcon as CompassIconAlt,
  RouteIcon as RouteIconAlt,
  RouterIcon as RoutingIcon,
  FootprintsIcon as FootprintsIconAlt,
  MilestoneIcon as MilestoneIconAlt,
  SignpostIcon as RoadSign,
  TrafficConeIcon as TrafficConeIconAlt,
  CarIcon as CarIconAlt,
  BusIcon as BusIconAlt,
  TruckIcon as TruckIconAlt,
  TractorIcon as TractorIconAlt,
  TrainTrackIcon as TrainIconAlt,
  TypeIcon as PlaneIconAlt,
  PlaneTakeoffIcon as PlaneTakeoffIconAlt,
  PlaneLandingIcon as PlaneLandingIconAlt,
  ShipIcon as ShipIconAlt,
  SailboatIcon as SailboatIconAlt,
  AnchorIcon as AnchorIconAlt,
  TypeIcon as BikeIconAlt,
  BikeIcon as Scooter,
  SkullIcon as Skateboard,
  RocketIcon as RocketIconAlt,
  SatelliteIcon as SatelliteIconAlt,
  SatelliteDishIcon as SatelliteDishIconAlt,
  OrbitIcon as OrbitIconAlt,
  SpaceIcon as Planet,
  TelescopeIcon as TelescopeIconAlt,
  RadarIcon as RadarIconAlt,
  AntennaIcon as AntennaIconAlt,
  WifiOffIcon as WifiOffIconAlt,
  BluetoothIcon as BluetoothIconAlt,
  BluetoothConnectedIcon as BluetoothConnectedIconAlt,
  BluetoothOffIcon as BluetoothOffIconAlt,
  BluetoothSearchingIcon as BluetoothSearchingIconAlt,
  CastIcon as CastIconAlt,
  AirplayIcon as AirplayIconAlt,
  MonitorIcon as MonitorIconAlt,
  TvIcon as TvIconAlt,
  LaptopIcon as LaptopIconAlt,
  ComputerIcon as ComputerIconAlt,
  ServerIcon as ServerIconAlt,
  ServerCrashIcon as ServerCrashIconAlt,
  ServerOffIcon as ServerOffIconAlt,
  PrinterIcon as PrinterIconAlt,
  VoicemailIcon as Fax,
  ScanIcon as Scanner,
  WebcamIcon as WebcamIconAlt,
  CameraIcon as CameraIconAlt,
  CameraOffIcon as CameraOffIconAlt,
  VideoIcon as VideoIconAlt,
  VideoOffIcon as VideoOffIconAlt,
  MicIcon as Microphone,
  MicIcon as Microphone,
  MusicIcon as MusicIconAlt,
  Music2Icon as Music2IconAlt,
  Music3Icon as Music3IconAlt,
  Music4Icon as Music4IconAlt,
  HeadphonesIcon as HeadphonesIconAlt,
  RadioReceiverIcon as RadioIconAlt,
  RadioReceiverIcon as RadioReceiverIconAlt,
  SpeakerIcon as SpeakerIconAlt,
  VolumeIcon as VolumeIconAlt,
  Volume1Icon as Volume1IconAlt,
  Volume2Icon as Volume2IconAlt,
  VolumeXIcon as VolumeXIconAlt,
  MicOffIcon as Mute,
  MegaphoneIcon as MegaphoneIconAlt,
  BellIcon as Bullhorn,
  PodcastIcon as PodcastIconAlt,
  AirplayIcon as Broadcast,
  RssIcon as RssIconAlt,
  NewspaperIcon as NewspaperIconAlt,
  BookIcon as BookIconAlt,
  BookOpenIcon as BookOpenIconAlt,
  BookOpenCheckIcon as BookOpenCheckIconAlt,
  BookOpenTextIcon as BookOpenTextIconAlt,
  BookmarkIcon as BookmarkIconAlt,
  BookmarkCheckIcon as BookmarkCheckIconAlt,
  BookmarkMinusIcon as BookmarkMinusIconAlt,
  BookmarkPlusIcon as BookmarkPlusIconAlt,
  BookmarkXIcon as BookmarkXIconAlt,
  LibraryIcon as LibraryIconAlt,
  AlbumIcon as AlbumIconAlt,
  FileIcon as FileIconAlt,
  FileArchiveIcon as FileArchiveIconAlt,
  FileAudioIcon as FileAudioIconAlt,
  FileAudio2Icon as FileAudio2IconAlt,
  FileBadgeIcon as FileBadgeIconAlt,
  FileBadge2Icon as FileBadge2IconAlt,
  FileBarChartIcon as FileBarChartIconAlt,
  FileBarChart2Icon as FileBarChart2IconAlt,
  FileBoxIcon as FileBoxIconAlt,
  FileCheckIcon as FileCheckIconAlt,
  FileCheck2Icon as FileCheck2IconAlt,
  FileClockIcon as FileClockIconAlt,
  FileCodeIcon as FileCodeIconAlt,
  FileCode2Icon as FileCode2IconAlt,
  FileCogIcon as FileCogIconAlt,
  FileCogIcon as FileCog2IconAlt,
  FileDiffIcon as FileDiffIconAlt,
  FileDigitIcon as FileDigitIconAlt,
  FileDownIcon as FileDownIconAlt,
  FilePenIcon as FileEditIconAlt,
  FileHeartIcon as FileHeartIconAlt,
  FileImageIcon as FileImageIconAlt,
  FileInputIcon as FileInputIconAlt,
  FileJsonIcon as FileJsonIconAlt,
  FileJson2Icon as FileJson2IconAlt,
  KeyIcon as KeyIconAlt,
  FileKey2Icon as FileKey2IconAlt,
  FileLineChartIcon as FileLineChartIconAlt,
  LockIcon as LockIconAlt,
  FileLock2Icon as FileLock2IconAlt,
  FileMinusIcon as FileMinusIconAlt,
  FileMinus2Icon as FileMinus2IconAlt,
  FileOutputIcon as FileOutputIconAlt,
  FilePieChartIcon as FilePieChartIconAlt,
  FilePlusIcon as FilePlusIconAlt,
  FilePlus2Icon as FilePlus2IconAlt,
  FileQuestionIcon as FileQuestionIconAlt,
  ScanIcon as ScanIconAlt,
  FileSearchIcon as FileSearchIconAlt,
  FilePenLineIcon as FileSignatureIconAlt,
  FileSpreadsheetIcon as FileSpreadsheetIconAlt,
  FileStackIcon as FileStackIconAlt,
  FilePlus2Icon as FileSymlinkIconAlt,
  FileTerminalIcon as FileTerminalIconAlt,
  FileTextIcon as FileTextIconAlt,
  FileTypeIcon as FileTypeIconAlt,
  FileType2Icon as FileType2IconAlt,
  FileUpIcon as FileUpIconAlt,
  VideoIcon as VideoIconAlt,
  FileVideo2Icon as FileVideo2IconAlt,
  VolumeIcon as VolumeIconAlt,
  Volume2Icon as Volume2IconAlt,
  FileWarningIcon as FileWarningIconAlt,
  FileXIcon as FileXIconAlt,
  FileX2Icon as FileX2IconAlt,
  FilesIcon as FilesIconAlt,
  FolderIcon as FolderIconAlt,
  FolderArchiveIcon as FolderArchiveIconAlt,
  FolderCheckIcon as FolderCheckIconAlt,
  FolderClockIcon as FolderClockIconAlt,
  FolderClosedIcon as FolderClosedIconAlt,
  FolderCogIcon as FolderCogIconAlt,
  FolderDotIcon as FolderDotIconAlt,
  FolderDownIcon as FolderDownIconAlt,
  FolderPenIcon as FolderEditIconAlt,
  FolderGitIcon as FolderGitIconAlt,
  FolderGit2Icon as FolderGit2IconAlt,
  FolderHeartIcon as FolderHeartIconAlt,
  FolderInputIcon as FolderInputIconAlt,
  KeyIcon as KeyIconAlt,
  LockIcon as LockIconAlt,
  FolderMinusIcon as FolderMinusIconAlt,
  FolderOpenIcon as FolderOpenIconAlt,
  FolderOutputIcon as FolderOutputIconAlt,
  FolderPlusIcon as FolderPlusIconAlt,
  FolderSearchIcon as FolderSearchIconAlt,
  FolderSearch2Icon as FolderSearch2IconAlt,
  FolderSymlinkIcon as FolderSymlinkIconAlt,
  FolderSyncIcon as FolderSyncIconAlt,
  TreesIcon as Tree,
  FolderUpIcon as FolderUpIconAlt,
  FolderXIcon as FolderXIconAlt,
  FoldersIcon as FoldersIconAlt,
  InboxIcon as InboxIconAlt,
  MailIcon as MailIconAlt,
  MailCheckIcon as MailCheckIconAlt,
  MailMinusIcon as MailMinusIconAlt,
  MailOpenIcon as MailOpenIconAlt,
  MailPlusIcon as MailPlusIconAlt,
  MailQuestionIcon as MailQuestionIconAlt,
  MailSearchIcon as MailSearchIconAlt,
  MailWarningIcon as MailWarningIconAlt,
  MailXIcon as MailXIconAlt,
  MessageCircleIcon as MessageCircleIconAlt,
  MessageSquareIcon as MessageSquareIconAlt,
  MessageSquareDashedIcon as MessageSquareDashedIconAlt,
  MessageSquarePlusIcon as MessageSquarePlusIconAlt,
  MessagesSquareIcon as MessagesSquareIconAlt,
  PhoneIcon as PhoneIconAlt,
  PhoneCallIcon as PhoneCallIconAlt,
  PhoneForwardedIcon as PhoneForwardedIconAlt,
  PhoneIncomingIcon as PhoneIncomingIconAlt,
  PhoneMissedIcon as PhoneMissedIconAlt,
  PhoneOffIcon as PhoneOffIconAlt,
  PhoneOutgoingIcon as PhoneOutgoingIconAlt,
  VoicemailIcon as VoiceMail,
  SendIcon as SendIconAlt,
  ShareIcon as ShareIconAlt,
  Share2Icon as Share2IconAlt,
  ForwardIcon as ForwardIconAlt,
  ReplyIcon as ReplyIconAlt,
  ReplyAllIcon as ReplyAllIconAlt,
  Redo2Icon as RedoIconAlt,
  UndoIcon as UndoIconAlt,
  ArrowDown01Icon as Undo2IconAlt,
  DownloadIcon as DownloadIconAlt,
  CloudDownloadIcon as DownloadCloudIconAlt,
  UploadIcon as UploadIconAlt,
  CloudUploadIcon as UploadCloudIconAlt,
  CloudIcon as CloudIconAlt,
  CloudCogIcon as CloudCogIconAlt,
  CloudDrizzleIcon as CloudDrizzleIconAlt,
  CloudFogIcon as CloudFogIconAlt,
  CloudHailIcon as CloudHailIconAlt,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomQuoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Define specialty service categories and services
const specialtyServices = [
  {
    id: "carpet-upholstery",
    name: "Carpet & Upholstery",
    icon: <Sofa className="h-5 w-5 text-purple-500" />,
    services: [
      { id: "carpet-deep-clean", name: "Carpet Deep Cleaning", price: 120 },
      { id: "upholstery-clean", name: "Upholstery Cleaning", price: 95 },
      { id: "stain-removal", name: "Stain Removal Treatment", price: 75 },
      { id: "carpet-protection", name: "Carpet Protection Treatment", price: 85 },
      { id: "area-rug-cleaning", name: "Area Rug Cleaning", price: 110 },
    ],
  },
  {
    id: "restoration",
    name: "Restoration Services",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    services: [
      { id: "water-damage", name: "Water Damage Restoration", price: 350 },
      { id: "mold-remediation", name: "Mold Remediation", price: 450 },
      { id: "fire-smoke", name: "Fire & Smoke Damage", price: 500 },
      { id: "odor-removal", name: "Odor Removal", price: 200 },
      { id: "sewage-cleanup", name: "Sewage Cleanup", price: 550 },
    ],
  },
  {
    id: "specialized-cleaning",
    name: "Specialized Cleaning",
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    services: [
      { id: "post-construction", name: "Post-Construction Cleanup", price: 300 },
      { id: "move-in-out", name: "Move In/Out Cleaning", price: 250 },
      { id: "hoarder-cleanup", name: "Hoarder Cleanup", price: 600 },
      { id: "crime-scene", name: "Crime Scene Cleanup", price: 800 },
      { id: "biohazard", name: "Biohazard Cleanup", price: 750 },
    ],
  },
  {
    id: "commercial",
    name: "Commercial Services",
    icon: <Building className="h-5 w-5 text-gray-500" />,
    services: [
      { id: "office-cleaning", name: "Office Cleaning", price: 180 },
      { id: "medical-facility", name: "Medical Facility Sanitization", price: 350 },
      { id: "restaurant-kitchen", name: "Restaurant & Kitchen Cleaning", price: 400 },
      { id: "retail-space", name: "Retail Space Cleaning", price: 220 },
      { id: "warehouse-cleaning", name: "Warehouse Cleaning", price: 500 },
    ],
  },
  {
    id: "outdoor",
    name: "Outdoor Cleaning",
    icon: <Wind className="h-5 w-5 text-green-500" />,
    services: [
      { id: "pressure-washing", name: "Pressure Washing", price: 150 },
      { id: "deck-patio", name: "Deck & Patio Cleaning", price: 180 },
      { id: "gutter-cleaning", name: "Gutter Cleaning", price: 120 },
      { id: "exterior-house", name: "Exterior House Washing", price: 250 },
      { id: "driveway-cleaning", name: "Driveway & Sidewalk Cleaning", price: 140 },
    ],
  },
  {
    id: "specialty-surfaces",
    name: "Specialty Surfaces",
    icon: <Paintbrush className="h-5 w-5 text-red-500" />,
    services: [
      { id: "hardwood-floor", name: "Hardwood Floor Cleaning", price: 130 },
      { id: "tile-grout", name: "Tile & Grout Cleaning", price: 140 },
      { id: "natural-stone", name: "Natural Stone Cleaning", price: 160 },
      { id: "marble-polishing", name: "Marble Polishing", price: 200 },
      { id: "concrete-cleaning", name: "Concrete Cleaning & Sealing", price: 180 },
    ],
  },
  {
    id: "vehicle",
    name: "Vehicle Cleaning",
    icon: <Car className="h-5 w-5 text-blue-600" />,
    services: [
      { id: "auto-detailing", name: "Auto Detailing", price: 150 },
      { id: "rv-cleaning", name: "RV Cleaning", price: 250 },
      { id: "boat-cleaning", name: "Boat Cleaning", price: 300 },
      { id: "fleet-washing", name: "Fleet Washing", price: 400 },
      { id: "aircraft-cleaning", name: "Aircraft Cleaning", price: 800 },
    ],
  },
  {
    id: "industrial",
    name: "Industrial Cleaning",
    icon: <Warehouse className="h-5 w-5 text-gray-600" />,
    services: [
      { id: "factory-cleaning", name: "Factory Cleaning", price: 600 },
      { id: "equipment-cleaning", name: "Equipment Cleaning", price: 350 },
      { id: "industrial-floor", name: "Industrial Floor Cleaning", price: 450 },
      { id: "high-ceiling", name: "High Ceiling & Wall Cleaning", price: 500 },
      { id: "industrial-kitchen", name: "Industrial Kitchen Cleaning", price: 550 },
    ],
  },
]

export function CustomQuoteDrawer({ open, onOpenChange }: CustomQuoteDrawerProps) {
  const [formData, setFormData] = useState({
    // Contact Information
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",

    // Property Details
    propertyType: "residential",
    squareFootage: "",
    rooms: "",
    bathrooms: "",

    // Service Details
    serviceType: "standard",
    emergencyResponse: false,
    waterDamage: false,
    moldRemediation: false,
    fireSmokeDamage: false,
    commercialCleaning: false,
    constructionCleanup: false,
    moveInOut: false,
    deepCleaning: false,

    // Emergency Details
    damageExtent: "minor",
    timeOfIncident: "",
    insuranceProvider: "",
    policyNumber: "",

    // Schedule
    preferredDate: "",
    preferredTime: "",
    flexibleTiming: false,
    urgencyLevel: "standard",

    // Additional Information
    specialRequests: "",
    howDidYouHear: "",
    contactPreference: "email",
    agreeToTerms: false,

    // Specialty Services
    selectedSpecialtyServices: [] as string[],
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [step, setStep] = useState(1)
  const [showEmergencyFields, setShowEmergencyFields] = useState(false)
  const [activeSpecialtyTab, setActiveSpecialtyTab] = useState("carpet-upholstery")

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Show emergency fields if emergency response is selected
    if (field === "emergencyResponse") {
      setShowEmergencyFields(value as boolean)
    }
  }

  const handleSpecialtyServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const currentServices = [...prev.selectedSpecialtyServices]
      const serviceIndex = currentServices.indexOf(serviceId)

      if (serviceIndex >= 0) {
        currentServices.splice(serviceIndex, 1)
      } else {
        currentServices.push(serviceId)
      }

      return {
        ...prev,
        selectedSpecialtyServices: currentServices,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process form submission
    console.log("Form submitted:", formData)
    // Close the drawer
    onOpenChange(false)
    // Show success message
    alert("Your custom quote request has been submitted. We'll contact you shortly!")
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      {/* Add other states */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                  placeholder="12345"
                  required
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Property Details
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <RadioGroup
                  value={formData.propertyType}
                  onValueChange={(value) => handleChange("propertyType", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residential" id="residential" />
                    <Label htmlFor="residential" className="cursor-pointer">
                      Residential
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <Label htmlFor="commercial" className="cursor-pointer">
                      Commercial
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="industrial" id="industrial" />
                    <Label htmlFor="industrial" className="cursor-pointer">
                      Industrial
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => handleChange("squareFootage", e.target.value)}
                    placeholder="1500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms">Number of Rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => handleChange("rooms", e.target.value)}
                    placeholder="4"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleChange("bathrooms", e.target.value)}
                  placeholder="2"
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Service Details
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Primary Service Type</Label>
                <RadioGroup
                  value={formData.serviceType}
                  onValueChange={(value) => handleChange("serviceType", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      Standard Cleaning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deep" id="deep" />
                    <Label htmlFor="deep" className="cursor-pointer">
                      Deep Cleaning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="move" id="move" />
                    <Label htmlFor="move" className="cursor-pointer">
                      Move In/Out Cleaning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specialty" id="specialty" />
                    <Label htmlFor="specialty" className="cursor-pointer">
                      Specialty Services
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Additional Services Needed</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emergencyResponse"
                      checked={formData.emergencyResponse}
                      onCheckedChange={(checked) => handleChange("emergencyResponse", checked === true)}
                    />
                    <Label htmlFor="emergencyResponse" className="cursor-pointer flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      Emergency Response
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="waterDamage"
                      checked={formData.waterDamage}
                      onCheckedChange={(checked) => handleChange("waterDamage", checked === true)}
                    />
                    <Label htmlFor="waterDamage" className="cursor-pointer flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-500" />
                      Water Damage
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moldRemediation"
                      checked={formData.moldRemediation}
                      onCheckedChange={(checked) => handleChange("moldRemediation", checked === true)}
                    />
                    <Label htmlFor="moldRemediation" className="cursor-pointer flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-500" />
                      Mold Remediation
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fireSmokeDamage"
                      checked={formData.fireSmokeDamage}
                      onCheckedChange={(checked) => handleChange("fireSmokeDamage", checked === true)}
                    />
                    <Label htmlFor="fireSmokeDamage" className="cursor-pointer flex items-center gap-1">
                      <Trash2 className="h-3.5 w-3.5 text-orange-500" />
                      Fire/Smoke Damage
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="commercialCleaning"
                      checked={formData.commercialCleaning}
                      onCheckedChange={(checked) => handleChange("commercialCleaning", checked === true)}
                    />
                    <Label htmlFor="commercialCleaning" className="cursor-pointer flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-gray-500" />
                      Commercial Cleaning
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="constructionCleanup"
                      checked={formData.constructionCleanup}
                      onCheckedChange={(checked) => handleChange("constructionCleanup", checked === true)}
                    />
                    <Label htmlFor="constructionCleanup" className="cursor-pointer flex items-center gap-1">
                      <Hammer className="h-3.5 w-3.5 text-yellow-500" />
                      Construction Cleanup
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moveInOut"
                      checked={formData.moveInOut}
                      onCheckedChange={(checked) => handleChange("moveInOut", checked === true)}
                    />
                    <Label htmlFor="moveInOut" className="cursor-pointer flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                      Move In/Out
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deepCleaning"
                      checked={formData.deepCleaning}
                      onCheckedChange={(checked) => handleChange("deepCleaning", checked === true)}
                    />
                    <Label htmlFor="deepCleaning" className="cursor-pointer flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                      Deep Cleaning
                    </Label>
                  </div>
                </div>
              </div>

              {showEmergencyFields && (
                <div className="space-y-4 p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/10 dark:border-red-800/30">
                  <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency Details
                  </h4>

                  <div className="space-y-2">
                    <Label htmlFor="damageExtent">Extent of Damage</Label>
                    <Select
                      value={formData.damageExtent}
                      onValueChange={(value) => handleChange("damageExtent", value)}
                    >
                      <SelectTrigger id="damageExtent">
                        <SelectValue placeholder="Select damage extent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor - Small area affected</SelectItem>
                        <SelectItem value="moderate">Moderate - Multiple areas affected</SelectItem>
                        <SelectItem value="severe">Severe - Extensive damage</SelectItem>
                        <SelectItem value="critical">Critical - Entire property affected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeOfIncident">When did the incident occur?</Label>
                    <Input
                      id="timeOfIncident"
                      type="datetime-local"
                      value={formData.timeOfIncident}
                      onChange={(e) => handleChange("timeOfIncident", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider (if applicable)</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleChange("insuranceProvider", e.target.value)}
                      placeholder="Insurance company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number (if applicable)</Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleChange("policyNumber", e.target.value)}
                      placeholder="Policy number"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleChange("specialRequests", e.target.value)}
                  placeholder="Please describe any special requirements or areas that need extra attention..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              Specialty Services
            </h3>
            <div className="grid gap-4">
              <p className="text-sm text-gray-500">
                Select from our comprehensive range of specialty cleaning and restoration services to customize your
                quote.
              </p>

              <Tabs value={activeSpecialtyTab} onValueChange={setActiveSpecialtyTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                  {specialtyServices.slice(0, 4).map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                      {category.icon}
                      <span className="hidden md:inline">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsList className="grid grid-cols-2 md:grid-cols-4">
                  {specialtyServices.slice(4).map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                      {category.icon}
                      <span className="hidden md:inline">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {specialtyServices.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {category.icon}
                          {category.name}
                        </CardTitle>
                        <CardDescription>Select the services you need</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-2">
                          {category.services.map((service) => (
                            <div
                              key={service.id}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                formData.selectedSpecialtyServices.includes(service.id)
                                  ? "bg-primary/10 border-primary"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800/10"
                              }`}
                              onClick={() => handleSpecialtyServiceToggle(service.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={service.id}
                                  checked={formData.selectedSpecialtyServices.includes(service.id)}
                                  onCheckedChange={() => handleSpecialtyServiceToggle(service.id)}
                                />
                                <Label htmlFor={service.id} className="cursor-pointer">
                                  {service.name}
                                </Label>
                              </div>
                              <span className="font-medium">${service.price}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>

              {formData.selectedSpecialtyServices.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Services ({formData.selectedSpecialtyServices.length})</h4>
                  <div className="space-y-2">
                    {formData.selectedSpecialtyServices.map((serviceId) => {
                      const categoryWithService = specialtyServices.find((category) =>
                        category.services.some((service) => service.id === serviceId),
                      )
                      const service = categoryWithService?.services.find((service) => service.id === serviceId)

                      return service ? (
                        <div key={serviceId} className="flex items-center justify-between">
                          <span className="text-sm">{service.name}</span>
                          <span className="text-sm font-medium">${service.price}</span>
                        </div>
                      ) : null
                    })}
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <span className="font-medium">Estimated Total:</span>
                      <span className="font-bold">
                        $
                        {specialtyServices
                          .flatMap((category) => category.services)
                          .filter((service) => formData.selectedSpecialtyServices.includes(service.id))
                          .reduce((sum, service) => sum + service.price, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Scheduling & Preferences
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange("preferredDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleChange("preferredTime", value)}>
                  <SelectTrigger id="preferredTime">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flexibleTiming"
                  checked={formData.flexibleTiming}
                  onCheckedChange={(checked) => handleChange("flexibleTiming", checked === true)}
                />
                <Label htmlFor="flexibleTiming" className="cursor-pointer">
                  I'm flexible with timing
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgencyLevel">Urgency Level</Label>
                <Select value={formData.urgencyLevel} onValueChange={(value) => handleChange("urgencyLevel", value)}>
                  <SelectTrigger id="urgencyLevel">
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency - Need service immediately</SelectItem>
                    <SelectItem value="urgent">Urgent - Need service within 24 hours</SelectItem>
                    <SelectItem value="standard">Standard - Within the next few days</SelectItem>
                    <SelectItem value="flexible">Flexible - Anytime in the next 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>How would you prefer to be contacted?</Label>
                <RadioGroup
                  value={formData.contactPreference}
                  onValueChange={(value) => handleChange("contactPreference", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-pref" />
                    <Label htmlFor="email-pref" className="cursor-pointer">
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone-pref" />
                    <Label htmlFor="phone-pref" className="cursor-pointer">
                      Phone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text-pref" />
                    <Label htmlFor="text-pref" className="cursor-pointer">
                      Text Message
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                <Select value={formData.howDidYouHear} onValueChange={(value) => handleChange("howDidYouHear", value)}>
                  <SelectTrigger id="howDidYouHear">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Family Referral</SelectItem>
                    <SelectItem value="ad">Advertisement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleChange("agreeToTerms", checked === true)}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy
                </Label>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-6 px-2">
        {[1, 2, 3, 4, 5].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex flex-col items-center ${
              stepNumber < step ? "text-primary" : stepNumber === step ? "text-primary" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                stepNumber < step
                  ? "bg-primary text-white"
                  : stepNumber === step
                    ? "border-2 border-primary text-primary"
                    : "border border-gray-300 text-gray-400"
              }`}
            >
              {stepNumber < step ? "✓" : stepNumber}
            </div>
            <span className="text-xs hidden md:block">
              {stepNumber === 1
                ? "Contact"
                : stepNumber === 2
                  ? "Property"
                  : stepNumber === 3
                    ? "Services"
                    : stepNumber === 4
                      ? "Specialty"
                      : "Schedule"}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const Content = (
    <>
      <div className={isDesktop ? "p-6" : "p-4"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepIndicator()}

          <ScrollArea className={isDesktop ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-260px)]"} type="always">
            <div className="space-y-6 pr-4">{renderStepContent()}</div>
          </ScrollArea>

          <div className="flex justify-between gap-2 pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 5 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!formData.agreeToTerms}>
                Submit Request
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  )

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] sm:w-[540px] sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Request Custom Quote
          </SheetTitle>
          <SheetDescription>
            Fill out the form below to request a custom quote tailored to your specific needs.
          </SheetDescription>
        </SheetHeader>
        {Content}
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Request Custom Quote
          </DrawerTitle>
          <DrawerDescription>
            Fill out the form below to request a custom quote tailored to your specific needs.
          </DrawerDescription>
        </DrawerHeader>
        {Content}
      </DrawerContent>
    </Drawer>
  )
}
