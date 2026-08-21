import type { AppLocale } from "./locale";

export type AuthCopy = {
  createAccount: string;
  loginAccount: string;
  mockHint: string;
  mockLogin: (password: string) => string;
  signup: string;
  login: string;
  username: string;
  usernamePh: string;
  password: string;
  passwordPh: string;
  name: string;
  namePh: string;
  ageLocksGrade: (grade: string) => string;
  school: string;
  state: string;
  contact: string;
  contactPh: string;
  ageLockNote: (age: string, grade: string) => string;
  createEnter: string;
  loginBtn: string;
  backHome: string;
  errors: Record<string, string>;
};

export const AUTH_I18N: Record<AppLocale, AuthCopy> = {
  zh: {
    createAccount: "创建账号",
    loginAccount: "登录账号",
    mockHint: "目前为 Mock 演示模式：可用下方演示账号，或自己注册（仅存在本机）。",
    mockLogin: (password) => `一键登录 Mock 账号（密码均为 ${password}）`,
    signup: "注册",
    login: "登录",
    username: "登录名",
    usernamePh: "例如：ali_2026",
    password: "密码",
    passwordPh: "至少 4 位",
    name: "姓名",
    namePh: "学生姓名",
    ageLocksGrade: (grade) => `年龄（将锁定为 ${grade}）`,
    school: "学校名字",
    state: "州属",
    contact: "联系方式（家长电话/电邮）",
    contactPh: "电话或 email",
    ageLockNote: (age, grade) => `年龄 ${age} 岁 → 课程锁定 ${grade}（注册后不可自行更改）`,
    createEnter: "创建并进入",
    loginBtn: "登录",
    backHome: "返回首页",
    errors: {
      empty_password: "密码不能为空",
      invalid_password: "密码格式不符合要求",
      wrong_password: "当前密码错误",
      signup_failed: "注册失败，请稍后再试",
      bad_credentials: "登录名或密码不正确",
      profile_sync: "无法同步用户资料",
    },
  },
  en: {
    createAccount: "Create account",
    loginAccount: "Log in",
    mockHint: "Demo mode: use a mock account below, or sign up (saved on this device only).",
    mockLogin: (password) => `One-tap mock login (password is ${password})`,
    signup: "Sign up",
    login: "Log in",
    username: "Username",
    usernamePh: "e.g. ali_2026",
    password: "Password",
    passwordPh: "At least 4 characters",
    name: "Name",
    namePh: "Student name",
    ageLocksGrade: (grade) => `Age (locks to ${grade})`,
    school: "School name",
    state: "State",
    contact: "Contact (parent phone / email)",
    contactPh: "Phone or email",
    ageLockNote: (age, grade) => `Age ${age} → course locked to ${grade} (can't change after signup)`,
    createEnter: "Create and enter",
    loginBtn: "Log in",
    backHome: "Back to home",
    errors: {
      empty_password: "Password cannot be empty",
      invalid_password: "Password format is invalid",
      wrong_password: "Current password is incorrect",
      signup_failed: "Sign up failed. Please try again.",
      bad_credentials: "Incorrect username or password",
      profile_sync: "Couldn't sync profile",
    },
  },
  ms: {
    createAccount: "Cipta akaun",
    loginAccount: "Log masuk",
    mockHint: "Mod demo: guna akaun mock di bawah, atau daftar (disimpan pada peranti ini sahaja).",
    mockLogin: (password) => `Log masuk mock satu ketikan (kata laluan ${password})`,
    signup: "Daftar",
    login: "Log masuk",
    username: "Nama pengguna",
    usernamePh: "cth. ali_2026",
    password: "Kata laluan",
    passwordPh: "Sekurang-kurangnya 4 aksara",
    name: "Nama",
    namePh: "Nama pelajar",
    ageLocksGrade: (grade) => `Umur (dikunci ke ${grade})`,
    school: "Nama sekolah",
    state: "Negeri",
    contact: "Hubungan (telefon / emel ibu bapa)",
    contactPh: "Telefon atau emel",
    ageLockNote: (age, grade) => `Umur ${age} → kursus dikunci ke ${grade} (tidak boleh tukar selepas daftar)`,
    createEnter: "Cipta dan masuk",
    loginBtn: "Log masuk",
    backHome: "Kembali ke laman",
    errors: {
      empty_password: "Kata laluan tidak boleh kosong",
      invalid_password: "Format kata laluan tidak sah",
      wrong_password: "Kata laluan semasa tidak betul",
      signup_failed: "Daftar gagal. Sila cuba lagi.",
      bad_credentials: "Nama pengguna atau kata laluan tidak betul",
      profile_sync: "Tidak dapat segerakkan profil",
    },
  },
};

export function getAuthCopy(locale: AppLocale): AuthCopy {
  return AUTH_I18N[locale] ?? AUTH_I18N.zh;
}

export function localizeAuthError(code: string, locale: AppLocale): string {
  return getAuthCopy(locale).errors[code] ?? code;
}
