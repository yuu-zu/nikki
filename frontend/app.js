
const state = {
  language: "vi",
  currentScreen: "dashboard-home",
  token: localStorage.getItem("diaryToken") || "",
  user: JSON.parse(localStorage.getItem("diaryUser") || "null"),
  notes: [],
  trash: [],
  selectedNoteId: null,
  pendingId: "",
  tempPassword: sessionStorage.getItem("tempPassword") || "",
  personalKey: sessionStorage.getItem("personalKey") || "",
  notesUnlocked: false,
};

const translations = {
  vi: {
    nav: { home: "Trang chủ", intro: "Giới thiệu", about: "Về chúng tôi", login: "Đăng nhập" },
    public: {
      homeKicker: "BloomNote diary space",
      homeTitle: "Lưu giữ ký ức như một khu vườn riêng yên tĩnh của bạn.",
      homeText: "BloomNote giúp bạn viết nhật ký cá nhân trong một giao diện dịu mắt, giữ nội dung ở dạng mã hóa và chỉ mở ra khi chính bạn muốn đọc lại.",
      heroAbout: "Khám phá thêm",
      heroLogin: "Mở khu đăng nhập",
      featureHome: "Bạn có thể viết nhật ký mỗi ngày, lưu lại cảm xúc riêng tư và quay lại đọc bằng khóa cá nhân bất cứ khi nào cần.",
      featureEncryption: "Nội dung được mã hóa AES trước khi lưu và sẽ không hiện rõ nếu bạn chưa mở khóa.",
      featureOtp: "Đăng ký bằng OTP email để kích hoạt tài khoản và bảo vệ luồng đăng nhập tốt hơn.",
      tags: ["Mã hóa AES", "OTP qua email", "Riêng tư từng ghi chú"],
      introKicker: "Giới thiệu",
      introTitle: "Một website nhật ký cá nhân gọn gàng, ấm áp và an toàn.",
      introCards: [
        { title: "Viết và lưu mỗi ngày", text: "Trình soạn thảo cho phép bạn ghi nhanh suy nghĩ, chỉnh kiểu chữ cơ bản và sắp xếp lại nhật ký theo cách đơn giản." },
        { title: "Bảo mật trước khi hiển thị", text: "Danh sách nhật ký đang hoạt động cũng giữ nội dung ở dạng mã hóa. Chỉ khi bạn chủ động mở khóa, nội dung mới được giải mã để xem và sửa." },
        { title: "Rõ ràng cho người dùng", text: "Trang chủ, giới thiệu, về chúng tôi và khu đăng nhập được tách mạch lạc nhưng vẫn nằm trong cùng một trải nghiệm liền mạch." },
      ],
      aboutKicker: "Về chúng tôi",
      aboutTitle: "BloomNote được làm ra để việc viết riêng tư trở nên dễ chịu hơn.",
      aboutText: "Mục tiêu của website là tạo ra một nơi vừa đẹp mắt vừa thực tế để bạn cất giữ câu chuyện cá nhân. Từ phần giới thiệu, đăng nhập đến bảng điều khiển đều được thiết kế để người dùng cảm thấy nhẹ nhàng, dễ dùng và an tâm hơn khi lưu dữ liệu riêng tư.",
      aboutStats: [
        "Tập trung vào cảm giác đọc tiếng Việt rõ ràng, dễ nhìn.",
        "Giữ nội dung ghi chú ở dạng mã hóa cho tới khi được mở khóa.",
        "Tách khu đăng nhập riêng nhưng vẫn giữ tinh thần của landing page.",
      ],
    },
    auth: {
      kicker: "Đăng nhập an toàn",
      title: "Bước vào khu nhật ký riêng với cùng cảm giác dịu dàng như trang chủ.",
      text: "Tại đây bạn vẫn thấy tinh thần của BloomNote, nhưng phần chính sẽ tập trung cho đăng nhập, đăng ký và xác thực OTP.",
      backHome: "Về trang chủ",
      loginHeading: "Chào mừng bạn quay lại",
      loginIdentifierLabel: "Email / Tên người dùng",
      loginPasswordLabel: "Mật khẩu",
      loginSubmit: "Đăng nhập",
      forgotPassword: "Quên mật khẩu",
      registerPrompt: "Chưa có tài khoản?",
      goRegister: "Đăng ký",
      registerHeading: "Tạo tài khoản mới",
      registerUsernameLabel: "Tên người dùng",
      registerEmailLabel: "Email",
      registerPasswordLabel: "Mật khẩu",
      registerSubmit: "Gửi OTP",
      loginPrompt: "Đã có tài khoản?",
      goLogin: "Đăng nhập",
      otpHeading: "Xác thực OTP",
      otpText: "Nhập mã OTP đã được gửi về email của bạn.",
      otpSubmit: "Xác nhận",
      tags: ["Trang riêng cho đăng nhập", "Giữ cảm giác landing page", "Liền mạch với trang chủ"],
      toggleShow: "Hiện",
      toggleHide: "Ẩn",
    },
    dashboard: {
      screens: {
        "dashboard-home": ["Tổng quan", "Quản lý nhật ký an toàn và riêng tư."],
        notes: ["Nhật ký", "Danh sách giữ nội dung ở dạng mã hóa cho đến khi bạn mở khóa."],
        trash: ["Thùng rác", "Nhật ký đã xóa vẫn được giữ mã hóa trước khi bị xóa hẳn."],
        profile: ["Thông tin cá nhân", "Cập nhật hồ sơ và khóa cá nhân dùng để giải mã."],
        "share-view": ["Ghi chú được chia sẻ", "Xem bản ghi mã hóa mà bạn đã gửi đi."],
      },
      notesLocked: "Đã khóa",
      notesUnlocked: "Đã mở khóa",
      lockedHint: "Nhật ký đang hoạt động hiện chỉ hiển thị nội dung đã mã hóa. Hãy nhấn mở khóa để xem nội dung thật.",
      unlockedHint: "Bạn đã mở khóa thành công. Giờ có thể đọc, chọn và chỉnh sửa nhật ký đã mã hóa.",
      unlockButton: "Mở khóa nhật ký",
      lockButton: "Ẩn nội dung",
      lockedBadge: "Đang mã hóa",
      unlockedBadge: "Đã giải mã",
      emptyNotes: "Chưa có nhật ký nào ở đây.",
      emptyTrash: "Thùng rác đang trống.",
      newNotePlaceholder: "Nhật ký mới sẽ được mã hóa ngay khi bạn lưu.",
      openLabel: "Mở",
      deleteLabel: "Xóa",
      restoreLabel: "Khôi phục",
    },
    toasts: {
      loginSuccess: "Đăng nhập thành công.",
      registerOtp: "OTP đã được gửi về email.",
      registerSuccess: "Đăng ký thành công. Vui lòng đăng nhập.",
      movedToTrash: "Đã chuyển nhật ký vào thùng rác.",
      restored: "Đã khôi phục nhật ký.",
      saved: "Đã lưu nhật ký dưới dạng mã hóa.",
      profileSaved: "Đã cập nhật thông tin cá nhân.",
      unlockSuccess: "Đã mở khóa nội dung nhật ký.",
      lockSuccess: "Đã ẩn nội dung nhật ký đang hoạt động.",
      needFields: "Vui lòng nhập tiêu đề và nội dung.",
      needKey: "Cần nhập khóa cá nhân hoặc đăng nhập lại để mã hóa nội dung.",
      needUnlock: "Hãy mở khóa nhật ký trước khi xem hoặc chỉnh sửa nội dung cũ.",
      shareCreated: "Đã tạo link chia sẻ và copy thông tin.",
      switchAccount: "Hãy đăng nhập tài khoản khác.",
      logout: "Đã đăng xuất.",
      sharedLoadError: "Không tải được ghi chú chia sẻ.",
      noNoteToShare: "Hãy mở một nhật ký trước khi chia sẻ.",
      keyPrompt: "Nhập khóa cá nhân để giải mã nhật ký:",
      sharePrompt: "Nhập khóa kiểm thử để gửi kèm (có thể để trống):",
      forgotPrompt: "Nhập email tài khoản:",
      unlockRequiredForExisting: "Nhật ký cũ đang được giữ ở dạng mã hóa. Mở khóa trước để xem nội dung thật.",
    },
  },
  en: {
    nav: { home: "Home", intro: "Introduction", about: "About", login: "Login" },
    public: {
      homeKicker: "BloomNote diary space",
      homeTitle: "Keep memories in a quiet private garden of your own.",
      homeText: "BloomNote lets you write personal diaries in a calm interface, keep every entry encrypted, and only open it when you decide to.",
      heroAbout: "Explore more",
      heroLogin: "Open login area",
      featureHome: "Write daily reflections, manage private notes, and come back to them anytime with your personal key.",
      featureEncryption: "Entries are encrypted with AES before saving and stay unreadable until you unlock them.",
      featureOtp: "Email OTP registration helps activate accounts and adds a safer sign-in flow.",
      tags: ["AES encryption", "Email OTP", "Private notes"],
      introKicker: "Introduction",
      introTitle: "A personal diary website that feels warm, tidy, and secure.",
      introCards: [
        { title: "Write and save every day", text: "The editor lets you capture thoughts quickly, use basic formatting, and keep your journal simple to manage." },
        { title: "Protected before reveal", text: "Active diary entries also stay encrypted in the list. Only an explicit unlock reveals readable content for viewing or editing." },
        { title: "Clear for users", text: "Home, introduction, about, and login are separated cleanly while still feeling like one continuous product experience." },
      ],
      aboutKicker: "About us",
      aboutTitle: "BloomNote was built to make private writing feel calmer.",
      aboutText: "The website aims to give you a place that is both beautiful and practical for personal stories. From the landing sections to the login area and dashboard, everything is shaped to feel softer, easier, and safer.",
      aboutStats: [
        "Focused on clear, comfortable reading.",
        "Keeps diary content encrypted until you unlock it.",
        "Separates the login area while preserving the landing-page feeling.",
      ],
    },
    auth: {
      kicker: "Secure login",
      title: "Step into your private diary with the same atmosphere as the home page.",
      text: "This view keeps BloomNote's identity while focusing on sign in, sign up, and OTP verification.",
      backHome: "Back to home",
      loginHeading: "Welcome back",
      loginIdentifierLabel: "Email / Username",
      loginPasswordLabel: "Password",
      loginSubmit: "Login",
      forgotPassword: "Forgot password",
      registerPrompt: "No account yet?",
      goRegister: "Register",
      registerHeading: "Create a new account",
      registerUsernameLabel: "Username",
      registerEmailLabel: "Email",
      registerPasswordLabel: "Password",
      registerSubmit: "Send OTP",
      loginPrompt: "Already have an account?",
      goLogin: "Login",
      otpHeading: "OTP verification",
      otpText: "Enter the OTP that was sent to your email.",
      otpSubmit: "Confirm",
      tags: ["Dedicated login view", "Keeps landing-page vibe", "Smooth product flow"],
      toggleShow: "Show",
      toggleHide: "Hide",
    },
    dashboard: {
      screens: {
        "dashboard-home": ["Overview", "Manage your diary in a private and secure way."],
        notes: ["Diary", "Entries stay encrypted until you choose to unlock them."],
        trash: ["Trash", "Deleted entries remain encrypted before permanent cleanup."],
        profile: ["Profile", "Update your profile and personal decryption key."],
        "share-view": ["Shared note", "View the encrypted note you shared."],
      },
      notesLocked: "Locked",
      notesUnlocked: "Unlocked",
      lockedHint: "Active entries currently show encrypted content only. Unlock them when you want to read the real text.",
      unlockedHint: "Entries are unlocked now. You can read, open, and edit decrypted content.",
      unlockButton: "Unlock diary",
      lockButton: "Hide content",
      lockedBadge: "Encrypted",
      unlockedBadge: "Decrypted",
      emptyNotes: "No diary entries yet.",
      emptyTrash: "Trash is empty.",
      newNotePlaceholder: "A new entry will be encrypted the moment you save it.",
      openLabel: "Open",
      deleteLabel: "Delete",
      restoreLabel: "Restore",
    },
    toasts: {
      loginSuccess: "Logged in successfully.",
      registerOtp: "OTP sent to your email.",
      registerSuccess: "Registration complete. Please log in.",
      movedToTrash: "Moved the entry to trash.",
      restored: "Restored the entry.",
      saved: "Saved the diary entry in encrypted form.",
      profileSaved: "Profile updated successfully.",
      unlockSuccess: "Diary content unlocked.",
      lockSuccess: "Active diary content hidden again.",
      needFields: "Please enter both title and content.",
      needKey: "A personal key or a fresh login is required to encrypt content.",
      needUnlock: "Unlock the diary before viewing or editing older entries.",
      shareCreated: "Share link created and copied.",
      switchAccount: "Please sign in to a different account.",
      logout: "Logged out.",
      sharedLoadError: "Unable to load the shared note.",
      noNoteToShare: "Open a diary entry before sharing it.",
      keyPrompt: "Enter your personal key to decrypt diary entries:",
      sharePrompt: "Enter an optional test key to include:",
      forgotPrompt: "Enter your account email:",
      unlockRequiredForExisting: "Existing diary entries remain encrypted until you unlock them.",
    },
  },
};

