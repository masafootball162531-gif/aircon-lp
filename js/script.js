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
    const shouldShow = triggerTop <= window.innerHeight + 550;

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

const caseStudyList = document.querySelector("#caseStudyList");
const caseStudyMoreButton = document.querySelector(".case-study-more-button");

if (caseStudyList && caseStudyMoreButton) {
  const updateCaseStudyLimitedHeight = () => {
    if (caseStudyList.classList.contains("is-expanded")) return;

    const firstCard = caseStudyList.querySelector(".case-study-card");
    const secondCard = caseStudyList.querySelector(".case-study-card.is-collapsible");

    if (!firstCard || !secondCard) return;

    const previewHeight = Math.min(Math.max(secondCard.offsetHeight * 2 + 88, 190), 280);
    caseStudyList.style.setProperty(
      "--case-study-limited-height",
      `${firstCard.offsetHeight + previewHeight}px`
    );
  };

  updateCaseStudyLimitedHeight();
  window.addEventListener("resize", updateCaseStudyLimitedHeight);

  caseStudyMoreButton.addEventListener("click", () => {
    caseStudyList.classList.remove("is-limited");
    caseStudyList.classList.add("is-expanded");
    caseStudyMoreButton.setAttribute("aria-expanded", "true");
  });
}

const servicePriceModal = document.querySelector("#servicePriceModal");
const servicePriceModalTitle = document.querySelector("#servicePriceModalTitle");
const servicePriceModalSub = document.querySelector("#servicePriceModalSub");
const servicePriceModalImage = document.querySelector("#servicePriceModalImage");
const servicePriceModalMenu = document.querySelector("#servicePriceModalMenu");
const serviceModalTriggers = document.querySelectorAll("[data-service-modal-trigger]");
const serviceModalCloseButtons = document.querySelectorAll("[data-service-modal-close]");
let lastServiceModalTrigger = null;

