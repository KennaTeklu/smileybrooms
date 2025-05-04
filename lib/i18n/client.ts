"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages
export const LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
  ru: "Русский",
}

export type LanguageCode = keyof typeof LANGUAGES

// Translation context
type TranslationContextType = {
  locale: LanguageCode
  setLocale: (locale: LanguageCode) => void
  t: (key: string, params?: Record<string, string>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Translation provider props
interface TranslationProviderProps {
  children: ReactNode
  defaultLocale?: LanguageCode
}

// Simple translations (in a real app, these would be loaded from JSON files)
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "common.back": "Back",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.language": "Language",
    "support.title": "Smiley Brooms Support",
    "support.subtitle": "We're here to help you!",
    "support.connecting": "Connecting you with our {team} team",
    "support.specialist": "A specialist will be with you shortly.",
    "support.id": "Support ID",
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.accessibility": "Accessibility",
    "settings.notifications": "Notifications",
    "settings.privacy": "Privacy",
  },
  es: {
    "common.back": "Atrás",
    "common.close": "Cerrar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.success": "Éxito",
    "common.language": "Idioma",
    "support.title": "Soporte de Smiley Brooms",
    "support.subtitle": "¡Estamos aquí para ayudarte!",
    "support.connecting": "Conectándote con nuestro equipo de {team}",
    "support.specialist": "Un especialista estará contigo en breve.",
    "support.id": "ID de soporte",
    "settings.title": "Configuración",
    "settings.language": "Idioma",
    "settings.theme": "Tema",
    "settings.accessibility": "Accesibilidad",
    "settings.notifications": "Notificaciones",
    "settings.privacy": "Privacidad",
  },
  fr: {
    "common.back": "Retour",
    "common.close": "Fermer",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.success": "Succès",
    "common.language": "Langue",
    "support.title": "Support Smiley Brooms",
    "support.subtitle": "Nous sommes là pour vous aider !",
    "support.connecting": "Connexion avec notre équipe {team}",
    "support.specialist": "Un spécialiste sera bientôt avec vous.",
    "support.id": "ID de support",
    "settings.title": "Paramètres",
    "settings.language": "Langue",
    "settings.theme": "Thème",
    "settings.accessibility": "Accessibilité",
    "settings.notifications": "Notifications",
    "settings.privacy": "Confidentialité",
  },
  de: {
    "common.back": "Zurück",
    "common.close": "Schließen",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Wird geladen...",
    "common.error": "Ein Fehler ist aufgetreten",
    "common.success": "Erfolg",
    "common.language": "Sprache",
    "support.title": "Smiley Brooms Support",
    "support.subtitle": "Wir sind hier, um Ihnen zu helfen!",
    "support.connecting": "Verbindung mit unserem {team}-Team",
    "support.specialist": "Ein Spezialist wird in Kürze bei Ihnen sein.",
    "support.id": "Support-ID",
    "settings.title": "Einstellungen",
    "settings.language": "Sprache",
    "settings.theme": "Thema",
    "settings.accessibility": "Barrierefreiheit",
    "settings.notifications": "Benachrichtigungen",
    "settings.privacy": "Datenschutz",
  },
  zh: {
    "common.back": "返回",
    "common.close": "关闭",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.loading": "加载中...",
    "common.error": "发生错误",
    "common.success": "成功",
    "common.language": "语言",
    "support.title": "Smiley Brooms 客户支持",
    "support.subtitle": "我们随时为您提供帮助！",
    "support.connecting": "正在连接我们的{team}团队",
    "support.specialist": "专家将很快为您服务。",
    "support.id": "支持ID",
    "settings.title": "设置",
    "settings.language": "语言",
    "settings.theme": "主题",
    "settings.accessibility": "无障碍",
    "settings.notifications": "通知",
    "settings.privacy": "隐私",
  },
  ja: {
    "common.back": "戻る",
    "common.close": "閉じる",
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.loading": "読み込み中...",
    "common.error": "エラーが発生しました",
    "common.success": "成功",
    "common.language": "言語",
    "support.title": "Smiley Brooms サポート",
    "support.subtitle": "お手伝いします！",
    "support.connecting": "{team}チームに接続しています",
    "support.specialist": "担当者がまもなく対応します。",
    "support.id": "サポートID",
    "settings.title": "設定",
    "settings.language": "言語",
    "settings.theme": "テーマ",
    "settings.accessibility": "アクセシビリティ",
    "settings.notifications": "通知",
    "settings.privacy": "プライバシー",
  },
  ar: {
    "common.back": "رجوع",
    "common.close": "إغلاق",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "نجاح",
    "common.language": "اللغة",
    "support.title": "دعم Smiley Brooms",
    "support.subtitle": "نحن هنا لمساعدتك!",
    "support.connecting": "جاري توصيلك بفريق {team} لدينا",
    "support.specialist": "سيكون أحد المتخصصين معك قريبًا.",
    "support.id": "رقم الدعم",
    "settings.title": "الإعدادات",
    "settings.language": "اللغة",
    "settings.theme": "المظهر",
    "settings.accessibility": "إمكانية الوصول",
    "settings.notifications": "الإشعارات",
    "settings.privacy": "الخصوصية",
  },
  ru: {
    "common.back": "Назад",
    "common.close": "Закрыть",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.loading": "Загрузка...",
    "common.error": "Произошла ошибка",
    "common.success": "Успех",
    "common.language": "Язык",
    "support.title": "Поддержка Smiley Brooms",
    "support.subtitle": "Мы здесь, чтобы помочь вам!",
    "support.connecting": "Соединение с нашей командой {team}",
    "support.specialist": "Специалист скоро будет с вами.",
    "support.id": "ID поддержки",
    "settings.title": "Настройки",
    "settings.language": "Язык",
    "settings.theme": "Тема",
    "settings.accessibility": "Доступность",
    "settings.notifications": "Уведомления",
    "settings.privacy": "Конфиденциальность",
  },
}

// Translation provider component
export function TranslationProvider({ children, defaultLocale = "en" }: TranslationProviderProps) {
  const [locale, setLocaleState] = useState<LanguageCode>(defaultLocale)

  // Load saved language preference
  useEffect(() => {
    const savedLocale = localStorage.getItem("language") as LanguageCode
    if (savedLocale && Object.keys(LANGUAGES).includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  // Save language preference when it changes
  const setLocale = (newLocale: LanguageCode) => {
    setLocaleState(newLocale)
    localStorage.setItem("language", newLocale)
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
  }

  // Translation function
  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[locale]?.[key] || translations.en[key] || key

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value)
      })
    }

    return translation
  }

  return <TranslationContext.Provider value={{ locale, setLocale, t }}>{children}</TranslationContext.Provider>
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