const els = {
  publicView: document.getElementById("public-view"), authView: document.getElementById("auth-view"), dashboardView: document.getElementById("dashboard-view"),
  navButtons: document.querySelectorAll(".nav-btn[data-section]"), navLogin: document.getElementById("nav-login"), languageToggle: document.getElementById("language-toggle"),
  brandHome: document.getElementById("brand-home"), heroAbout: document.getElementById("hero-about"), heroLogin: document.getElementById("hero-login"), authBackHome: document.getElementById("auth-back-home"),
  homeKicker: document.getElementById("home-kicker"), homeTitle: document.getElementById("home-title"), homeText: document.getElementById("home-text"), heroTags: document.getElementById("hero-tags"),
  featureHomeCopy: document.getElementById("feature-home-copy"), featureEncryption: document.getElementById("feature-encryption"), featureOtp: document.getElementById("feature-otp"),
  introKicker: document.getElementById("intro-kicker"), introTitle: document.getElementById("intro-title"), introCardTitle1: document.getElementById("intro-card-title-1"), introCardText1: document.getElementById("intro-card-text-1"),
  introCardTitle2: document.getElementById("intro-card-title-2"), introCardText2: document.getElementById("intro-card-text-2"), introCardTitle3: document.getElementById("intro-card-title-3"), introCardText3: document.getElementById("intro-card-text-3"),
  aboutKicker: document.getElementById("about-kicker"), aboutTitle: document.getElementById("about-title"), aboutText: document.getElementById("about-text"), aboutStat1: document.getElementById("about-stat-1"), aboutStat2: document.getElementById("about-stat-2"), aboutStat3: document.getElementById("about-stat-3"),
  authKicker: document.getElementById("auth-kicker"), authTitle: document.getElementById("auth-title"), authText: document.getElementById("auth-text"), authTags: document.getElementById("auth-tags"),
  loginCard: document.getElementById("login-card"), registerCard: document.getElementById("register-card"), otpCard: document.getElementById("otp-card"), loginHeading: document.getElementById("login-heading"),
  loginIdentifierLabel: document.getElementById("login-identifier-label"), loginPasswordLabel: document.getElementById("login-password-label"), loginIdentifier: document.getElementById("login-identifier"), loginPassword: document.getElementById("login-password"), togglePassword: document.getElementById("toggle-password"),
  loginSubmit: document.getElementById("login-submit"), forgotPassword: document.getElementById("forgot-password"), registerPrompt: document.getElementById("register-prompt"), goRegister: document.getElementById("go-register"),
  registerHeading: document.getElementById("register-heading"), registerUsernameLabel: document.getElementById("register-username-label"), registerEmailLabel: document.getElementById("register-email-label"), registerPasswordLabel: document.getElementById("register-password-label"), registerUsername: document.getElementById("register-username"), registerEmail: document.getElementById("register-email"), registerPassword: document.getElementById("register-password"), registerSubmit: document.getElementById("register-submit"),
  loginPrompt: document.getElementById("login-prompt"), goLogin: document.getElementById("go-login"), otpHeading: document.getElementById("otp-heading"), otpText: document.getElementById("otp-text"), otpCode: document.getElementById("otp-code"), otpSubmit: document.getElementById("otp-submit"),
  sideButtons: document.querySelectorAll(".side-btn"), screenTitle: document.getElementById("screen-title"), screenSubtitle: document.getElementById("screen-subtitle"), userDropdownTrigger: document.getElementById("user-dropdown-trigger"), userDropdown: document.getElementById("user-dropdown"), dropdownActions: document.querySelectorAll("[data-profile-action]"), screens: document.querySelectorAll(".screen"),
  activeCount: document.getElementById("active-count"), trashCount: document.getElementById("trash-count"), keyStatus: document.getElementById("key-status"), noteSearch: document.getElementById("note-search"), unlockNotes: document.getElementById("unlock-notes"), notesSecurityHint: document.getElementById("notes-security-hint"),
  notesList: document.getElementById("notes-list"), trashList: document.getElementById("trash-list"), noteTitle: document.getElementById("note-title"), noteEditor: document.getElementById("note-editor"), saveNote: document.getElementById("save-note"), shareNote: document.getElementById("share-note"), fab: document.getElementById("create-note-fab"),
  profileDisplayName: document.getElementById("profile-display-name"), profileBirthDate: document.getElementById("profile-birth-date"), profileEmail: document.getElementById("profile-email"), profileGender: document.getElementById("profile-gender"), profilePersonalKey: document.getElementById("profile-personal-key"), saveProfile: document.getElementById("save-profile"),
  toast: document.getElementById("toast"), sharedNoteTitle: document.getElementById("shared-note-title"), sharedNoteKey: document.getElementById("shared-note-key"), sharedNoteContent: document.getElementById("shared-note-content"),
};

