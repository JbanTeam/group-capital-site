$(function () {
  // burger/mobile-menu***********************************************
  @@include('_burger.js');
  // certificates-section blocks*************************************
  var certificates_s = $('.certificates-section');

  function css(cnt, side, blockHeight, windowWidth) {
    var width;
    if (windowWidth >= 1412) {
      width = Math.random() * 150 + 120 + 'px';
    } else if (windowWidth > 1222 && windowWidth < 1412) {
      width = Math.random() * 100 + 70 + 'px';
    } else if (windowWidth > 1000 && windowWidth <= 1222) {
      width = Math.random() * 80 + 40 + 'px';
    } else if (windowWidth > 780 && windowWidth <= 1000) {
      width = Math.random() * 70 + 20 + 'px';
    }
    return {
      position: 'absolute',
      top: cnt * blockHeight,
      [side]: 0,
      width: width,
      height: blockHeight + 'px',
      'background-color': '#fff',
    };
  }

  function createBlocks(blocksTotal, windowWidth) {
    var blockHeight = certificates_s.outerHeight() / blocksTotal;

    for (var i = 0; i < blocksTotal; i++) {
      $("<div class='block left'></div>").appendTo('.certificates-section').css(css(i, 'left', blockHeight, windowWidth));
      $("<div class='block right'></div>").appendTo('.certificates-section').css(css(i, 'right', blockHeight, windowWidth));
    }
  }
  createBlocks(20, $(window).width());

  var updateBlocks = function (blocksTotal, windowWidth) {
    var leftBlocks = $('.block.left');
    var rightBlocks = $('.block.right');
    var blockHeight = certificates_s.outerHeight() / blocksTotal;
    leftBlocks.each(function (cnt, block) {
      $(block).css(css(cnt, 'left', blockHeight, windowWidth));
    });
    rightBlocks.each(function (cnt, block) {
      $(block).css(css(cnt, 'right', blockHeight, windowWidth));
    });
  };
  var updateBlocksThrottled = _.throttle(function () {
    updateBlocks(20, $(window).width());
  }, 300);

  $(window).on('resize', updateBlocksThrottled);

  // header burger onScroll, burger position*********************************************************************************
  $('.mobile-menu a').each(function (i, link) {
    $(link).on('click', function (e) {
      e.preventDefault();
    });
  });

  function burgerPos() {
    if ($(this).width() <= 1170) {
      if ($('.header-burger').attr('style')) $('.header-burger').removeAttr('style');
      return;
    }
    var wrapper = $('.header .wrapper');
    $('.header-burger').css({ right: 'initial', left: wrapper.offset().left + wrapper.width() });
  }
  burgerPos();
  var headerOnScrollThrottled = _.throttle(burgerPos, 300);
  $(window).on('resize', headerOnScrollThrottled);

  function headerOnScroll() {
    if ($(this).scrollTop() >= 140) {
      $('.header').addClass('scrolled');
      $('.header-burger').addClass('scrolled');
    } else {
      $('.header').removeClass('scrolled');
      $('.header-burger').removeClass('scrolled');
    }
  }
  headerOnScroll();
  var headerOnScrollThrottled = _.throttle(headerOnScroll, 300);
  $(window).on('scroll', headerOnScrollThrottled);

  // modal-callback(в window.on закрытие)*********************************************************************
  var modal = $('.modal');
  var modalOpen = $('.modal-open');
  var modalClose = $('.modal-close');

  modalOpen.on('click', function () {
    $('body').addClass('scroll-off');
    modal.fadeIn(400);
    if (mobileMenu.hasClass('active')) {
      burger.toggleClass('active');
      mobileMenu.removeClass('active');
      mobileMenu.one('transitionend', function (e) {
        mobileMenu.addClass('hidden');
      });
    }
  });

  modalClose.on('click', function () {
    modal.fadeOut(400, function () {
      if ($('.mobile-menu').hasClass('hidden')) {
        $('body').removeClass('scroll-off');
      }
    });
  });

  // certificates popup******************************************************************
  var images = $('.certificate');
  var popup = $('.popup');
  var popupClose = $('.popup-close');

  var popupImage = popup.find('.popup-image');
  var popupSpan = popup.find('.popup-image span');
  popupSpan.before("<div class='bottom-images'></div>");
  var popupBottomImages = popup.find('.bottom-images');

  for (var i = 0; i < images.length; i++) {
    var src = $(images[i]).find('img').attr('src');
    popupBottomImages.append("<div class='bottom-image'><img src='" + src + "'/></div>");
  }

  var popupBottomImage = popup.find('.bottom-image img');
  popupBottomImage.on('click', function () {
    $('.main-image img').attr('src', $(this).attr('src'));
  });

  images.on('click', function (event) {
    event.preventDefault();
    var src = $(this).find('img').attr('src');
    popupBottomImages.before("<div class='main-image'><img src='" + src + "'/></div>");
    $('body').addClass('scroll-off');
    popup.fadeIn(400);
  });

  popupClose.on('click', function () {
    popup.fadeOut(400, function () {
      if ($('.mobile-menu').hasClass('hidden')) {
        $('body').removeClass('scroll-off');
      }
      onClosePopup();
    });
  });

  // закрытие модалки и попапа при нажатии на оверлей
  $(window).on('click', function (event) {
    if ($(event.target).hasClass('modal')) {
      modal.fadeOut(400, function () {
        if ($('.mobile-menu').hasClass('hidden')) {
          $('body').removeClass('scroll-off');
        }
      });
    }
    if ($(event.target).hasClass('popup')) {
      popup.fadeOut(400, function () {
        if ($('.mobile-menu').hasClass('hidden')) {
          $('body').removeClass('scroll-off');
        }
        onClosePopup();
      });
    }
  });

  // удаляем главное изображение при закрытии попапа
  function onClosePopup() {
    $('.main-image').remove();
  }
});

