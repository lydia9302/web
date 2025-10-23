// Custom Cursor - Initialize after DOM loads
let mouseX = 0,
  mouseY = 0;
let followerX = 0,
  followerY = 0;
let mainX = 0,
  mainY = 0;
let isHovering = false;
let cursorFollower = null;
let cursorMain = null;

// Initialize custom cursor
function initCustomCursor() {
  cursorFollower = document.querySelector('.cursor-follower');
  cursorMain = document.querySelector('.cursor-main');

  // Exit if cursor elements don't exist
  if (!cursorFollower || !cursorMain) {
    console.log('Custom cursor elements not found');
    return;
  }

  console.log('Custom cursor initialized');

  // Initialize cursor position to center of screen
  mouseX = 0;
  mouseY = 0;
  followerX = mouseX;
  followerY = mouseY;
  mainX = mouseX;
  mainY = mouseY;

  // Set initial position
  cursorFollower.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  cursorMain.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;

  // Smooth cursor movement with time delay
  function animateCursor() {
    // Follower cursor (fast, small dot)
    followerX += (mouseX - followerX) * 0.3;
    followerY += (mouseY - followerY) * 0.3;
    cursorFollower.style.transform = `translate(${followerX - 4}px, ${
      followerY - 4
    }px)`;

    // Main cursor (slower, larger circle)
    if (!isHovering) {
      mainX += (mouseX - mainX) * 0.15;
      mainY += (mouseY - mainY) * 0.15;
      cursorMain.style.transform = `translate(${mainX - 15}px, ${mainY - 15}px)`;
    } else {
      // 호버 중일 때는 작은 원을 따라다니도록
      updateHoverCursor();
    }

    requestAnimationFrame(animateCursor);
  }

  // Update cursor position on hover
  function updateHoverCursor() {
    if (isHovering) {
      cursorMain.style.transform = `translate(${followerX - 25}px, ${
        followerY - 25
      }px)`;
    }
  }

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Start animation
  animateCursor();

  // Cursor hover effects
  const hoverElements = document.querySelectorAll(
    'a, button, label, .nav-item, [data-cursor="hover"]'
  );

  console.log('Hover elements found:', hoverElements.length);

  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      console.log('Mouse entered hover element');
      isHovering = true;
      cursorMain.style.width = '50px';
      cursorMain.style.height = '50px';
      cursorMain.style.backgroundColor = 'rgba(255, 31, 2, 0.1)';
      cursorMain.style.borderWidth = '1px';
      updateHoverCursor();
    });
    el.addEventListener('mouseleave', () => {
      console.log('Mouse left hover element');
      isHovering = false;
      cursorMain.style.width = '30px';
      cursorMain.style.height = '30px';
      cursorMain.style.backgroundColor = 'transparent';
      cursorMain.style.borderWidth = '1px';
      cursorMain.style.transform = `translate(${followerX - 15}px, ${
        followerY - 15
      }px)`;
    });
  });
}

// Initialize custom cursor when DOM is ready
document.addEventListener('DOMContentLoaded', initCustomCursor);

// Navigation 스크롤 숨김/표시 기능
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavigation() {
  const navbar = document.querySelector('nav');
  const currentScrollY = window.scrollY;

  if (!navbar) return;

  // 스크롤 다운 (숨김)
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.3s ease-in-out';
  }
  // 스크롤 업 (표시)
  else if (currentScrollY < lastScrollY) {
    navbar.style.transform = 'translateY(0)';
    navbar.style.transition = 'transform 0.3s ease-in-out';
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateNavigation);
    ticking = true;
  }
}

// 스크롤 이벤트 리스너 추가
window.addEventListener('scroll', onScroll);

// Logo scroll animation
function startLogoAnimation() {
  console.log('Logo animation started');
  // CSS 애니메이션이 이미 HTML에 인라인으로 적용되어 있으므로 별도 작업 불필요
}

