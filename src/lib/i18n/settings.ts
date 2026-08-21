import type { AppLocale } from "./locale";

export type SettingsCopy = {
  title: string;
  back: string;
  gameExperience: string;
  soundEffects: string;
  backgroundMusic: string;
  on: string;
  off: string;
  language: string;
  langZh: string;
  langMs: string;
  langEn: string;
  account: string;
  changePassword: string;
  loginMethod: string;
  logout: string;
  help: string;
  faq: string;
  contact: string;
  howToPlay: string;
  legal: string;
  terms: string;
  privacy: string;
  about: string;
  aboutTitle: string;
  logoutConfirmTitle: string;
  logoutConfirmBody: string;
  cancel: string;
  confirmLogout: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submitPassword: string;
  passwordSuccess: string;
  passwordMismatch: string;
  passwordEmpty: string;
  loginMethodTitle: string;
  emailLabel: string;
  passwordLabel: string;
  comingSoon: string;
  contactBody: string;
  contactSoon: string;
  version: string;
  loading: string;
  passwordWrong: string;
  passwordInvalid: string;
};

export const SETTINGS_I18N: Record<AppLocale, SettingsCopy> = {
  zh: {
    title: "设置",
    back: "返回",
    gameExperience: "游戏体验",
    soundEffects: "音效",
    backgroundMusic: "背景音乐",
    on: "ON",
    off: "OFF",
    language: "语言",
    langZh: "简体中文",
    langMs: "Bahasa Melayu",
    langEn: "English",
    account: "账号",
    changePassword: "修改密码",
    loginMethod: "登录方式",
    logout: "登出账号",
    help: "帮助",
    faq: "常见问题",
    contact: "联系我们",
    howToPlay: "游戏玩法",
    legal: "法律",
    terms: "用户协议",
    privacy: "隐私政策",
    about: "关于",
    aboutTitle: "关于 OG EduWorld",
    logoutConfirmTitle: "确定要登出吗？",
    logoutConfirmBody: "登出后需要重新登录才能继续游戏。",
    cancel: "取消",
    confirmLogout: "登出",
    currentPassword: "当前密码",
    newPassword: "新密码",
    confirmPassword: "确认新密码",
    submitPassword: "确认修改",
    passwordSuccess: "密码修改成功",
    passwordMismatch: "两次输入的新密码不一致",
    passwordEmpty: "密码不能为空",
    loginMethodTitle: "登录方式",
    emailLabel: "Email",
    passwordLabel: "密码",
    comingSoon: "内容即将开放",
    contactBody: "如果你有任何问题，欢迎联系我们。",
    contactSoon: "联系方式即将开放",
    version: "Version",
    loading: "加载中…",
    passwordWrong: "当前密码错误",
    passwordInvalid: "密码格式不符合要求",
  },
  ms: {
    title: "Tetapan",
    back: "Kembali",
    gameExperience: "Pengalaman Permainan",
    soundEffects: "Kesan Bunyi",
    backgroundMusic: "Muzik Latar",
    on: "ON",
    off: "OFF",
    language: "Bahasa",
    langZh: "简体中文",
    langMs: "Bahasa Melayu",
    langEn: "English",
    account: "Akaun",
    changePassword: "Tukar Kata Laluan",
    loginMethod: "Kaedah Log Masuk",
    logout: "Log Keluar",
    help: "Bantuan",
    faq: "Soalan Lazim",
    contact: "Hubungi Kami",
    howToPlay: "Cara Bermain",
    legal: "Undang-undang",
    terms: "Terma Perkhidmatan",
    privacy: "Dasar Privasi",
    about: "Mengenai",
    aboutTitle: "Mengenai OG EduWorld",
    logoutConfirmTitle: "Pasti mahu log keluar?",
    logoutConfirmBody: "Anda perlu log masuk semula untuk terus bermain.",
    cancel: "Batal",
    confirmLogout: "Log Keluar",
    currentPassword: "Kata laluan semasa",
    newPassword: "Kata laluan baharu",
    confirmPassword: "Sahkan kata laluan baharu",
    submitPassword: "Sahkan",
    passwordSuccess: "Kata laluan berjaya ditukar",
    passwordMismatch: "Kata laluan baharu tidak sepadan",
    passwordEmpty: "Kata laluan tidak boleh kosong",
    loginMethodTitle: "Kaedah Log Masuk",
    emailLabel: "Email",
    passwordLabel: "Kata Laluan",
    comingSoon: "Akan datang",
    contactBody: "Jika anda ada soalan, sila hubungi kami.",
    contactSoon: "Maklumat hubungan akan dibuka tidak lama lagi",
    version: "Version",
    loading: "Memuatkan…",
    passwordWrong: "Kata laluan semasa tidak betul",
    passwordInvalid: "Format kata laluan tidak sah",
  },
  en: {
    title: "Settings",
    back: "Back",
    gameExperience: "Game Experience",
    soundEffects: "Sound Effects",
    backgroundMusic: "Background Music",
    on: "ON",
    off: "OFF",
    language: "Language",
    langZh: "简体中文",
    langMs: "Bahasa Melayu",
    langEn: "English",
    account: "Account",
    changePassword: "Change Password",
    loginMethod: "Login Method",
    logout: "Log Out",
    help: "Help",
    faq: "FAQ",
    contact: "Contact Us",
    howToPlay: "How to Play",
    legal: "Legal",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    about: "About",
    aboutTitle: "About OG EduWorld",
    logoutConfirmTitle: "Log out?",
    logoutConfirmBody: "You will need to log in again to continue playing.",
    cancel: "Cancel",
    confirmLogout: "Log Out",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    submitPassword: "Update Password",
    passwordSuccess: "Password updated",
    passwordMismatch: "New passwords do not match",
    passwordEmpty: "Password cannot be empty",
    loginMethodTitle: "Login Method",
    emailLabel: "Email",
    passwordLabel: "Password",
    comingSoon: "Coming Soon",
    contactBody: "If you have any questions, feel free to contact us.",
    contactSoon: "Contact details coming soon",
    version: "Version",
    loading: "Loading…",
    passwordWrong: "Current password is incorrect",
    passwordInvalid: "Password format is invalid",
  },
};