function t() { return translations[state.language]; }
function showToast(message) { els.toast.textContent = message; els.toast.classList.remove("hidden"); setTimeout(() => els.toast.classList.add("hidden"), 2500); }
function escapeHtml(value = "") { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
function renderTagList(container, items) { container.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join(""); }

function renderMarketingContent() {
  const copy = t();
  document.documentElement.lang = state.language;
  els.languageToggle.textContent = state.language === "vi" ? "EN" : "VN";
  els.navButtons[0].textContent = copy.nav.home; els.navButtons[1].textContent = copy.nav.intro; els.navButtons[2].textContent = copy.nav.about; els.navLogin.textContent = copy.nav.login;
  els.homeKicker.textContent = copy.public.homeKicker; els.homeTitle.textContent = copy.public.homeTitle; els.homeText.textContent = copy.public.homeText; els.heroAbout.textContent = copy.public.heroAbout; els.heroLogin.textContent = copy.public.heroLogin;
  els.featureHomeCopy.textContent = copy.public.featureHome; els.featureEncryption.textContent = copy.public.featureEncryption; els.featureOtp.textContent = copy.public.featureOtp; renderTagList(els.heroTags, copy.public.tags);
  els.introKicker.textContent = copy.public.introKicker; els.introTitle.textContent = copy.public.introTitle; els.introCardTitle1.textContent = copy.public.introCards[0].title; els.introCardText1.textContent = copy.public.introCards[0].text; els.introCardTitle2.textContent = copy.public.introCards[1].title; els.introCardText2.textContent = copy.public.introCards[1].text; els.introCardTitle3.textContent = copy.public.introCards[2].title; els.introCardText3.textContent = copy.public.introCards[2].text;
  els.aboutKicker.textContent = copy.public.aboutKicker; els.aboutTitle.textContent = copy.public.aboutTitle; els.aboutText.textContent = copy.public.aboutText; els.aboutStat1.textContent = copy.public.aboutStats[0]; els.aboutStat2.textContent = copy.public.aboutStats[1]; els.aboutStat3.textContent = copy.public.aboutStats[2];
  els.authKicker.textContent = copy.auth.kicker; els.authTitle.textContent = copy.auth.title; els.authText.textContent = copy.auth.text; els.authBackHome.textContent = copy.auth.backHome; renderTagList(els.authTags, copy.auth.tags);
  els.loginHeading.textContent = copy.auth.loginHeading; els.loginIdentifierLabel.textContent = copy.auth.loginIdentifierLabel; els.loginPasswordLabel.textContent = copy.auth.loginPasswordLabel; els.loginSubmit.textContent = copy.auth.loginSubmit; els.forgotPassword.textContent = copy.auth.forgotPassword; els.registerPrompt.textContent = copy.auth.registerPrompt; els.goRegister.textContent = copy.auth.goRegister; els.registerHeading.textContent = copy.auth.registerHeading; els.registerUsernameLabel.textContent = copy.auth.registerUsernameLabel; els.registerEmailLabel.textContent = copy.auth.registerEmailLabel; els.registerPasswordLabel.textContent = copy.auth.registerPasswordLabel; els.registerSubmit.textContent = copy.auth.registerSubmit; els.loginPrompt.textContent = copy.auth.loginPrompt; els.goLogin.textContent = copy.auth.goLogin; els.otpHeading.textContent = copy.auth.otpHeading; els.otpText.textContent = copy.auth.otpText; els.otpSubmit.textContent = copy.auth.otpSubmit; els.togglePassword.textContent = copy.auth.toggleShow;
  renderDashboardStats(); updateUnlockStateUI(); switchScreen(state.currentScreen);
}
function updateNavState(activeSection = "home") { els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.section === activeSection)); }
function showPublicApp() { els.publicView.classList.remove("hidden"); els.authView.classList.add("hidden"); els.dashboardView.classList.add("hidden"); }
function showAuthApp(card = "login") { els.publicView.classList.add("hidden"); els.authView.classList.remove("hidden"); els.dashboardView.classList.add("hidden"); toggleAuthCard(card); }
function showAppForAuthenticatedUser() { els.publicView.classList.add("hidden"); els.authView.classList.add("hidden"); els.dashboardView.classList.remove("hidden"); els.userDropdownTrigger.textContent = state.user?.displayName || state.user?.username || "User"; switchScreen("dashboard-home"); refreshNotes(); loadProfile(); }
function scrollToSection(sectionId) { const section = document.getElementById(sectionId); if (!section) return; showPublicApp(); section.scrollIntoView({ behavior: "smooth", block: "start" }); updateNavState(sectionId); }
function toggleAuthCard(target) { els.loginCard.classList.toggle("hidden", target !== "login"); els.registerCard.classList.toggle("hidden", target !== "register"); els.otpCard.classList.toggle("hidden", target !== "otp"); }

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, { headers: { "Content-Type": "application/json", ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}), ...(options.headers || {}) }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