// Count-up animation for outcome numbers
function animateOutcomeNumbers() {
  const outcomeNumbers = document.querySelectorAll('.outcome-number');
  console.log('Found outcome numbers:', outcomeNumbers.length);

  outcomeNumbers.forEach((element) => {
    const target = parseInt(element.getAttribute('data-target'));
    console.log('Target value:', target);

    if (isNaN(target)) {
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, target);
      element.textContent = Math.floor(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);
  });
}

// Side Navigation Scroll Tracking
function initSideNavigation() {
  const sideNav = document.getElementById('side-nav');
  const navItems = document.querySelectorAll('.nav-item');
  const navLines = document.querySelectorAll('.nav-line');
  const navLabels = document.querySelectorAll('.nav-label');
  const sectionIds = [
    'intro',
    'goal',
    'outcomes',
    'features',
    'process',
    'challenges',
    'outcomes2',
  ];
  const sectionElements = sectionIds
    .map((id) => {
      if (id === 'intro') return null; // intro는 특별 처리
      return document.getElementById(id);
    })
    .filter(Boolean);
  const heroSection = document.getElementById('hero');

  let ticking = false;

  function updateActiveNav() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Hero 섹션을 지났는지 확인
    if (heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

      if (scrollPosition > heroBottom - 300) {
        // Hero 섹션을 지나면 네비게이션 표시
        if (sideNav.style.opacity === '0') {
          sideNav.style.opacity = '1';
        }

        // 현재 활성 섹션 찾기 (Intro 포함)
        let activeSectionIndex = -1;
        const navHeight = document.querySelector('nav').offsetHeight;
        const adjustedScrollPosition = scrollPosition + navHeight + 50;

        // Hero 섹션을 지나지 않았으면 Intro 활성화
        if (heroSection) {
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          if (scrollPosition < heroBottom - 300) {
            activeSectionIndex = 0; // Intro (첫 번째 라인)
          }
        }

        // Hero 섹션을 지났으면 다른 섹션들 확인
        if (activeSectionIndex === -1) {
          sectionElements.forEach((section, index) => {
            if (section) {
              const sectionTop = section.offsetTop;
              const sectionBottom = sectionTop + section.offsetHeight;

              // 섹션 범위 내에 있는지 확인 (index + 1로 조정)
              if (
                adjustedScrollPosition >= sectionTop &&
                adjustedScrollPosition < sectionBottom
              ) {
                activeSectionIndex = index + 1; // Intro가 첫 번째이므로 +1
              }
            }
          });

          // 섹션 범위 내에 없으면 가장 가까운 섹션 찾기
          if (activeSectionIndex === -1) {
            let minDistance = Infinity;

            sectionElements.forEach((section, index) => {
              if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionCenter = sectionTop + sectionHeight / 2;

                const distance = Math.abs(
                  adjustedScrollPosition - sectionCenter
                );

                if (distance < minDistance) {
                  minDistance = distance;
                  activeSectionIndex = index + 1; // Intro가 첫 번째이므로 +1
                }
              }
            });
          }
        }

        // 네비게이션 라인 업데이트
        navLines.forEach((line, index) => {
          const label = line.parentElement.querySelector('.nav-label');

          if (index === activeSectionIndex) {
            // 활성 라인: 길고 진한 색상, 두께 2px
            line.style.width = '48px';
            line.style.height = '2px';
            line.style.backgroundColor = 'text-gray-600';
            // 활성 라벨: 진한 색상 + 볼드
            if (label) {
              label.classList.remove('text-gray-600', 'font-normal');
              label.classList.add('text-gray-600', 'font-bold');
            }
          } else {
            // 비활성 라인: 짧고 연한 색상, 두께 1px
            line.style.width = '24px';
            line.style.height = '1px';
            line.style.backgroundColor = 'text-gray-600';
            // 비활성 라벨: 연한 색상 + 일반
            if (label) {
              label.classList.remove('text-gray-600', 'font-bold');
              label.classList.add('text-gray-600', 'font-normal');
            }
          }
        });
      } else {
        // Hero 섹션에 있으면 네비게이션 숨김
        if (sideNav.style.opacity === '1') {
          sideNav.style.opacity = '0';
        }
      }
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveNav);
      ticking = true;
    }
  }

  // 호버 효과 추가
  navItems.forEach((item) => {
    const label = item.querySelector('.nav-label');
    const line = item.querySelector('.nav-line');

    item.addEventListener('mouseenter', () => {
      // 호버 시 간격 제거하고 높이 확장 (연속된 호버 영역)
      sideNav.style.gap = '0px';
      item.style.padding = '16px 8px';
      item.style.minHeight = '48px';
      // 호버 시 라인 두께 2px로 증가
      line.style.height = '2px';
      // 라벨 나타나기 (Tailwind 클래스 사용)
      label.classList.remove('opacity-0', '-translate-x-2.5');
      label.classList.add('opacity-100', 'translate-x-0');
    });

    item.addEventListener('mouseleave', () => {
      // 호버 해제 시 간격과 높이 축소 (디폴트 상태로 복원)
      sideNav.style.gap = '0px';
      item.style.padding = '2px 8px';
      item.style.minHeight = '16px';
      // 호버 해제 시 라인 두께 복원 (활성 상태에 따라)
      const isActive = line.style.width === '48px';
      line.style.height = isActive ? '2px' : '1px';
      // 라벨 숨기기 (Tailwind 클래스 사용)
      label.classList.remove('opacity-100', 'translate-x-0');
      label.classList.add('opacity-0', '-translate-x-2.5');
      // 호버 해제 후 활성 상태에 따른 색상 복원
      setTimeout(() => {
        if (isActive) {
          label.classList.remove('text-gray-600');
          label.classList.add('text-gray-600');
        } else {
          label.classList.remove('text-gray-600');
          label.classList.add('text-gray-600');
        }
      }, 300); // transition duration과 맞춤
    });
  });

  // 클릭 핸들러 추가 (라인과 텍스트 모두 클릭 가능)
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');

      if (sectionId === 'intro') {
        // Intro 클릭 시 페이지 상단으로 스크롤
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        // 다른 섹션들 클릭 시 해당 섹션으로 스크롤
        const targetSection = document.getElementById(sectionId);

        if (targetSection) {
          const sectionTop = targetSection.offsetTop;
          const navHeight = document.querySelector('nav').offsetHeight;

          window.scrollTo({
            top: sectionTop - navHeight - 20,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // 스크롤 이벤트 리스너 (throttled)
  window.addEventListener('scroll', requestTick, { passive: true });

  // 초기 호출
  updateActiveNav();
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, starting animations');
  startLogoAnimation();
  initSideNavigation();

  // Set up intersection observer for outcome numbers
  const outcomeSection = document.querySelector('.outcome-section');
  console.log('Outcome section found:', !!outcomeSection);

  if (outcomeSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Outcome section is visible, starting count animation');
            animateOutcomeNumbers();
            observer.unobserve(entry.target); // Run only once
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -50px 0px', // Start animation a bit before the section is fully visible
      }
    );

    observer.observe(outcomeSection);
  }
});