// animations*******************************************************************************************
// animations*******************************************************************************************
var tl = gsap.timeline();
tl.fromTo('.top-section .nav', { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
  .fromTo('.header-item', { opacity: 0, x: 10 }, { opacity: 1, x: 0, stagger: 0.25 })
  .fromTo('.top-section .main-desc', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 })
  .fromTo('.top-section .img-wrap', { x: 50, opacity: 0 }, { x: 0, opacity: 1 }, '-=0.5');

var ctrl = new ScrollMagic.Controller();

$('.section').each(function (i) {
  let section = $(this);
  var title = section.find('.title');

  var tl = gsap.timeline();

  if (section.hasClass('directions-section')) {
    tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }).fromTo('.direction', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2 });
  } else if (section.hasClass('about-section')) {
    tl.fromTo(section.find('.wrap-img'), { x: -50, opacity: 0 }, { x: 0, opacity: 1 }).fromTo(
      section.find('.wrap-desc'),
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1 },
      '-=0.5'
    );
  } else if (section.hasClass('waranties-section')) {
    tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }).fromTo('.waranty', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2 });
  } else if (section.hasClass('certificates-section')) {
    tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }).fromTo('.certificate', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2 });
  } else if (section.hasClass('callback-section')) {
    tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0 })
      .fromTo(section.find('.content-img'), { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
      .fromTo(section.find('.content-form'), { x: 50, opacity: 0 }, { x: 0, opacity: 1 }, '-=0.5')
      .fromTo(section.find('.content-img picture'), { rotate: 5 }, { rotate: -5, repeat: -1, yoyo: true, ease: 'power1.inOut', duration: 4 });
  } else {
    // tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
  }

  new ScrollMagic.Scene({
    triggerElement: this,
    triggerHook: 0.6,
    reverse: false,
  })
    .setTween(tl)
    // .addIndicators({
    //   colorTrigger: 'red',
    //   colorStart: 'red',
    //   colorEnd: 'red',
    //   indent: 40,
    // })
    .addTo(ctrl);
});

var footerTl = gsap.timeline();
footerTl
  .fromTo('.footer .logo', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 })
  .fromTo('.footer .nav', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 })
  .fromTo('.footer .footer-info_item', { x: 50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.2, duration: 0.3 })
  .fromTo('.footer-bottom p', { opacity: 0 }, { opacity: 1, duration: 0.3 });
new ScrollMagic.Scene({
  triggerElement: '.footer',
  triggerHook: 0.8,
  reverse: false,
})
  .setTween(footerTl)
  // .addIndicators({
  //   colorTrigger: 'red',
  //   colorStart: 'red',
  //   colorEnd: 'red',
  //   indent: 40,
  // })
  .addTo(ctrl);