function setSession(data, password) {
  state.token = data.token; state.user = data.user; state.tempPassword = password; state.notesUnlocked = false;
  localStorage.setItem("diaryToken", data.token); localStorage.setItem("diaryUser", JSON.stringify(data.user)); sessionStorage.setItem("tempPassword", password);
  els.userDropdownTrigger.textContent = data.user.displayName || data.user.username;
}

function clearSession() {
  state.token = ""; state.user = null; state.tempPassword = ""; state.personalKey = ""; state.notesUnlocked = false; state.notes = []; state.trash = []; state.selectedNoteId = null;
  localStorage.removeItem("diaryToken"); localStorage.removeItem("diaryUser"); sessionStorage.removeItem("tempPassword"); sessionStorage.removeItem("personalKey");
}

function getEncryptionKey() { return state.personalKey || state.tempPassword; }
function getDecryptionKey() { return state.notesUnlocked ? state.personalKey || state.tempPassword : ""; }
function decryptText(cipherText) {
  const key = getDecryptionKey();
  if (!key) return cipherText;
  try { const bytes = CryptoJS.AES.decrypt(cipherText, key); const plain = bytes.toString(CryptoJS.enc.Utf8); return plain || cipherText; } catch (error) { return cipherText; }
}

function renderDashboardStats() {
  const copy = t().dashboard;
  els.activeCount.textContent = state.notes.length; els.trashCount.textContent = state.trash.length; els.keyStatus.textContent = state.notesUnlocked ? copy.notesUnlocked : copy.notesLocked;
}