// Simple image switching for feature buttons
document.addEventListener('change', function (e) {
  if (e.target.type === 'radio' && e.target.name.startsWith('feature')) {
    const featureNumber = e.target.name.replace('feature', '');
    const imageType = e.target.value;
    const imageContainer = document.getElementById(
      `feature${featureNumber}-image`
    );

    if (imageContainer) {
      const imageContent = getImageContent(featureNumber, imageType);
      imageContainer.innerHTML = imageContent;
    }
  }
});

// Function to generate different image content based on feature and image type
function getImageContent(featureNumber, imageType) {
  const imageContents = {
    1: {
      quote:
        '<img src="src/images/features/pf-1_1-1.png" alt="Security Quote" class="w-full h-full object-cover">',
      watchlist:
        '<img src="src/images/features/pf-1_1-2.png" alt="Watchlist" class="w-full h-full object-cover">',
      'advanced-chart':
        '<img src="src/images/features/pf-1_1-3.png" alt="Advanced Chart" class="w-full h-full object-cover">',
      'options-analyzer':
        '<img src="src/images/features/pf-1_1-4.png" alt="Options Analyzer" class="w-full h-full object-cover">',
      'analyzer-drawer':
        '<img src="src/images/features/pf-2_1-1.gif" alt="Analyzer Drawer" class="w-full h-full object-cover">',
      'customize-table':
        '<img src="src/images/features/pf-2_1-2.png" alt="Customize Table" class="w-full h-full object-cover">',
    },
    2: {
      'growth-10k':
        '<img src="src/images/features/pf-1_2-1.png" alt="Growth of 10K" class="w-full h-full object-cover">',
      'sector-heatmap':
        '<img src="src/images/features/pf-1_2-2.png" alt="Sector Heatmap" class="w-full h-full object-cover">',
      'peers-comparison':
        '<img src="src/images/features/pf-1_2-3.png" alt="Peers Comparison" class="w-full h-full object-cover">',
      'options-open-interest':
        '<img src="src/images/features/pf-1_2-4.png" alt="Options Open Interest" class="w-full h-full object-cover">',
    },
    3: {
      'novice-mode':
        '<img src="src/images/features/pf-2_3-1.png" alt="Novice Mode" class="w-full h-full object-cover">',
      'advanced-mode':
        '<img src="src/images/features/pf-2_3-2.png" alt="Advanced Mode" class="w-full h-full object-cover">',

    },
    4: {
      'predefined-screens':
        '<img src="src/images/features/pf-2_4-1.png" alt="Advanced Chart" class="w-full h-full object-cover">',
      filters:
        '<img src="src/images/features/pf-2_4-2.png" alt="Options Analyzer" class="w-full h-full object-cover">',
      'my-holdings':
        '<img src="src/images/features/pf-2_4-3.png" alt="Analyzer Drawer" class="w-full h-full object-cover">',
      'top-result':
        '<img src="src/images/features/pf-2_4-4.png" alt="Customize Table" class="w-full h-full object-cover">',
    },
  };

  return (
    imageContents[featureNumber]?.[imageType] ||
    '<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop&crop=center" alt="Default Image" class="w-full h-full object-cover">'
  );
}

