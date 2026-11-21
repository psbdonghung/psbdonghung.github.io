/* PSB - Bản 3: Sáng tạo */
(function () {
  'use strict';

  /* ---------- Menu điện thoại ---------- */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (btn && nav) {
    var closeMenu = function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('.hdr')) closeMenu();
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', closeMenu);
  }

  /* ---------- Thẻ lợi ích: nảy khi bấm ---------- */
  document.querySelectorAll('.ben__card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.remove('pop');
      void card.offsetWidth;
      card.classList.add('pop');
    });
    card.addEventListener('animationend', function () {
      card.classList.remove('pop');
    });
  });

  /* ---------- Video: chỉ phát một video một lúc ---------- */
  var videos = document.querySelectorAll('video');
  videos.forEach(function (v) {
    v.addEventListener('play', function () {
      videos.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });

  /* ---------- Hộp xem ảnh ---------- */
  var box = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var zoomBtns = Array.prototype.slice.call(document.querySelectorAll('.zoom'));
  var current = -1;
  var opener = null;

  function show(i) {
    var n = zoomBtns.length;
    current = (i + n) % n;
    var img = zoomBtns[current].querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
  }
  function openBox(i) {
    opener = zoomBtns[i];
    show(i);
    box.hidden = false;
    document.body.classList.add('lb-open');
    box.querySelector('.lb-close').focus();
  }
  function closeBox() {
    box.hidden = true;
    lbImg.src = '';
    document.body.classList.remove('lb-open');
    if (opener) opener.focus();
  }

  zoomBtns.forEach(function (b, i) {
    b.setAttribute('aria-haspopup', 'dialog');
    b.addEventListener('click', function () { openBox(i); });
  });
  if (box) {
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-stage')) closeBox();
    });
    box.querySelector('.lb-close').addEventListener('click', closeBox);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') { closeBox(); }
      else if (e.key === 'ArrowLeft') { show(current - 1); }
      else if (e.key === 'ArrowRight') { show(current + 1); }
      else if (e.key === 'Tab') {
        var f = box.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Form đăng ký (bản xem thử, không gửi đi đâu) ---------- */
  var form = document.getElementById('form-dang-ky');
  if (form) {
    var ok = document.getElementById('form-ok');
    var rules = {
      'ten-phu-huynh': function (v) {
        return v.trim() ? '' : 'Vui lòng nhập họ tên phụ huynh.';
      },
      'dia-chi': function (v) {
        return v.trim() ? '' : 'Vui lòng nhập địa chỉ.';
      },
      'sdt': function (v) {
        var s = v.replace(/[\s.\-]/g, '');
        if (!s) return 'Vui lòng nhập số điện thoại.';
        if (!/^0\d{9}$/.test(s)) return 'Số điện thoại gồm 10 chữ số và bắt đầu bằng 0.';
        return '';
      },
      'ten-hoc-vien': function (v) {
        return v.trim() ? '' : 'Vui lòng nhập họ tên học viên.';
      },
      'tuoi': function (v) {
        var s = v.trim();
        if (!s) return 'Vui lòng nhập độ tuổi học viên.';
        if (!/^\d+$/.test(s)) return 'Độ tuổi phải là số.';
        var n = parseInt(s, 10);
        if (n < 6 || n > 18) return 'Độ tuổi học viên từ 6 đến 18.';
        return '';
      }
    };

    var check = function (input) {
      var msg = rules[input.id](input.value);
      var out = document.getElementById('err-' + input.id);
      out.textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    Object.keys(rules).forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener('blur', function () {
        if (input.value !== '' || input.getAttribute('aria-invalid') === 'true') check(input);
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') check(input);
        ok.hidden = true;
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (id) {
        var input = document.getElementById(id);
        if (!check(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        ok.hidden = true;
        firstBad.focus();
        return;
      }
      ok.hidden = false;
      ok.focus();
    });
  }
})();