function updateUnlockStateUI() {
  const copy = t().dashboard;
  els.unlockNotes.textContent = state.notesUnlocked ? copy.lockButton : copy.unlockButton;
  els.notesSecurityHint.textContent = state.notesUnlocked ? copy.unlockedHint : copy.lockedHint;
  els.noteEditor.classList.toggle("is-locked", !state.notesUnlocked && Boolean(state.selectedNoteId));
}

function renderNotes() {
  const copy = t().dashboard;
  if (!state.notes.length) {
    els.notesList.innerHTML = `<article class="note-card"><p>${escapeHtml(copy.emptyNotes)}</p></article>`;
  } else {
    els.notesList.innerHTML = state.notes.map((note) => {
      const preview = state.notesUnlocked ? decryptText(note.encryptedContent) : note.encryptedContent;
      return `<article class="note-card"><span class="note-meta">${state.notesUnlocked ? copy.unlockedBadge : copy.lockedBadge}</span><h4>${escapeHtml(note.title)}</h4><p>${escapeHtml((preview || note.encryptedContent).slice(0, 140))}</p><div class="row"><button class="secondary-btn" type="button" onclick="selectNote('${note.id}')">${copy.openLabel}</button><button class="secondary-btn" type="button" onclick="deleteNote('${note.id}')">${copy.deleteLabel}</button></div></article>`;
    }).join("");
  }
  if (!state.trash.length) {
    els.trashList.innerHTML = `<article class="note-card"><p>${escapeHtml(copy.emptyTrash)}</p></article>`;
    return;
  }
  els.trashList.innerHTML = state.trash.map((note) => `<article class="note-card"><span class="note-meta">${escapeHtml(copy.lockedBadge)}</span><h4>${escapeHtml(note.title)}</h4><p>${escapeHtml(note.encryptedContent.slice(0, 140))}</p><div class="row"><button class="secondary-btn" type="button" onclick="restoreNote('${note.id}')">${copy.restoreLabel}</button></div></article>`).join("");
}