if (servicePriceModal && serviceModalTriggers.length) {
  const servicePriceMenus = {
    repair: [
      ["エアコンの修理", "8,800円〜"],
      ["エアコンの故障診断", "3,300円〜"],
      ["冷たい風が出ない", "8,800円〜"],
      ["エラー表示の確認", "6,600円〜"],
      ["異音・異臭の点検", "7,700円〜"],
      ["室外機の修理", "13,200円〜"],
    ],
    water: [
      ["エアコンからの水漏れ", "8,800円〜"],
      ["ドレンホース詰まり", "6,600円〜"],
      ["室内機の水漏れ修理", "8,800円〜"],
      ["吹き出し口の水飛び", "7,700円〜"],
      ["排水経路の点検", "5,500円〜"],
      ["業務用エアコン水漏れ", "16,500円〜"],
    ],
    gas: [
      ["エアコンガスチャージ", "13,200円〜"],
      ["ガス漏れ点検", "8,800円〜"],
      ["冷媒ガス補充", "13,200円〜"],
      ["ガス不足診断", "5,500円〜"],
      ["配管接続部の確認", "7,700円〜"],
      ["ガス漏れ修理", "16,500円〜"],
    ],
    circuit: [
      ["専用回路工事", "16,500円〜"],
      ["エアコン用コンセント増設", "8,800円〜"],
      ["100V・200V電圧切替", "8,800円〜"],
      ["ブレーカー交換", "11,000円〜"],
      ["配線引き直し", "16,500円〜"],
      ["室外機まわりの電源点検", "5,500円〜"],
    ],
    breaker: [
      ["ブレーカー交換", "5,500円〜"],
      ["ブレーカー修理", "8,800円〜"],
      ["漏電調査", "8,800円〜"],
      ["分電盤点検", "5,500円〜"],
      ["専用回路増設", "16,500円〜"],
      ["容量アップ相談", "11,000円〜"],
    ],
    switch: [
      ["スイッチ交換", "3,300円〜"],
      ["スイッチ修理", "3,300円〜"],
      ["3路スイッチ交換", "4,400円〜"],
      ["換気扇スイッチ交換", "5,500円〜"],
      ["タイマースイッチ交換", "7,700円〜"],
      ["スイッチ配線点検", "5,500円〜"],
    ],
    outlet: [
      ["コンセント交換", "3,300円〜"],
      ["コンセント増設", "8,800円〜"],
      ["焦げ・発熱の点検", "5,500円〜"],
      ["アース付きコンセント", "7,700円〜"],
      ["屋外防水コンセント", "8,800円〜"],
      ["専用コンセント工事", "11,000円〜"],
    ],
    lighting: [
      ["照明器具交換", "3,300円〜"],
      ["LED照明取り付け", "5,500円〜"],
      ["シーリングライト取付", "3,300円〜"],
      ["ダウンライト交換", "7,700円〜"],
      ["照明スイッチ点検", "3,300円〜"],
      ["引掛シーリング交換", "5,500円〜"],
    ],
    intercom: [
      ["インターホン交換", "5,500円〜"],
      ["モニター付き取付", "11,000円〜"],
      ["インターホン配線点検", "5,500円〜"],
      ["チャイム修理", "5,500円〜"],
      ["玄関子機交換", "8,800円〜"],
      ["既設機器の撤去", "3,300円〜"],
    ],
    antenna: [
      ["アンテナ修理", "7,700円〜"],
      ["アンテナ交換", "16,500円〜"],
      ["BS/CSアンテナ設置", "13,200円〜"],
      ["ブースター交換", "11,000円〜"],
      ["テレビが映らない調査", "5,500円〜"],
      ["アンテナ方向調整", "7,700円〜"],
    ],
  };

  const renderServicePriceMenu = (items) => {
    if (!servicePriceModalMenu) return;

    servicePriceModalMenu.replaceChildren();

    items.forEach(([label, price]) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");

      term.textContent = label;
      description.textContent = price;
      row.append(term, description);
      servicePriceModalMenu.append(row);
    });
  };

  const openServicePriceModal = (trigger) => {
    lastServiceModalTrigger = trigger;

    const serviceKey = trigger.dataset.serviceKey || "repair";
    const serviceMainTitle = trigger.dataset.serviceMainTitle || "エアコン";
    const serviceTitle = trigger.dataset.serviceTitle || "修理トラブル";
    const serviceImage = trigger.dataset.serviceImage || "assets/case-aircon-01-cooling.png";
    const servicePosition = trigger.dataset.servicePosition || "";

    if (servicePriceModalTitle) {
      servicePriceModalTitle.textContent = serviceMainTitle;
    }

    if (servicePriceModalSub) {
      servicePriceModalSub.textContent = serviceTitle;
    }

    if (servicePriceModalImage) {
      servicePriceModalImage.src = serviceImage;
      servicePriceModalImage.alt = `${serviceTitle}の料金詳細イメージ`;
      servicePriceModalImage.style.objectPosition = servicePosition;
    }

    renderServicePriceMenu(servicePriceMenus[serviceKey] || servicePriceMenus.repair);

    servicePriceModal.hidden = false;
    document.body.classList.add("is-service-modal-open");
    servicePriceModal.querySelector(".service-price-modal-close")?.focus();
  };

  const closeServicePriceModal = () => {
    servicePriceModal.hidden = true;
    document.body.classList.remove("is-service-modal-open");
    lastServiceModalTrigger?.focus();
  };

  serviceModalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openServicePriceModal(trigger));
  });

  serviceModalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeServicePriceModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !servicePriceModal.hidden) {
      closeServicePriceModal();
    }
  });
}

document.querySelectorAll(".case-study-card.is-collapsible").forEach((card) => {
  const toggle = card.querySelector(".case-study-toggle");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "施工事例を閉じる" : "施工事例を開く");
  });
});

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
