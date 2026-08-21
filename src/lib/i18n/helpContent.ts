import type { AppLocale } from "./locale";

export type FaqItem = { q: string; a: string };

export function getFaqItems(locale: AppLocale): FaqItem[] {
  if (locale === "en") {
    return [
      { q: "What is Arena?", a: "Arena is your learning world. Complete challenges there to earn XP and Trophies and unlock new stages." },
      { q: "What is Trophy?", a: "Trophy shows your competitive progress. It is used on the ranking board." },
      { q: "What is XP?", a: "XP is experience. Collect enough XP to raise your Level." },
      { q: "How do I level up?", a: "Finish challenges and battles to earn XP. When the XP bar fills, your Level goes up." },
      { q: "How do I start a challenge?", a: "Open Practice / Challenge, pick a mode, then start. You can also enter from Home Arena." },
      { q: "How do I earn achievements?", a: "Complete goals like winning matches, learning streaks, or subject milestones. Check My Profile → Achievements." },
      { q: "How is the ranking calculated?", a: "Ranking is based on Trophy totals (overall or by subject). Higher trophies rank higher." },
      { q: "How do I change my avatar?", a: "Open My Profile, tap your avatar, and choose a new one." },
      { q: "How do I edit my profile?", a: "Open My Profile, tap the edit icon next to your name, then save." },
      { q: "What if I forgot my password?", a: "Ask a parent or teacher for help, or use Change Password in Settings after you can log in." },
    ];
  }
  if (locale === "ms") {
    return [
      { q: "Apa itu Arena?", a: "Arena ialah dunia pembelajaran anda. Lengkapkan cabaran untuk dapat XP dan Trophy serta buka peringkat baharu." },
      { q: "Apa itu Trophy?", a: "Trophy menunjukkan kemajuan kompetitif anda dan digunakan dalam carta kedudukan." },
      { q: "Apa itu XP?", a: "XP ialah mata pengalaman. Kumpul XP untuk naik Level." },
      { q: "Bagaimana nak naik level?", a: "Siapkan cabaran untuk dapat XP. Apabila bar XP penuh, Level anda naik." },
      { q: "Bagaimana mula cabaran?", a: "Buka Practice / Challenge, pilih mod, kemudian mula. Anda juga boleh masuk dari Home Arena." },
      { q: "Bagaimana dapat pencapaian?", a: "Capai matlamat seperti kemenangan, streak belajar, atau kemajuan subjek. Lihat Profil → Pencapaian." },
      { q: "Bagaimana kedudukan dikira?", a: "Kedudukan berdasarkan jumlah Trophy (keseluruhan atau mengikut subjek)." },
      { q: "Bagaimana tukar avatar?", a: "Buka Profil Saya, ketik avatar, kemudian pilih yang baharu." },
      { q: "Bagaimana edit profil?", a: "Buka Profil Saya, ketik ikon edit di sebelah nama, kemudian simpan." },
      { q: "Lupa kata laluan?", a: "Minta bantuan ibu bapa/guru, atau tukar kata laluan dalam Tetapan selepas berjaya log masuk." },
    ];
  }
  return [
    { q: "什么是 Arena？", a: "Arena 是你的学习世界。在这里完成挑战，获得 XP 和奖杯，并解锁新关卡。" },
    { q: "什么是 Trophy？", a: "Trophy（奖杯）代表竞技进度，也会用在排行榜上。" },
    { q: "什么是 XP？", a: "XP 是经验值。攒够 XP 就能提升等级。" },
    { q: "如何提升等级？", a: "完成挑战和对战可获得 XP。XP 进度条满了，等级就会提升。" },
    { q: "如何开始挑战？", a: "进入练习 / 挑战页选择模式后开始，也可以从首页 Arena 进入。" },
    { q: "如何获得成就？", a: "完成特定目标即可解锁成就，例如连胜、连续学习或科目里程碑。可在「我的资料」查看。" },
    { q: "排行榜是怎么计算的？", a: "排行榜按奖杯数量排序（总榜或分科目）。奖杯越多，排名越高。" },
    { q: "如何更换头像？", a: "打开「我的资料」，点击头像，选择新形象即可。" },
    { q: "如何修改个人资料？", a: "打开「我的资料」，点击名字旁的编辑按钮，修改后保存。" },
    { q: "忘记密码怎么办？", a: "请家长或老师协助。登录后也可以在「设置 → 修改密码」自行更换。" },
  ];
}

export type HowToSection = { title: string; body: string };

export function getHowToSections(locale: AppLocale): HowToSection[] {
  if (locale === "en") {
    return [
      { title: "What is Arena?", body: "Arena is your learning world. Complete challenges, earn XP and Trophies, and unlock new stages." },
      { title: "What is XP?", body: "XP is experience that raises your Level." },
      { title: "What is Trophy?", body: "Trophy tracks competitive progress and powers the ranking board." },
      { title: "What is Learning Hero?", body: "Your subjects become learning abilities: Chinese, English, Malay, Math, Science (and more as they unlock)." },
      { title: "What are Achievements?", body: "Achievements are special goals unlocked by learning and game milestones." },
      { title: "What is Ranking?", body: "Compare Trophy progress with other students on the leaderboard." },
    ];
  }
  if (locale === "ms") {
    return [
      { title: "Apa itu Arena?", body: "Arena ialah dunia pembelajaran anda. Lengkapkan cabaran, dapat XP dan Trophy, serta buka peringkat baharu." },
      { title: "Apa itu XP?", body: "XP ialah pengalaman yang menaikkan Level anda." },
      { title: "Apa itu Trophy?", body: "Trophy menjejaki kemajuan kompetitif dan digunakan dalam carta kedudukan." },
      { title: "Apa itu Wira Pembelajaran?", body: "Subjek menjadi keupayaan pembelajaran anda: Bahasa Cina, Inggeris, Melayu, Matematik, Sains (dan lagi bila dibuka)." },
      { title: "Apa itu Pencapaian?", body: "Pencapaian ialah matlamat istimewa yang dibuka melalui pembelajaran dan kemajuan permainan." },
      { title: "Apa itu Kedudukan?", body: "Bandingkan kemajuan Trophy anda dengan pelajar lain." },
    ];
  }
  return [
    { title: "什么是 Arena？", body: "Arena 是学生的学习世界。完成挑战、获得 XP / 奖杯，并解锁新关卡。" },
    { title: "什么是 XP？", body: "XP 是经验值，用来提升学生的等级。" },
    { title: "什么是 Trophy？", body: "Trophy（奖杯）代表竞技进度，并用于排行榜系统。" },
    { title: "什么是学习英雄？", body: "各科目会成为你的学习能力：华文、英文、马来文、数学、科学（以及后续解锁的科目）。" },
    { title: "什么是成就？", body: "成就是特殊目标。完成特定学习或游戏里程碑即可解锁。" },
    { title: "什么是排行榜？", body: "你可以在排行榜上和其他同学比较奖杯进度。" },
  ];
}