function setEditorMode() {
  const isExistingLocked = Boolean(state.selectedNoteId) && !state.notesUnlocked;
  els.noteEditor.contentEditable = String(!isExistingLocked);
  els.noteEditor.classList.toggle("is-locked", isExistingLocked);
}

function switchScreen(screenId) {
  state.currentScreen = screenId;
  els.screens.forEach((screen) => screen.classList.toggle("hidden", screen.id !== screenId));
  els.sideButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === screenId));
  els.fab.classList.toggle("hidden", screenId !== "notes");
  const [title, subtitle] = t().dashboard.screens[screenId] || ["Dashboard", ""];
  els.screenTitle.textContent = title; els.screenSubtitle.textContent = subtitle; updateUnlockStateUI(); setEditorMode();
}

async function refreshNotes(query = "") {
  if (!state.token) return;
  state.notes = await api(`/notes?q=${encodeURIComponent(query)}`); state.trash = await api("/notes?includeTrash=true"); renderDashboardStats(); renderNotes();
}

window.selectNote = function selectNote(noteId) {
  const note = state.notes.find((item) => item.id === noteId);
  if (!note) return;
  if (!state.notesUnlocked) return showToast(t().toasts.unlockRequiredForExisting);
  state.selectedNoteId = noteId; els.noteTitle.value = note.title; els.noteEditor.innerHTML = decryptText(note.encryptedContent) || note.encryptedContent; setEditorMode();
};

window.deleteNote = async function deleteNote(noteId) {
  try {
    await api(`/notes/${noteId}`, { method: "DELETE" });
    if (state.selectedNoteId === noteId) { state.selectedNoteId = null; els.noteTitle.value = ""; els.noteEditor.innerHTML = ""; }
    showToast(t().toasts.movedToTrash); await refreshNotes(els.noteSearch.value.trim());
  } catch (error) { showToast(error.message); }
};