// Ensure horizontal scrolling works on mobile
document.addEventListener('DOMContentLoaded', function () {
  const featureButtons = document.querySelectorAll('.feature-buttons');
  featureButtons.forEach((container) => {
    // Add touch support for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  });

  // No initialization needed - HTML already has correct initial state

  // Smooth image transitions without layout shifts
  document.addEventListener('change', function (e) {
    if (e.target.type === 'radio' && e.target.name.startsWith('feature')) {
      const featureNumber = e.target.name.replace('feature', '');
      const imageType = e.target.value;
      const imageContainer = document.getElementById(
        `feature${featureNumber}-image`
      );

      // Update selected states for this feature group
      document
        .querySelectorAll(`input[name="feature${featureNumber}"]`)
        .forEach((radio) => {
          const btn = radio.closest('.feature-btn');
          if (radio.checked) {
            // Selected state: bold text
            btn.classList.remove('text-gray-500', 'font-medium');
            btn.classList.add('text-white', 'font-bold');

            // Desktop: show triangle, Mobile: show underbar
            const triangle = btn.querySelector('.h-4.w-4');
            if (triangle) {
              // Desktop triangle
              triangle.classList.remove('opacity-0');
              triangle.classList.add('opacity-100');
              triangle.classList.add('animate-arrow-bounce-x'); // ← 추가
            }

            // Mobile: show underbar
            if (window.innerWidth < 768) {
              btn.classList.remove('border-transparent');
              btn.classList.add('border-key');
            }
          } else {
            // Default state: normal text
            btn.classList.remove('text-white', 'font-bold');
            btn.classList.add('text-gray-500', 'font-medium');

            // Desktop: hide triangle, Mobile: hide underbar
            const triangle = btn.querySelector('.h-4.w-4');
            if (triangle) {
              // Desktop triangle
              triangle.classList.remove('opacity-100');
              triangle.classList.add('opacity-0');
              triangle.classList.remove('animate-arrow-bounce-x'); // ← 추가
            }

            // Mobile: hide underbar
            if (window.innerWidth < 768) {
              btn.classList.remove('border-key');
              btn.classList.add('border-transparent');
            }
          }
        });

      if (imageContainer) {
        const imageContent = getImageContent(featureNumber, imageType);
        imageContainer.innerHTML = imageContent;
      }

      // Also update mobile image if it exists
      const mobileImageContainer = document.getElementById(
        `feature${featureNumber}-image-mobile`
      );
      if (mobileImageContainer) {
        const imageContent = getImageContent(featureNumber, imageType);
        mobileImageContainer.innerHTML = imageContent;
      }
    }
  });
});

// Challenges Carousel
let currentSlide = 0;
const totalSlides = 3;

function updateCarousel(slideIndex) {
  const track = document.querySelector('.challenges-carousel-track');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track) {
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
  }

  dots.forEach((dot, index) => {
    if (index === slideIndex) {
      dot.classList.remove('bg-gray-300');
      dot.classList.add('bg-key');
    } else {
      dot.classList.remove('bg-key');
      dot.classList.add('bg-gray-300');
    }
  });

  // Update arrow button visibility
  if (prevBtn && nextBtn) {
    if (slideIndex === 0) {
      prevBtn.style.opacity = '0.3';
      prevBtn.style.pointerEvents = 'none';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
    }

    if (slideIndex === totalSlides - 1) {
      nextBtn.style.opacity = '0.3';
      nextBtn.style.pointerEvents = 'none';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
    }
  }

  currentSlide = slideIndex;
}

// Arrow button click handlers
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      updateCarousel(currentSlide - 1);
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      updateCarousel(currentSlide + 1);
    }
  });
}

