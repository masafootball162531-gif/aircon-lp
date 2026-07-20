const ctaLinks = document.querySelectorAll(".tel-cta, .line-cta, .mail-cta");

const currentTimeElements = document.querySelectorAll("[data-current-time]");

const updateCurrentTime = () => {
  const now = new Date();
  const timeLabel = `${now.getHours()}時${String(now.getMinutes()).padStart(2, "0")}分`;

  currentTimeElements.forEach((element) => {
    element.textContent = timeLabel;
  });
};

if (currentTimeElements.length) {
  updateCurrentTime();
  window.setInterval(updateCurrentTime, 30000);
}

ctaLinks.forEach((link) => {
  link.addEventListener("click", () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lp_cta_click",
      ctaType: link.classList.contains("tel-cta")
        ? "tel"
        : link.classList.contains("mail-cta")
          ? "mail"
          : "line",
      ctaArea: link.classList.contains("fixed-cta")
        ? "fixed"
        : link.classList.contains("fv-cta")
          ? "first_view"
          : "body",
    });
  });
});

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll("details[open]").forEach((openDetail) => {
      if (openDetail !== detail && openDetail.closest(".faq-list")) {
        openDetail.open = false;
      }
    });
  });
});

const fixedCtaBar = document.querySelector(".fixed-cta-bar");
const fixedCtaTrigger = document.querySelector(
  "[data-fixed-cta-center-trigger]"
);

if (fixedCtaBar && fixedCtaTrigger) {
  const updateFixedCtaVisibility = () => {
    const triggerTop = fixedCtaTrigger.getBoundingClientRect().top;
    const shouldShow = triggerTop <= window.innerHeight;

    fixedCtaBar.classList.toggle("is-visible", shouldShow);
  };

  updateFixedCtaVisibility();

  window.addEventListener("scroll", updateFixedCtaVisibility, {
    passive: true,
  });

  window.addEventListener("resize", updateFixedCtaVisibility);
}
const customerVoiceTrack = document.querySelector(".customer-voice-scroll-track");
const customerVoiceDots = document.querySelectorAll(".customer-voice-dots span");

if (customerVoiceTrack && customerVoiceDots.length) {
  const updateCustomerVoiceDots = () => {
    const slideWidth = customerVoiceTrack.clientWidth || 1;
    const activeIndex = Math.round(customerVoiceTrack.scrollLeft / slideWidth);

    customerVoiceDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  customerVoiceTrack.addEventListener("scroll", updateCustomerVoiceDots, { passive: true });
  window.addEventListener("resize", updateCustomerVoiceDots);
  updateCustomerVoiceDots();

  document.querySelectorAll(".customer-voice-next").forEach((button) => {
    button.addEventListener("click", () => {
      const slideWidth = customerVoiceTrack.clientWidth || 1;
      const currentIndex = Math.round(customerVoiceTrack.scrollLeft / slideWidth);
      const nextIndex = (currentIndex + 1) % customerVoiceDots.length;

      customerVoiceTrack.scrollTo({
        left: slideWidth * nextIndex,
        behavior: "smooth",
      });
    });
  });
}

const contactForm = document.querySelector("#airconContactForm");
const formConfirmPanel = document.querySelector("#formConfirmPanel");
const formConfirmList = document.querySelector("#formConfirmList");

if (contactForm && formConfirmPanel && formConfirmList) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const requestTypes = formData.getAll("ご依頼内容").join("、") || "未選択";
    const confirmItems = [
      ["お名前", formData.get("お名前") || ""],
      ["フリガナ", formData.get("フリガナ") || ""],
      ["電話番号", formData.get("電話番号") || ""],
      ["メールアドレス", formData.get("メールアドレス") || ""],
      ["住所", formData.get("住所") || ""],
      ["ご依頼内容", requestTypes],
      ["お問い合わせ内容", formData.get("お問い合わせ内容") || ""],
    ];

    formConfirmList.replaceChildren();

    confirmItems.forEach(([label, value]) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");

      term.textContent = label;
      description.textContent = value || "未入力";
      formConfirmList.append(term, description);
    });

    formConfirmPanel.hidden = false;
    formConfirmPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