window.restoreNote = async function restoreNote(noteId) {
  try { await api(`/notes/${noteId}/restore`, { method: "POST" }); showToast(t().toasts.restored); await refreshNotes(); } catch (error) { showToast(error.message); }
};
async function saveNote() {
  const title = els.noteTitle.value.trim(); const content = els.noteEditor.innerHTML.trim(); const encryptionKey = getEncryptionKey();
  if (!title || !content) return showToast(t().toasts.needFields);
  if (!encryptionKey) return showToast(t().toasts.needKey);
  if (state.selectedNoteId && !state.notesUnlocked) return showToast(t().toasts.needUnlock);
  const payload = { title, content, encryptionKey }; const url = state.selectedNoteId ? `/notes/${state.selectedNoteId}` : "/notes"; const method = state.selectedNoteId ? "PUT" : "POST";
  try { await api(url, { method, body: JSON.stringify(payload) }); showToast(t().toasts.saved); els.noteTitle.value = ""; els.noteEditor.innerHTML = ""; state.selectedNoteId = null; setEditorMode(); await refreshNotes(els.noteSearch.value.trim()); } catch (error) { showToast(error.message); }
}

async function shareSelectedNote() {
  if (!state.selectedNoteId) return showToast(t().toasts.noNoteToShare);
  const sharedTestKey = window.prompt(t().toasts.sharePrompt, "");
  try {
    const data = await api(`/notes/${state.selectedNoteId}/share`, { method: "POST", body: JSON.stringify({ sharedTestKey }) });
    await navigator.clipboard.writeText(`Share link: ${data.shareLink}\nEncrypted data: ${data.encryptedContent}\nTest key: ${data.testKey || "(none)"}`);
    showToast(t().toasts.shareCreated);
  } catch (error) { showToast(error.message); }
}

async function loadProfile() {
  if (!state.token) return;
  const user = await api("/user/me"); state.user = user; localStorage.setItem("diaryUser", JSON.stringify(user)); els.profileDisplayName.value = user.displayName || ""; els.profileBirthDate.value = user.birthDate || ""; els.profileEmail.value = user.email || ""; els.profileGender.value = user.gender || "";
}

async function saveProfile() {
  try {
    const payload = { displayName: els.profileDisplayName.value.trim(), birthDate: els.profileBirthDate.value, email: els.profileEmail.value.trim(), gender: els.profileGender.value, personalKey: els.profilePersonalKey.value.trim() };
    const data = await api("/user/me", { method: "PUT", body: JSON.stringify(payload) });
    state.user = data.user; localStorage.setItem("diaryUser", JSON.stringify(data.user));
    if (payload.personalKey) { state.personalKey = payload.personalKey; sessionStorage.setItem("personalKey", payload.personalKey); els.profilePersonalKey.value = ""; }
    renderDashboardStats(); updateUnlockStateUI(); showToast(t().toasts.profileSaved);
  } catch (error) { showToast(error.message); }
}

function resetNoteEditorForNewEntry() { state.selectedNoteId = null; els.noteTitle.value = ""; els.noteEditor.innerHTML = ""; setEditorMode(); }

async function handleHashRoute() {
  const hash = window.location.hash.replace("#", "");
  const sidebar = document.querySelector(".sidebar"); const userMenu = els.userDropdownTrigger.closest(".user-menu");
  if (hash.startsWith("share/")) {
    const shareToken = hash.split("/")[1]; showPublicApp();
    try {
      const response = await fetch(`/api/notes/shared/${shareToken}`); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Shared note not found.");
      els.publicView.classList.add("hidden"); els.authView.classList.add("hidden"); els.dashboardView.classList.remove("hidden"); switchScreen("share-view"); sidebar.classList.add("hidden"); userMenu.classList.add("hidden"); els.sharedNoteTitle.textContent = data.title; els.sharedNoteKey.textContent = data.sharedTestKey ? `Test key: ${data.sharedTestKey}` : "No test key included."; els.sharedNoteContent.value = data.encryptedContent;
    } catch (error) { showToast(error.message || t().toasts.sharedLoadError); }
    return;
  }
  sidebar.classList.remove("hidden"); userMenu.classList.remove("hidden");
  if (state.token && state.user) return showAppForAuthenticatedUser();
  if (hash === "login") return showAuthApp("login");
  showPublicApp(); updateNavState(hash || "home");
  if (hash) { const section = document.getElementById(hash); if (section) requestAnimationFrame(() => section.scrollIntoView({ behavior: "smooth", block: "start" })); }
}