// Dot click handlers
document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
  dot.addEventListener('click', () => {
    updateCarousel(index);
  });
});

// Touch/swipe support + Mouse drag support
let startX = 0;
let endX = 0;
let isDragging = false;

const carousel = document.getElementById('challenges-carousel');
if (carousel) {
  // Touch events
  carousel.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  // Mouse events for desktop
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    endX = e.pageX;
    carousel.style.cursor = 'grab';
    handleSwipe();
  });

  carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      carousel.style.cursor = 'grab';
    }
  });

  // Set initial cursor
  carousel.style.cursor = 'grab';

  function handleSwipe() {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        // Swipe/drag left
        updateCarousel(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        // Swipe/drag right
        updateCarousel(currentSlide - 1);
      }
    }
  }
}

// Initialize carousel
updateCarousel(0);

// 이미지 프리로드 함수
function preloadImages() {
  const imageUrls = [
    'src/images/features/pf-1_1-1.png',
    'src/images/features/pf-1_1-2.png',
    'src/images/features/pf-1_1-3.png',
    'src/images/features/pf-1_1-4.png',
    'src/images/features/pf-1_2-1.png',
    'src/images/features/pf-1_2-2.png',
    'src/images/features/pf-1_2-3.png',
    'src/images/features/pf-1_2-4.png',
  ];

  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });

  console.log('Feature images preloaded');
}

// 페이지 로드 시 프리로드 실행
document.addEventListener('DOMContentLoaded', preloadImages);

// 페이지 로드 시 초기 선택된 메뉴에 애니메이션 적용
document.addEventListener('DOMContentLoaded', function () {
  // 모든 feature 그룹에 대해 초기 선택된 메뉴 찾기
  document
    .querySelectorAll('input[name^="feature"]:checked')
    .forEach((radio) => {
      const btn = radio.closest('.feature-btn');
      const triangle = btn.querySelector('.h-4.w-4');

      if (triangle) {
        // 선택된 메뉴의 삼각형을 보이게 하고 애니메이션 적용
        triangle.classList.remove('opacity-0');
        triangle.classList.add('opacity-100');
        triangle.classList.add('animate-arrow-bounce-x');
        console.log('Initial selected menu animation applied');
      }
    });
});
