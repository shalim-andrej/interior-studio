/* Тёплый угол — интерактив: меню, появление блоков, демо-форма */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* --- Мобильное меню --- */
  const header = $(".site-header");
  const burger = $(".burger");
  if (header && burger) {
    burger.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".nav a").forEach((link) =>
      link.addEventListener("click", () => {
        header.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* --- Появление блоков при прокрутке (с учётом reduced-motion) --- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* --- Демо-форма: проверка полей, без отправки --- */
  const form = $("#lead-form");
  if (form) {
    const msg = $(".form-msg", form);
    const phone = $("#phone", form);
    const name = $("#name", form);
    const consent = $("#consent", form);

    const setError = (input, text) => {
      const box = input.closest(".field") || input.closest(".consent");
      const err = box && box.querySelector(".field__error");
      input.setAttribute("aria-invalid", text ? "true" : "false");
      if (err) err.textContent = text || "";
      return !text;
    };

    const validate = () => {
      let ok = true;
      ok = setError(name, name.value.trim().length < 2 ? "Укажите имя (от 2 символов)" : "") && ok;
      const digits = phone.value.replace(/\D/g, "");
      ok = setError(phone, digits.length < 10 ? "Введите номер телефона полностью" : "") && ok;
      if (!consent.checked) {
        const err = consent.closest(".consent").querySelector(".field__error");
        if (err) err.textContent = "Нужно согласие на обработку данных";
        ok = false;
      }
      return ok;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.className = "form-msg";
      if (!validate()) {
        msg.textContent = "Проверьте поля, отмеченные красным.";
        msg.classList.add("is-warn");
        const firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }
      msg.textContent =
        "Спасибо! Это демонстрационная форма: заявка не отправлена и нигде не сохраняется. В реальном проекте здесь придёт письмо менеджеру.";
      msg.classList.add("is-ok");
      form.reset();
      $$('[aria-invalid="true"]', form).forEach((el) => el.setAttribute("aria-invalid", "false"));
    });
  }
})();