els.navButtons.forEach((button) => button.addEventListener("click", () => { const section = button.dataset.section; history.replaceState(null, "", `#${section}`); scrollToSection(section); }));
els.brandHome.addEventListener("click", () => { history.replaceState(null, "", "#home"); scrollToSection("home"); });
els.heroAbout.addEventListener("click", () => { history.replaceState(null, "", "#about"); scrollToSection("about"); });
els.heroLogin.addEventListener("click", () => { history.replaceState(null, "", "#login"); showAuthApp("login"); });
els.navLogin.addEventListener("click", () => { history.replaceState(null, "", "#login"); showAuthApp("login"); });
els.authBackHome.addEventListener("click", () => { history.replaceState(null, "", "#home"); scrollToSection("home"); });

els.languageToggle.addEventListener("click", () => { state.language = state.language === "vi" ? "en" : "vi"; renderMarketingContent(); renderNotes(); });
els.goRegister.addEventListener("click", () => toggleAuthCard("register"));
els.goLogin.addEventListener("click", () => toggleAuthCard("login"));
els.togglePassword.addEventListener("click", () => { const currentType = els.loginPassword.getAttribute("type"); const copy = t().auth; els.loginPassword.setAttribute("type", currentType === "password" ? "text" : "password"); els.togglePassword.textContent = currentType === "password" ? copy.toggleHide : copy.toggleShow; });

els.loginSubmit.addEventListener("click", async () => {
  try {
    const identifier = els.loginIdentifier.value.trim(); const password = els.loginPassword.value; const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password }) });
    setSession(data, password); showToast(t().toasts.loginSuccess); showAppForAuthenticatedUser();
  } catch (error) { showToast(error.message); }
});

els.forgotPassword.addEventListener("click", async () => {
  const email = window.prompt(t().toasts.forgotPrompt, els.loginIdentifier.value.trim()); if (!email) return;
  try { const data = await api("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }); showToast(data.message); } catch (error) { showToast(error.message); }
});

els.registerSubmit.addEventListener("click", async () => {
  try { const payload = { username: els.registerUsername.value.trim(), email: els.registerEmail.value.trim(), password: els.registerPassword.value }; const data = await api("/auth/register", { method: "POST", body: JSON.stringify(payload) }); state.pendingId = data.pendingId; showToast(t().toasts.registerOtp); toggleAuthCard("otp"); } catch (error) { showToast(error.message); }
});
els.otpSubmit.addEventListener("click", async () => {
  try { await api("/auth/verify-otp", { method: "POST", body: JSON.stringify({ pendingId: state.pendingId, otp: els.otpCode.value.trim() }) }); showToast(t().toasts.registerSuccess); toggleAuthCard("login"); } catch (error) { showToast(error.message); }
});
els.sideButtons.forEach((button) => button.addEventListener("click", async () => { switchScreen(button.dataset.screen); if (button.dataset.screen === "notes" && !state.selectedNoteId) { els.noteEditor.innerHTML = t().dashboard.newNotePlaceholder; els.noteEditor.contentEditable = "true"; els.noteEditor.classList.remove("is-locked"); } }));
els.userDropdownTrigger.addEventListener("click", () => els.userDropdown.classList.toggle("hidden"));
els.dropdownActions.forEach((button) => button.addEventListener("click", async () => { const action = button.dataset.profileAction; els.userDropdown.classList.add("hidden"); if (action === "profile") { switchScreen("profile"); await loadProfile(); } if (action === "switch" || action === "logout") { clearSession(); showAuthApp("login"); renderMarketingContent(); showToast(action === "switch" ? t().toasts.switchAccount : t().toasts.logout); } }));
document.querySelectorAll(".editor-toolbar button").forEach((button) => button.addEventListener("click", () => { if (!state.selectedNoteId || state.notesUnlocked) document.execCommand(button.dataset.command, false, null); }));
els.noteSearch.addEventListener("input", () => refreshNotes(els.noteSearch.value.trim()));
els.unlockNotes.addEventListener("click", () => { if (state.notesUnlocked) { state.notesUnlocked = false; resetNoteEditorForNewEntry(); renderDashboardStats(); updateUnlockStateUI(); renderNotes(); return showToast(t().toasts.lockSuccess); } const key = window.prompt(t().toasts.keyPrompt, state.personalKey || state.tempPassword); if (key) { state.personalKey = key; state.notesUnlocked = true; sessionStorage.setItem("personalKey", key); renderDashboardStats(); updateUnlockStateUI(); renderNotes(); showToast(t().toasts.unlockSuccess); } });
els.saveNote.addEventListener("click", saveNote); els.shareNote.addEventListener("click", shareSelectedNote); els.fab.addEventListener("click", () => { switchScreen("notes"); resetNoteEditorForNewEntry(); }); els.saveProfile.addEventListener("click", saveProfile);
window.addEventListener("hashchange", handleHashRoute);
renderMarketingContent(); toggleAuthCard("login"); handleHashRoute(); resetNoteEditorForNewEntry();
